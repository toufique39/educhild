# EduChild

A community-driven social development event platform where people can discover local initiatives, volunteer for events, and manage the events they organize.

# Live Application
- Live Website: https://fancy-bienenstitch-f8f9d5.netlify.app
- Backend API: https://educhild-api.netlify.app
  
# Features
- Responsive landing page with an introduction, platform features, upcoming events, community gallery, and newsletter section.
- Browse upcoming community events and explore event details.
- Search and filter events by category.
- Email-and-password authentication with Google sign-in using Better Auth.
- Create events with event information, location, thumbnail, and a future event date.
- Join events when signed in.
- Manage events created by the current user, including editing and deleting them.
- View events joined by the current user.
- View and update profile information.
- Light and dark theme support.
- Protected user experiences backed by Better Auth sessions and JWT-based API authorization.

  
# Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Authentication: Better Auth
- Authentication Database: MongoDB Adapter
- Authorization: Better Auth JWT plugin
- Theme: next-themes
- Deployment: Netlify

  
# Backend Integration
The frontend communicates with the Express API deployed at:
https://educhild-api.netlify.app
The upcoming-events endpoint is configured through NEXT_PUBLIC_EVENTS_API_URL.
Getting Started
1. Clone the repository
git clone https://github.com/toufique39/educhild
cd dir
2. Install dependencies
npm install
3. Configure environment variables
Create a .env.local file in the project root:

# MongoDB connection used by Better Auth
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=edu_child

# Better Auth
BETTER_AUTH_URL=http://localhost:10000
BETTER_AUTH_SECRET=replace_with_a_strong_random_secret

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Express backend API
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3000/upcomming-events

# Optional: set this only if your auth client configuration uses it
NEXT_PUBLIC_BASE_URL=http://localhost:10000
Use the variable names expected by your project configuration. Never commit .env.local or expose OAuth secrets, database credentials, or the Better Auth secret.
4. Run the development server
npm run dev
Open the local URL configured by the project (the development setup for this project uses port 10000).
5. Build for production
npm run build
npm start
Google OAuth Configuration
For local development, configure the Google OAuth client with the local application origin and the Better Auth callback URL.

# For the deployed application, use:

Authorized JavaScript origin
https://fancy-bienenstitch-f8f9d5.netlify.app
Authorized redirect URI
https://fancy-bienenstitch-f8f9d5.netlify.app/api/auth/callback/google
Ensure the production Netlify site has BETTER_AUTH_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET configured for the required runtime/build scopes. The production NEXT_PUBLIC_EVENTS_API_URL should point to the deployed backend.
Related Project
- Backend README: See README-backend.md in the backend repository.
- Backend Live API: https://educhild-api.netlify.app
