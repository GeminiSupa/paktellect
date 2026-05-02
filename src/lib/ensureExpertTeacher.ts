import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { normalizeExpertCategory } from "@/lib/expertProfileBasics"

type EnsureExpertTeacherResult =
  | { status: "skipped" }
  | { status: "ok" }
  | { status: "error"; message: string }

function readExpertCategory(user: User): string {
  const meta = user.user_metadata as Record<string, unknown> | null | undefined
  const raw =
    (meta?.expert_category as string | undefined) ??
    (meta?.category as string | undefined) ??
    ""
  const norm = normalizeExpertCategory(raw)
  return norm ?? "Academic"
}

/**
 * Experts need a row in `public.teachers`. That insert requires an authenticated session (RLS),
 * so if email confirmation delays session creation at signup, we create the row on first login.
 */
export async function ensureExpertTeacherRow(user: User | null): Promise<EnsureExpertTeacherResult> {
  if (!user) return { status: "skipped" }

  const role = user.user_metadata?.role
  if (role !== "expert") return { status: "skipped" }

  console.log("Ensuring expert teacher row for user:", user.id)

  const { data: existing, error: existingErr } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingErr) {
    console.error("Error checking existing expert row:", existingErr)
    return { status: "error", message: existingErr.message || "Failed to verify expert profile" }
  }

  if (existing?.id) {
    console.log("Expert row already exists:", existing.id)
    return { status: "ok" }
  }

  console.log("Creating new expert row...")
  // INSERT can race with signup or a parallel session; unique on user_id → use upsert DO NOTHING.
  const { error: upsertErr } = await supabase.from("teachers").upsert(
    {
      user_id: user.id,
      category: readExpertCategory(user),
      is_public: false,
    },
    { onConflict: "user_id", ignoreDuplicates: true }
  )

  if (upsertErr) {
    if (upsertErr.code === "23505") {
        console.log("Expert row created in parallel race.")
        return { status: "ok" }
    }
    console.error("Error creating expert row:", upsertErr)
    return { status: "error", message: upsertErr.message || "Failed to create expert profile" }
  }

  console.log("Expert row created successfully.")
  return { status: "ok" }
}
