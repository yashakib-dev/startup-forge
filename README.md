# Startup Forge

Startup Forge is a Next.js application that connects founders with collaborators through opportunity postings, startup profiles, and application workflows. It includes founder, collaborator, and admin dashboards, native authentication, paginated opportunity browsing, and MongoDB-backed API routes.

## Live Links
Client Live link: https://startup-forge-one.vercel.app/ <br>
ServerLive link: https://startup-forge-server-alpha.vercel.app/
## Key Features

- Founder dashboard for posting and managing opportunities
- Collaborator dashboard for browsing and applying to opportunities
- Admin dashboard for managing startups, users, and transactions
- Opportunity details, startup profiles, and application submission
- Paginated opportunities listing and filter/search support
- MongoDB backend via custom `src/app/api/opportunities` API routes
- Stripe checkout integration for paid plans
- Auth using `better-auth` and role-based access

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - shared UI components, dashboard widgets, pagination, and homepage blocks
- `src/lib/actions/` - reusable server/client actions for opportunities, startups, payments, profiles, and users
- `src/lib/api/` - API helpers for plans and other read-only data
- `src/app/api/` - serverless handlers for auth, checkout, and opportunities
- `src/app/dashboard/` - protected founder, collaborator, and admin dashboard routes

## Development

Install dependencies:

```bash
npm install
```

Run the app in development mode:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

Build the application:

```bash
npm run build
```

Start the optimized production server:

```bash
npm start
```


## Important Routes

- `/` - homepage
- `/login` - sign in
- `/register` - sign up
- `/dashboard/founder` - founder dashboard
- `/dashboard/collaborator` - collaborator dashboard
- `/dashboard/admin` - admin dashboard
- `/opportunities` - opportunity marketplace
- `/opportunity-details/[id]` - opportunity detail page
- `/startup-details/[id]` - startup profile page

## API Endpoints

- `GET /api/opportunities` - list opportunities (supports query filters)
- `POST /api/opportunities` - create a new opportunity
- `GET /api/opportunities/[id]` - fetch one opportunity
- `PATCH /api/opportunities/[id]` - update opportunity
- `DELETE /api/opportunities/[id]` - delete opportunity

## Notes

- The project uses React 19 and Next.js 16 App Router.
- Components under `src/app` use both server and client rendering patterns.
- Opportunity fetching is centralized in `src/lib/actions/opportunity.js`.

## Troubleshooting

- Ensure MongoDB credentials are valid and available in `MONGO_DB_URI`
- If you change API route folders, rebuild the app with `npm run build`
- Check `src/lib/actions/opportunity.js` when opportunity fetching behaves unexpectedly

## License

This project is provided as-is. Update this README with your own license and contributor information as needed.
