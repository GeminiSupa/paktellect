"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Loader2, GraduationCap, Scale, Heart, Brain } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { getDeviceId } from "@/lib/fingerprint"
import { motion } from "framer-motion"

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "expert"]),
  category: z.string().optional(),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "student",
      category: "Academic"
    }
  })

  const selectedRole = watch("role")
  const selectedCategory = watch("category")

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    try {
      const deviceId = await getDeviceId();

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            ...(data.role === "expert"
              ? { expert_category: data.category || "Academic" }
              : {}),
            device_id_hash: deviceId,
          },
        },
      })

      if (error) throw error

      if (authData.user && data.role === "expert" && authData.session) {
        const { error: tErr } = await supabase.from('teachers').insert([{ 
            user_id: authData.user.id,
            category: data.category || 'Academic',
            is_public: false,
        }])
        if (tErr) {
          console.error("Could not create expert record immediately:", tErr)
          throw new Error(tErr.message || "Failed to create expert profile")
        }
      }

      if (authData.session) {
        toast.success("Account created! Redirecting to dashboard...")
        const target = data.role === "expert" ? "/dashboard/teacher" : "/dashboard/student"
        router.push(target)
      } else {
        toast.success("Account created! Please log in.")
        router.push("/login")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const categoryIcons = [
    { id: 'Academic', icon: <GraduationCap className="size-4" />, label: 'Academic' },
    { id: 'Legal', icon: <Scale className="size-4" />, label: 'Legal' },
    { id: 'Wellness', icon: <Heart className="size-4" />, label: 'Wellness' },
    { id: 'Mental Health', icon: <Brain className="size-4" />, label: 'Mental' },
  ]

  return (
      <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
      <CardHeader className="space-y-1 p-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Create an account</CardTitle>
        <CardDescription className="font-medium text-slate-600 dark:text-slate-300">
          Join the PAKTELLECT professional network today.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6 p-8">
          <div className="grid gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">Account Type</label>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl">
              <button 
                type="button" 
                onClick={() => setValue("role", "student")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${selectedRole === "student" ? "bg-white dark:bg-slate-800 shadow-xl text-primary" : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"}`}
              >
                Consumer
              </button>
              <button 
                type="button" 
                onClick={() => setValue("role", "expert")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${selectedRole === "expert" ? "bg-white dark:bg-slate-800 shadow-xl text-primary" : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"}`}
              >
                Expert
              </button>
            </div>
          </div>

          {selectedRole === "expert" && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="grid gap-3"
            >
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">Professional Domain</label>
                <div className="grid grid-cols-2 gap-2">
                    {categoryIcons.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setValue("category", cat.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedCategory === cat.id 
                                    ? "bg-primary text-white border-primary shadow-lg shadow-emerald-500/20" 
                                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
            </motion.div>
          )}
          
          <div className="grid gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300" htmlFor="fullName">Full Name</label>
            <Input
              id="fullName"
              placeholder="John Doe"
              className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary"
              disabled={isLoading}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 font-bold">{errors.fullName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300" htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300" htmlFor="password">Security Password</label>
            <Input
              id="password"
              type="password"
              className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 p-8 pt-0">
          <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-emerald-700 text-white font-black text-lg transition-all shadow-xl shadow-emerald-500/20" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Create Secure Account
          </Button>
          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>

      </form>
    </Card>
  )
}
