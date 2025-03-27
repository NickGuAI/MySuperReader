"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translationService } from "@/lib/external-services/translation-service"

type Language = {
  code: string
  name: string
}

type TranslationContextType = {
  isTranslated: boolean
  toggleTranslation: () => void
  currentLanguage: Language
  setLanguage: (code: string) => void
  availableLanguages: Language[]
  translateText: (text: string) => Promise<string>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [isTranslated, setIsTranslated] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>({ code: "en", name: "English" })
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([])

  useEffect(() => {
    // Get available languages
    const languages = translationService.getAvailableLanguages()
    setAvailableLanguages(languages)
  }, [])

  const toggleTranslation = () => {
    setIsTranslated((prev) => !prev)
  }

  const setLanguage = (code: string) => {
    const language = availableLanguages.find((lang) => lang.code === code)
    if (language) {
      setCurrentLanguage(language)
    }
  }

  const translateText = async (text: string): Promise<string> => {
    if (!isTranslated || !text) return text

    try {
      return await translationService.translateText(text, currentLanguage.code)
    } catch (error) {
      console.error("Translation error:", error)
      return text
    }
  }

  return (
    <TranslationContext.Provider
      value={{
        isTranslated,
        toggleTranslation,
        currentLanguage,
        setLanguage,
        availableLanguages,
        translateText,
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

