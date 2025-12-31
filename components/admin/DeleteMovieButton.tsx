'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteMovieButtonProps {
  movieId: string
  movieTitle: string
}

export default function DeleteMovieButton({ movieId, movieTitle }: DeleteMovieButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('movie')
        .delete()
        .eq('movie_id', movieId)

      if (error) throw error

      router.refresh()
      setShowConfirm(false)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1A1A1A] border border-red-600/20 rounded-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-white mb-2">Delete Movie</h3>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete <span className="text-white font-medium">{movieTitle}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 hover:bg-red-600/10 rounded-lg transition-colors"
      title="Delete"
    >
      <Trash2 className="w-4 h-4 text-red-400" />
    </button>
  )
}















