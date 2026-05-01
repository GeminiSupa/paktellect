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
    errors.push("Add a qualifications line (highlighted on your public card).")
  }

  switch (input.category) {
    case "Legal":
      if (!input.legalBarNumber.trim()) errors.push("Legal: add your bar / registration number.")
      if (!input.legalJurisdiction.trim()) errors.push("Legal: add your jurisdiction.")
      if (commaList(input.legalPracticeAreas).length === 0) errors.push("Legal: list at least one practice area.")
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
    default:
      if (commaList(input.academicSubjects).length === 0) errors.push("Academic: list at least one subject.")
      if (!input.academicEducationLevel.trim()) errors.push("Academic: add the education level you support.")
      if (!input.academicCredentials.trim()) errors.push("Academic: add your credentials or experience.")
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
