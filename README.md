# Wellspace

## Environment Variables Setup

To set up your environment variables:

1. Copy the `.env.example` file in the project root and rename it to `.env.local`

   \`\`\`
   cp .env.example .env.local
   \`\`\`

2. Open the `.env.local` file and replace the placeholder values with your actual credentials:

   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   STRIPE_SECRET_KEY=your_actual_stripe_secret_key
   STRIPE_PREMIUM_PLAN_PRICE_ID=your_actual_stripe_premium_plan_price_id
   \`\`\`

3. Save the `.env.local` file

4. Restart your development server if it's running

IMPORTANT: Never commit the `.env.local` file to version control. It contains sensitive information and should remain on your local machine.

For production deployment, set these environment variables in your hosting platform's dashboard (e.g., Vercel, Netlify).

## Getting Started

[Ensure this section includes instructions for installing dependencies, running the development server, etc.]

## Features

[List or update key features of your application]

## Contributing

[Add or update guidelines for contributing to the project, if applicable]

## License

[Specify or update the license under which your project is released]


