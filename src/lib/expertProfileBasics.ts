/** Validates fields that must be complete before saving an expert profile (directory + booking UX). */

export type ExpertProfileBasicsInput = {
  displayNameFromAccount: string
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

function commaList(v: string): string[] {
  return v.split(",").map((s) => s.trim()).filter(Boolean)
}

export function validateExpertProfileBasics(input: ExpertProfileBasicsInput): { ok: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.displayNameFromAccount.trim()) {
    errors.push("Set your display name under Account Settings (it appears as your name to clients).")
  }
  if (input.headline.trim().length < 8) {
    errors.push("Public headline: at least 8 characters (shown on Find Experts and booking).")
  }
  if (!input.specialty.trim()) {
    errors.push("Primary specialty is required.")
  }
  const rateNum = parseFloat(input.rate)
  if (!input.rate.trim() || Number.isNaN(rateNum) || rateNum <= 0) {
    errors.push("Set a standard hourly rate greater than 0 (clients can still send custom Offers).")
  }
  if (!input.city.trim() && !input.country.trim()) {
    errors.push("Add city and/or country so clients see your region in the directory.")
  }
  if (input.bio.trim().length < 24) {
    errors.push("Professional bio: at least 24 characters explaining how you help clients.")
  }
  if (!input.qualifications.trim()) {
    errors.push("Add a qualifications line (first line is highlighted on your public card).")
  }

  switch (input.category) {
    case "Legal":
      if (!input.legalBarNumber.trim()) errors.push("Legal: bar / registration number.")
      if (!input.legalJurisdiction.trim()) errors.push("Legal: jurisdiction.")
      if (commaList(input.legalPracticeAreas).length === 0) errors.push("Legal: at least one practice area (comma-separated).")
      break
    case "Mental Health":
      if (!input.mentalLicenseNumber.trim()) errors.push("Mental health: license number.")
      if (!input.mentalLicenseType.trim()) errors.push("Mental health: license type.")
      if (commaList(input.mentalModalities).length === 0) errors.push("Mental health: at least one modality.")
      break
    case "Wellness":
      if (!input.wellnessCertification.trim()) errors.push("Wellness: certification or credential.")
      if (commaList(input.wellnessSpecialties).length === 0) errors.push("Wellness: at least one specialty.")
      if (!input.wellnessApproach.trim()) errors.push("Wellness: describe your approach.")
      break
    default:
      if (commaList(input.academicSubjects).length === 0) errors.push("Academic: at least one subject (comma-separated).")
      if (!input.academicEducationLevel.trim()) errors.push("Academic: education level you support.")
      if (!input.academicCredentials.trim()) errors.push("Academic: your credentials or experience line.")
      break
  }

  return { ok: errors.length === 0, errors }
}
