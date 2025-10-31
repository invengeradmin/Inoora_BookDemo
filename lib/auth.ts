// import { supabase } from "./supabaseClient"

// // Hardcoded credentials for demo purposes
// const AGENT_CREDENTIALS = {
//   "info@inoora.ai": "Invenger@123",
//   "benjamin.macklin@invenger.com": "Invenger@123",
//   "sarah.johnson@inoora.com": "demo123",
//   "michael.chen@inoora.com": "demo123",
//   "emma.wilson@inoora.com": "demo123",
// }

// export const signInAgent = async (email: string, password: string) => {
//   try {
//     // Check if the email exists in the agents table
//     const { data: agentData, error: agentError } = await supabase
//       .from("agents")
//       .select("*")
//       .eq("email", email)
//       .eq("is_active", true)
//       .single()

//     if (agentError || !agentData) {
//       throw new Error("Access denied. Only authorized agents can login.")
//     }

//     // Check hardcoded credentials first
//     if (AGENT_CREDENTIALS[email] && AGENT_CREDENTIALS[email] === password) {
//       console.log("Authenticated with hardcoded credentials")
//       return { user: { email }, agent: agentData }
//     }

//     // Check stored password hash
//     if (agentData.password_hash === password) {
//       console.log("Authenticated with stored password")
//       return { user: { email }, agent: agentData }
//     }

//     throw new Error("Invalid credentials")
//   } catch (error) {
//     console.error("Authentication error:", error)
//     throw new Error("Authentication failed. Please check your credentials.")
//   }
// }

// export const signOutAgent = async () => {
//   if (typeof window !== "undefined") {
//     sessionStorage.removeItem("agent_email")
//   }
// }

// export const getCurrentAgent = async () => {
//   try {
//     const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("agent_email") : null

//     if (storedEmail) {
//       const { data: agent } = await supabase
//         .from("agents")
//         .select("*")
//         .eq("email", storedEmail)
//         .eq("is_active", true)
//         .single()

//       return agent
//     }

//     return null
//   } catch (error) {
//     console.error("Error getting current agent:", error)
//     return null
//   }
// }

// export const isSuperAdmin = (agent: any) => {
//   return agent?.role === "super_admin"
// }



import { query } from "@/lib/postgres"
import bcrypt from "bcryptjs"

// ------------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------------
export const signInAgent = async (email: string, password: string) => {
  try {
    const { rows } = await query(
      `SELECT * FROM agents WHERE email = $1 AND is_active = true LIMIT 1`,
      [email]
    )

    if (!rows || rows.length === 0) {
      throw new Error("Access denied. Agent not found or inactive.")
    }

    const agent = rows[0]

    // Verify password
    const isMatch = await bcrypt.compare(password, agent.password_hash)
    if (!isMatch) {
      throw new Error("Invalid credentials.")
    }

    // Role validation (must be super_admin or agent)
    if (!["super_admin", "agent"].includes(agent.role)) {
      throw new Error("Unauthorized role.")
    }

    // Store session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("agent_email", email)
      sessionStorage.setItem("agent_role", agent.role)
    }

   return {
  user: { email },
  agent: JSON.parse(JSON.stringify(agent)), // makes it serializable
}
  } catch (error) {
    console.error("Authentication error:", error)
    throw new Error("Authentication failed. Please check your credentials.")
  }
}

// ------------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------------
export const signOutAgent = async () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("agent_email")
    sessionStorage.removeItem("agent_role")
  }
}

// ------------------------------------------------------------------
// CURRENT AGENT
// ------------------------------------------------------------------
export const getCurrentAgent = async () => {
  try {
    if (typeof window === "undefined") return null
    const email = sessionStorage.getItem("agent_email")
    if (!email) return null

    const res = await fetch("/api/auth/current", {
      headers: { "x-agent-email": email },
      cache: "no-store",
    })

    if (!res.ok) return null
    const agent = await res.json()
    return agent
  } catch (error) {
    console.error("Error getting current agent:", error)
    return null
  }
}



// ------------------------------------------------------------------
// ROLE CHECKS
// ------------------------------------------------------------------
export const isSuperAdmin = (agent: any) => agent?.role === "super_admin"
export const isAgent = (agent: any) => agent?.role === "agent"
