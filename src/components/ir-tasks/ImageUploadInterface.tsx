import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AlertCircle, Upload, X } from 'lucide-react'

import { TaskResultsSection } from './TaskResultsSection'
import type { IRTask } from '@/types/api'
import { useSubmitImages } from '@/hooks/useApi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ImageUploadInterfaceProps = {
  task: IRTask
}

export const ImageUploadInterface = ({ task }: ImageUploadInterfaceProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const submitImagesMutation = useSubmitImages()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return

    try {
      await submitImagesMutation.mutateAsync({
        taskUuid: task.uuid,
        images: selectedFiles,
      })

      setSelectedFiles([])
    } catch (error) {
      console.error('Failed to submit images:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">UUID:</span>
            <span className="font-mono text-xs">{task.uuid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Realogram:</span>
            <span
              className={
                task.compute_realogram ? 'text-green-600' : 'text-gray-400'
              }
            >
              {task.compute_realogram ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shares:</span>
            <span
              className={
                task.compute_shares ? 'text-green-600' : 'text-gray-400'
              }
            >
              {task.compute_shares ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Drag and drop images or click to select. Max 10MB per file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : isDragReject
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-900 mb-2">
                Drop the images here...
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop images here or click to select
                </p>
                <p className="text-gray-600 mb-4">
                  Supports JPG, PNG, WebP, GIF, BMP (max 10MB each)
                </p>
              </>
            )}
          </div>

          {fileRejections.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {fileRejections.map(({ file, errors }) => (
                    <div key={file.name}>
                      <strong>{file.name}:</strong>{' '}
                      {errors.map((e) => e.message).join(', ')}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">
                Selected Images ({selectedFiles.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={submitImagesMutation.isPending}
              >
                {submitImagesMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit {selectedFiles.length} Image
                    {selectedFiles.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}

          {submitImagesMutation.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to submit images: {submitImagesMutation.error.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <TaskResultsSection taskUuid={task.uuid} />
    </div>
  )
}
