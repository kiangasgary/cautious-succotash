const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSaveSummary() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // First, let's try to get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    console.error('Auth error:', authError.message)
    return
  }

  if (!user) {
    console.error('No user logged in')
    return
  }

  // Test data for saving a summary
  const testSummary = {
    user_id: user.id,
    video_id: 'test_video_123',
    video_title: 'Test Video Title',
    summary_points: [
      { emoji: '📌', text: 'Test summary point 1' },
      { emoji: '💡', text: 'Test summary point 2' }
    ],
    created_at: new Date().toISOString()
  }

  try {
    // Try to save the summary
    const { data, error } = await supabase
      .from('summaries')
      .insert(testSummary)
      .select()

    if (error) {
      console.error('Error saving summary:', error.message)
      return
    }

    console.log('Successfully saved summary:', data)

    // Now try to fetch it back
    const { data: fetchedData, error: fetchError } = await supabase
      .from('summaries')
      .select('*')
      .eq('video_id', 'test_video_123')
      .single()

    if (fetchError) {
      console.error('Error fetching saved summary:', fetchError.message)
      return
    }

    console.log('Successfully fetched saved summary:', fetchedData)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSaveSummary() 