"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Play, RotateCcw } from "lucide-react"

interface FumigationStep {
  id: string
  name: string
  duration: number // in minutes
  status: "pending" | "active" | "completed"
  startTime?: string
  endTime?: string
}

interface FumigationProgressProps {
  containerNumber: string
  commodity: string
  treatmentType: string
  onComplete?: () => void
}

export function FumigationProgress({ containerNumber, commodity, treatmentType, onComplete }: FumigationProgressProps) {
  const [steps, setSteps] = useState<FumigationStep[]>([
    {
      id: "preparation",
      name: "Persiapan & Inspeksi",
      duration: 60,
      status: "completed",
      startTime: "2024-03-15T08:00:00Z",
      endTime: "2024-03-15T09:00:00Z",
    },
    {
      id: "sealing",
      name: "Pemasangan Tenda & Sealing",
      duration: 90,
      status: "completed",
      startTime: "2024-03-15T09:00:00Z",
      endTime: "2024-03-15T10:30:00Z",
    },
    {
      id: "gassing",
      name: "Aplikasi Gas Fumigan",
      duration: 1440, // 24 hours
      status: "active",
      startTime: "2024-03-15T10:30:00Z",
    },
    {
      id: "aeration",
      name: "Aerasi & Ventilasi",
      duration: 240, // 4 hours
      status: "pending",
    },
    {
      id: "certification",
      name: "Sertifikasi & Dokumentasi",
      duration: 30,
      status: "pending",
    },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getOverallProgress = () => {
    const completedSteps = steps.filter((step) => step.status === "completed").length
    const activeStep = steps.find((step) => step.status === "active")

    if (activeStep && activeStep.startTime) {
      const startTime = new Date(activeStep.startTime)
      const elapsed = (currentTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes
      const stepProgress = Math.min(elapsed / activeStep.duration, 1)
      return ((completedSteps + stepProgress) / steps.length) * 100
    }

    return (completedSteps / steps.length) * 100
  }

  const getRemainingTime = (step: FumigationStep) => {
    if (!step.startTime || step.status !== "active") return null

    const startTime = new Date(step.startTime)
    const elapsed = (currentTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes
    const remaining = Math.max(step.duration - elapsed, 0)

    const hours = Math.floor(remaining / 60)
    const minutes = Math.floor(remaining % 60)

    return `${hours}h ${minutes}m`
  }

  const getStepProgress = (step: FumigationStep) => {
    if (step.status === "completed") return 100
    if (step.status === "pending") return 0
    if (!step.startTime) return 0

    const startTime = new Date(step.startTime)
    const elapsed = (currentTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes
    return Math.min((elapsed / step.duration) * 100, 100)
  }

  const getStatusIcon = (step: FumigationStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "active":
        return <Play className="w-5 h-5 text-blue-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (step: FumigationStep) => {
    switch (step.status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Berlangsung</Badge>
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progress Fumigasi</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {Math.round(getOverallProgress())}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Container:</span>
                <div className="font-medium">{containerNumber}</div>
              </div>
              <div>
                <span className="text-gray-500">Komoditas:</span>
                <div className="font-medium">{commodity}</div>
              </div>
              <div>
                <span className="text-gray-500">Perlakuan:</span>
                <div className="font-medium">{treatmentType}</div>
              </div>
            </div>
            <Progress value={getOverallProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} className={`${step.status === "active" ? "ring-2 ring-blue-500" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    {getStatusIcon(step)}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.name}</h3>
                    <p className="text-sm text-gray-500">
                      Durasi: {Math.floor(step.duration / 60)}h {step.duration % 60}m
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {step.status === "active" && getRemainingTime(step) && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">Sisa Waktu</div>
                      <div className="text-lg font-bold text-blue-800">{getRemainingTime(step)}</div>
                    </div>
                  )}
                  {getStatusBadge(step)}
                </div>
              </div>

              {step.status !== "pending" && (
                <div className="mt-4">
                  <Progress value={getStepProgress(step)} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{step.startTime && `Mulai: ${new Date(step.startTime).toLocaleString("id-ID")}`}</span>
                    <span>{step.endTime && `Selesai: ${new Date(step.endTime).toLocaleString("id-ID")}`}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Terakhir diperbarui: {currentTime.toLocaleString("id-ID")}</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {getOverallProgress() === 100 && (
                <Button onClick={onComplete} size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Selesai
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
