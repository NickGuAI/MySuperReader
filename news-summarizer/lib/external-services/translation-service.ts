// Mock translation service
export const translationService = {
  // Translate text from Japanese to English
  async translateText(text: string, targetLanguage = "en"): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // In a real implementation, this would call an AI translation API
    // For now, we'll use a simple mock translation for Japanese phrases
    if (text === "ニュース要約") {
      return "News Summary"
    }

    // Return the original text for other content
    // In a real implementation, this would be translated
    return text
  },

  // Translate an entire object with text fields
  async translateObject<T extends Record<string, any>>(
    obj: T,
    textFields: (keyof T)[],
    targetLanguage = "en",
  ): Promise<T> {
    // Create a copy of the object
    const translated = { ...obj }

    // Translate each specified field
    for (const field of textFields) {
      if (typeof obj[field] === "string") {
        translated[field] = await this.translateText(obj[field] as string, targetLanguage)
      }
    }

    return translated
  },

  // Get available languages
  getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: "en", name: "English" },
      { code: "ja", name: "日本語" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
      { code: "de", name: "Deutsch" },
      { code: "zh", name: "中文" },
    ]
  },
}

