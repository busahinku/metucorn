'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateMovie(movieId: string, formData: FormData) {
  const supabase = await createClient()

  // Extract form data
  const title = formData.get('title') as string
  const directorId = formData.get('director_id') as string
  const price = parseFloat(formData.get('price') as string)
  const status = formData.get('status') as string
  const releaseDate = formData.get('release_date') as string
  const durationTime = formData.get('duration_time') as string
  const ageRating = formData.get('age_rating') as string
  const posterImage = formData.get('poster_image') as string
  const headerImage = formData.get('header_image') as string
  const bannerText = formData.get('banner_text') as string
  const trailerLink = formData.get('trailer_link') as string
  const ytLink = formData.get('yt_link') as string
  const description = formData.get('description') as string
  const synopsis = formData.get('synopsis') as string

  // Build update object with only fields that exist
  const updateData: any = {
    title,
    director_id: directorId || null,
    price,
    status,
    release_date: releaseDate || null,
    duration_time: durationTime ? parseInt(durationTime) : null,
    age_rating: ageRating || null,
    poster_image: posterImage || null,
    header_image: headerImage || null,
    banner_text: bannerText || null,
    trailer_link: trailerLink || null,
    yt_link: ytLink || null,
    description: description || null,
    synopsis: synopsis || null,
  }

  // Update movie
  const { error: movieError } = await supabase
    .from('movie')
    .update(updateData)
    .eq('movie_id', movieId)

  if (movieError) {
    return { success: false, error: movieError.message }
  }

  // Handle genres
  const genreIds = formData.getAll('genres') as string[]

  // Delete existing genre associations
  await supabase
    .from('movie_genre')
    .delete()
    .eq('movie_id', movieId)

  // Insert new genre associations
  if (genreIds.length > 0) {
    const genreInserts = genreIds.map(genreId => ({
      movie_id: movieId,
      genre_id: genreId
    }))

    await supabase
      .from('movie_genre')
      .insert(genreInserts)
  }

  // Handle cast
  const castData = formData.get('cast') as string
  if (castData) {
    const cast = JSON.parse(castData) as Array<{ cast_id: string; role_name: string }>

    // Delete existing cast associations
    await supabase
      .from('movie_cast')
      .delete()
      .eq('movie_id', movieId)

    // Insert new cast associations
    if (cast.length > 0) {
      const castInserts = cast.map(c => ({
        movie_id: movieId,
        cast_id: c.cast_id,
        role_name: c.role_name
      }))

      await supabase
        .from('movie_cast')
        .insert(castInserts)
    }
  }

  revalidatePath('/admin/movies')
  revalidatePath(`/admin/movies/${movieId}/edit`)
  revalidatePath(`/movies/${movieId}`)

  return { success: true }
}

export async function createMovie(formData: FormData) {
  const supabase = await createClient()

  // Extract form data
  const title = formData.get('title') as string
  const directorId = formData.get('director_id') as string
  const price = parseFloat(formData.get('price') as string)
  const status = formData.get('status') as string
  const releaseDate = formData.get('release_date') as string
  const durationTime = formData.get('duration_time') as string
  const ageRating = formData.get('age_rating') as string
  const posterImage = formData.get('poster_image') as string
  const headerImage = formData.get('header_image') as string
  const bannerText = formData.get('banner_text') as string
  const trailerLink = formData.get('trailer_link') as string
  const ytLink = formData.get('yt_link') as string
  const description = formData.get('description') as string
  const synopsis = formData.get('synopsis') as string

  // Build insert object
  const insertData: any = {
    title,
    director_id: directorId || null,
    price,
    status,
    release_date: releaseDate || null,
    duration_time: durationTime ? parseInt(durationTime) : null,
    age_rating: ageRating || null,
    poster_image: posterImage || null,
    header_image: headerImage || null,
    banner_text: bannerText || null,
    trailer_link: trailerLink || null,
    yt_link: ytLink || null,
    description: description || null,
    synopsis: synopsis || null,
  }

  // Insert movie
  const { data: movie, error: movieError } = await supabase
    .from('movie')
    .insert(insertData)
    .select('movie_id')
    .single()

  if (movieError || !movie) {
    return { success: false, error: movieError?.message || 'Failed to create movie' }
  }

  const movieId = movie.movie_id

  // Handle genres
  const genreIds = formData.getAll('genres') as string[]
  if (genreIds.length > 0) {
    const genreInserts = genreIds.map(genreId => ({
      movie_id: movieId,
      genre_id: genreId
    }))

    await supabase
      .from('movie_genre')
      .insert(genreInserts)
  }

  // Handle cast
  const castData = formData.get('cast') as string
  if (castData) {
    const cast = JSON.parse(castData) as Array<{ cast_id: string; role_name: string }>

    if (cast.length > 0) {
      const castInserts = cast.map(c => ({
        movie_id: movieId,
        cast_id: c.cast_id,
        role_name: c.role_name
      }))

      await supabase
        .from('movie_cast')
        .insert(castInserts)
    }
  }

  revalidatePath('/admin/movies')
  revalidatePath(`/movies`)

  return { success: true, movieId }
}
