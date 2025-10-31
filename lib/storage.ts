/**
 * Supabase Storage Helper Functions
 * Handles file uploads, downloads, and deletions for PropShield
 * 
 * Compatible with Expo SDK 54+:
 * - Web: Uses Blob/ArrayBuffer
 * - React Native: Passes file object directly (Supabase handles FormData internally)
 * - No deprecated FileSystem methods
 */

import { supabase } from './supabase';

export interface UploadOptions {
  bucket: 'documents' | 'reports' | 'avatars';
  path: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 * @param options Upload configuration
 * @returns Upload result with URL
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { bucket, path, file, onProgress } = options;

  try {
    // Sanitize MIME type to handle malformed types from document picker
    // Pass filename as fallback to extract extension
    const cleanMimeType = sanitizeMimeType(file.type, file.name);
    console.log(`Upload: Original type: ${file.type}, Clean type: ${cleanMimeType}, File: ${file.name}`);
    
    // Start upload
    if (onProgress) onProgress(0);

    // Convert file URI to ArrayBuffer (official Supabase React Native approach)
    // This works for both Web and React Native
    const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());

    // Upload the ArrayBuffer with explicit contentType
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, arraybuffer, {
        contentType: cleanMimeType, // Use sanitized MIME type
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    if (onProgress) onProgress(100);

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket Bucket name
 * @param path File path
 * @returns Success status
 */
export async function deleteFile(
  bucket: 'documents' | 'reports' | 'avatars',
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Get download URL for a file
 * @param bucket Bucket name
 * @param path File path
 * @param expiresIn URL expiry time in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getDownloadUrl(
  bucket: 'documents' | 'reports' | 'avatars',
  path: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Get URL error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error('Get URL exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get URL',
    };
  }
}

/**
 * List files in a folder
 * @param bucket Bucket name
 * @param folder Folder path
 * @returns List of files
 */
export async function listFiles(
  bucket: 'documents' | 'reports' | 'avatars',
  folder: string
) {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error('List files error:', error);
      return { success: false, error: error.message, files: [] };
    }

    return { success: true, files: data };
  } catch (error) {
    console.error('List files exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
      files: [],
    };
  }
}

/**
 * Generate a unique file path for uploads
 * @param userId User ID
 * @param fileName Original file name
 * @param prefix Optional prefix (e.g., verification ID)
 * @returns Unique file path
 */
export function generateFilePath(
  userId: string,
  fileName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (prefix) {
    return `${userId}/${prefix}/${timestamp}_${randomString}_${sanitizedFileName}`;
  }
  
  return `${userId}/${timestamp}_${randomString}_${sanitizedFileName}`;
}

/**
 * Sanitize MIME type to ensure it's a single valid MIME type
 * @param mimeType Original MIME type (might be comma-separated or malformed)
 * @param fileName Optional file name to extract extension from
 * @returns Clean MIME type
 */
export function sanitizeMimeType(mimeType: string | undefined | null, fileName?: string): string {
  // MIME type mapping for common file types
  const mimeMap: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'heic': 'image/heic',
    'heif': 'image/heif',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain',
  };
  
  // If mimeType is empty or invalid, try to get it from filename
  if (!mimeType || mimeType.includes(',') || mimeType.includes('json')) {
    if (fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext && mimeMap[ext]) {
        console.log(`Using MIME type from filename: ${fileName} -> ${mimeMap[ext]}`);
        return mimeMap[ext];
      }
    }
  }
  
  // If mimeType exists and looks valid, clean it
  if (mimeType) {
    // Remove any extra text after comma or semicolon
    let cleanType = mimeType.split(',')[0].split(';')[0].trim();
    
    // If it's a valid MIME type (contains '/'), return it
    if (cleanType.includes('/') && !cleanType.includes('json')) {
      return cleanType;
    }
    
    // Try to map from extension if mimeType looks like an extension
    if (mimeMap[cleanType.toLowerCase()]) {
      return mimeMap[cleanType.toLowerCase()];
    }
  }
  
  // Fallback: try to get from filename
  if (fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext && mimeMap[ext]) {
      console.log(`Fallback: Using MIME type from filename: ${fileName} -> ${mimeMap[ext]}`);
      return mimeMap[ext];
    }
  }
  
  // Last resort
  return 'application/octet-stream';
}
