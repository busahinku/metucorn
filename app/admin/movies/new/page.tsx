import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AddMovieForm from '@/components/admin/AddMovieForm'

export default async function NewMoviePage() {
  const supabase = await createClient()

  // Fetch all directors
  const { data: directors } = await supabase
    .from('director')
    .select('director_id, director_name')
    .order('director_name')

  // Fetch all genres
  const { data: genres } = await supabase
    .from('genre')
    .select('genre_id, name')
    .order('name')

  // Fetch all cast members
  const { data: allCastMembers } = await supabase
    .from('cast_member')
    .select('cast_id, cast_name')
    .order('cast_name')

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/movies"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Add New Movie</h1>
          <p className="text-gray-400">Create a new movie entry</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
        <AddMovieForm
          directors={directors || []}
          genres={genres || []}
          allCastMembers={allCastMembers || []}
        />
      </div>
    </div>
  )
}
