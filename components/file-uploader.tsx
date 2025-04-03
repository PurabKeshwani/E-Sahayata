"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileText, CheckCircle } from "lucide-react"

interface FileUploaderProps {
  id: string
  accept: string
  maxSize: number // in MB
  onUpload: (file: File) => void
}

export function FileUploader({ id, accept, maxSize, onUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    // Check file type
    const fileType = selectedFile.type
    const acceptedTypes = accept.split(",").map((type) => type.trim())

    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        // Check file extension
        const extension = `.${selectedFile.name.split(".").pop()}`
        return extension.toLowerCase() === type.toLowerCase()
      } else {
        // Check MIME type
        return fileType.includes(type.replace("*", ""))
      }
    })

    if (!isAccepted) {
      setError(`File type not supported. Please upload ${accept} files`)
      return
    }

    setFile(selectedFile)
    setIsUploaded(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setIsUploaded(true)
          onUpload(file)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleRemove = () => {
    setFile(null)
    setIsUploaded(false)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      {!file ? (
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Drag & drop file here, or click to browse</p>
          <p className="text-xs text-muted-foreground">
            Supports {accept} (Max {maxSize}MB)
          </p>
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="rounded-md bg-muted p-2">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
            </div>
          )}

          {isUploaded && (
            <div className="mt-4 flex items-center text-sm text-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              File uploaded successfully
            </div>
          )}

          {!isUploaded && !isUploading && (
            <Button type="button" className="mt-4 bg-[#10B981] hover:bg-[#059669]" size="sm" onClick={handleUpload}>
              Upload File
            </Button>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

