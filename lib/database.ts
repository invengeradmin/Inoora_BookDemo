// // import { createServerClient } from "./supabase"
// // import type { DemoSession, Agent, EmailConfig } from "@/types/database"

// // const supabase = createServerClient()

// // // Helper function to extract readable error messages
// // function getReason(error: any): string {
// //   if (!error) return "Unknown error"

// //   // Handle Supabase/Postgres errors
// //   if (error.message) return error.message
// //   if (error.details) return error.details
// //   if (error.hint) return error.hint

// //   // Handle generic errors
// //   if (typeof error === "string") return error
// //   if (error.toString && typeof error.toString === "function") {
// //     return error.toString()
// //   }

// //   return "An unexpected error occurred"
// // }

// // // Demo Sessions
// // export const getDemoSessions = async (): Promise<DemoSession[]> => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("demo_sessions")
// //       .select(`
// //         *,
// //         agents (
// //           id,
// //           name,
// //           email,
// //           title,
// //           avatar_url,
// //           timezone
// //         )
// //       `)
// //       .order("created_at", { ascending: false })

// //     if (error) {
// //       console.error("Error fetching demo sessions:", getReason(error))
// //       return []
// //     }

// //     return data || []
// //   } catch (error) {
// //     console.error("Failed to get demo sessions:", getReason(error))
// //     return []
// //   }
// // }

// // export const saveDemoSession = async (sessionData: Omit<DemoSession, "created_at" | "updated_at">) => {
// //   try {
// //     const { data, error } = await supabase.from("demo_sessions").insert([sessionData]).select().single()

// //     if (error) {
// //       console.error("Error saving demo session:", getReason(error))
// //       throw new Error(`Failed to save session: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to save demo session:", getReason(error))
// //     throw error
// //   }
// // }

// // export const updateDemoSession = async (sessionId: string, updates: Partial<DemoSession>) => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("demo_sessions")
// //       .update({ ...updates, updated_at: new Date().toISOString() })
// //       .eq("id", sessionId)
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error("Error updating demo session:", getReason(error))
// //       throw new Error(`Failed to update session: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to update demo session:", getReason(error))
// //     throw error
// //   }
// // }

// // export const deleteDemoSession = async (sessionId: string) => {
// //   try {
// //     const { error } = await supabase.from("demo_sessions").delete().eq("id", sessionId)

// //     if (error) {
// //       console.error("Error deleting demo session:", getReason(error))
// //       throw new Error(`Failed to delete session: ${getReason(error)}`)
// //     }
// //   } catch (error) {
// //     console.error("Failed to delete demo session:", getReason(error))
// //     throw error
// //   }
// // }

// // export const assignAgentToSession = async (sessionId: string, agentId: string) => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("demo_sessions")
// //       .update({
// //         agent_id: agentId,
// //         assigned_at: new Date().toISOString(),
// //         status: "confirmed",
// //         updated_at: new Date().toISOString(),
// //       })
// //       .eq("id", sessionId)
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error("Error assigning agent:", getReason(error))
// //       throw new Error(`Failed to assign agent: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to assign agent:", getReason(error))
// //     throw error
// //   }
// // }

// // // Agents
// // export const getAgents = async (): Promise<Agent[]> => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("agents")
// //       .select("*")
// //       .eq("is_active", true)
// //       .order("name", { ascending: true })

// //     if (error) {
// //       console.error("Error fetching agents:", getReason(error))
// //       return []
// //     }

// //     return data || []
// //   } catch (error) {
// //     console.error("Failed to get agents:", getReason(error))
// //     return []
// //   }
// // }

// // export const createAgent = async (
// //   agentData: Omit<Agent, "id" | "created_at" | "updated_at"> & { password: string },
// // ) => {
// //   try {
// //     const { password, ...agentInfo } = agentData

