# OneSignal Next.js Push Notification Example

    .
    ├── app         # Next.js app to place orders from
    ├── supabase    # Supabase directory containing functions to send push notifications
    └── README.md

- Rename `app/.env.example` to `app/.env.local` and add your Supabase URL, Anon Key, and OneSignal App ID.
- Run `supabase link --project-ref YOUR_SUPABASE_PROJECT_REF` to link the edge functions to your Supabase project
- Set environment variables for edge functions
  - Rename `supabase/.env.example` to `supabase/.env`
  - Add your OneSignal App ID, User Auth Key, and REST API Key
  - Run `supabase secrets set --env-file ./supabase/.env`
- Deploy the `notify` edge function by running `supabase functions deploy notify --no-verify-jwt`
- Run the SQL below to create the `orders` table
- Create a OneSignal app with Custom Code Setup

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
