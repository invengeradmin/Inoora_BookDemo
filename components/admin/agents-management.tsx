// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Users, Mail, MapPin, Plus, Trash2, Edit, CheckCircle, AlertCircle, Key, Eye, EyeOff } from "lucide-react"
// import { createAgent, updateAgent, deleteAgent, updateAgentPassword } from "@/lib/database"
// import type { Agent } from "@/types/database"

// interface AgentsManagementProps {
//   agents: Agent[]
//   onAgentsUpdate: () => void
// }

// export function AgentsManagement({ agents, onAgentsUpdate }: AgentsManagementProps) {
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
//   const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
//   const [passwordAgent, setPasswordAgent] = useState<Agent | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
//   const [showPassword, setShowPassword] = useState(false)

//   const [newAgent, setNewAgent] = useState({
//     email: "",
//     name: "",
//     title: "",
//     timezone: "America/New_York",
//     role: "agent" as "agent" | "super_admin",
//     password: "",
//   })

//   const [passwordData, setPasswordData] = useState({
//     password: "",
//     confirmPassword: "",
//   })

//   // Updated timezones - only US, India, and Dubai
//   const timezones = ["America/New_York", "Asia/Kolkata", "Asia/Dubai"]

//   // Check if agent is a hardcoded agent
//   const isHardcodedAgent = (email: string) => {
//     const hardcodedEmails = ["info@inoora.ai", "benjamin.macklin@invenger.com", "shannon.pereira@invenger.com"]
//     return hardcodedEmails.includes(email)
//   }

//   const handleAddAgent = async () => {
//     try {
//       setIsLoading(true)
//       setMessage(null)

//       if (!newAgent.email || !newAgent.name || !newAgent.title || !newAgent.password) {
//         setMessage({ type: "error", text: "Please fill in all required fields" })
//         return
//       }

//       // Create the agent with plain text password - the API will handle hashing
//       await createAgent({
//         ...newAgent,
//         is_active: true,
//       })

//       setMessage({ type: "success", text: "Agent added successfully!" })
//       setNewAgent({ email: "", name: "", title: "", timezone: "America/New_York", role: "agent", password: "" })
//       setIsAddDialogOpen(false)
//       onAgentsUpdate()
//     } catch (error) {
//       console.error("Failed to add agent:", error)
//       setMessage({ type: "error", text: "Failed to add agent. Email might already exist." })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleEditAgent = async () => {
//     if (!editingAgent) return

//     try {
//       setIsLoading(true)
//       setMessage(null)

//       await updateAgent(editingAgent.id, {
//         name: editingAgent.name,
//         title: editingAgent.title,
//         timezone: editingAgent.timezone,
//         role: editingAgent.role,
//       })

//       setMessage({ type: "success", text: "Agent updated successfully!" })
//       setIsEditDialogOpen(false)
//       setEditingAgent(null)
//       onAgentsUpdate()
//     } catch (error) {
//       console.error("Failed to update agent:", error)
//       setMessage({ type: "error", text: "Failed to update agent" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleUpdatePassword = async () => {
//     if (!passwordAgent) return

//     try {
//       setIsLoading(true)
//       setMessage(null)

//       if (!passwordData.password) {
//         setMessage({ type: "error", text: "Password cannot be empty" })
//         return
//       }

//       if (passwordData.password !== passwordData.confirmPassword) {
//         setMessage({ type: "error", text: "Passwords do not match" })
//         return
//       }

//       await updateAgentPassword(passwordAgent.id, passwordData.password)

//       setMessage({ type: "success", text: "Password updated successfully!" })
//       setIsPasswordDialogOpen(false)
//       setPasswordAgent(null)
//       setPasswordData({ password: "", confirmPassword: "" })
//     } catch (error) {
//       console.error("Failed to update password:", error)
//       setMessage({ type: "error", text: "Failed to update password" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteAgent = async (agentId: string, agentName: string) => {
//     if (!confirm(`Are you sure you want to delete ${agentName}? This action cannot be undone.`)) {
//       return
//     }

//     try {
//       setIsLoading(true)
//       setMessage(null)