// //     const { data, error } = await supabase
// //       .from("agents")
// //       .insert([
// //         {
// //           ...agentInfo,
// //           password_hash: password, // Store password directly for demo purposes
// //         },
// //       ])
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error("Error creating agent:", getReason(error))
// //       throw new Error(`Failed to create agent: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to create agent:", getReason(error))
// //     throw error
// //   }
// // }

// // export const updateAgent = async (agentId: string, updates: Partial<Agent>) => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("agents")
// //       .update({ ...updates, updated_at: new Date().toISOString() })
// //       .eq("id", agentId)
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error("Error updating agent:", getReason(error))
// //       throw new Error(`Failed to update agent: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to update agent:", getReason(error))
// //     throw error
// //   }
// // }

// // export const updateAgentPassword = async (agentId: string, password: string) => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("agents")
// //       .update({
// //         password_hash: password, // Store password directly for demo purposes
// //         updated_at: new Date().toISOString(),
// //       })
// //       .eq("id", agentId)
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error("Error updating agent password:", getReason(error))
// //       throw new Error(`Failed to update password: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to update agent password:", getReason(error))
// //     throw error
// //   }
// // }

// // export const deleteAgent = async (agentId: string) => {
// //   try {
// //     const { error } = await supabase.from("agents").delete().eq("id", agentId)

// //     if (error) {
// //       console.error("Error deleting agent:", getReason(error))
// //       throw new Error(`Failed to delete agent: ${getReason(error)}`)
// //     }
// //   } catch (error) {
// //     console.error("Failed to delete agent:", getReason(error))
// //     throw error
// //   }
// // }

// // // Blocked Slots
// // export const getBlockedSlots = async () => {
// //   try {
// //     const { data, error } = await supabase
// //       .from("blocked_slots")
// //       .select("*")
// //       .order("date", { ascending: true })
// //       .order("time", { ascending: true })

// //     if (error) {
// //       // If table doesn't exist, return empty array to keep UI working
// //       if (error.code === "42P01" || error.message?.includes("does not exist")) {
// //         console.warn("blocked_slots table does not exist, returning empty array")
// //         return []
// //       }
// //       console.error("Error getting blocked slots:", getReason(error))
// //       return []
// //     }

// //     return data || []
// //   } catch (error) {
// //     console.error("Failed to get blocked slots:", getReason(error))
// //     return []
// //   }
// // }

// // export const blockSlot = async (slotData: { date: string; time: string; reason?: string }) => {
// //   try {
// //     // Get current user (for demo purposes, we'll use the first super admin)
// //     const { data: agents } = await supabase.from("agents").select("id").eq("role", "super_admin").limit(1)

// //     const blockedBy = agents?.[0]?.id

// //     const { data, error } = await supabase
// //       .from("blocked_slots")
// //       .insert([
// //         {
// //           ...slotData,
// //           blocked_by: blockedBy,
// //         },
// //       ])
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error("Error blocking slot:", getReason(error))
// //       throw new Error(`Failed to block slot: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to block slot:", getReason(error))
// //     throw error
// //   }
// // }

// // export const unblockSlot = async (slotId: string) => {
// //   try {
// //     const { error } = await supabase.from("blocked_slots").delete().eq("id", slotId)

// //     if (error) {
// //       console.error("Error unblocking slot:", getReason(error))
// //       throw new Error(`Failed to unblock slot: ${getReason(error)}`)
// //     }
// //   } catch (error) {
// //     console.error("Failed to unblock slot:", getReason(error))
// //     throw error
// //   }
// // }

// // // Email Configuration
// // export const getEmailConfig = async (): Promise<EmailConfig | null> => {
// //   try {
// //     const { data, error } = await supabase.from("email_config").select("*").eq("is_active", true).single()

// //     if (error) {
// //       if (error.code === "PGRST116") {
// //         // No rows returned
// //         return null
// //       }
// //       console.error("Error getting email config:", getReason(error))
// //       return null
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to get email config:", getReason(error))
// //     return null
// //   }
// // }

