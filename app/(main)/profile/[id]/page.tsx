import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'
import ProfileContent from './profile-content'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !profile) {
    notFound()
  }
  
  // Fetch reviews for this profile (if we had a reviews table with actual data)
  // For now, we'll pass empty reviews
  const reviews: Array<{ id: string; rating: number; reviewer: string; date: string; text: string }> = []
  
  return <ProfileContent profile={profile as Profile} reviews={reviews} />
}
