# YouTube Video Summarizer

An AI-powered web application that automatically generates concise, bullet-pointed summaries of YouTube videos using Google's Gemini AI.

## 🌟 Features

- **Quick Video Summaries**: Generate concise summaries of YouTube videos
- **AI-Powered Analysis**: Leverages Google's Gemini AI for accurate content understanding
- **User Authentication**: Secure user accounts with Supabase authentication
- **Save & Organize**: Store and manage your video summaries
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Comfortable viewing in any environment

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.2.4, React 19
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **AI Integration**: Google Gemini AI
- **Additional Tools**: YouTube Transcript API

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/kiangasgary/youtube-summarizer.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

You'll need to set up the following services and obtain their API keys:

1. **Supabase Project**: For database and authentication
2. **Google Gemini AI**: For AI-powered summarization
3. **YouTube Data API**: For video metadata (optional)

## 🔑 Required API Keys

- Supabase Project Configuration
- Google Gemini AI API Key
- YouTube Data API Key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Supabase for the backend infrastructure
- Next.js team for the amazing framework
- All contributors and users of this project 