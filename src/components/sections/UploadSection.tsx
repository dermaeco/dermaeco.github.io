import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Upload, Camera, CheckCircle, X, Sun, Eye, Palette, Focus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkinAnalysis } from '@/hooks/useSkinAnalysis'
import { formatBytes } from '@/lib/utils'

interface UploadSectionProps {
  onUploadComplete: (imageUrl: string) => void
  onBack: () => void
}

export function UploadSection({ onUploadComplete, onBack }: UploadSectionProps) {
  const { t } = useTranslation()
  const { uploadImage, isUploading, uploadedImageUrl } = useSkinAnalysis()
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])
  
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })
  
  const handleUpload = async () => {
    if (!selectedFile) return
    
    try {
      const imageUrl = await uploadImage(selectedFile)
      onUploadComplete(imageUrl)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }
  
  const clearSelection = () => {
    setPreview(null)
    setSelectedFile(null)
  }
  
  const guidelines = [
    { icon: Sun, text: t('upload.guideline1') },
    { icon: Eye, text: t('upload.guideline2') },
    { icon: Palette, text: t('upload.guideline3') },
    { icon: Focus, text: t('upload.guideline4') }
  ]
  
  return (
    <section className="wabi-section">
      <div className="wabi-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-4">
              {t('upload.title')}
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t('upload.subtitle')}
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('upload.guidelines')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guidelines.map((guideline, index) => {
                    const Icon = guideline.icon
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-stone-700">{guideline.text}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  {!preview ? (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive ? 'border-black bg-gray-50' : 'border-stone-300 hover:border-black hover:bg-gray-50'
                      }`}
                    >
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                      <input {...getInputProps()} />
                      <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <p className="text-stone-700 font-medium mb-2">
                        {isDragActive ? 'Drop your photo here' : t('upload.drag')}
                      </p>
                        <p className="text-sm text-stone-500">
                          {t('upload.formats')}
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        onClick={clearSelection}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4 text-stone-600" />
                      </button>
                      {selectedFile && (
                        <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-3 py-1">
                          <p className="text-xs font-medium text-stone-700">{selectedFile.name}</p>
                          <p className="text-xs text-stone-500">{formatBytes(selectedFile.size)}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Error Messages */}
                {fileRejections.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    {fileRejections.map(({ file, errors }, index) => (
                      <div key={index}>
                        {errors.map(error => (
                          <p key={error.code} className="text-sm text-red-600">
                            {error.message}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                {preview && (
                  <div className="p-6 border-t border-stone-200">
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={onBack}
                        className="flex-1"
                      >
                        {t('common.back')}
                      </Button>
                      <Button
                        onClick={handleUpload}
                        loading={isUploading}
                        className="flex-1"
                      >
                        {isUploading ? t('upload.uploading') : t('common.continue')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
