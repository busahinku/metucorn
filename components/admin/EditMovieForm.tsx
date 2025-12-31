'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateMovie } from '@/lib/admin/actions'
import { X, Plus } from 'lucide-react'

interface Director {
  director_id: string
  director_name: string
}

interface Genre {
  genre_id: string
  name: string
}

interface CastMember {
  cast_id: string
  cast_name: string
}

interface MovieCast {
  cast_member: CastMember
  role_name: string
}

interface MovieGenre {
  genre: Genre
}

interface Movie {
  movie_id: string
  title: string
  description: string | null
  synopsis: string | null
  director_id: string | null
  price: number
  status: string
  release_date: string | null
  duration_time: number | null
  age_rating: string | null
  poster_image: string | null
  header_image: string | null
  banner_text: string | null
  trailer_link: string | null
  yt_link: string | null
  movie_genre: MovieGenre[]
  movie_cast: MovieCast[]
}

interface EditMovieFormProps {
  movie: Movie
  directors: Director[]
  genres: Genre[]
  allCastMembers: CastMember[]
}

export default function EditMovieForm({ movie, directors, genres, allCastMembers }: EditMovieFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize cast state
  const [castList, setCastList] = useState<Array<{ cast_id: string; role_name: string }>>(
    movie.movie_cast.map(mc => ({
      cast_id: mc.cast_member.cast_id,
      role_name: mc.role_name
    }))
  )

  // Initialize selected genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    movie.movie_genre.map(mg => mg.genre.genre_id)
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    // Add cast data as JSON
    formData.set('cast', JSON.stringify(castList))

    // Add selected genres
    formData.delete('genres')
    selectedGenres.forEach(genreId => {
      formData.append('genres', genreId)
    })

    startTransition(async () => {
      const result = await updateMovie(movie.movie_id, formData)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/movies')
        }, 1500)
      } else {
        setError(result.error || 'Failed to update movie')
      }
    })
  }

  const addCastMember = () => {
    if (allCastMembers && allCastMembers.length > 0) {
      setCastList([...castList, { cast_id: allCastMembers[0].cast_id, role_name: '' }])
    }
  }

  const removeCastMember = (index: number) => {
    setCastList(castList.filter((_, i) => i !== index))
  }

  const updateCastMember = (index: number, field: 'cast_id' | 'role_name', value: string) => {
    const newCastList = [...castList]
    newCastList[index][field] = value
    setCastList(newCastList)
  }

  const toggleGenre = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId))
    } else {
      setSelectedGenres([...selectedGenres, genreId])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
          <p className="text-sm text-green-400">
            Movie updated successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          defaultValue={movie.title}
          required
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={movie.description || ''}
          placeholder="Short description of the movie"
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        />
      </div>

      {/* Synopsis */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Synopsis
        </label>
        <textarea
          name="synopsis"
          rows={4}
          defaultValue={movie.synopsis || ''}
          placeholder="Detailed plot summary"
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        />
      </div>

      {/* Director */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Director
        </label>
        <select
          name="director_id"
          defaultValue={movie.director_id || ''}
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        >
          <option value="">No Director</option>
          {directors.map(director => (
            <option key={director.director_id} value={director.director_id}>
              {director.director_name}
            </option>
          ))}
        </select>
      </div>

      {/* Genres */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Genres
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {genres.map(genre => (
            <label
              key={genre.genre_id}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                selectedGenres.includes(genre.genre_id)
                  ? 'bg-red-600/20 border-red-600/50 text-white'
                  : 'bg-[#0C0C0C] border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.genre_id)}
                onChange={() => toggleGenre(genre.genre_id)}
                className="sr-only"
              />
              <span className="text-sm">{genre.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cast */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Cast
          </label>
          {allCastMembers && allCastMembers.length > 0 ? (
            <button
              type="button"
              onClick={addCastMember}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Cast
            </button>
          ) : (
            <span className="text-sm text-yellow-400">No cast members available in database</span>
          )}
        </div>
        <div className="space-y-2">
          {castList.map((cast, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={cast.cast_id}
                onChange={(e) => updateCastMember(index, 'cast_id', e.target.value)}
                className="flex-1 px-4 py-2 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
              >
                {allCastMembers && allCastMembers.length > 0 ? (
                  allCastMembers.map(member => (
                    <option key={member.cast_id} value={member.cast_id}>
                      {member.cast_name}
                    </option>
                  ))
                ) : (
                  <option value="">No cast members available</option>
                )}
              </select>
              <input
                type="text"
                value={cast.role_name}
                onChange={(e) => updateCastMember(index, 'role_name', e.target.value)}
                placeholder="Role (e.g., Tony Stark)"
                className="flex-1 px-4 py-2 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
              />
              <button
                type="button"
                onClick={() => removeCastMember(index)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))}
          {castList.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">No cast members added</p>
          )}
        </div>
      </div>

      {/* Poster Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Poster Image URL
        </label>
        <input
          type="url"
          name="poster_image"
          defaultValue={movie.poster_image || ''}
          placeholder="https://..."
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        />
      </div>

      {/* Header Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Header Image URL
        </label>
        <input
          type="url"
          name="header_image"
          defaultValue={movie.header_image || ''}
          placeholder="https://..."
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        />
      </div>

      {/* Banner Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Banner Text
        </label>
        <input
          type="text"
          name="banner_text"
          defaultValue={movie.banner_text || ''}
          placeholder="Featured banner text"
          className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
        />
      </div>

      {/* Video Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trailer Link (YouTube)
          </label>
          <input
            type="url"
            name="trailer_link"
            defaultValue={movie.trailer_link || ''}
            placeholder="https://youtube.com/..."
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Movie Link (YouTube/Vimeo/Dailymotion)
          </label>
          <input
            type="url"
            name="yt_link"
            defaultValue={movie.yt_link || ''}
            placeholder="https://youtube.com/... or https://vimeo.com/..."
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          />
        </div>
      </div>

      {/* Price, Status, Release Date, Duration, Age Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            defaultValue={movie.price}
            required
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status *
          </label>
          <select
            name="status"
            defaultValue={movie.status}
            required
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          >
            <option value="available">Available</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Release Date
          </label>
          <input
            type="date"
            name="release_date"
            defaultValue={movie.release_date || ''}
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration_time"
            defaultValue={movie.duration_time || ''}
            placeholder="120"
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age Rating
          </label>
          <input
            type="text"
            name="age_rating"
            defaultValue={movie.age_rating || ''}
            placeholder="PG-13, R, etc."
            className="w-full px-4 py-3 bg-[#0C0C0C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/movies')}
          disabled={isPending}
          className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
