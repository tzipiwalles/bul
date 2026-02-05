'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedStory, setSelectedStory] = useState<StoryProfile | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkScroll, 300)
    }
  }

  const profilesWithVideo = profiles.filter(p => p.hasVideo)

  if (profilesWithVideo.length === 0) return null

  return (
    <>
      <div className={cn("relative", className)}>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-bold text-gray-900">עדכונים חיים</h2>
          </div>
          <span className="text-sm text-gray-500">{profilesWithVideo.length} עסקים עם תוכן חדש</span>
        </div>

        {/* Scroll Container */}
        <div className="relative group">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-full glass shadow-md",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}

          {/* Stories List */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
          >
            {profilesWithVideo.map((profile, index) => (
              <motion.button
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedStory(profile)}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                {/* Story Ring */}
                <div className={cn(
                  "w-[72px] h-[72px] rounded-full p-[3px]",
                  profile.isNew 
                    ? "story-ring story-ring-glow" 
                    : "bg-gradient-to-tr from-gray-300 to-gray-200"
                )}>
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{profile.name[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <span className="text-xs text-gray-700 font-medium max-w-[72px] truncate">
                  {profile.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-full glass shadow-md",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          profile={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  )
}

interface StoryViewerProps {
  profile: StoryProfile
  onClose: () => void
}

function StoryViewer({ profile, onClose }: StoryViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass-dark flex items-center justify-center"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Profile Info */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
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

      {/* Video Content */}
      <div 
        className="relative max-w-md w-full h-[80vh] bg-black rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {profile.videoUrl ? (
          <video
            autoPlay
            loop
            playsInline
            controls
            className="w-full h-full object-contain"
          >
            <source src={profile.videoUrl} type="video/mp4" />
          </video>
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
