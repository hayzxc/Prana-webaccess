"use client"

import { useState } from "react"
import { useAuth } from "@/lib/simple-backend-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { CompanyLogo } from "@/components/company-logo"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 animate-slide-in">
          <CompanyLogo size="md" showText={true} />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-prana-navy hover:text-prana-blue smooth-transition navbar-item font-medium">
            Home
          </Link>
          <Link
            href="/about"
            className="text-prana-navy hover:text-prana-blue smooth-transition navbar-item font-medium"
          >
            Tentang Kami
          </Link>
          <Link
            href="/services"
            className="text-prana-navy hover:text-prana-blue smooth-transition navbar-item font-medium"
          >
            Layanan
          </Link>
          <a
            href="#certifications"
            className="text-prana-navy hover:text-prana-blue smooth-transition navbar-item font-medium"
          >
            Sertifikat
          </a>

          {user ? (
            <div className="flex items-center space-x-4 animate-fade-in">
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="text-prana-navy hover:text-prana-blue smooth-transition navbar-item font-medium"
              >
                Dashboard
              </Link>
              <span className="text-sm text-prana-gray">Hi, {user.name}</span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-prana-navy text-prana-navy hover:bg-prana-navy hover:text-white bg-transparent"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="animate-scale-in">
              <Link href="/login">
                <Button className="bg-prana-navy hover:bg-prana-blue text-white font-medium px-6">Login</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none smooth-transition hover:scale-110 text-prana-navy"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-6 py-3 animate-slide-in border-t border-gray-100">
          <Link href="/" className="block py-2 text-prana-navy hover:text-prana-blue smooth-transition font-medium">
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-prana-navy hover:text-prana-blue smooth-transition font-medium"
          >
            Tentang Kami
          </Link>
          <Link
            href="/services"
            className="block py-2 text-prana-navy hover:text-prana-blue smooth-transition font-medium"
          >
            Layanan
          </Link>
          <a
            href="#certifications"
            className="block py-2 text-prana-navy hover:text-prana-blue smooth-transition font-medium"
          >
            Sertifikat
          </a>

          {user ? (
            <div className="mt-2">
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="block py-2 text-prana-navy hover:text-prana-blue smooth-transition font-medium"
              >
                Dashboard
              </Link>
              <Button onClick={logout} className="w-full mt-2 bg-prana-navy hover:bg-prana-blue text-white">
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login" className="block mt-2">
              <Button className="w-full bg-prana-navy hover:bg-prana-blue text-white">Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
