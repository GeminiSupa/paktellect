import { Suspense } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import TeacherDashboardShell from "@/components/dashboard/TeacherDashboardShell"

function ShellFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 mt-28 grow pb-24 md:pb-8">
      {children}
    </div>
  )
}

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <Suspense fallback={<ShellFallback>{children}</ShellFallback>}>
        <TeacherDashboardShell>{children}</TeacherDashboardShell>
      </Suspense>

      <Footer />
    </div>
  )
}
