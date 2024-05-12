import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tvqqkuivoouaciaykuhr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cXFrdWl2b291YWNpYXlrdWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzODc5NjEsImV4cCI6MjAyODk2Mzk2MX0.G2WaiD8CrtnWlkP0wcXIlzpWyKPkxqlMw4KvOsJCqDQ'
export const supabase = createClient(supabaseUrl, supabaseKey)

