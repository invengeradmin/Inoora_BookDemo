// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BarChart3, Calendar, Users, Mail, LogOut, Download, RefreshCw, Ban } from "lucide-react"
// import { getCurrentAgent, signOutAgent, isSuperAdmin } from "@/lib/auth"
// import { getDemoSessions, getAgents } from "@/lib/database"
// import { generateSessionsPDF } from "@/lib/pdf"
// import { SessionsTable } from "@/components/admin/sessions-table"
// import { EmailConfig } from "@/components/admin/email-config"
// import { AgentsManagement } from "@/components/admin/agents-management"
// import { SlotBlocking } from "@/components/admin/slot-blocking"
// import { DashboardStats } from "@/components/admin/dashboard-stats"
// import type { DemoSession, Agent } from "@/types/database"
// import Image from "next/image"

// export default function AdminDashboard() {
//   const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
//   const [sessions, setSessions] = useState<DemoSession[]>([])
//   const [agents, setAgents] = useState<Agent[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     checkAuth()
//     loadData()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const agent = await getCurrentAgent()
//       if (!agent) {
//         router.push("/demoadmin/login")
//         return
//       }
//       setCurrentAgent(agent)
//     } catch (error) {
//       console.error("Auth check failed:", error)
//       router.push("/demoadmin/login")
//     }
//   }

//   const loadData = async () => {
//     try {
//       setIsLoading(true)
//       const [sessionsData, agentsData] = await Promise.all([getDemoSessions(), getAgents()])
//       setSessions(sessionsData || [])
//       setAgents(agentsData || [])
//     } catch (error) {
//       console.error("Failed to load data:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRefresh = async () => {
//     setIsRefreshing(true)
//     await loadData()
//     setIsRefreshing(false)
//   }

//   const handleSignOut = async () => {
//     try {
//       await signOutAgent()
//       router.push("/demoadmin/login")
//     } catch (error) {
//       console.error("Sign out failed:", error)
//     }
//   }

//   const handleDownloadPDF = async () => {
//     try {
//       await generateSessionsPDF(sessions)
//     } catch (error) {
//       console.error("PDF generation failed:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
//           <p className="text-white">Loading admin dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   const isSuper = isSuperAdmin(currentAgent)

//   // Filter sessions for regular agents - only show their assigned sessions
//   const filteredSessions = isSuper ? sessions : sessions.filter((session) => session.agent_id === currentAgent?.id)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header */}
//       <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Image src="/logo.png" alt="Inoora" width={40} height={40} className="object-contain" />
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Inoora Demo Admin</h1>
//                 <p className="text-purple-200">
//                   Welcome back, {currentAgent?.name}
//                   {isSuper && (
//                     <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
//                       Super Admin
//                     </span>
//                   )}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleRefresh}
//                 disabled={isRefreshing}
//                 className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//               >
//                 <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
//                 Refresh
//               </Button>
//               {isSuper && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleDownloadPDF}
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   Export PDF
//                 </Button>
//               )}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleSignOut}
//                 className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Sign Out
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <Tabs defaultValue="dashboard" className="space-y-6">
//           <TabsList className="bg-white/10 border-white/20">
//             <TabsTrigger value="dashboard" className="data-[state=active]:bg-white/20">
//               <BarChart3 className="w-4 h-4 mr-2" />
//               Dashboard
//             </TabsTrigger>
//             <TabsTrigger value="sessions" className="data-[state=active]:bg-white/20">
//               <Calendar className="w-4 h-4 mr-2" />
//               {isSuper ? "All Sessions" : "My Sessions"}
//             </TabsTrigger>
//             {isSuper && (
//               <TabsTrigger value="agents" className="data-[state=active]:bg-white/20">
//                 <Users className="w-4 h-4 mr-2" />
//                 Agents
//               </TabsTrigger>
//             )}
//             {isSuper && (
//               <TabsTrigger value="blocking" className="data-[state=active]:bg-white/20">
//                 <Ban className="w-4 h-4 mr-2" />
//                 Block Slots
//               </TabsTrigger>
//             )}
//             {isSuper && (
//               <TabsTrigger value="email" className="data-[state=active]:bg-white/20">
//                 <Mail className="w-4 h-4 mr-2" />
//                 Email Config
//               </TabsTrigger>
//             )}
//           </TabsList>

//           <TabsContent value="dashboard">
//             <DashboardStats sessions={filteredSessions} agents={agents} />
//           </TabsContent>

//           <TabsContent value="sessions">
//             <SessionsTable
//               sessions={filteredSessions}
//               agents={agents}
//               onSessionUpdate={loadData}
//               onRefresh={handleRefresh}
//               currentAgent={currentAgent}
//               isSuper={isSuper}
//             />
//           </TabsContent>

//           {isSuper && (
//             <TabsContent value="agents">
//               <AgentsManagement agents={agents} onAgentsUpdate={loadData} />
//             </TabsContent>
//           )}

//           {isSuper && (
//             <TabsContent value="blocking">
//               <SlotBlocking onRefresh={handleRefresh} />
//             </TabsContent>
//           )}

//           {isSuper && (
//             <TabsContent value="email">
//               <EmailConfig />
//             </TabsContent>
//           )}
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// app/demoadmin/page.tsx
import { getDemoSessions, getAgents } from "@/lib/database"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function DemoAdminPage() {
  const [sessions, agents] = await Promise.all([
    getDemoSessions(),
    getAgents(),
  ])

  return <AdminDashboard initialSessions={sessions} initialAgents={agents} />
}
