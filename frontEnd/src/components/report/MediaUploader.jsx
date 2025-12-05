import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import imageCompression from 'browser-image-compression'
import './MediaUploader.css'

const MAX_IMAGES = 3
const MAX_VIDEOS = 1
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

export default function MediaUploader({ media = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const images = media.filter((m) => m.type === 'image')
  const videos = media.filter((m) => m.type === 'video')

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      return await imageCompression(file, options)
    } catch (error) {
      console.error('Image compression failed:', error)
      return file
    }
  }

  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    setUploading(true)
    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          if (file.size > MAX_IMAGE_SIZE) {
            throw new Error(`Image ${file.name} is too large (max 5MB)`)
          }
          const compressed = await compressImage(file)
          const dataUrl = await fileToDataURL(compressed)
          return {
            type: 'image',
            url: dataUrl,
            thumb: dataUrl,
            name: file.name,
          }
        })
      )
      onChange([...media, ...newImages])
    } catch (error) {
      alert(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (videos.length + files.length > MAX_VIDEOS) {
      alert(`Maximum ${MAX_VIDEOS} video allowed`)
      return
    }

    setUploading(true)
    try {
      const newVideos = await Promise.all(
        files.map(async (file) => {
          if (file.size > MAX_VIDEO_SIZE) {
            throw new Error(`Video ${file.name} is too large (max 50MB)`)
          }
          const dataUrl = await fileToDataURL(file)
          return {
            type: 'video',
            url: dataUrl,
            thumb: dataUrl,
            name: file.name,
          }
        })
      )
      onChange([...media, ...newVideos])
    } catch (error) {
      alert(error.message || 'Failed to upload video')
    } finally {
      setUploading(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const removeMedia = (index) => {
    onChange(media.filter((_, i) => i !== index))
  }

  return (
    <div className="media-uploader">
      <div className="media-preview">
        {media.map((item, index) => (
          <motion.div
            key={index}
            className="media-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {item.type === 'image' ? (
              <img src={item.thumb || item.url} alt={`Upload ${index + 1}`} />
            ) : (
              <video src={item.url} controls />
            )}
            <button
              className="media-remove"
              onClick={() => removeMedia(index)}
              aria-label="Remove"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>

      <div className="media-upload-buttons">
        {images.length < MAX_IMAGES && (
          <label className="upload-button">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading ? 'Uploading...' : `📷 Add Images (${images.length}/${MAX_IMAGES})`}
          </label>
        )}
        {videos.length < MAX_VIDEOS && (
          <label className="upload-button">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading ? 'Uploading...' : `🎥 Add Video (${videos.length}/${MAX_VIDEOS})`}
          </label>
        )}
      </div>
    </div>
  )
}

