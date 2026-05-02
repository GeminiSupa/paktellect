/**
 * Two-tier validation for expert profiles.
 *
 * Save  -> validateProfileForSave   : minimum to save a draft (name + phone + category)
 * Live  -> validateProfileForPublish: full checklist required to appear in /experts
 *
 * The publish checklist is intentionally the same set of rules that used to be the
 * monolithic "validateExpertProfileBasics", just renamed and only run when the user
 * presses "Go Live".
 */

export type ExpertProfileBasicsInput = {
  displayNameFromAccount: string
  phone: string
  category: string
  headline: string
  specialty: string
  rate: string
  city: string
  country: string
  bio: string
  qualifications: string
  legalBarNumber: string
  legalJurisdiction: string
  legalPracticeAreas: string
  mentalLicenseNumber: string
  mentalLicenseType: string
  mentalModalities: string
  wellnessCertification: string
  wellnessSpecialties: string
  wellnessApproach: string
  academicSubjects: string
  academicEducationLevel: string
  academicCredentials: string
}

export type ValidationResult = { ok: boolean; errors: string[] }

/** Values accepted by DB `teachers.category` CHECK constraint */
export const EXPERT_CATEGORY_VALUES = [
  "Academic",
  "Legal",
  "Wellness",
  "Mental Health",
  "Plumbing",
  "Electrical",
  "Logistics",
  "Mechanics",
] as const

export type ExpertCategoryValue = (typeof EXPERT_CATEGORY_VALUES)[number]

/**
 * Normalize signup typos / casing so Legal experts never fall through to "Academic"
 * tutoring rules by mistake.
 */
export function normalizeExpertCategory(raw: string | null | undefined): ExpertCategoryValue | null {
  const s = (raw ?? "").trim()
  if (!s) return null
  const key = s.toLowerCase().replace(/\s+/g, " ").trim()

  const aliases: Record<string, ExpertCategoryValue> = {
    academic: "Academic",
    tutor: "Academic",
    tutoring: "Academic",
    education: "Academic",
    teacher: "Academic",
    legal: "Legal",
    law: "Legal",
    lawyer: "Legal",
    attorneys: "Legal",
    attorney: "Legal",
    solicitor: "Legal",
    advocate: "Legal",
    wellness: "Wellness",
    fitness: "Wellness",
    nutrition: "Wellness",
    mental: "Mental Health",
    "mental health": "Mental Health",
    psychology: "Mental Health",
    therapist: "Mental Health",
    counselling: "Mental Health",
    counseling: "Mental Health",
    plumbing: "Plumbing",
    plumber: "Plumbing",
    electrical: "Electrical",
    electrician: "Electrical",
    logistics: "Logistics",
    freight: "Logistics",
    mechanics: "Mechanics",
    mechanic: "Mechanics",
    automotive: "Mechanics",
  }

  if (aliases[key]) return aliases[key]

  const exact = EXPERT_CATEGORY_VALUES.find((c) => c.toLowerCase() === key)
  return exact ?? null
}

/** PostgREST may return `profiles` as a single object or a one-element array. */
export function pickJoinedProfile<T extends { full_name?: string | null }>(
  p: T | T[] | null | undefined
): T | null {
  if (p == null) return null
  if (Array.isArray(p)) return p[0] ?? null
  return p
}

/**
 * Map a `teachers` row (+ optional profile) to the publish validator input.
 * Keeps dashboard / go-live checks aligned with the same rules.
 */
export function buildPublishInputFromTeacherRow(
  teacher: {
    category?: string | null
    headline?: string | null
    specialty?: string | null
    hourly_rate?: number | string | null
    bio?: string | null
    qualifications?: string | null
    legal_bar_number?: string | null
    legal_jurisdiction?: string | null
    legal_practice_areas?: string[] | null
    mental_license_number?: string | null
    mental_license_type?: string | null
    mental_modalities?: string[] | null
    wellness_certification?: string | null
    wellness_specialties?: string[] | null
    wellness_approach?: string | null
    academic_subjects?: string[] | null
    academic_education_level?: string | null
    academic_credentials?: string | null
  },
  profile: { full_name?: string | null; city?: string | null; country?: string | null; phone?: string | null } | null
): ExpertProfileBasicsInput {
  const rawCat = teacher.category?.trim() || ""
  const normalized = normalizeExpertCategory(teacher.category)
  return {
    displayNameFromAccount: profile?.full_name || "",
    phone: profile?.phone || "",
    category: normalized ?? rawCat,
    headline: teacher.headline || "",
    specialty: teacher.specialty || "",
    rate: teacher.hourly_rate != null && String(teacher.hourly_rate) !== "" ? String(teacher.hourly_rate) : "",
    city: profile?.city || "",
    country: profile?.country || "",
    bio: teacher.bio || "",
    qualifications: teacher.qualifications || "",
    legalBarNumber: teacher.legal_bar_number || "",
    legalJurisdiction: teacher.legal_jurisdiction || "",
    legalPracticeAreas: (teacher.legal_practice_areas || []).join(", "),
    mentalLicenseNumber: teacher.mental_license_number || "",
    mentalLicenseType: teacher.mental_license_type || "",
    mentalModalities: (teacher.mental_modalities || []).join(", "),
    wellnessCertification: teacher.wellness_certification || "",
    wellnessSpecialties: (teacher.wellness_specialties || []).join(", "),
    wellnessApproach: teacher.wellness_approach || "",
    academicSubjects: (teacher.academic_subjects || []).join(", "),
    academicEducationLevel: teacher.academic_education_level || "",
    academicCredentials: teacher.academic_credentials || "",
  }
}

