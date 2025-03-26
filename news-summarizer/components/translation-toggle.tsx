"use client"
import { Button } from "@/components/ui/button"
import { Globe, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/contexts/translation-context"
import { Badge } from "@/components/ui/badge"

export default function TranslationToggle() {
  const { isTranslated, toggleTranslation, currentLanguage, setLanguage, availableLanguages } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`jp-button-outline flex items-center gap-2 ${
              isTranslated ? "border-ochre text-ochre hover:bg-ochre/5" : ""
            }`}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Translate</span>
            {isTranslated && (
              <Badge className="jp-badge bg-ochre/10 text-ochre border-ochre/20 ml-1">{currentLanguage.name}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="jp-card border border-sumi/10">
          <DropdownMenuItem className="flex items-center justify-between cursor-pointer" onClick={toggleTranslation}>
            <span>{isTranslated ? "Disable Translation" : "Enable Translation"}</span>
            {isTranslated && <Check className="h-4 w-4 text-ochre" />}
          </DropdownMenuItem>

          {isTranslated && (
            <>
              <div className="px-2 py-1.5 text-xs text-sumi/60">Select Language</div>
              {availableLanguages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setLanguage(language.code)}
                >
                  <span>{language.name}</span>
                  {currentLanguage.code === language.code && <Check className="h-4 w-4 text-ochre" />}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

