import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Use the specific project ID
const projectId = 'hcmqvcehtdsuvdejnisj'

// Ensure the types directory exists
const typesDir = path.join(process.cwd(), 'types')
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true })
}

// Generate types using Supabase CLI
console.log('Generating Supabase types...')
try {
  const command = `supabase gen types typescript --project-id ${projectId} > types/supabase.ts`
  console.log('Running command:', command)
  execSync(command, {
    stdio: 'inherit',
  })
  console.log('Types generated successfully!')
} catch (error) {
  console.error('Error generating types:', error)
  process.exit(1)
} 