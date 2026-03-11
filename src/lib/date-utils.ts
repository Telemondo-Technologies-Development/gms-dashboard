import { z } from 'zod'

const dateInputSchema = z.union([z.string(), z.number(), z.date()])

export function parseDateInput(value: unknown): Date | null {
  const parsed = dateInputSchema.safeParse(value)
  if (!parsed.success) {
    return null
  }

  const date = parsed.data instanceof Date ? parsed.data : new Date(parsed.data)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export function toStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parseCalendarDay(value: unknown): Date | null {
  const parsed = z.string().min(1).safeParse(value)
  if (!parsed.success) {
    return null
  }

  const date = parseDateInput(parsed.data)
  if (!date) {
    return null
  }

  return toStartOfDay(date)
}
