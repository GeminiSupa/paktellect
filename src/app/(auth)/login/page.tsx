"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { getDeviceId } from "@/lib/fingerprint"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const deviceId = await getDeviceId();
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Device Limit Check Logic
      // In a real app, you would check this deviceId against a 'user_devices' table in Supabase
      console.log("Device Fingerprint:", deviceId);

      toast.success("Logged in successfully!")
      
      const role = authData.user?.user_metadata?.role
      if (role === 'expert') {
         router.push("/dashboard/teacher")
      } else {
         router.push("/dashboard/student")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden">
      <CardHeader className="space-y-1 p-8 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-3xl font-black tracking-tighter">Sign in</CardTitle>
        <CardDescription className="font-medium text-slate-500">
          Enter your credentials to access your secure profile.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6 p-8">
          <div className="grid gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="h-14 rounded-xl border-slate-100 dark:border-slate-800 focus:ring-primary"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="password">Security Password</label>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              className="h-14 rounded-xl border-slate-100 dark:border-slate-800 focus:ring-primary"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 p-8 pt-0">
          <Button type="submit" className="w-full h-16 rounded-2xl font-black text-lg transition-all" variant="premium" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Secure Login
          </Button>
          <p className="text-center text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Sign up today
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>

  )
}
