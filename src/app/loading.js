import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="container py-10 space-y-10">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-[60vh] rounded-3xl" />
      
      {/* Sections Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-48 h-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[...Array(3)].map((_, i) => (
             <Skeleton key={i} className="h-96 rounded-2xl" />
           ))}
        </div>
      </div>
    </div>
  )
}