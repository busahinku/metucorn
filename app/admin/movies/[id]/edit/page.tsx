import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EditMovieForm from '@/components/admin/EditMovieForm'

export default async function EditMoviePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch movie data with all relations
  const { data: movie } = await supabase
    .from('movie')
    .select(`
      *,
      movie_genre (
        genre:genre_id (
          genre_id,
          name
        )
      ),
      movie_cast (
        cast_member:cast_id (
          cast_id,
          cast_name
        ),
        role_name
      )
    `)
    .eq('movie_id', params.id)
    .single()

  if (!movie) {
    notFound()
  }

  // Fetch all directors
  const { data: directors, error: directorsError } = await supabase
    .from('director')
    .select('director_id, director_name')
    .order('director_name')

  // Fetch all genres
  const { data: genres, error: genresError } = await supabase
    .from('genre')
    .select('genre_id, name')
    .order('name')

  // Fetch all cast members
  const { data: allCastMembers, error: castError } = await supabase
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
          <h1 className="text-3xl font-bold text-white mb-2">Edit Movie</h1>
          <p className="text-gray-400">Update movie information</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
        <EditMovieForm
          movie={movie}
          directors={directors || []}
          genres={genres || []}
          allCastMembers={allCastMembers || []}
        />
      </div>
    </div>
  )
}














