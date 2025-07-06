# AutoPost AI - LinkedIn Automation Platform

AutoPost AI is a web application that automates LinkedIn content creation and posting using AI. Generate engaging posts, schedule them at optimal times, and track your performance.

## Features

### MVP Features (Completed)
- ✅ User authentication with Supabase
- ✅ AI-powered post generation using OpenAI GPT-4
- ✅ Modern dashboard UI with Tailwind CSS
- ✅ Database schema for users, posts, and analytics
- ✅ Post creation interface with customizable parameters

### Upcoming Features
- 🔄 LinkedIn OAuth integration
- 🔄 Automated post scheduling
- 🔄 LinkedIn API posting functionality
- 🔄 Analytics and engagement tracking
- 🔄 Post history management

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI**: OpenAI GPT-4o for post generation
- **APIs**: LinkedIn Marketing API (planned)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- LinkedIn Developer account (for OAuth)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd postmaster
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# LinkedIn OAuth Configuration (when ready)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

4. Set up Supabase database

Create a new Supabase project and run the SQL schema:

```sql
-- Copy and paste the contents of supabase/schema.sql into your Supabase SQL editor
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
postmaster/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication
│   └── page.tsx          # Home page
├── contexts/              # React contexts
│   └── supabase-context.tsx
├── lib/                   # Utilities and services
│   ├── ai/               # AI post generation
│   ├── supabase/         # Supabase client configs
│   └── database.types.ts # Database type definitions
├── supabase/             # Database schema
└── middleware.ts         # Auth middleware
```

## Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Create Post**: Go to Dashboard → Create New Post
3. **Customize**: Choose tone, length, and other parameters
4. **Generate**: Let AI create engaging LinkedIn content
5. **Review**: Edit the generated post if needed
6. **Schedule**: (Coming soon) Schedule for optimal posting times

## Development Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Next.js setup with TypeScript
- [x] Supabase integration with SSR
- [x] User authentication
- [x] Database schema
- [x] AI post generation

### Phase 2: LinkedIn Integration (In Progress)
- [ ] LinkedIn OAuth setup
- [ ] LinkedIn API integration
- [ ] Post scheduling system
- [ ] Automated posting

### Phase 3: Analytics & Enhancement
- [ ] Engagement tracking
- [ ] Analytics dashboard
- [ ] A/B testing
- [ ] Advanced scheduling algorithms

## API Documentation

### POST /api/posts/generate

Generate a LinkedIn post using AI.

**Request Body:**
```json
{
  "topic": "Your post topic or idea",
  "tone": "professional|casual|thought-leadership|storytelling",
  "length": "short|medium|long",
  "includeHashtags": true,
  "includeQuestion": false,
  "targetAudience": "Optional target audience"
}
```

**Response:**
```json
{
  "id": "post-uuid",
  "title": "Generated post title",
  "content": "Generated post content",
  "hashtags": ["relevant", "hashtags"],
  "suggestedTime": "ISO timestamp",
  "status": "draft"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub.
# autopost
