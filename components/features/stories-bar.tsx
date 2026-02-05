'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { Play, X, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryProfile {
  id: string
  name: string
  avatarUrl: string | null
  hasVideo: boolean
  videoUrl?: string
  category: string
  isNew?: boolean
}

interface StoriesBarProps {
  profiles: StoryProfile[]
  className?: string
}

export function StoriesBar({ profiles, className }: StoriesBarProps) {
  const [selectedStory, setSelectedStory] = useState<StoryProfile | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimationControls()
  const containerRef = useRef<HTMLDivElement>(null)

  const profilesWithVideo = profiles.filter(p => p.hasVideo)

  // Calculate animation duration based on content width
  const itemWidth = 88 // 72px width + 16px gap
  const totalWidth = profilesWithVideo.length * itemWidth

  // Duplicate items for seamless loop
  const duplicatedProfiles = [...profilesWithVideo, ...profilesWithVideo]

  useEffect(() => {
    if (profilesWithVideo.length === 0) return

    // Start the marquee animation
    const startAnimation = () => {
      controls.start({
        x: [-totalWidth, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: profilesWithVideo.length * 3, // 3 seconds per item
            ease: "linear",
          },
        },
      })
    }

    if (!isPaused) {
      startAnimation()
    } else {
      controls.stop()
    }
  }, [isPaused, profilesWithVideo.length, controls, totalWidth])

  if (profilesWithVideo.length === 0) return null

  return (
    <>
      <div className={cn("relative overflow-hidden", className)}>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
            </div>
            <h2 className="font-bold text-gray-900">עדכונים חיים</h2>
          </div>
          <span className="text-sm text-gray-500">{profilesWithVideo.length} עסקים עם תוכן חדש</span>
        </div>

        {/* Marquee Container */}
        <div 
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Overlays for fade effect */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          {/* Animated Stories Row */}
          <motion.div
            animate={controls}
            className="flex gap-4 py-2"
            style={{ width: 'fit-content' }}
          >
            {duplicatedProfiles.map((profile, index) => (
              <motion.button
                key={`${profile.id}-${index}`}
                onClick={() => setSelectedStory(profile)}
                className="flex flex-col items-center gap-2 shrink-0 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Story Ring - Fixed aspect ratio */}
                <div className={cn(
                  "w-[72px] h-[72px] rounded-full p-[3px] transition-all duration-300",
                  profile.isNew 
                    ? "story-ring story-ring-glow" 
                    : "bg-gradient-to-tr from-gray-300 to-gray-200",
                  "group-hover:scale-105 group-hover:shadow-lg"
                )}>
                  <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                    {/* Fixed aspect-square container for image */}
                    <div className="relative w-full h-full aspect-square rounded-full overflow-hidden">
                      {profile.avatarUrl ? (
                        <Image
                          src={profile.avatarUrl}
                          alt={profile.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{profile.name[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <span className="text-xs text-gray-700 font-medium max-w-[72px] truncate">
                  {profile.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 flex items-center gap-1"
            >
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <span>עצור לצפייה</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <StoryViewer
            profile={selectedStory}
            profiles={profilesWithVideo}
            onClose={() => setSelectedStory(null)}
            onNext={(next) => setSelectedStory(next)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Skeleton loader for Stories Bar
export function StoriesBarSkeleton() {
  return (
    <div className="relative overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stories Skeleton */}
      <div className="flex gap-4 py-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[72px] h-[72px] rounded-full bg-gray-200 animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface StoryViewerProps {
  profile: StoryProfile
  profiles: StoryProfile[]
  onClose: () => void
  onNext: (profile: StoryProfile) => void
}

function StoryViewer({ profile, profiles, onClose, onNext }: StoryViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const currentIndex = profiles.findIndex(p => p.id === profile.id)

  // Progress bar animation
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }

    const handleEnded = () => {
      // Auto-advance to next story
      if (currentIndex < profiles.length - 1) {
        onNext(profiles[currentIndex + 1])
      } else {
        onClose()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [currentIndex, profiles, onNext, onClose])

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNext(profiles[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      onNext(profiles[currentIndex + 1])
    } else {
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
        {profiles.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: i < currentIndex ? '100%' : '0%' }}
              animate={{ 
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-12 left-4 z-20 w-10 h-10 rounded-full glass-dark flex items-center justify-center"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Profile Info */}
      <div className="absolute top-12 right-4 z-20 flex items-center gap-3">
        <div className="relative w-10 h-10 aspect-square rounded-full overflow-hidden border-2 border-white">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">{profile.name[0]}</span>
            </div>
          )}
        </div>
        <div className="text-white">
          <div className="font-bold">{profile.name}</div>
          <div className="text-xs text-white/70">{profile.category}</div>
        </div>
      </div>

      {/* Navigation Areas */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
        onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
      />

      {/* Video Content */}
      <div 
        className="relative max-w-md w-full h-[80vh] bg-black rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {profile.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={profile.videoUrl}
              autoPlay
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain"
            />
            {/* Mute Toggle */}
            <button
              onClick={() => {
                setIsMuted(!isMuted)
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted
                }
              }}
              className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full glass-dark flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white/60">
              <Play className="h-16 w-16 mx-auto mb-4" />
              <p>אין סרטון זמין</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
