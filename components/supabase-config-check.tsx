"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Database, Key, Globe } from "lucide-react"
import Image from "next/image"

export function SupabaseConfigCheck() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="Inoora" width={40} height={40} className="object-contain" />
          </div>
          <CardTitle className="text-2xl text-white">Supabase Configuration Required</CardTitle>
          <p className="text-purple-200 mt-2">
            The application needs to be configured with your Supabase credentials to work properly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Missing Supabase environment variables. Please configure the following:</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <Globe className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="font-medium text-white">NEXT_PUBLIC_SUPABASE_URL</div>
                <div className="text-sm text-purple-200">Your Supabase project URL</div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs ${supabaseUrl ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
              >
                {supabaseUrl ? "✓ Set" : "✗ Missing"}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <Key className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="font-medium text-white">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                <div className="text-sm text-purple-200">Your Supabase anonymous key</div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs ${supabaseAnonKey ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
              >
                {supabaseAnonKey ? "✓ Set" : "✗ Missing"}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <Database className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="font-medium text-white">SUPABASE_SERVICE_ROLE_KEY</div>
                <div className="text-sm text-purple-200">Your Supabase service role key (server-side)</div>
              </div>
              <div className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300">Server Only</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-3">How to configure:</h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p>1. Go to your Supabase project dashboard</p>
              <p>2. Navigate to Settings → API</p>
              <p>3. Copy the Project URL and anon/public key</p>
              <p>4. Add these as environment variables in your deployment</p>
            </div>
          </div>

          <div className="text-center text-sm text-purple-300">
            <p>Once configured, refresh this page to continue.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
