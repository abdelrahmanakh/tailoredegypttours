import { prisma } from '@/lib/prisma'
import { createAdmin, deleteAdmin } from './actions'
import AdminsClient from './AdminsClient'

export default async function AdminsPage() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-4xl mx-auto">
       <AdminsClient 
          admins={admins} 
          createAction={createAdmin} 
          deleteAction={deleteAdmin} 
       />
    </div>
  )
}