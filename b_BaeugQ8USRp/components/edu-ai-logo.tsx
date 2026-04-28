"use client"

import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface EduAILogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function EduAILogo({ size = "md", showText = true, className }: EduAILogoProps) {
  const sizes = {
    sm: { icon: 20, container: "w-8 h-8", text: "text-lg" },
    md: { icon: 28, container: "w-12 h-12", text: "text-2xl" },
    lg: { icon: 36, container: "w-16 h-16", text: "text-3xl" },
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn(
        "rounded-xl bg-primary flex items-center justify-center",
        sizes[size].container
      )}>
        <GraduationCap className="text-primary-foreground" size={sizes[size].icon} />
      </div>
      {showText && (
        <span className={cn("font-bold text-primary", sizes[size].text)}>
          EduAI
        </span>
      )}
    </div>
  )
}