//       await deleteAgent(agentId)
//       setMessage({ type: "success", text: "Agent deleted successfully!" })
//       onAgentsUpdate()
//     } catch (error) {
//       console.error("Failed to delete agent:", error)
//       setMessage({ type: "error", text: "Failed to delete agent" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getTimezoneLabel = (timezone: string) => {
//     switch (timezone) {
//       case "America/New_York":
//         return "United States (EST/EDT)"
//       case "Asia/Kolkata":
//         return "India (IST)"
//       case "Asia/Dubai":
//         return "Dubai (GST)"
//       default:
//         return timezone
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {message && (
//         <Alert
//           className={
//             message.type === "success"
//               ? "bg-green-500/10 border-green-500/20 text-green-200"
//               : "bg-red-500/10 border-red-500/20 text-red-200"
//           }
//         >
//           {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
//           <AlertDescription>{message.text}</AlertDescription>
//         </Alert>
//       )}

//       <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2 text-white text-xl">
//               <Users className="w-6 h-6" />
//               Active Agents ({agents.length})
//             </CardTitle>
//             <p className="text-white/80">Manage your demo agents and their availability</p>
//           </div>

//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Agent
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Add New Agent</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={newAgent.email}
//                     onChange={(e) => setNewAgent((prev) => ({ ...prev, email: e.target.value }))}
//                     placeholder="agent@company.com"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name *</Label>
//                   <Input
//                     id="name"
//                     value={newAgent.name}
//                     onChange={(e) => setNewAgent((prev) => ({ ...prev, name: e.target.value }))}
//                     placeholder="John Doe"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="title">Job Title *</Label>
//                   <Input
//                     id="title"
//                     value={newAgent.title}
//                     onChange={(e) => setNewAgent((prev) => ({ ...prev, title: e.target.value }))}
//                     placeholder="Sales Executive"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password *</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={newAgent.password}
//                       onChange={(e) => setNewAgent((prev) => ({ ...prev, password: e.target.value }))}
//                       placeholder="Set a password"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="timezone">Timezone</Label>
//                   <Select
//                     value={newAgent.timezone}
//                     onValueChange={(value) => setNewAgent((prev) => ({ ...prev, timezone: value }))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {timezones.map((tz) => (
//                         <SelectItem key={tz} value={tz}>
//                           {getTimezoneLabel(tz)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="role">Role</Label>
//                   <Select
//                     value={newAgent.role}
//                     onValueChange={(value: "agent" | "super_admin") =>
//                       setNewAgent((prev) => ({ ...prev, role: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="agent">Agent</SelectItem>
//                       <SelectItem value="super_admin">Super Admin</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Button onClick={handleAddAgent} disabled={isLoading} className="w-full">
//                   {isLoading ? "Adding..." : "Add Agent"}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4">
//             {agents.map((agent) => (
//               <Card key={agent.id} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
//                         <AvatarImage src={agent.avatar_url || "/placeholder.svg"} alt={agent.name} />
//                         <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg">
//                           {agent.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="space-y-1">
//                         <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
//                         <p className="text-purple-600 font-medium">{agent.title}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           <div className="flex items-center gap-1">
//                             <Mail className="w-4 h-4" />
//                             {agent.email}
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <MapPin className="w-4 h-4" />
//                             {getTimezoneLabel(agent.timezone)}
//                           </div>
//                         </div>
//                         {isHardcodedAgent(agent.email) && (
//                           <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">System Agent</Badge>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Badge
//                         className={
//                           agent.role === "super_admin"
//                             ? "bg-yellow-100 text-yellow-800 border-yellow-200"
//                             : "bg-green-100 text-green-800 border-green-200"
//                         }
//                       >
//                         {agent.role === "super_admin" ? "Super Admin" : "Agent"}
//                       </Badge>
//                       <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>

//                       {/* Only show password button for non-hardcoded agents */}
//                       {!isHardcodedAgent(agent.email) && (
//                         <Dialog
//                           open={isPasswordDialogOpen && passwordAgent?.id === agent.id}
//                           onOpenChange={(open) => {
//                             setIsPasswordDialogOpen(open)
//                             if (!open) setPasswordAgent(null)
//                           }}
//                         >
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => setPasswordAgent(agent)}
//                               className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
//                             >
//                               <Key className="w-4 h-4" />
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-md">
//                             <DialogHeader>
//                               <DialogTitle>Set Password for {agent.name}</DialogTitle>
//                             </DialogHeader>
//                             <div className="space-y-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="new-password">New Password</Label>
//                                 <div className="relative">
//                                   <Input
//                                     id="new-password"
//                                     type={showPassword ? "text" : "password"}
//                                     value={passwordData.password}
//                                     onChange={(e) => setPasswordData((prev) => ({ ...prev, password: e.target.value }))}
//                                     placeholder="Enter new password"
//                                   />
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="sm"
//                                     className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                   >
//                                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                   </Button>
//                                 </div>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor="confirm-password">Confirm Password</Label>
//                                 <Input
//                                   id="confirm-password"
//                                   type="password"
//                                   value={passwordData.confirmPassword}
//                                   onChange={(e) =>
//                                     setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
//                                   }
//                                   placeholder="Confirm new password"
//                                 />
//                               </div>

//                               <Button onClick={handleUpdatePassword} disabled={isLoading} className="w-full">
//                                 {isLoading ? "Updating..." : "Update Password"}
//                               </Button>
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       )}

