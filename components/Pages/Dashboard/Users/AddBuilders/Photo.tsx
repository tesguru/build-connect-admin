
import FileUploadComponent from '@/components/ui/Forms/FileUploadComponent'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { uploadFile } from '@/libs/utils/fileUpload'
import { Spinner } from '@/components/ui/Custom/LoadingState'

const Photo = () => {
  const { setValue, watch } = useFormContext()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' })
  
  const profilePhoto = watch('profilePhoto')
  const [uploadedUrl, setUploadedUrl] = useState<string>('')

  const handleFileSelected = async (file: any) => {
    if (!file) return;

    setUploadStatus({ type: 'info', message: 'Starting upload...' })

    try {
      setIsUploading(true)
      
      const result = await uploadFile(file, 'profile_photo', 'Client Profile Photo')
      
      if (result.success) {
        setUploadedUrl(result.publicUrl || '')
        
        setValue('profilePhoto', {
          ...file,
          fileId: result.fileId,
          publicUrl: result.publicUrl,
          uploadedAt: new Date().toISOString()
        }, { shouldValidate: true })

        setUploadStatus({ 
          type: 'success', 
          message: 'Profile photo uploaded successfully!' 
        })
      }
    } catch (error: any) {
      console.error('Upload failed:', error)
      setUploadStatus({ 
        type: 'error', 
        message: error.message || "Failed to upload photo. Please try again." 
      })
      setValue('profilePhoto', null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileError = (error: string) => {
    setUploadStatus({ type: 'error', message: error })
  }

  const clearStatus = () => {
    setUploadStatus({ type: null, message: '' })
  }

  const getStatusStyles = (type: string) => {
    const styles = {
      success: 'bg-green-50 border-green-200 text-green-700',
      error: 'bg-red-50 border-red-200 text-red-700',
      info: 'bg-blue-50 border-blue-200 text-blue-700',
    }
    return styles[type as keyof typeof styles] || styles.info
  }

  const getStatusIcon = (type: string) => {
    const icons = {
      success: (
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      info: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return icons[type as keyof typeof icons] || icons.info
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Photo</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a clear photo for identification purposes. PNG, JPG (max. 5MB)
        </p>
      </div>
      
      <FileUploadComponent
        name="profilePhoto"
        label="Profile Photo"
        title="Upload Profile Photo"
        note="PNG, JPG (max. 5MB)"
        maxSizeMB={5}
        onFileSelected={handleFileSelected}
        onError={handleFileError}
        disabled={isUploading}
      />

      {/* Upload status */}
      {isUploading && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 flex items-center">
            <Spinner className="h-4 w-4 mr-3 shrink-0" />
            Uploading photo...
          </p>
        </div>
      )}

      {/* Status Message */}
      {uploadStatus.type && (
        <div className={`p-3 border rounded-lg ${getStatusStyles(uploadStatus.type)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(uploadStatus.type)}
              <p className="text-sm">
                {uploadStatus.message}
              </p>
            </div>
            <button
              onClick={clearStatus}
              className="hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Preview of uploaded photo */}
      {profilePhoto && !isUploading && uploadStatus.type !== 'error' && (
        <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50">
          <h4 className="text-sm font-medium text-green-800 mb-2">Photo Uploaded Successfully</h4>
          <div className="flex items-center space-x-4">
            <img 
              src={profilePhoto.uri} 
              alt="Profile preview" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">{profilePhoto.name}</p>
              <p className="text-xs text-green-600">
                {(profilePhoto.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {uploadedUrl && (
                <p className="text-xs text-green-500 mt-1">
                  ✅ Successfully uploaded to cloud storage
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Photo