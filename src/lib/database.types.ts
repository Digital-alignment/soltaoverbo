export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'free' | 'paid'
export type CourseType = 'free' | 'paid'
export type NotificationType = 'comment' | 'reply' | 'like' | 'announcement' | 'course_update'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      users_profiles: {
        Row: {
          id: string
          display_name: string
          bio: string
          profile_picture_url: string | null
          role: UserRole
          instagram_url: string | null
          linkedin_url: string | null
          substack_url: string | null
          email_public: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          bio?: string
          profile_picture_url?: string | null
          role?: UserRole
          instagram_url?: string | null
          linkedin_url?: string | null
          substack_url?: string | null
          email_public?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          bio?: string
          profile_picture_url?: string | null
          role?: UserRole
          instagram_url?: string | null
          linkedin_url?: string | null
          substack_url?: string | null
          email_public?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string | null
          course_type: CourseType
          stripe_payment_link: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url?: string | null
          course_type?: CourseType
          stripe_payment_link?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string | null
          course_type?: CourseType
          stripe_payment_link?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          tags: string[]
          description: string
          audio_url: string | null
          zoom_link: string | null
          recording_url: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          tags?: string[]
          description?: string
          audio_url?: string | null
          zoom_link?: string | null
          recording_url?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          tags?: string[]
          description?: string
          audio_url?: string | null
          zoom_link?: string | null
          recording_url?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      course_materials: {
        Row: {
          id: string
          lesson_id: string
          title: string
          file_url: string
          file_type: string
          file_size: number | null
          mime_type: string | null
          original_filename: string | null
          is_uploaded: boolean
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          file_url: string
          file_type?: string
          file_size?: number | null
          mime_type?: string | null
          original_filename?: string | null
          is_uploaded?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          file_url?: string
          file_type?: string
          file_size?: number | null
          mime_type?: string | null
          original_filename?: string | null
          is_uploaded?: boolean
          created_at?: string
        }
      }
      lesson_audio_files: {
        Row: {
          id: string
          lesson_id: string
          title: string
          audio_file_url: string
          duration_seconds: number
          file_size_bytes: number
          original_filename: string
          mime_type: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          audio_file_url: string
          duration_seconds: number
          file_size_bytes: number
          original_filename: string
          mime_type: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          audio_file_url?: string
          duration_seconds?: number
          file_size_bytes?: number
          original_filename?: string
          mime_type?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      writing_exercises: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          writing_exercise_id: string
          user_id: string
          likes_count: number
          comments_count: number
          published_at: string
          hidden_from_fogueira: boolean
        }
        Insert: {
          id?: string
          writing_exercise_id: string
          user_id: string
          likes_count?: number
          comments_count?: number
          published_at?: string
          hidden_from_fogueira?: boolean
        }
        Update: {
          id?: string
          writing_exercise_id?: string
          user_id?: string
          likes_count?: number
          comments_count?: number
          published_at?: string
          hidden_from_fogueira?: boolean
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string | null
          lesson_id: string | null
          user_id: string
          parent_comment_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          lesson_id?: string | null
          user_id: string
          parent_comment_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          lesson_id?: string | null
          user_id?: string
          parent_comment_id?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          link: string | null
          broadcast_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          link?: string | null
          broadcast_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          link?: string | null
          broadcast_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      admin_broadcasts: {
        Row: {
          id: string
          title: string
          message: string
          image_url: string | null
          target_audience: string[]
          created_by: string | null
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          message: string
          image_url?: string | null
          target_audience: string[]
          created_by?: string | null
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          message?: string
          image_url?: string | null
          target_audience?: string[]
          created_by?: string | null
          created_at?: string
          is_active?: boolean
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_payment_id: string
          status: SubscriptionStatus
          started_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_id: string
          status?: SubscriptionStatus
          started_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_id?: string
          status?: SubscriptionStatus
          started_at?: string
          expires_at?: string | null
        }
      }
      banners: {
        Row: {
          id: string
          image_url: string
          button_text: string | null
          button_link: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          visible_to_roles: string[]
        }
        Insert: {
          id?: string
          image_url: string
          button_text?: string | null
          button_link?: string | null
          display_order: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          visible_to_roles?: string[]
        }
        Update: {
          id?: string
          image_url?: string
          button_text?: string | null
          button_link?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          visible_to_roles?: string[]
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
          updated_at?: string
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
      user_role: UserRole
      course_type: CourseType
      notification_type: NotificationType
      subscription_status: SubscriptionStatus
    }
  }
}
