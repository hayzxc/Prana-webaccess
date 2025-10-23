"use client"

import React, { memo, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useVirtualList } from "@/hooks/use-virtual-list"
import { useDebounce } from "@/hooks/use-debounce"

interface Certificate {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
  containerNumber?: string
}

interface OptimizedCertificateListProps {
  certificates: Certificate[]
  onCertificateClick?: (certificate: Certificate) => void
  searchable?: boolean
}

const CertificateItem = memo(
  ({
    certificate,
    onClick,
  }: {
    certificate: Certificate
    onClick?: (certificate: Certificate) => void
  }) => {
    const handleClick = useCallback(() => {
      onClick?.(certificate)
    }, [certificate, onClick])

    const statusColor = useMemo(() => {
      switch (certificate.status) {
        case "active":
          return "bg-green-100 text-green-800"
        case "pending":
          return "bg-yellow-100 text-yellow-800"
        case "expired":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }, [certificate.status])

    return (
      <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">{certificate.title}</CardTitle>
            <Badge className={statusColor}>{certificate.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-gray-600 space-y-1">
            <p>Type: {certificate.type}</p>
            {certificate.containerNumber && <p>Container: {certificate.containerNumber}</p>}
            <p>Created: {new Date(certificate.createdAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    )
  },
)

CertificateItem.displayName = "CertificateItem"

export const OptimizedCertificateList = memo(
  ({ certificates, onCertificateClick, searchable = true }: OptimizedCertificateListProps) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    const filteredCertificates = useMemo(() => {
      if (!debouncedSearchTerm) return certificates

      return certificates.filter(
        (cert) =>
          cert.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          cert.containerNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          cert.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }, [certificates, debouncedSearchTerm])

    const { visibleItems, totalHeight, setScrollTop } = useVirtualList(filteredCertificates, {
      itemHeight: 120,
      containerHeight: 600,
      overscan: 3,
    })

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
      },
      [setScrollTop],
    )

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    }, [])

    return (
      <div className="space-y-4">
        {searchable && (
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        )}

        <div className="overflow-auto border rounded-lg" style={{ height: 600 }} onScroll={handleScroll}>
          <div style={{ height: totalHeight, position: "relative" }}>
            {visibleItems.map(({ item: certificate, index }) => (
              <div
                key={certificate.id}
                style={{
                  position: "absolute",
                  top: index * 120,
                  left: 0,
                  right: 0,
                  height: 120,
                  padding: "8px",
                }}
              >
                <CertificateItem certificate={certificate} onClick={onCertificateClick} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 text-center">
          Showing {visibleItems.length} of {filteredCertificates.length} certificates
        </div>
      </div>
    )
  },
)

OptimizedCertificateList.displayName = "OptimizedCertificateList"
