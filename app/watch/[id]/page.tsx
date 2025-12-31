'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import ReactPlayer from 'react-player'
import { Film, X, Settings, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Star } from 'lucide-react'

export default function WatchPage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<any>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [hasExistingRating, setHasExistingRating] = useState(false)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { id: movieId } = params
  const partyCode = searchParams.get('party')

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Step 1.0: Get client profile
        const { data: client } = await supabase
          .from('client')
          .select('client_id')
          .eq('user_id', user.id)
          .single()

        if (!client) {
          router.push('/login')
          return
        }

        // Step 2.0: Check ticket
        const { data: ticket } = await supabase
          .from('ticket')
          .select('*')
          .eq('client_id', client.client_id)
          .eq('movie_id', movieId)
          .eq('is_active', true)
          .single()

        if (!ticket) {
          alert('You need a valid ticket to watch this movie')
          router.push(`/movies/${movieId}`)
          return
        }

        // Step 3.0: Fetch movie
        const { data: movieData } = await supabase
          .from('movie')
          .select('*')
          .eq('movie_id', movieId)
          .single()

        setMovie(movieData)
        setHasAccess(true)

        // Step 4.0: Record watch history (prevent rapid duplicates)
        // Check if watch history already exists for this client+movie in the last 5 minutes
        // This prevents React Strict Mode double inserts but allows legitimate new views
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: existingHistory, error: checkError } = await supabase
          .from('watch_history')
          .select('history_id')
          .eq('client_id', client.client_id)
          .eq('movie_id', movieId)
          .gte('watch_date', fiveMinutesAgo)
          .limit(1)

        // Only insert if no recent watch history exists (within 5 minutes)
        if (!existingHistory || existingHistory.length === 0) {
          const { error: insertError } = await supabase
          .from('watch_history')
          .insert({
            client_id: client.client_id,
            movie_id: movieId,
            watch_date: new Date().toISOString(),
            watch_duration: 0,
          })
          
          if (insertError) {
            console.error('Failed to insert watch history:', insertError)
          }
        }

      } catch (error: any) {
        alert('Failed to verify access')
        router.push('/movies')
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [movieId, partyCode])

  // Auto-hide controls when playing
  useEffect(() => {
    if (playing) {
      // Hide controls after 2 seconds when video is playing
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
    } else {
      // Show controls when paused
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [playing])

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    // Auto-hide again after 2 seconds if playing
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
    }
  }

  const handleMouseEnter = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (playing) {
      // Hide controls when mouse leaves and video is playing
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 1000)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  // Format time (seconds to MM:SS or HH:MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Handle progress update
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number }) => {
    if (!seeking) {
      setPlayedSeconds(state.playedSeconds)
    }
  }

  // Handle duration
  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  // Handle seeking
  const handleSeekChange = (clientX: number) => {
    if (!progressBarRef.current || !duration || duration === 0) return
    
    const rect = progressBarRef.current.getBoundingClientRect()
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const newTime = pos * duration
    
    setPlayedSeconds(newTime)
    if (playerRef.current) {
      playerRef.current.seekTo(pos, 'fraction')
    }
  }

  const handleSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSeeking(true)
    handleSeekChange(e.clientX)
  }

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSeeking(false)
  }

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (seeking) {
      e.preventDefault()
      handleSeekChange(e.clientX)
    }
  }

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!seeking) {
      handleSeekChange(e.clientX)
    }
  }

  const handleSeekTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSeeking(true)
    const touch = e.touches[0]
    if (touch) {
      handleSeekChange(touch.clientX)
    }
  }

  const handleSeekTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (seeking) {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        handleSeekChange(touch.clientX)
      }
    }
  }

  const handleSeekTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSeeking(false)
  }

  // Handle mouse leave to stop seeking
  useEffect(() => {
    const handleMouseUp = () => {
      if (seeking) {
        setSeeking(false)
      }
    }
    
    if (seeking) {
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchend', handleMouseUp)
    }
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [seeking])

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (rating === 0) return
    
    setSubmittingRating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please login to rate this movie')
        setShowRatingModal(false)
        return
      }

      const { data: client } = await supabase
        .from('client')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!client) {
        alert('Client profile not found')
        setShowRatingModal(false)
        return
      }

      // Upsert will update if rating exists (due to UNIQUE constraint on client_id, movie_id)
      const { error } = await supabase
        .from('rating')
        .upsert({
          client_id: client.client_id,
          movie_id: movieId,
          score: rating,
          review_text: reviewText.trim() || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'client_id,movie_id'
        })

      if (error) throw error
      
      alert('Thank you for rating this movie!')
      setShowRatingModal(false)
      setReviewText('')
    } catch (error: any) {
      alert('Failed to submit rating: ' + (error.message || 'Unknown error'))
    } finally {
      setSubmittingRating(false)
    }
  }

  // Detect video provider from URL
  const getVideoProvider = (url: string) => {
    if (!url) return null
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    if (url.includes('dailymotion.com')) return 'dailymotion'
    return 'file' // For direct video files
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <Film className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess || !movie) {
    return null
  }

  const videoUrl = movie.yt_link || movie.trailer_link
  const provider = getVideoProvider(videoUrl || '')

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Player */}
      <div 
        className="absolute inset-0 w-full h-full"
        onClick={() => {
          setShowControls(true)
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
          }
          if (playing) {
            controlsTimeoutRef.current = setTimeout(() => {
              setShowControls(false)
            }, 2000)
          }
        }}
      >
        <style jsx global>{`
          /* Hide Vimeo native controls */
          iframe[src*="vimeo"] {
            pointer-events: auto !important;
          }
          .vimeo-player iframe {
            pointer-events: auto !important;
          }
          /* Hide any overlay controls from video providers */
          iframe {
            pointer-events: auto !important;
          }
        `}</style>
        {videoUrl ? (
            <ReactPlayer
            ref={playerRef}
            url={videoUrl}
              width="100%"
              height="100%"
            playing={playing}
            volume={muted ? 0 : volume}
            playbackRate={playbackRate}
            controls={false}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onPlay={() => {
              setPlaying(true)
              // Hide controls after video starts playing
              setTimeout(() => {
                setShowControls(false)
              }, 2000)
            }}
            onPause={() => {
              setPlaying(false)
              setShowControls(true)
            }}
            onEnded={async () => {
              setPlaying(false)
              setShowControls(true)
              
              // Check if user already has a rating for this movie
              try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                  const { data: client } = await supabase
                    .from('client')
                    .select('client_id')
                    .eq('user_id', user.id)
                    .single()

                  if (client) {
                    const { data: existingRating } = await supabase
                      .from('rating')
                      .select('score, review_text')
                      .eq('client_id', client.client_id)
                      .eq('movie_id', movieId)
                      .single()

                    if (existingRating) {
                      // Pre-fill with existing rating
                      setRating(existingRating.score)
                      setReviewText(existingRating.review_text || '')
                      setHasExistingRating(true)
                    } else {
                      // Reset for new rating
                      setRating(0)
                      setReviewText('')
                      setHasExistingRating(false)
                    }
                  }
                }
              } catch (error) {
                // If error, just reset
                setRating(0)
                setReviewText('')
              }
              
              setShowRatingModal(true)
            }}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 0,
                  controls: 0,
                  rel: 0,
                  modestbranding: 1,
                  showinfo: 0,
                  iv_load_policy: 3,
                  cc_load_policy: 0,
                  fs: 0,
                  disablekb: 1,
                  playsinline: 1,
                  origin: typeof window !== 'undefined' ? window.location.origin : '',
                },
                embedOptions: {
                  host: 'https://www.youtube-nocookie.com',
                }
              },
              vimeo: {
                playerOptions: {
                  autoplay: false,
                  controls: false,
                  title: false,
                  byline: false,
                  portrait: false,
                  responsive: true,
                  transparent: false,
                }
              },
              dailymotion: {
                params: {
                  autoplay: false,
                  controls: false,
                  'ui-logo': false,
                  'ui-start-screen-info': false,
                }
              }
            }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Film className="w-16 h-16 mx-auto mb-4" />
                <p>Video not available</p>
              </div>
            </div>
          )}

        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 flex flex-col justify-between pointer-events-none transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 pointer-events-auto">
              <button
                onClick={() => router.push('/movies')}
                className="flex items-center gap-2 text-white hover:text-red-500 transition z-10"
              >
                <X className="w-6 h-6" />
                <span className="text-sm font-medium">Exit</span>
              </button>
              
              <h1 className="text-white text-lg font-semibold truncate max-w-md text-center">
                {movie.title}
              </h1>
              
              <div className="w-24"></div>
        </div>

            {/* Center Play Button - Absolutely positioned */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={() => setPlaying(!playing)}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition flex items-center justify-center pointer-events-auto z-10"
              >
                {playing ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
      </div>

            {/* Bottom Controls */}
            <div className="p-4 space-y-3 pointer-events-auto">
              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-mono min-w-[50px]">
                  {formatTime(playedSeconds)}
                </span>
                <div
                  ref={progressBarRef}
                  className="flex-1 h-3 bg-white/20 rounded-full cursor-pointer group relative z-10"
                  onMouseDown={handleSeekMouseDown}
                  onMouseUp={handleSeekMouseUp}
                  onMouseMove={handleSeekMouseMove}
                  onMouseLeave={handleSeekMouseUp}
                  onTouchStart={handleSeekTouchStart}
                  onTouchMove={handleSeekTouchMove}
                  onTouchEnd={handleSeekTouchEnd}
                  onClick={handleSeekClick}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div
                    className="absolute inset-0 h-full bg-white/20 rounded-full"
                  />
                  <div
                    className="h-full bg-red-600 rounded-full transition-all relative z-10"
                    style={{ width: `${duration && duration > 0 ? (playedSeconds / duration) * 100 : 0}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
                    style={{ left: `calc(${duration && duration > 0 ? (playedSeconds / duration) * 100 : 0}% - 8px)` }}
                  />
                </div>
                <span className="text-white text-xs font-mono min-w-[50px] text-right">
                  {formatTime(duration)}
                </span>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="text-white hover:text-red-500 transition"
                  >
                    {playing ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setMuted(!muted)}
                    className="text-white hover:text-red-500 transition"
                  >
                    {muted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Speed Control */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="flex items-center gap-2 text-white hover:text-red-500 transition"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-sm">{playbackRate}x</span>
                    </button>
                  
                    {showSettings && (
                      <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px]">
                        <div className="text-xs text-gray-400 mb-2 px-2">Playback Speed</div>
                        {speedOptions.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackRate(speed)
                              setShowSettings(false)
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 transition ${
                              playbackRate === speed ? 'text-red-500 font-semibold' : 'text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                    </div>
                    )}
                  </div>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-red-500 transition"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </button>
                    </div>
                        </div>
                    </div>
                  </div>
                </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-xl border border-[#1A1A1A] p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {hasExistingRating ? 'Update Your Rating' : 'Rate this Movie'}
              </h2>
              <p className="text-gray-400">
                {hasExistingRating 
                  ? `Update your rating for ${movie?.title}` 
                  : `How would you rate ${movie?.title}?`}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-0.5 md:gap-2 mb-6 md:mb-8 flex-wrap px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => setRating(score)}
                  onMouseEnter={() => setHoveredRating(score)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                  disabled={submittingRating}
                >
                  <Star
                    className={`w-5 h-5 md:w-7 md:h-7 ${
                      (hoveredRating >= score || rating >= score)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'fill-transparent text-gray-600'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="text-center mb-4">
                <p className="text-white font-semibold text-lg">
                  {rating} / 10
                </p>
              </div>
            )}

            {/* Review Text Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Write a review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                disabled={submittingRating}
                className="w-full h-32 px-4 py-3 bg-[#1A1A1A] border border-[#252525] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-red-600 transition disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewText.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false)
                  setRating(0)
                  setHoveredRating(0)
                  setReviewText('')
                }}
                disabled={submittingRating}
                className="flex-1 px-4 py-3 bg-[#1A1A1A] hover:bg-[#252525] rounded-lg text-white font-medium transition disabled:opacity-50"
            >
                Skip
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={rating === 0 || submittingRating}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


