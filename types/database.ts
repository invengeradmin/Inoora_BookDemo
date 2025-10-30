export interface Agent {
  id: string
  email: string
  name: string
  title: string
  avatar_url?: string
  timezone: string
  is_active: boolean
  role: "agent" | "super_admin"
  created_at: string
  updated_at: string
}

export interface DemoSession {
  id: string
  agent_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_country: string
  customer_company: string
  demo_date: string
  demo_time: string
  duration: number
  status:
    | "confirmed"
    | "cancelled"
    | "rescheduled"
    | "completed"
    | "success_pending"
    | "on_hold_waiting"
    | "regret"
    | "interested"
    | "need_in_depth_demo"
    | "onboard"
  notes?: string
  created_at: string
  updated_at: string
  // ✅ Rename this
  agent?: Agent | null
}

export interface EmailConfig {
  id: string
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_password: string
  from_email: string
  from_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: string
  session_id: string
  from_email: string
  to_email: string
  subject: string
  content: string
  sent_at: string
  sent_by: string
}
