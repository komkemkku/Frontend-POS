export interface ValidationRule<T = any> {
  validate: (value: T) => boolean
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate a value against multiple rules
 */
export const validate = <T>(value: T, rules: ValidationRule<T>[]): ValidationResult => {
  const errors: string[] = []
  
  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Required field validation
 */
export const required = (message = 'ฟิลด์นี้จำเป็นต้องกรอก'): ValidationRule => ({
  validate: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined
  },
  message
})

/**
 * Minimum length validation
 */
export const minLength = (min: number, message?: string): ValidationRule<string> => ({
  validate: (value: string) => value.length >= min,
  message: message || `ต้องมีอย่างน้อย ${min} ตัวอักษร`
})

/**
 * Maximum length validation
 */
export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
  validate: (value: string) => value.length <= max,
  message: message || `ต้องมีไม่เกิน ${max} ตัวอักษร`
})

/**
 * Email validation
 */
export const email = (message = 'รูปแบบอีเมลไม่ถูกต้อง'): ValidationRule<string> => ({
  validate: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  message
})

/**
 * Phone number validation (Thai format)
 */
export const phoneNumber = (message = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'): ValidationRule<string> => ({
  validate: (value: string) => {
    const phoneRegex = /^(\+66|0)[0-9]{8,9}$/
    return phoneRegex.test(value.replace(/[-\s]/g, ''))
  },
  message
})

/**
 * Number validation
 */
export const isNumber = (message = 'ต้องเป็นตัวเลขเท่านั้น'): ValidationRule<string> => ({
  validate: (value: string) => {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value))
  },
  message
})

/**
 * Minimum number validation
 */
export const minValue = (min: number, message?: string): ValidationRule<number> => ({
  validate: (value: number) => value >= min,
  message: message || `ต้องมีค่าอย่างน้อย ${min}`
})

/**
 * Maximum number validation
 */
export const maxValue = (max: number, message?: string): ValidationRule<number> => ({
  validate: (value: number) => value <= max,
  message: message || `ต้องมีค่าไม่เกิน ${max}`
})

/**
 * URL validation
 */
export const url = (message = 'รูปแบบ URL ไม่ถูกต้อง'): ValidationRule<string> => ({
  validate: (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  message
})

/**
 * Pattern validation
 */
export const pattern = (regex: RegExp, message = 'รูปแบบข้อมูลไม่ถูกต้อง'): ValidationRule<string> => ({
  validate: (value: string) => regex.test(value),
  message
})