// // export const saveEmailConfig = async (configData: Omit<EmailConfig, "id" | "created_at" | "updated_at">) => {
// //   try {
// //     // First, deactivate all existing configs
// //     await supabase.from("email_config").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000") // Update all rows

// //     // Then insert the new config
// //     const { data, error } = await supabase.from("email_config").insert([configData]).select().single()

// //     if (error) {
// //       console.error("Error saving email config:", getReason(error))
// //       throw new Error(`Failed to save email config: ${getReason(error)}`)
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to save email config:", getReason(error))
// //     throw error
// //   }
// // }

// // // Email Logs
// // export const logEmail = async (emailData: {
// //   session_id: string
// //   from_email: string
// //   to_email: string
// //   subject: string
// //   content: string
// //   sent_by: string
// // }) => {
// //   try {
// //     const { data, error } = await supabase.from("email_logs").insert([emailData]).select().single()

// //     if (error) {
// //       console.error("Error logging email:", getReason(error))
// //       // Don't throw error for logging failures
// //       return null
// //     }

// //     return data
// //   } catch (error) {
// //     console.error("Failed to log email:", getReason(error))
// //     return null
// //   }
// // }

// // lib/database.ts
// import { query } from "@/lib/postgres"
// import type { DemoSession, Agent, EmailConfig } from "@/types/database"

// // 🧩 Helper: readable error
// function getReason(error: any): string {
//   if (!error) return "Unknown error"
//   if (error.message) return error.message
//   if (error.detail) return error.detail
//   if (error.hint) return error.hint
//   return typeof error === "string" ? error : JSON.stringify(error)
// }

// // ---------------------- DEMO SESSIONS ----------------------
// export const getDemoSessions = async (): Promise<DemoSession[]> => {
//   try {
//     const result = await query(`
//       SELECT ds.*, 
//              json_build_object(
//                'id', a.id,
//                'name', a.name,
//                'email', a.email,
//                'title', a.title,
//                'avatar_url', a.avatar_url,
//                'timezone', a.timezone
//              ) AS agent
//       FROM demo_sessions ds
//       LEFT JOIN agents a ON ds.agent_id = a.id
//       ORDER BY ds.created_at DESC
//     `)
//     return JSON.parse(JSON.stringify(result.rows)) // ✅ serialize here
//   } catch (error) {
//     console.error("Error fetching demo sessions:", getReason(error))
//     return []
//   }
// }

// export const saveDemoSession = async (
//   sessionData: Omit<DemoSession, "created_at" | "updated_at">
// ) => {
//   try {
//     const columns = Object.keys(sessionData)
//     const values = Object.values(sessionData)
//     const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")

//     const result = await query(
//       `INSERT INTO demo_sessions (${columns.join(", ")})
//        VALUES (${placeholders})
//        RETURNING *`,
//       values
//     )

//     return result.rows[0]
//   } catch (error) {
//     console.error("Error saving demo session:", getReason(error))
//     throw error
//   }
// }

// export const updateDemoSession = async (
//   sessionId: string,
//   updates: Partial<DemoSession>
// ) => {
//   try {
//     const keys = Object.keys(updates)
//     const values = Object.values(updates)
//     const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ")
//     const sql = `UPDATE demo_sessions SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`
//     const result = await query(sql, [...values, sessionId])
//     return result.rows[0]
//   } catch (error) {
//     console.error("Error updating demo session:", getReason(error))
//     throw error
//   }
// }

// export const deleteDemoSession = async (sessionId: string) => {
//   try {
//     await query(`DELETE FROM demo_sessions WHERE id = $1`, [sessionId])
//   } catch (error) {
//     console.error("Error deleting demo session:", getReason(error))
//     throw error
//   }
// }