//                       <Dialog
//                         open={isEditDialogOpen && editingAgent?.id === agent.id}
//                         onOpenChange={(open) => {
//                           setIsEditDialogOpen(open)
//                           if (!open) setEditingAgent(null)
//                         }}
//                       >
//                         <DialogTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setEditingAgent(agent)}
//                             className="border-blue-200 text-blue-700 hover:bg-blue-50"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="max-w-md">
//                           <DialogHeader>
//                             <DialogTitle>Edit Agent</DialogTitle>
//                           </DialogHeader>
//                           {editingAgent && (
//                             <div className="space-y-4">
//                               <div className="space-y-2">
//                                 <Label>Email Address</Label>
//                                 <Input value={editingAgent.email} disabled className="bg-gray-100" />
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-name">Full Name *</Label>
//                                 <Input
//                                   id="edit-name"
//                                   value={editingAgent.name}
//                                   onChange={(e) =>
//                                     setEditingAgent((prev) => (prev ? { ...prev, name: e.target.value } : null))
//                                   }
//                                 />
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-title">Job Title *</Label>
//                                 <Input
//                                   id="edit-title"
//                                   value={editingAgent.title}
//                                   onChange={(e) =>
//                                     setEditingAgent((prev) => (prev ? { ...prev, title: e.target.value } : null))
//                                   }
//                                 />
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-timezone">Timezone</Label>
//                                 <Select
//                                   value={editingAgent.timezone}
//                                   onValueChange={(value) =>
//                                     setEditingAgent((prev) => (prev ? { ...prev, timezone: value } : null))
//                                   }
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {timezones.map((tz) => (
//                                       <SelectItem key={tz} value={tz}>
//                                         {getTimezoneLabel(tz)}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-role">Role</Label>
//                                 <Select
//                                   value={editingAgent.role}
//                                   onValueChange={(value: "agent" | "super_admin") =>
//                                     setEditingAgent((prev) => (prev ? { ...prev, role: value } : null))
//                                   }
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="agent">Agent</SelectItem>
//                                     <SelectItem value="super_admin">Super Admin</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>

//                               <Button onClick={handleEditAgent} disabled={isLoading} className="w-full">
//                                 {isLoading ? "Updating..." : "Update Agent"}
//                               </Button>
//                             </div>
//                           )}
//                         </DialogContent>
//                       </Dialog>

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleDeleteAgent(agent.id, agent.name)}
//                         disabled={isLoading || isHardcodedAgent(agent.email)}
//                         className="border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {agents.length === 0 && (
//             <div className="text-center py-12">
//               <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
//               <p className="text-white/60 text-lg">No agents found</p>
//               <p className="text-white/40 text-sm">Add agents to get started</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Users, Mail, MapPin, Plus, Trash2, Edit, CheckCircle, AlertCircle, Key, Eye, EyeOff } from "lucide-react"

interface Agent {
  id: string
  email: string
  name: string
  title: string
  timezone: string
  role: "agent" | "super_admin"
  avatar_url?: string
}

interface AgentsManagementProps {
  agents: Agent[]
  onAgentsUpdate: () => void
}

export function AgentsManagement({ agents, onAgentsUpdate }: AgentsManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [passwordAgent, setPasswordAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [newAgent, setNewAgent] = useState({
    email: "",
    name: "",
    title: "",
    timezone: "America/New_York",
    role: "agent" as "agent" | "super_admin",
    password: "",
  })

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  })

  const timezones = ["America/New_York", "Asia/Kolkata", "Asia/Dubai"]

  // Helper
  const getTimezoneLabel = (tz: string) => ({
    "America/New_York": "United States (EST/EDT)",
    "Asia/Kolkata": "India (IST)",
    "Asia/Dubai": "Dubai (GST)",
  }[tz] || tz)

  // --- CRUD Handlers ---
  const handleAddAgent = async () => {
    if (!newAgent.email || !newAgent.name || !newAgent.title || !newAgent.password) {
      setMessage({ type: "error", text: "All fields are required" })
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgent),
      })

      if (!res.ok) throw new Error("Failed to add agent")
      setMessage({ type: "success", text: "Agent added successfully!" })
      setIsAddDialogOpen(false)
      setNewAgent({ email: "", name: "", title: "", timezone: "America/New_York", role: "agent", password: "" })
      onAgentsUpdate()
    } catch {
      setMessage({ type: "error", text: "Failed to add agent. Email might already exist." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAgent = async () => {
    if (!editingAgent) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/agents/${editingAgent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAgent),
      })

      if (!res.ok) throw new Error("Failed to update agent")
      setMessage({ type: "success", text: "Agent updated successfully!" })
      setIsEditDialogOpen(false)
      setEditingAgent(null)
      onAgentsUpdate()
    } catch {
      setMessage({ type: "error", text: "Failed to update agent" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAgent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setMessage({ type: "success", text: "Agent deleted successfully!" })
      onAgentsUpdate()
    } catch {
      setMessage({ type: "error", text: "Failed to delete agent" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!passwordAgent) return
    if (!passwordData.password) {
      setMessage({ type: "error", text: "Password cannot be empty" })
      return
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`/api/agents/${passwordAgent.id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordData.password }),
      })
      if (!res.ok) throw new Error("Failed")
      setMessage({ type: "success", text: "Password updated successfully!" })
      setIsPasswordDialogOpen(false)
      setPasswordAgent(null)
      setPasswordData({ password: "", confirmPassword: "" })
    } catch {
      setMessage({ type: "error", text: "Failed to update password" })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Render ---
  return (
    <div className="space-y-6">
      {message && (
        <Alert className={
          message.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-200"
            : "bg-red-500/10 border-red-500/20 text-red-200"
        }>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white text-xl">
              <Users className="w-6 h-6" /> Active Agents ({agents.length})
            </CardTitle>
            <p className="text-white/80">Manage your agents and their roles</p>
          </div>

          {/* Add Agent */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="w-4 h-4 mr-2" /> Add Agent
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {["email", "name", "title"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{field === "email" ? "Email Address *" : field === "name" ? "Full Name *" : "Job Title *"}</Label>
                    <Input
                      id={field}
                      type={field === "email" ? "email" : "text"}
                      value={(newAgent as any)[field]}
                      onChange={(e) => setNewAgent((p) => ({ ...p, [field]: e.target.value }))}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newAgent.password}
                      onChange={(e) => setNewAgent((p) => ({ ...p, password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={newAgent.timezone}
                    onValueChange={(v) => setNewAgent((p) => ({ ...p, timezone: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>{getTimezoneLabel(tz)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={newAgent.role}
                    onValueChange={(v: "agent" | "super_admin") => setNewAgent((p) => ({ ...p, role: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddAgent} disabled={isLoading} className="w-full">
                  {isLoading ? "Adding..." : "Add Agent"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-12 text-white/60">No agents found</div>
          ) : (
            <div className="grid gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="border-0 shadow-md bg-white">
                  <CardContent className="p-6 flex justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={agent.avatar_url || ""} />
                        <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.title}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <Mail className="w-4 h-4" /> {agent.email}
                          <MapPin className="w-4 h-4" /> {getTimezoneLabel(agent.timezone)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={agent.role === "super_admin" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                        {agent.role === "super_admin" ? "Super Admin" : "Agent"}
                      </Badge>

                      {/* Edit */}
                      <Dialog open={isEditDialogOpen && editingAgent?.id === agent.id} onOpenChange={(o) => { setIsEditDialogOpen(o); if (!o) setEditingAgent(null) }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setEditingAgent(agent)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader><DialogTitle>Edit Agent</DialogTitle></DialogHeader>
                          {editingAgent && (
                            <div className="space-y-3">
                              <Label>Email</Label>
                              <Input value={editingAgent.email} disabled />
                              <Label>Name</Label>
                              <Input value={editingAgent.name} onChange={(e) => setEditingAgent((p) => p ? { ...p, name: e.target.value } : null)} />
                              <Label>Title</Label>
                              <Input value={editingAgent.title} onChange={(e) => setEditingAgent((p) => p ? { ...p, title: e.target.value } : null)} />
                              <Button onClick={handleEditAgent} disabled={isLoading} className="w-full">
                                {isLoading ? "Updating..." : "Update"}
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Password */}
                      <Dialog open={isPasswordDialogOpen && passwordAgent?.id === agent.id} onOpenChange={(o) => { setIsPasswordDialogOpen(o); if (!o) setPasswordAgent(null) }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setPasswordAgent(agent)}>
                            <Key className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader><DialogTitle>Update Password</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <Input type="password" placeholder="New Password" value={passwordData.password} onChange={(e) => setPasswordData((p) => ({ ...p, password: e.target.value }))} />
                            <Input type="password" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))} />
                            <Button onClick={handleUpdatePassword} disabled={isLoading} className="w-full">
                              {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" variant="outline" onClick={() => handleDeleteAgent(agent.id, agent.name)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
