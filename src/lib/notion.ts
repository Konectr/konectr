import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { BlogPost } from "@/components/blog/BlogCard";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || "";

// Extended type for full blog post with content
export interface BlogPostFull extends BlogPost {
  content: string;
}

// Helper to extract plain text from rich text array
function getPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join("");
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Convert Notion blocks to markdown
async function blocksToMarkdown(blockId: string): Promise<string> {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  let markdown = "";

  for (const block of response.results as BlockObjectResponse[]) {
    if (!("type" in block)) continue;

    switch (block.type) {
      case "paragraph":
        markdown += getPlainText(block.paragraph.rich_text) + "\n\n";
        break;
      case "heading_1":
        markdown += `# ${getPlainText(block.heading_1.rich_text)}\n\n`;
        break;
      case "heading_2":
        markdown += `## ${getPlainText(block.heading_2.rich_text)}\n\n`;
        break;
      case "heading_3":
        markdown += `### ${getPlainText(block.heading_3.rich_text)}\n\n`;
        break;
      case "bulleted_list_item":
        markdown += `- ${getPlainText(block.bulleted_list_item.rich_text)}\n`;
        break;
      case "numbered_list_item":
        markdown += `1. ${getPlainText(block.numbered_list_item.rich_text)}\n`;
        break;
      case "quote":
        markdown += `> ${getPlainText(block.quote.rich_text)}\n\n`;
        break;
      case "code":
        const lang = block.code.language || "";
        markdown += `\`\`\`${lang}\n${getPlainText(block.code.rich_text)}\n\`\`\`\n\n`;
        break;
      case "divider":
        markdown += "---\n\n";
        break;
      case "image":
        const imageUrl =
          block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;
        const caption = block.image.caption
          ? getPlainText(block.image.caption)
          : "";
        markdown += `![${caption}](${imageUrl})\n\n`;
        break;
      default:
        // Skip unsupported blocks
        break;
    }
  }

  return markdown.trim();
}

// Transform Notion page to BlogPost
function pageToPost(page: PageObjectResponse): BlogPost {
  const props = page.properties;

  // Extract title (Title property)
  const titleProp = props["Title"];
  const title =
    titleProp?.type === "title" ? getPlainText(titleProp.title) : "Untitled";

  // Extract slug
  const slugProp = props["Slug"];
  const slug =
    slugProp?.type === "rich_text"
      ? getPlainText(slugProp.rich_text)
      : title.toLowerCase().replace(/\s+/g, "-");

  // Extract excerpt
  const excerptProp = props["Excerpt"];
  const excerpt =
    excerptProp?.type === "rich_text"
      ? getPlainText(excerptProp.rich_text)
      : "";

  // Extract category
  const categoryProp = props["Category"];
  const category =
    categoryProp?.type === "select" ? categoryProp.select?.name || "General" : "General";

  // Extract published date
  const dateProp = props["Published Date"];
  const date =
    dateProp?.type === "date" && dateProp.date?.start
      ? formatDate(dateProp.date.start)
      : formatDate(new Date().toISOString());

  // Extract read time
  const readTimeProp = props["Read Time"];
  const readTime =
    readTimeProp?.type === "rich_text"
      ? getPlainText(readTimeProp.rich_text)
      : "5 min read";

  // Extract author
  const authorProp = props["Author"];
  const author =
    authorProp?.type === "rich_text"
      ? getPlainText(authorProp.rich_text)
      : "Konectr Team";

  // Extract cover image URL
  const imageProp = props["Cover Image URL"];
  const image = imageProp?.type === "url" ? imageProp.url || undefined : undefined;

  return {
    slug,
    title,
    excerpt,
    date,
    readTime,
    author,
    category,
    image,
  };
}

// Fetch all published blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  // Return empty array if no database ID configured
  if (!DATABASE_ID) {
    console.warn("NOTION_BLOG_DATABASE_ID not configured");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(pageToPost);
  } catch (error) {
    console.error("Error fetching posts from Notion:", error);
    return [];
  }
}

// Fetch a single post by slug with full content
export async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
  // Return null if no database ID configured
  if (!DATABASE_ID) {
    console.warn("NOTION_BLOG_DATABASE_ID not configured");
    return null;
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0] as PageObjectResponse;
    const post = pageToPost(page);
    const content = await blocksToMarkdown(page.id);

    return {
      ...post,
      content,
    };
  } catch (error) {
    console.error("Error fetching post from Notion:", error);
    return null;
  }
}

// Get all slugs for static generation
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}
