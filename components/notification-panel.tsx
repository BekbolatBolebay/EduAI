"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  Trophy, 
  BookOpen,
  Zap,
  X
} from "lucide-react"

interface Notification {
  id: string
  type: "achievement" | "reminder" | "result" | "course" | "system"
  title: string
  message: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Жаңа жетістік!",
    message: "Сіз \"7 күндік серия\" жетістігін алдыңыз!",
    time: "2 сағат бұрын",
    read: false
  },
  {
    id: "2",
    type: "result",
    title: "Тест нәтижесі",
    message: "Математика тестінен 18/20 ұпай жинадыңыз",
    time: "5 сағат бұрын",
    read: false
  },
  {
    id: "3",
    type: "reminder",
    title: "Сабаққа еске салу",
    message: "\"Тригонометрия негіздері\" сабағы 30 минуттан кейін басталады",
    time: "Кеше",
    read: true
  },
  {
    id: "4",
    type: "course",
    title: "Жаңа курс қосылды",
    message: "Python бағдарламалау курсы қазір қолжетімді",
    time: "2 күн бұрын",
    read: true
  },
  {
    id: "5",
    type: "system",
    title: "Жүйе жаңартуы",
    message: "EduAI платформасы жаңартылды. Жаңа мүмкіндіктерді тексеріңіз!",
    time: "1 апта бұрын",
    read: true
  }
]

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-5 w-5 text-amber-600" />
      case "result":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "course":
        return <BookOpen className="h-5 w-5 text-purple-600" />
      case "system":
        return <Zap className="h-5 w-5 text-primary" />
    }
  }

  const getIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "achievement":
        return "bg-amber-100"
      case "result":
        return "bg-green-100"
      case "reminder":
        return "bg-blue-100"
      case "course":
        return "bg-purple-100"
      case "system":
        return "bg-primary/10"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Хабарландырулар
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            <Button variant="ghost" size="sm">
              Барлығын оқылды деп белгілеу
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="h-12 w-12 mb-3 opacity-20" />
              <p>Хабарландыру жоқ</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBg(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
