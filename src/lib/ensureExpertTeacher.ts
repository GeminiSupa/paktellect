import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type EnsureExpertTeacherResult =
  | { status: "skipped" }
  | { status: "ok" }
  | { status: "error"; message: string }

function readExpertCategory(user: User): string {
  const meta = user.user_metadata as Record<string, unknown> | null | undefined
  const raw =
    (meta?.expert_category as string | undefined) ??
    (meta?.category as string | undefined) ??
    "Academic"

  return raw || "Academic"
}

/**
 * Experts need a row in `public.teachers`. That insert requires an authenticated session (RLS),
 * so if email confirmation delays session creation at signup, we create the row on first login.
 */
export async function ensureExpertTeacherRow(user: User | null): Promise<EnsureExpertTeacherResult> {
  if (!user) return { status: "skipped" }

  const role = user.user_metadata?.role
  if (role !== "expert") return { status: "skipped" }

  const { data: existing, error: existingErr } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingErr) {
    return { status: "error", message: existingErr.message || "Failed to verify expert profile" }
  }

  if (existing?.id) return { status: "ok" }

  const { error: insertErr } = await supabase.from("teachers").insert([
    {
      user_id: user.id,
      category: readExpertCategory(user),
      is_public: false,
    },
  ])

  if (insertErr) {
    return { status: "error", message: insertErr.message || "Failed to create expert profile" }
  }

  return { status: "ok" }
}
