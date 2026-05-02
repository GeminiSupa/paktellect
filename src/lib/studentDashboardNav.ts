import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Scale,
  MessageSquare,
  Handshake,
  Settings,
  BookMarked,
} from "lucide-react"

export type StudentNavItem = {
  href: string
  label: string
  shortLabel: string
  icon: LucideIcon
  primary?: boolean
}

export const STUDENT_NAV: StudentNavItem[] = [
  { href: "/dashboard/student", label: "My sessions", shortLabel: "Home", icon: LayoutDashboard, primary: true },
  { href: "/experts", label: "Find experts", shortLabel: "Browse", icon: BookOpen, primary: true },
  { href: "/dashboard/student/messages", label: "Messages", shortLabel: "Chat", icon: MessageSquare, primary: true },
  { href: "/dashboard/student/payments", label: "Payments", shortLabel: "Pay", icon: CreditCard, primary: true },
  { href: "/dashboard/student/legal", label: "Legal files", shortLabel: "Legal", icon: Scale },
  { href: "/dashboard/student/offers", label: "Offers", shortLabel: "Offers", icon: Handshake },
  { href: "/dashboard/student/settings", label: "Settings", shortLabel: "Settings", icon: Settings },
  { href: "/manual", label: "User guide", shortLabel: "Guide", icon: BookMarked },
]

export const STUDENT_BOTTOM_PRIMARY = STUDENT_NAV.filter((i) => i.primary)
