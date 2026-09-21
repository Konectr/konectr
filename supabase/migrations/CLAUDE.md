# Migrations live in the mobile repo

Supabase migrations for the Konectr database are kept in **`konectr-mvp`**
(`supabase/migrations/`, 320+ files), not here. Both this site and the app talk
to the same project (`Konectr-App`, `rsrplvdtbycqcxjlyeju`), so a second
migrations directory here would be a split source of truth.

The RPCs this site calls — `get_activity_rsvp_teaser`, `create_web_rsvp`,
`get_activity_by_share_code`, `cancel_web_rsvp`, `post_web_chat_message`,
`get_web_chat_messages` — are all defined there.

If a change to this site needs a DB change, add the migration to `konectr-mvp`
and reference it from this repo's commit message.
