"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card"
import { supabase } from "@/lib/supabase"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      setSentTo(values.email)
      toast.success("Reset link sent — check your inbox.")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Couldn't send the email"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (sentTo) {
    return (
      <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-1 p-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Check your email
          </CardTitle>
          <CardDescription className="font-medium text-slate-600 dark:text-slate-300">
            We sent a password reset link to <span className="font-bold text-foreground">{sentTo}</span>. The link expires in an hour.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Didn&apos;t get it? Check your spam folder, or try again with a different address.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-8 pt-0">
          <Link href="/login" className="w-full">
            <Button className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest" variant="premium">
              Back to sign in
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Use a different email
          </button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
      <CardHeader className="space-y-1 p-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
          Forgot password
        </CardTitle>
        <CardDescription className="font-medium text-slate-600 dark:text-slate-300">
          Enter your email and we&apos;ll send you a secure reset link.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4 p-8">
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" aria-hidden />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-14 pl-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary"
                disabled={isLoading}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-8 pt-0">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest"
            variant="premium"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Send reset link
          </Button>
          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">
            Remembered it?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
