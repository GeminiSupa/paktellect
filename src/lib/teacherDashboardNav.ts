import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Scale,
  Handshake,
  DollarSign,
  User,
  Clock,
  Settings,
  BookOpen,
} from "lucide-react"

export type TeacherNavItem = {
  href: string
  label: string
  shortLabel: string
  icon: LucideIcon
  /** Shown in mobile bottom bar */
  primary?: boolean
  /** Emphasized in sidebar (e.g. availability) */
  emphasize?: boolean
}

export const TEACHER_NAV: TeacherNavItem[] = [
  { href: "/dashboard/teacher", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard, primary: true },
  { href: "/dashboard/teacher/bookings", label: "Schedule & Sessions", shortLabel: "Sessions", icon: Calendar, primary: true },
  { href: "/dashboard/teacher/availability", label: "Slots & Availability", shortLabel: "Slots", icon: Clock, primary: true, emphasize: true },
  { href: "/dashboard/teacher/earnings", label: "Financials & Payouts", shortLabel: "Earnings", icon: DollarSign, primary: true },
  { href: "/dashboard/teacher/bookings?status=pending", label: "Student Inquiries", shortLabel: "Inquiries", icon: Users },
  { href: "/dashboard/teacher/messages", label: "Messages", shortLabel: "Messages", icon: MessageSquare },
  { href: "/dashboard/teacher/legal", label: "Legal Workspace", shortLabel: "Legal", icon: Scale },
  { href: "/dashboard/teacher/offers", label: "Offers", shortLabel: "Offers", icon: Handshake },
  { href: "/dashboard/teacher/profile", label: "Practice Profile", shortLabel: "Profile", icon: User },
  { href: "/dashboard/teacher/settings", label: "Settings", shortLabel: "Settings", icon: Settings },
  { href: "/manual/expert", label: "Expert manual", shortLabel: "Manual", icon: BookOpen },
]

export const TEACHER_BOTTOM_PRIMARY = TEACHER_NAV.filter((i) => i.primary)
