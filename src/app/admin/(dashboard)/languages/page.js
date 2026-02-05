import { prisma } from '@/lib/prisma'
import LanguageClient from './LanguageClient'

export default async function LanguagesPage() {
  // 1. Fetch data on the server
  const languages = await prisma.language.findMany({
    orderBy: [
        { isDefault: 'desc' }, // Default language on top
        { isActive: 'desc' },  // Active languages next
        { code: 'asc' }        // Alphabetical
    ]
  })

  // 2. Pass data to the client component
  return (
    <div className="max-w-5xl mx-auto p-6">
      <LanguageClient languages={languages} />
    </div>
  )
}