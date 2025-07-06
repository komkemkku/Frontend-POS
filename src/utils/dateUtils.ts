// Date utility functions for formatting timestamps
export class DateUtils {
  
  /**
   * แปลง Unix timestamp เป็นวันที่ในรูปแบบไทย
   * @param unixTimestamp - Unix timestamp (seconds)
   * @returns วันที่ในรูปแบบ "21 ม.ค. 2567"
   */
  static formatThaiDate(unixTimestamp: number | string): string {
    if (!unixTimestamp) return '-'
    
    try {
      // แปลงเป็น milliseconds ถ้าเป็น seconds
      const timestamp = typeof unixTimestamp === 'string' 
        ? parseInt(unixTimestamp) 
        : unixTimestamp
      
      const date = new Date(timestamp * 1000) // แปลงเป็น milliseconds
      
      if (isNaN(date.getTime())) return '-'
      
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ]
      
      const day = date.getDate()
      const month = thaiMonths[date.getMonth()]
      const year = date.getFullYear() + 543 // แปลงเป็นปี พ.ศ.
      
      return `${day} ${month} ${year}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return '-'
    }
  }

  /**
   * แปลง Unix timestamp เป็นวันที่และเวลาในรูปแบบไทย
   * @param unixTimestamp - Unix timestamp (seconds)
   * @returns วันที่และเวลาในรูปแบบ "21 ม.ค. 2567 เวลา 14:30"
   */
  static formatThaiDateTime(unixTimestamp: number | string): string {
    if (!unixTimestamp) return '-'
    
    try {
      const timestamp = typeof unixTimestamp === 'string' 
        ? parseInt(unixTimestamp) 
        : unixTimestamp
      
      const date = new Date(timestamp * 1000)
      
      if (isNaN(date.getTime())) return '-'
      
      const dateStr = this.formatThaiDate(timestamp)
      const time = date.toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
      
      return `${dateStr} เวลา ${time}`
    } catch (error) {
      console.error('Error formatting datetime:', error)
      return '-'
    }
  }

  /**
   * แปลง Unix timestamp เป็นรูปแบบสั้น
   * @param unixTimestamp - Unix timestamp (seconds)
   * @returns วันที่ในรูปแบบ "21/01/67"
   */
  static formatShortDate(unixTimestamp: number | string): string {
    if (!unixTimestamp) return '-'
    
    try {
      const timestamp = typeof unixTimestamp === 'string' 
        ? parseInt(unixTimestamp) 
        : unixTimestamp
      
      const date = new Date(timestamp * 1000)
      
      if (isNaN(date.getTime())) return '-'
      
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = (date.getFullYear() + 543).toString().slice(-2) // เอา 2 หลักสุดท้าย
      
      return `${day}/${month}/${year}`
    } catch (error) {
      console.error('Error formatting short date:', error)
      return '-'
    }
  }

  /**
   * คำนวณระยะเวลาที่ผ่านมาจาก Unix timestamp
   * @param unixTimestamp - Unix timestamp (seconds)
   * @returns ข้อความเช่น "2 วันที่แล้ว", "3 ชั่วโมงที่แล้ว"
   */
  static timeAgo(unixTimestamp: number | string): string {
    if (!unixTimestamp) return '-'
    
    try {
      const timestamp = typeof unixTimestamp === 'string' 
        ? parseInt(unixTimestamp) 
        : unixTimestamp
      
      const now = Date.now()
      const diffMs = now - (timestamp * 1000)
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)
      const diffMonths = Math.floor(diffDays / 30)
      const diffYears = Math.floor(diffDays / 365)
      
      if (diffYears > 0) return `${diffYears} ปีที่แล้ว`
      if (diffMonths > 0) return `${diffMonths} เดือนที่แล้ว`
      if (diffDays > 0) return `${diffDays} วันที่แล้ว`
      if (diffHours > 0) return `${diffHours} ชั่วโมงที่แล้ว`
      if (diffMinutes > 0) return `${diffMinutes} นาทีที่แล้ว`
      return 'เมื่อสักครู่'
    } catch (error) {
      console.error('Error calculating time ago:', error)
      return '-'
    }
  }

  /**
   * ตรวจสอบว่าวันที่อยู่ในช่วงที่กำหนดหรือไม่
   * @param unixTimestamp - Unix timestamp (seconds)
   * @param days - จำนวนวันย้อนหลัง
   * @returns true ถ้าอยู่ในช่วงที่กำหนด
   */
  static isWithinDays(unixTimestamp: number | string, days: number): boolean {
    if (!unixTimestamp) return false
    
    try {
      const timestamp = typeof unixTimestamp === 'string' 
        ? parseInt(unixTimestamp) 
        : unixTimestamp
      
      const now = Date.now()
      const diffMs = now - (timestamp * 1000)
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      return diffDays <= days
    } catch (error) {
      console.error('Error checking date range:', error)
      return false
    }
  }
}

// Export as default และ named export
export default DateUtils
