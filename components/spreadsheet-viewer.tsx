"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Download, Edit, Plus } from "lucide-react"
import { type SheetData, getSheet, updateSheet } from "@/lib/google-sheets"

interface SpreadsheetViewerProps {
  sheetId: string
  editable?: boolean
}

export function SpreadsheetViewer({ sheetId, editable = false }: SpreadsheetViewerProps) {
  const [sheet, setSheet] = useState<SheetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any[][]>([])

  useEffect(() => {
    loadSheet()
  }, [sheetId])

  const loadSheet = async () => {
    setLoading(true)
    try {
      const data = await getSheet(sheetId)
      setSheet(data)
      if (data) {
        setEditData([...data.data])
      }
    } catch (error) {
      console.error("Error loading sheet:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!sheet) return

    try {
      await updateSheet(sheet.id, editData)
      setSheet({ ...sheet, data: editData })
      setEditMode(false)
    } catch (error) {
      console.error("Error saving sheet:", error)
    }
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...editData]
    if (!newData[rowIndex]) {
      newData[rowIndex] = []
    }
    newData[rowIndex][colIndex] = value
    setEditData(newData)
  }

  const addRow = () => {
    const newRow = new Array(sheet?.headers.length || 0).fill("")
    setEditData([...editData, newRow])
  }

  const exportToCSV = () => {
    if (!sheet) return

    const csvContent = [sheet.headers.join(","), ...sheet.data.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${sheet.name}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Loading spreadsheet...
        </CardContent>
      </Card>
    )
  }

  if (!sheet) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-gray-500">Spreadsheet not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{sheet.name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Last modified: {new Date(sheet.lastModified).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSheet}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {editable && (
              <>
                {editMode ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {sheet.headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(editMode ? editData : sheet.data).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {sheet.headers.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {editMode ? (
                        <Input
                          value={row[colIndex] || ""}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="min-w-[100px]"
                        />
                      ) : (
                        <span>{row[colIndex] || ""}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {editMode && (
          <div className="mt-4">
            <Button variant="outline" onClick={addRow}>
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
