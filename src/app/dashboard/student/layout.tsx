import { Suspense } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import StudentDashboardShell from "@/components/dashboard/StudentDashboardShell"

function ShellFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 mt-28 grow pb-28 md:pb-12">
      {children}
    </div>
  )
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <Suspense fallback={<ShellFallback>{children}</ShellFallback>}>
        <StudentDashboardShell>{children}</StudentDashboardShell>
      </Suspense>

      <Footer />
    </div>
  )
}
