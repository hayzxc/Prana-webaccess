"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface CompanyLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  variant?: "default" | "white" | "transparent"
}

export function CompanyLogo({ size = "md", showText = true, className, variant = "default" }: CompanyLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const getLogoSrc = () => {
    switch (variant) {
      case "white":
        return "/images/prana-logo.png"
      case "transparent":
        return "/images/prana-logo-transparent.png"
      default:
        return "/images/prana-logo-new.jpeg"
    }
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src={getLogoSrc() || "/placeholder.svg"}
          alt="PT Prana Argentum Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold text-prana-navy leading-tight", textSizeClasses[size])}>
            PT Prana Argentum
          </span>
          {size !== "sm" && <span className="text-xs text-prana-gray leading-tight">Fumigation Services</span>}
        </div>
      )}
    </div>
  )
}
