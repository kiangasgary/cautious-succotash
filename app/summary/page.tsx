import { Suspense } from "react"
import { SummaryDisplay } from "@/components/summary-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SummaryPage() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-12 md:pt-16 px-4 pb-4 md:px-8 md:pb-8 max-w-3xl mx-auto">
      <div className="w-full flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mx-auto pr-16">Video Summary</h1>
      </div>

      <div className="w-full">
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
