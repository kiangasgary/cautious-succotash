export interface SummaryPoint {
  emoji: string
  text: string
}

export interface Database {
  public: {
    Tables: {
      summaries: {
        Row: {
          id: string
          user_id: string
          video_id: string
          video_title: string
          summary_points: SummaryPoint[]
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          video_title: string
          summary_points: SummaryPoint[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          video_title?: string
          summary_points?: SummaryPoint[]
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
      [_ in never]: never
    }
  }
} 