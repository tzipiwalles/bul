export type Gender = 'male' | 'female'
export type Role = 'professional' | 'store'
export type ServiceType = 'appointment' | 'project' | 'emergency' | 'retail'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          business_name: string
          gender: Gender
          role: Role
          service_type: ServiceType
          city: string
          address: string | null
          phone: string
          whatsapp: string | null
          description: string | null
          rating: number
          review_count: number
          media_urls: string[]
          avatar_url: string | null
          is_verified: boolean
          is_active: boolean
          opening_hours: OpeningHours | null
          categories: string[]
          community: string | null
          website_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          business_name: string
          gender: Gender
          role: Role
          service_type: ServiceType
          city: string
          address?: string | null
          phone: string
          whatsapp?: string | null
          description?: string | null
          rating?: number
          review_count?: number
          media_urls?: string[]
          avatar_url?: string | null
          is_verified?: boolean
          is_active?: boolean
          opening_hours?: OpeningHours | null
          categories?: string[]
          community?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          business_name?: string
          gender?: Gender
          role?: Role
          service_type?: ServiceType
          city?: string
          address?: string | null
          phone?: string
          whatsapp?: string | null
          description?: string | null
          rating?: number
          review_count?: number
          media_urls?: string[]
          avatar_url?: string | null
          is_verified?: boolean
          is_active?: boolean
          opening_hours?: OpeningHours | null
          categories?: string[]
          community?: string | null
          website_url?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          profile_id: string
          reviewer_id: string
          rating: number
        }
        Insert: {
          id?: string
          created_at?: string
          profile_id: string
          reviewer_id: string
          rating: number
        }
        Update: {
          id?: string
          created_at?: string
          profile_id?: string
          reviewer_id?: string
          rating?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          name_he: string
          icon: string
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          name_he: string
          icon: string
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          name_he?: string
          icon?: string
          parent_id?: string | null
          sort_order?: number
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          profile_id: string
          customer_name: string
          customer_phone: string
          requested_date: string
          requested_time: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          profile_id: string
          customer_name: string
          customer_phone: string
          requested_date: string
          requested_time?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          profile_id?: string
          customer_name?: string
          customer_phone?: string
          requested_date?: string
          requested_time?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          notes?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          profile_id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          message: string | null
          status: 'new' | 'contacted' | 'closed'
        }
        Insert: {
          id?: string
          created_at?: string
          profile_id: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'closed'
        }
        Update: {
          id?: string
          created_at?: string
          profile_id?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'closed'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender: Gender
      role: Role
      service_type: ServiceType
    }
  }
}

export interface OpeningHours {
  sunday?: { open: string; close: string } | null
  monday?: { open: string; close: string } | null
  tuesday?: { open: string; close: string } | null
  wednesday?: { open: string; close: string } | null
  thursday?: { open: string; close: string } | null
  friday?: { open: string; close: string } | null
  saturday?: { open: string; close: string } | null
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']

// User features types
export interface Favorite {
  id: string
  user_id: string
  profile_id: string
  created_at: string
}

export interface UserNote {
  id: string
  user_id: string
  profile_id: string
  note: string
  created_at: string
  updated_at: string
}

export type ActivityType = 'view' | 'call' | 'whatsapp' | 'appointment_request' | 'lead_sent'

export interface UserActivity {
  id: string
  user_id: string
  profile_id: string
  activity_type: ActivityType
  metadata: Record<string, unknown>
  created_at: string
}
