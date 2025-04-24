# YouTube Summarizer

A modern web application that uses AI to generate concise, bullet-pointed summaries of YouTube videos. Built with Next.js, Supabase, and Google's Gemini AI.

## Features

- 🎥 YouTube video URL processing
- 🤖 AI-powered summary generation using Google's Gemini
- 📝 Bullet-pointed, easy-to-read summaries
- 👤 User authentication and profiles
- 💾 Save and organize summaries
- 📱 Responsive design for all devices
- 🌓 Light/Dark mode support

## Tech Stack

- **Frontend**: Next.js 15.2.4, React 19
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **AI**: Google Gemini AI
- **API**: YouTube Data API v3

## Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM package manager
- Supabase account
- Google Cloud account (for Gemini AI and YouTube API)

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kiangasgary/youtube-summerizer.git
cd youtube-summerizer
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── summary/       # Summary generation
│   └── history/       # User history
├── components/        # Reusable components
├── lib/              # Utility functions
├── types/            # TypeScript types
└── styles/           # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 