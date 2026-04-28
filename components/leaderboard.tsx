"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Star } from "lucide-react"

export function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaders()

    // Realtime subscription
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchLeaders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchLeaders() {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, xp, grade")
      .order("xp", { ascending: false })
      .limit(5)
    
    if (data) setLeaders(data)
    setLoading(false)
  }

  if (loading) return <div className="h-40 flex items-center justify-center">Жүктелуде...</div>

  return (
    <Card className="border shadow-xl rounded-[32px] overflow-hidden bg-card/50 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Көшбасшылар
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaders.map((leader, idx) => (
          <div 
            key={leader.id} 
            className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
              idx === 0 ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center font-black">
                {idx === 0 ? (
                  <Medal className="h-5 w-5 text-amber-500" />
                ) : idx === 1 ? (
                  <Medal className="h-5 w-5 text-slate-400" />
                ) : idx === 2 ? (
                  <Medal className="h-5 w-5 text-amber-700" />
                ) : (
                  <span className="text-muted-foreground">{idx + 1}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold truncate max-w-[120px]">{leader.full_name}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{leader.grade}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-primary fill-current" />
              <span className="text-sm font-black text-primary">{leader.xp}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
