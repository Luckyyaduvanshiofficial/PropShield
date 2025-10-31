/**
 * Document Upload Screen
 * Allows users to upload property documents for verification
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/auth-context';
import { generateFilePath, uploadFile } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface SelectedDocument {
  name: string;
  uri: string;
  size: number;
  mimeType: string;
}

const DOCUMENT_TYPES = [
  { id: 'sale_deed', label: 'Sale Deed', icon: 'doc.text' },
  { id: 'encumbrance_certificate', label: 'Encumbrance Certificate', icon: 'shield.checkmark' },
  { id: 'property_tax', label: 'Property Tax Receipt', icon: 'dollarsign.circle' },
  { id: 'mutation_records', label: 'Mutation Records', icon: 'folder' },
  { id: 'approval_plans', label: 'Approval Plans', icon: 'building.2' },
  { id: 'title_deed', label: 'Title Deed', icon: 'doc.text.fill' },
  { id: 'other', label: 'Other Documents', icon: 'doc' },
];

export default function DocumentUploadScreen() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickDocument = async () => {
    if (!selectedType) {
      Alert.alert('Select Document Type', 'Please select a document type first');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/heic',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset) => ({
          name: asset.name,
          uri: asset.uri,
          size: asset.size || 0,
          mimeType: asset.mimeType || 'application/octet-stream',
        }));

        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload documents');
      return;
    }

    if (!selectedType) {
      Alert.alert('Error', 'Please select a document type');
      return;
    }

    if (selectedFiles.length === 0) {
      Alert.alert('Error', 'Please select at least one document');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Step 1: Create verification record
      const { data: verification, error: verificationError } = await supabase
        .from('verifications')
        .insert({
          user_id: user.id,
          property_address: 'Address to be updated',
          status: 'pending',
          fraud_score: 0,
          risk_rating: 'pending', // Valid values: pending, green, yellow, red
        })
        .select()
        .single();

      if (verificationError || !verification) {
        console.error('Verification creation error:', verificationError);
        throw new Error(
          `Failed to create verification record: ${verificationError?.message || 'Unknown error'}`
        );
      }

      // Step 2: Upload files
      const totalFiles = selectedFiles.length;
      const uploadedDocuments = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const progress = ((i + 1) / totalFiles) * 80; // Reserve 20% for database operations
        setUploadProgress(progress);

        // Generate unique file path
        const filePath = generateFilePath(user.id, file.name, verification.id);

        // Upload to Supabase Storage
        const uploadResult = await uploadFile({
          bucket: 'documents',
          path: filePath,
          file: {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          },
        });

        if (!uploadResult.success) {
          throw new Error(`Failed to upload ${file.name}: ${uploadResult.error}`);
        }

        // Step 3: Create document record in database
        const { data: document, error: documentError } = await supabase
          .from('documents')
          .insert({
            verification_id: verification.id,
            document_type: selectedType,
            file_name: file.name,
            file_url: uploadResult.url!,
            file_size: file.size,
            mime_type: file.mimeType,
            ocr_status: 'pending',
          })
          .select()
          .single();

        if (documentError) {
          throw new Error(`Failed to save document metadata: ${documentError.message}`);
        }

        uploadedDocuments.push(document);
      }

      setUploadProgress(100);

      // Success!
      Alert.alert(
        'Upload Complete',
        `Successfully uploaded ${selectedFiles.length} document(s). Verification process has started.`,
        [
          {
            text: 'View Status',
            onPress: () => router.push(`/verification-status?id=${verification.id}` as any),
          },
          {
            text: 'Upload More',
            onPress: () => {
              setSelectedFiles([]);
              setSelectedType(null);
              setUploadProgress(0);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        error instanceof Error ? error.message : 'An error occurred during upload'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Upload Documents</ThemedText>
          <ThemedText style={styles.subtitle}>
            Select document type and upload your property documents for verification
          </ThemedText>
        </View>

        {/* Document Type Selection */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Select Document Type
          </ThemedText>
          <View style={styles.typeGrid}>
            {DOCUMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
                disabled={uploading}
              >
                <IconSymbol
                  name={type.icon as any}
                  size={32}
                  color={selectedType === type.id ? '#007AFF' : '#666'}
                />
                <ThemedText
                  style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.typeLabelSelected,
                  ]}
                  numberOfLines={2}
                >
                  {type.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* File Selection */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Select Files
          </ThemedText>
          
          <TouchableOpacity
            style={[styles.pickButton, !selectedType && styles.pickButtonDisabled]}
            onPress={pickDocument}
            disabled={!selectedType || uploading}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="#fff" />
            <ThemedText style={styles.pickButtonText}>
              {selectedFiles.length > 0 ? 'Add More Files' : 'Pick Documents'}
            </ThemedText>
          </TouchableOpacity>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <View style={styles.filesList}>
              {selectedFiles.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <View style={styles.fileIcon}>
                    <IconSymbol name="doc.fill" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.fileInfo}>
                    <ThemedText style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </ThemedText>
                    <ThemedText style={styles.fileSize}>
                      {formatFileSize(file.size)}
                    </ThemedText>
                  </View>
                  {!uploading && (
                    <TouchableOpacity
                      onPress={() => removeFile(index)}
                      style={styles.removeButton}
                    >
                      <IconSymbol name="xmark.circle.fill" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Upload Progress */}
        {uploading && (
          <View style={styles.progressSection}>
            <ThemedText style={styles.progressText}>
              Uploading... {Math.round(uploadProgress)}%
            </ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
            </View>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (selectedFiles.length === 0 || uploading) && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol name="arrow.up.circle.fill" size={24} color="#fff" />
              <ThemedText style={styles.uploadButtonText}>
                Upload {selectedFiles.length} Document{selectedFiles.length !== 1 ? 's' : ''}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <IconSymbol name="info.circle" size={20} color="#007AFF" />
          <ThemedText style={styles.infoText}>
            Supported formats: PDF, JPG, PNG, HEIC, DOC, DOCX{'\n'}
            Maximum file size: 50MB per file
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    backgroundColor: '#E8F4FF',
    borderColor: '#007AFF',
  },
  typeLabel: {
    marginTop: 8,
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
  },
  typeLabelSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pickButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  pickButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filesList: {
    marginTop: 15,
    gap: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F4FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    opacity: 0.6,
  },
  removeButton: {
    padding: 4,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  uploadButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#007AFF',
    lineHeight: 18,
  },
});
