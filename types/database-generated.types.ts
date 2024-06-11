export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_string: string
          city: string
          country: string
          created_at: string
          id: number
          location_id: number
          postal_code: string | null
          state: string | null
          street1: string | null
          street2: string | null
        }
        Insert: {
          address_string: string
          city: string
          country: string
          created_at?: string
          id?: number
          location_id: number
          postal_code?: string | null
          state?: string | null
          street1?: string | null
          street2?: string | null
        }
        Update: {
          address_string?: string
          city?: string
          country?: string
          created_at?: string
          id?: number
          location_id?: number
          postal_code?: string | null
          state?: string | null
          street1?: string | null
          street2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      cuisines: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      diets: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      email_sign_ups: {
        Row: {
          created_at: string
          email: string
          id: number
          is_verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          is_verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          is_verified?: boolean
        }
        Relationships: []
      }
      food_allergies: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          accommodation: string
          budget: number | null
          created_at: string
          destination: string
          end_date: string
          id: number
          itinerary_status: Database["public"]["Enums"]["itinerary_status"]
          length_of_stay: number
          media_id: number | null
          start_date: string
          user_id: string
        }
        Insert: {
          accommodation: string
          budget?: number | null
          created_at?: string
          destination: string
          end_date: string
          id?: number
          itinerary_status?: Database["public"]["Enums"]["itinerary_status"]
          length_of_stay: number
          media_id?: number | null
          start_date: string
          user_id: string
        }
        Update: {
          accommodation?: string
          budget?: number | null
          created_at?: string
          destination?: string
          end_date?: string
          id?: number
          itinerary_status?: Database["public"]["Enums"]["itinerary_status"]
          length_of_stay?: number
          media_id?: number | null
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_itineraries_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          id: number
          lat: number
          lon: number
          parent_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          lat: number
          lon: number
          parent_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          lat?: number
          lon?: number
          parent_id?: number | null
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          id: number
          media_type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          media_type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: []
      }
      point_of_interests: {
        Row: {
          address_id: number
          created_at: string
          description: string
          id: number
          location_id: number
          name: string
        }
        Insert: {
          address_id: number
          created_at?: string
          description: string
          id?: number
          location_id: number
          name: string
        }
        Update: {
          address_id?: number
          created_at?: string
          description?: string
          id?: number
          location_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_point_of_interests_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_point_of_interests_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      point_of_interests_media: {
        Row: {
          created_at: string
          id: number
          media_id: number
          point_of_interest_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          media_id: number
          point_of_interest_id: number
        }
        Update: {
          created_at?: string
          id?: number
          media_id?: number
          point_of_interest_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_point_of_interests_media_point_of_interest_id_fkey"
            columns: ["point_of_interest_id"]
            isOneToOne: false
            referencedRelation: "point_of_interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_schedule_item_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          has_on_boarded: boolean
          id: string
          is_email_verified: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          has_on_boarded?: boolean
          id: string
          is_email_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          has_on_boarded?: boolean
          id?: string
          is_email_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recreations: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      schedule_items: {
        Row: {
          created_at: string
          duration: number
          end_time: string
          id: number
          itinerary_id: number
          point_of_interest_id: number
          price: number | null
          schedule_item_type: Database["public"]["Enums"]["schedule_item_type"]
          start_time: string
        }
        Insert: {
          created_at?: string
          duration: number
          end_time: string
          id?: number
          itinerary_id: number
          point_of_interest_id: number
          price?: number | null
          schedule_item_type: Database["public"]["Enums"]["schedule_item_type"]
          start_time: string
        }
        Update: {
          created_at?: string
          duration?: number
          end_time?: string
          id?: number
          itinerary_id?: number
          point_of_interest_id?: number
          price?: number | null
          schedule_item_type?: Database["public"]["Enums"]["schedule_item_type"]
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_schedule_items_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_schedule_items_point_of_interest_id_fkey"
            columns: ["point_of_interest_id"]
            isOneToOne: false
            referencedRelation: "point_of_interests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cuisines: {
        Row: {
          created_at: string
          cuisine_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          cuisine_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          cuisine_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_user_cuisines_cuisine_id_fkey"
            columns: ["cuisine_id"]
            isOneToOne: false
            referencedRelation: "cuisines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cuisines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_diets: {
        Row: {
          created_at: string
          diet_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          diet_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          diet_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_user_diets_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_diets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_food_allergies: {
        Row: {
          created_at: string
          food_allergy_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          food_allergy_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          food_allergy_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_user_food_allergies_food_allergy_id_fkey"
            columns: ["food_allergy_id"]
            isOneToOne: false
            referencedRelation: "food_allergies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_food_allergies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recreations: {
        Row: {
          created_at: string
          id: number
          recreation_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          recreation_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          recreation_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_user_recreations_recreation_id_fkey"
            columns: ["recreation_id"]
            isOneToOne: false
            referencedRelation: "recreations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recreations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_all_preference_choices: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_preferences: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      itinerary_status:
        | "ai_pending"
        | "ai_failure"
        | "draft"
        | "finalized"
        | "canceled"
        | "in_progress"
        | "completed"
      media_type: "image" | "video"
      schedule_item_type:
        | "accommodation"
        | "transportation"
        | "meal"
        | "activity"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

