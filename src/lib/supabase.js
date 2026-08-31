// Initialize supabase client (browser.util)
// Config .env file se aati hai — dekho .env.example
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseReady = Boolean(supabase)

if (!isSupabaseReady) {
  console.warn(
    '⚠️  Supabase ready nahi hai. File `.env` mein VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY set karo (format ke liye .env.example dekho).',
  )
}