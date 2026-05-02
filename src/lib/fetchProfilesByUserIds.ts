import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Loads profiles by primary key (`profiles.id` = auth user id) without using
 * PostgREST resource embedding from `teachers`. Embedding requires a FK between
 * `teachers.user_id` and `profiles`; many deployments omit it or use another name.
 */
export async function fetchProfilesByUserIds<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  userIds: string[],
  columns: string
): Promise<Map<string, T>> {
  const out = new Map<string, T>()
  const ids = [...new Set(userIds)].filter(Boolean)
  const CHUNK = 120
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK)
    const { data, error } = await supabase.from("profiles").select(columns).in("id", chunk)
    if (error) {
      console.warn("[fetchProfilesByUserIds]", error.message)
      continue
    }
    const rows = (data ?? []) as unknown as T[]
    for (const row of rows) {
      const rid = (row as Record<string, unknown>).id
      const id = typeof rid === "string" ? rid : undefined
      if (id) out.set(id, row)
    }
  }
  return out
}