// export const assignAgentToSession = async (sessionId: string, agentId: string) => {
//   try {
//     const result = await query(
//       `
//       UPDATE demo_sessions 
//       SET agent_id = $1, assigned_at = NOW(), status = 'confirmed', updated_at = NOW()
//       WHERE id = $2
//       RETURNING *
//       `,
//       [agentId, sessionId]
//     )
//     return result.rows[0]
//   } catch (error) {
//     console.error("Error assigning agent:", getReason(error))
//     throw error
//   }
// }

// // ---------------------- AGENTS ----------------------
// export const getAgents = async (): Promise<Agent[]> => {
//   try {
//     const result = await query(`SELECT * FROM agents WHERE is_active = true ORDER BY name ASC`)
//     return JSON.parse(JSON.stringify(result.rows)) // ✅ serialize here
//   } catch (error) {
//     console.error("Error fetching agents:", getReason(error))
//     return []
//   }
// }

// export const createAgent = async (agentData: any) => {
//   try {
//     const { password, ...agentInfo } = agentData
//     const columns = Object.keys(agentInfo).concat("password_hash")
//     const values = Object.values(agentInfo).concat(password)
//     const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")

//     const result = await query(
//       `INSERT INTO agents (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
//       values
//     )
//     return result.rows[0]
//   } catch (error) {
//     console.error("Error creating agent:", getReason(error))
//     throw error
//   }
// }

// export const updateAgent = async (agentId: string, updates: Partial<Agent>) => {
//   try {
//     const keys = Object.keys(updates)
//     const values = Object.values(updates)
//     const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ")
//     const result = await query(
//       `UPDATE agents SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
//       [...values, agentId]
//     )
//     return result.rows[0]
//   } catch (error) {
//     console.error("Error updating agent:", getReason(error))
//     throw error
//   }
// }

// export const updateAgentPassword = async (agentId: string, password: string) => {
//   try {
//     const result = await query(
//       `
//       UPDATE agents 
//       SET password_hash = $1, updated_at = NOW()
//       WHERE id = $2 RETURNING *
//       `,
//       [password, agentId]
//     )
//     return result.rows[0]
//   } catch (error) {
//     console.error("Error updating agent password:", getReason(error))
//     throw error
//   }
// }

// export const deleteAgent = async (agentId: string) => {
//   try {
//     await query(`DELETE FROM agents WHERE id = $1`, [agentId])
//   } catch (error) {
//     console.error("Error deleting agent:", getReason(error))
//     throw error
//   }
// }

// // ---------------------- BLOCKED SLOTS ----------------------
// export const getBlockedSlots = async () => {
//   try {
//     const result = await query(
//       `SELECT * FROM blocked_slots ORDER BY date ASC, time ASC`
//     )
//     return result.rows
//   } catch (error: any) {
//     if (error.code === "42P01") {
//       console.warn("blocked_slots table does not exist")
//       return []
//     }
//     console.error("Error getting blocked slots:", getReason(error))
//     return []
//   }
// }

// export const blockSlot = async (slotData: { date: string; time: string; reason?: string }) => {
//   try {
//     const result = await query(
//       `INSERT INTO blocked_slots (date, time, reason) VALUES ($1, $2, $3) RETURNING *`,
//       [slotData.date, slotData.time, slotData.reason || null]
//     )
//     return result.rows[0]
//   } catch (error) {
//     console.error("Error blocking slot:", getReason(error))
//     throw error
//   }
// }

// export const unblockSlot = async (slotId: string) => {
//   try {
//     await query(`DELETE FROM blocked_slots WHERE id = $1`, [slotId])
//   } catch (error) {
//     console.error("Error unblocking slot:", getReason(error))
//     throw error
//   }
// }

// // ---------------------- EMAIL CONFIG ----------------------
// export const getEmailConfig = async () => {
//   const result = await query(`SELECT * FROM email_config WHERE is_active = true LIMIT 1`)
//   return result.rows[0] || null
// }


// export const saveEmailConfig = async (configData: any) => {
//   await query(`UPDATE email_config SET is_active = false`)

