import { getUserSummaries } from "@/actions/summary-actions"
import { SavedSummaries } from "@/components/saved-summaries"
import { Header } from "@/components/header"
import { redirect } from "next/navigation"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function MySummariesPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const { success, summaries, error } = await getUserSummaries()

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-3xl mx-auto pt-8">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold">My Saved Summaries</h1>
          <p className="text-muted-foreground mt-2">View and manage your saved video summaries</p>
        </div>

        <SavedSummaries summaries={success ? summaries : []} error={success ? null : error} />
      </main>
    </>
  )
}
