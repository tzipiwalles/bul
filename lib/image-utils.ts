import imageCompression from 'browser-image-compression'

/**
 * Generic blur placeholder for images - a subtle gray gradient
 * This eliminates layout shifts while images load
 */
export const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDBAURAAYSIQcTMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFBv/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEBREh/9oADAMBAAIRAxEAPwCl8Y7xu1Xu67w3S51VZSQVskdNBNM7pFGGwFUE4A/ADWq6UpWlxjJuxk2MXHoggQo3hn//2Q=='

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
  quality?: number
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: 'image/webp',
  quality: 0.8,
}

/**
 * Compress and convert an image to WebP format
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image as a File object
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...defaultOptions, ...options }
  
  try {
    // Skip compression for very small files
    if (file.size < 50 * 1024) { // Less than 50KB
      return file
    }

    const compressedFile = await imageCompression(file, {
      maxSizeMB: mergedOptions.maxSizeMB!,
      maxWidthOrHeight: mergedOptions.maxWidthOrHeight!,
      useWebWorker: mergedOptions.useWebWorker!,
      fileType: mergedOptions.fileType,
      initialQuality: mergedOptions.quality,
    })

    // Create a new file with .webp extension
    const fileName = file.name.replace(/\.[^/.]+$/, '.webp')
    return new File([compressedFile], fileName, { type: 'image/webp' })
  } catch (error) {
    console.error('Image compression failed:', error)
    // Return original file if compression fails
    return file
  }
}

/**
 * Compress multiple images in parallel
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Array of compressed files
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file, options)))
}

/**
 * Generate a tiny blur placeholder for an image
 * @param file - The image file
 * @returns Base64 encoded tiny image for blur placeholder
 */
export async function generateBlurPlaceholder(file: File): Promise<string> {
  try {
    // Create a very small version for blur placeholder
    const tinyImage = await imageCompression(file, {
      maxSizeMB: 0.001,
      maxWidthOrHeight: 16,
      useWebWorker: true,
      initialQuality: 0.1,
    })

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(tinyImage)
    })
  } catch (error) {
    console.error('Failed to generate blur placeholder:', error)
    return ''
  }
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Check if a file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