//   // ✅ Remove is_active if it exists already
//   const cleanData = { ...configData }
//   delete cleanData.is_active

//   const keys = Object.keys(cleanData)
//   const values = Object.values(cleanData)
//   const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")

//   const sql = `
//     INSERT INTO email_config (${keys.join(", ")}, is_active)
//     VALUES (${placeholders}, true)
//     RETURNING *
//   `

//   const result = await query(sql, values)
//   return result.rows[0]
// }

// // ---------------------- EMAIL LOGS ----------------------
// export const logEmail = async (emailData: {
//   session_id: string
//   from_email: string
//   to_email: string
//   subject: string
//   content: string
//   sent_by: string
// }) => {
//   try {
//     const keys = Object.keys(emailData)
//     const values = Object.values(emailData)
//     const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
//     await query(
//       `INSERT INTO email_logs (${keys.join(", ")}) VALUES (${placeholders})`,
//       values
//     )
//   } catch (error) {
//     console.error("Error logging email:", getReason(error))
//   }
// }

import { query } from "@/lib/postgres"
import type { DemoSession, Agent, EmailConfig } from "@/types/database"

// 🧩 Helper: readable error
function getReason(error: any): string {
  if (!error) return "Unknown error"
  if (error.message) return error.message
  if (error.detail) return error.detail
  if (error.hint) return error.hint
  return typeof error === "string" ? error : JSON.stringify(error)
}

// 🧩 Helper: serialize rows for Next.js Client Components
function serialize<T>(rows: any): T {
  return JSON.parse(JSON.stringify(rows))
}

// ---------------------- DEMO SESSIONS ----------------------
export const getDemoSessions = async (): Promise<DemoSession[]> => {
  try {
    const result = await query(`
      SELECT ds.*, 
             json_build_object(
               'id', a.id,
               'name', a.name,
               'email', a.email,
               'title', a.title,
               'avatar_url', a.avatar_url,
               'timezone', a.timezone
             ) AS agent
      FROM demo_sessions ds
      LEFT JOIN agents a ON ds.agent_id = a.id
      ORDER BY ds.created_at DESC
    `)
    return serialize<DemoSession[]>(result.rows)
  } catch (error) {
    console.error("Error fetching demo sessions:", getReason(error))
    return []
  }
}

export const saveDemoSession = async (
  sessionData: Omit<DemoSession, "created_at" | "updated_at">
) => {
  try {
    const columns = Object.keys(sessionData)
    const values = Object.values(sessionData)
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")

    const result = await query(
      `INSERT INTO demo_sessions (${columns.join(", ")})
       VALUES (${placeholders})
       RETURNING *`,
      values
    )

    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error saving demo session:", getReason(error))
    throw error
  }
}

export const updateDemoSession = async (
  sessionId: string,
  updates: Partial<DemoSession>
) => {
  try {
    // 🔧 Remove any accidental 'updated_at' from the update object
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => k !== "updated_at")
    )

    const keys = Object.keys(cleanUpdates)
    const values = Object.values(cleanUpdates)

    if (keys.length === 0) {
      throw new Error("No valid fields provided for update")
    }

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ")
    const sql = `
      UPDATE demo_sessions 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *
    `
    const result = await query(sql, [...values, sessionId])
    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error updating demo session:", getReason(error))
    throw error
  }
}

export const deleteDemoSession = async (sessionId: string) => {
  try {
    await query(`DELETE FROM demo_sessions WHERE id = $1`, [sessionId])
  } catch (error) {
    console.error("Error deleting demo session:", getReason(error))
    throw error
  }
}

