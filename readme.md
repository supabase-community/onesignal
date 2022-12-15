# OneSignal Next.js Push Notification Example

Simple ordering app to demonstrate how you can use OneSignal with your Supabase project to send push notifications when a new data is inserted in your database.

You can find the full guide [here](https://supabase.com/docs/guides/integrations/onesignal).

![Screenshot](https://raw.githubusercontent.com/supabase-community/onesignal/main/assets/screenshot.png)

    .
    ├── app         # Next.js app to place orders from
    ├── supabase    # Supabase directory containing functions to send push notifications
    └── README.md

## Get Started

- Create a [OneSignal app with Custom Code Setup](https://documentation.onesignal.com/docs/web-push-custom-code-setup)
- Rename `app/.env.example` to `app/.env.local` and add your Supabase URL, Anon Key, and OneSignal App ID.
- Run `supabase link --project-ref YOUR_SUPABASE_PROJECT_REF` to link the edge functions to your Supabase project
- Set environment variables for edge functions
  - Rename `supabase/.env.example` to `supabase/.env`
  - Add your OneSignal App ID, User Auth Key, and REST API Key
  - Run `supabase secrets set --env-file ./supabase/.env`
- Deploy the `notify` edge function by running `supabase functions deploy notify --no-verify-jwt`
- Run the SQL below to create the `orders` table
- Setup [Database Webhooks](https://supabase.com/docs/guides/database/webhooks) to call the edge function when a new row is inserted into `orders` table

```sql
create table if not exists public.orders (
    id uuid not null primary key default uuid_generate_v4(),
    created_at timestamptz not null default now(),
    user_id uuid not null default auth.uid(),
    price int8 not null
);
```

## Running the app locally

Run the following command to start the Next.js app

```bash
cd app

npm install

npm run dev
```
