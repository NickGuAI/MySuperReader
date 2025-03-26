// Mock email service
export const emailService = {
  // Send an email with article content
  async sendEmail(email: string, subject: string, content: string): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Always return success for mock implementation
    return {
      success: true,
      message: `Email sent successfully to ${email}`,
    }
  },
}