export const assignAgentToSession = async (sessionId: string, agentId: string) => {
  try {
    const result = await query(
      `
      UPDATE demo_sessions 
      SET agent_id = $1, assigned_at = NOW(), status = 'confirmed', updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [agentId, sessionId]
    )
    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error assigning agent:", getReason(error))
    throw error
  }
}

// ---------------------- AGENTS ----------------------
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const result = await query(`SELECT * FROM agents WHERE is_active = true ORDER BY name ASC`)
    return serialize<Agent[]>(result.rows)
  } catch (error) {
    console.error("Error fetching agents:", getReason(error))
    return []
  }
}

export const createAgent = async (agentData: any) => {
  try {
    const { password, ...agentInfo } = agentData
    const columns = Object.keys(agentInfo).concat("password_hash")
    const values = Object.values(agentInfo).concat(password)
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")

    const result = await query(
      `INSERT INTO agents (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values
    )
    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error creating agent:", getReason(error))
    throw error
  }
}

export const updateAgent = async (agentId: string, updates: Partial<Agent>) => {
  try {
    const keys = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ")
    const result = await query(
      `UPDATE agents SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, agentId]
    )
    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error updating agent:", getReason(error))
    throw error
  }
}

export const updateAgentPassword = async (agentId: string, password: string) => {
  try {
    const result = await query(
      `
      UPDATE agents 
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *
      `,
      [password, agentId]
    )
    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error updating agent password:", getReason(error))
    throw error
  }
}

export const deleteAgent = async (agentId: string) => {
  try {
    await query(`DELETE FROM agents WHERE id = $1`, [agentId])
  } catch (error) {
    console.error("Error deleting agent:", getReason(error))
    throw error
  }
}

// ---------------------- BLOCKED SLOTS ----------------------
export const getBlockedSlots = async () => {
  try {
    const result = await query(
      `SELECT * FROM blocked_slots ORDER BY date ASC, time ASC`
    )
    return serialize(result.rows)
  } catch (error: any) {
    if (error.code === "42P01") {
      console.warn("blocked_slots table does not exist")
      return []
    }
    console.error("Error getting blocked slots:", getReason(error))
    return []
  }
}

export const blockSlot = async (slotData: { date: string; time: string; reason?: string }) => {
  try {
    const result = await query(
      `INSERT INTO blocked_slots (date, time, reason) VALUES ($1, $2, $3) RETURNING *`,
      [slotData.date, slotData.time, slotData.reason || null]
    )
    return serialize(result.rows[0])
  } catch (error) {
    console.error("Error blocking slot:", getReason(error))
    throw error
  }
}

export const unblockSlot = async (slotId: string) => {
  try {
    await query(`DELETE FROM blocked_slots WHERE id = $1`, [slotId])
  } catch (error) {
    console.error("Error unblocking slot:", getReason(error))
    throw error
  }
}

// ---------------------- EMAIL CONFIG ----------------------
export const getEmailConfig = async (): Promise<EmailConfig | null> => {
  try {
    const result = await query(`SELECT * FROM email_config WHERE is_active = true LIMIT 1`)
    return serialize(result.rows[0] || null)
  } catch (error) {
    console.error("Error getting email config:", getReason(error))
    return null
  }
}

export const saveEmailConfig = async (configData: any) => {
  await query(`UPDATE email_config SET is_active = false`)

  const cleanData = { ...configData }
  delete cleanData.is_active

  const keys = Object.keys(cleanData)
  const values = Object.values(cleanData)
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")

  const sql = `
    INSERT INTO email_config (${keys.join(", ")}, is_active)
    VALUES (${placeholders}, true)
    RETURNING *
  `

  const result = await query(sql, values)
  return serialize(result.rows[0])
}

// ---------------------- EMAIL LOGS ----------------------
export const logEmail = async (emailData: {
  session_id: string
  from_email: string
  to_email: string
  subject: string
  content: string
  sent_by: string
}) => {
  try {
    const keys = Object.keys(emailData)
    const values = Object.values(emailData)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")

    await query(
      `INSERT INTO email_logs (${keys.join(", ")}) VALUES (${placeholders})`,
      values
    )
  } catch (error) {
    console.error("Error logging email:", getReason(error))
  }
}
