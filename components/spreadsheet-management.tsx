"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, FileSpreadsheet, Calendar, Users } from "lucide-react"
import { type SheetData, getSheets, createSheet } from "@/lib/google-sheets"
import { SpreadsheetViewer } from "./spreadsheet-viewer"

export function SpreadsheetManagement() {
  const [sheets, setSheets] = useState<SheetData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSheetName, setNewSheetName] = useState("")
  const [newSheetHeaders, setNewSheetHeaders] = useState("")

  useEffect(() => {
    loadSheets()
  }, [])

  const loadSheets = async () => {
    setLoading(true)
    try {
      const data = await getSheets()
      setSheets(data)
    } catch (error) {
      console.error("Error loading sheets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSheetName.trim() || !newSheetHeaders.trim()) return

    try {
      const headers = newSheetHeaders.split(",").map((h) => h.trim())
      const newSheet = await createSheet(newSheetName, headers)
      setSheets([...sheets, newSheet])
      setNewSheetName("")
      setNewSheetHeaders("")
      setShowCreateForm(false)
    } catch (error) {
      console.error("Error creating sheet:", error)
    }
  }

  if (selectedSheet) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedSheet(null)}>
          ← Back to Sheets
        </Button>
        <SpreadsheetViewer sheetId={selectedSheet} editable={true} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Spreadsheet Management</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Sheet
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Spreadsheet</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSheet} className="space-y-4">
              <div>
                <Label htmlFor="sheetName">Sheet Name</Label>
                <Input
                  id="sheetName"
                  value={newSheetName}
                  onChange={(e) => setNewSheetName(e.target.value)}
                  placeholder="Enter sheet name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="headers">Column Headers (comma-separated)</Label>
                <Input
                  id="headers"
                  value={newSheetHeaders}
                  onChange={(e) => setNewSheetHeaders(e.target.value)}
                  placeholder="Date, Container, Commodity, Status"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Sheet</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">Loading spreadsheets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sheets.map((sheet) => (
            <Card key={sheet.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">{sheet.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{sheet.data.length} rows</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {sheet.headers.length} columns
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(sheet.lastModified).toLocaleDateString()}
                  </div>
                  <div className="pt-2">
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setSelectedSheet(sheet.id)}
                    >
                      Open Sheet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
