'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteReviewButtonProps {
  ratingId: string
}

export default function DeleteReviewButton({ ratingId }: DeleteReviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('rating')
        .delete()
        .eq('rating_id', ratingId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-red-600/10 rounded-lg transition-colors"
      title="Delete review"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 text-red-400" />
      )}
    </button>
  )
}
