function commaList(v: string): string[] {
  return v.split(",").map((s) => s.trim()).filter(Boolean)
}

export function validateProfileForSave(input: ExpertProfileBasicsInput): ValidationResult {
  const errors: string[] = []
  if (!input.displayNameFromAccount.trim()) {
    errors.push("Add your display name so clients know who they're booking.")
  }
  if (input.phone.trim().length < 10) {
    errors.push("Add a valid phone number (at least 10 digits).")
  }
  if (!input.category.trim()) {
    errors.push("Pick a professional category.")
  }
  return { ok: errors.length === 0, errors }
}

export function validateProfileForPublish(input: ExpertProfileBasicsInput): ValidationResult {
  const errors: string[] = []

  // Save-tier rules apply first
  const saveResult = validateProfileForSave(input)
  errors.push(...saveResult.errors)

  if (input.headline.trim().length < 8) {
    errors.push("Write a public headline of at least 8 characters.")
  }
  const rateNum = parseFloat(input.rate)
  if (!input.rate.trim() || Number.isNaN(rateNum) || rateNum <= 0) {
    errors.push("Set an hourly rate greater than 0 (clients can still send custom offers).")
  }
  if (!input.city.trim() && !input.country.trim()) {
    errors.push("Add a city and/or country so clients see your region.")
  }
  if (input.bio.trim().length < 24) {
    errors.push("Write a short bio (at least 24 characters) explaining how you help clients.")
  }
  if (!input.qualifications.trim()) {
    errors.push("Add one headline qualifications line (shown on your public card — e.g. bar admission, degrees, certifications).")
  }

  const catNorm = normalizeExpertCategory(input.category)
  if (catNorm === null && input.category.trim()) {
    errors.push(
      `Unrecognized category "${input.category}". Open Profile → Professional category and choose Legal, Wellness, Mental Health, Academic, or a trade — so we only ask for fields that apply to you.`
    )
    return { ok: errors.length === 0, errors }
  }
  const cat = catNorm ?? "Academic"

  /** Academic + trades share DB columns academic_*; labels differ by category in the UI only. */
  const requireTradeOrTeachingDetails = () => {
    const isAcademic = cat === "Academic"
    if (commaList(input.academicSubjects).length === 0) {
      errors.push(
        isAcademic
          ? "Teaching: list at least one subject or exam you cover (comma-separated)."
          : `${cat}: list the main services or job types you offer (comma-separated).`
      )
    }
    if (!input.academicEducationLevel.trim()) {
      errors.push(
        isAcademic
          ? "Teaching: say which grade levels or learners you support (e.g. O Levels, undergrad)."
          : `${cat}: describe the typical scope or tier you handle (e.g. residential, commercial, nationwide).`
      )
    }
    if (!input.academicCredentials.trim()) {
      errors.push(
        isAcademic
          ? "Teaching: add your credentials or experience (degrees, years tutoring, etc.)."
          : `${cat}: add licenses, certifications, or relevant experience.`
      )
    }
  }

  switch (cat) {
    case "Legal":
      if (!input.legalBarNumber.trim()) errors.push("Legal: add your bar / registration number.")
      if (!input.legalJurisdiction.trim()) errors.push("Legal: add your jurisdiction.")
      if (commaList(input.legalPracticeAreas).length === 0) {
        errors.push("Legal: list at least one practice area (e.g. civil litigation, contracts).")
      }
      break
    case "Mental Health":
      if (!input.mentalLicenseNumber.trim()) errors.push("Mental health: add your license number.")
      if (!input.mentalLicenseType.trim()) errors.push("Mental health: add your license type.")
      if (commaList(input.mentalModalities).length === 0) errors.push("Mental health: list at least one modality.")
      break
    case "Wellness":
      if (!input.wellnessCertification.trim()) errors.push("Wellness: add a certification or credential.")
      if (commaList(input.wellnessSpecialties).length === 0) errors.push("Wellness: list at least one specialty.")
      if (!input.wellnessApproach.trim()) errors.push("Wellness: describe your approach.")
      break
    case "Academic":
    case "Plumbing":
    case "Electrical":
    case "Logistics":
    case "Mechanics":
      requireTradeOrTeachingDetails()
      break
  }

  return { ok: errors.length === 0, errors }
}

/**
 * @deprecated Use validateProfileForPublish for the full checklist or
 * validateProfileForSave for the minimum-to-save set. Kept temporarily so any
 * remaining callers don't break during the migration.
 */
export const validateExpertProfileBasics = validateProfileForPublish
