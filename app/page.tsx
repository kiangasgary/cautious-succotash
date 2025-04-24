import { Suspense } from "react"
import { YoutubeForm } from "@/components/youtube-form"
import { SummaryDisplay } from "@/components/summary-display"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-12 md:pt-16 px-4 pb-4 md:px-8 md:pb-8 max-w-3xl mx-auto">
      <header className="w-full text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">YouTube Summarizer</h1>
        <p className="text-muted-foreground text-lg">
          Get AI-generated summaries of YouTube videos with bullet points and emojis
        </p>
      </header>

      <div className="w-full space-y-8">
        <YoutubeForm />

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Generating summary...</span>
            </div>
          }
        >
          <SummaryDisplay />
        </Suspense>
      </div>
    </main>
  )
}
