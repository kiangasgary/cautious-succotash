const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    // Test connection
    const { data: tableData, error: tableError } = await supabase
      .from('summaries')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('Error accessing summaries table:', tableError.message)
      return
    }

    console.log('Successfully connected to Supabase and accessed summaries table')
    console.log('Sample data:', tableData)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSupabase() 