import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Film as FilmIcon } from 'lucide-react'
import DeleteMovieButton from '@/components/admin/DeleteMovieButton'

export default async function AdminMoviesPage() {
  const supabase = await createClient()

  // Step 1.0: Fetch all movies with relations
  const { data: movies } = await supabase
    .from('movie')
    .select(`
      *,
      director:director_id (director_name),
      movie_genre (
        genre:genre_id (name)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl space-y-6">
      {/* Step 2.0: Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Movies</h1>
          <p className="text-gray-400">Manage all movies in the catalog</p>
        </div>
        <Link
          href="/admin/movies/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </Link>
      </div>

      {/* Step 3.0: Movies Table */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Movie</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Director</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Genres</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Price</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movies && movies.length > 0 ? (
                movies.map((movie: any) => (
                  <tr key={movie.movie_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {movie.poster_image ? (
                          <Image
                            src={movie.poster_image}
                            alt={movie.title}
                            width={48}
                            height={64}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-white/5 rounded flex items-center justify-center">
                            <FilmIcon className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{movie.title}</div>
                          <div className="text-sm text-gray-400">{movie.release_date?.split('-')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {movie.director?.director_name || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.movie_genre?.slice(0, 2).map((mg: any, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-red-600/10 text-red-400 text-xs rounded">
                            {mg.genre?.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      ${movie.price}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        movie.status === 'available' 
                          ? 'bg-green-600/10 text-green-400' 
                          : 'bg-gray-600/10 text-gray-400'
                      }`}>
                        {movie.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/movies/${movie.movie_id}/edit`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </Link>
                        <DeleteMovieButton movieId={movie.movie_id} movieTitle={movie.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No movies found. Add your first movie to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

