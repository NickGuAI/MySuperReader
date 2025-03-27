"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { LogIn, LogOut, Settings, User } from "lucide-react"

export default function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/login")} className="jp-button-outline">
        <LogIn className="h-4 w-4 mr-2" />
        Sign in
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.displayName}
            fill
            className="rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="jp-card border border-sumi/10 w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-indigo">{user.displayName}</p>
            <p className="text-xs text-sumi/60 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-sumi/10" />
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => router.push("/profile")}>
          <User className="h-4 w-4 mr-2 text-sumi/70" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => router.push("/profile")}>
          <Settings className="h-4 w-4 mr-2 text-sumi/70" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-sumi/10" />
        <DropdownMenuItem className="cursor-pointer flex items-center text-vermilion" onClick={() => logout()}>
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

