/**
 * Document Upload Screen
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DocumentTypes } from '@/constants/config';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
}

export default function UploadDocumentScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const documentTypeOptions = [
    { value: DocumentTypes.SALE_DEED, label: '📄 Sale Deed', description: 'Property sale agreement' },
    { value: DocumentTypes.EC, label: '📋 EC Certificate', description: 'Encumbrance Certificate' },
    { value: DocumentTypes.MUTATION, label: '🔄 Mutation', description: 'Property ownership transfer' },
    { value: DocumentTypes.TAX_RECEIPT, label: '💰 Tax Receipt', description: 'Property tax payment' },
    { value: DocumentTypes.PROPERTY_CARD, label: '🏠 Property Card', description: 'Municipal property record' },
    { value: DocumentTypes.APPROVAL_PLAN, label: '✅ Approval Plan', description: 'Building approval' },
  ];

  const handlePickDocument = async () => {
    if (!selectedType) {
      Alert.alert('Select Document Type', 'Please select a document type first');
      return;
    }

    // Mock file picker - replace with expo-document-picker
    const mockDoc: UploadedDocument = {
      id: Date.now().toString(),
      name: `document_${documents.length + 1}.pdf`,
      type: selectedType,
      size: Math.floor(Math.random() * 5000000),
    };

    setDocuments([...documents, mockDoc]);
    Alert.alert('Success', 'Document added successfully!');
  };

  const handleCameraCapture = async () => {
    if (!selectedType) {
      Alert.alert('Select Document Type', 'Please select a document type first');
      return;
    }

    Alert.alert('Camera', 'Camera integration coming soon with development build');
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleStartVerification = () => {
    if (documents.length === 0) {
      Alert.alert('No Documents', 'Please upload at least one document');
      return;
    }

    Alert.alert(
      'Start Verification',
      `You are about to verify ${documents.length} document(s). This will cost ₹499.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // Navigate to verification status screen
            Alert.alert('Success', 'Verification started!', [
              { text: 'OK', onPress: () => router.push('/verification-status') }
            ]);
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText>← Back</ThemedText>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            Upload Documents
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Upload your property documents for verification
          </ThemedText>
        </View>

        {/* Document Type Selection */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Select Document Type
        </ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          {documentTypeOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.typeCard,
                selectedType === option.value && styles.typeCardSelected
              ]}
              onPress={() => setSelectedType(option.value)}
            >
              <ThemedText style={styles.typeLabel}>{option.label}</ThemedText>
              <ThemedText style={styles.typeDescription}>{option.description}</ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Upload Buttons */}
        <View style={styles.uploadButtons}>
          <Pressable
            style={[styles.uploadButton, !selectedType && styles.uploadButtonDisabled]}
            onPress={handlePickDocument}
            disabled={!selectedType}
          >
            <ThemedText style={styles.uploadButtonIcon}>📁</ThemedText>
            <ThemedText style={styles.uploadButtonText}>Choose File</ThemedText>
          </Pressable>

          <Pressable
            style={[styles.uploadButton, !selectedType && styles.uploadButtonDisabled]}
            onPress={handleCameraCapture}
            disabled={!selectedType}
          >
            <ThemedText style={styles.uploadButtonIcon}>📸</ThemedText>
            <ThemedText style={styles.uploadButtonText}>Scan Document</ThemedText>
          </Pressable>
        </View>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Uploaded Documents ({documents.length})
            </ThemedText>

            {documents.map((doc) => (
              <View key={doc.id} style={styles.documentCard}>
                <View style={styles.documentInfo}>
                  <ThemedText style={styles.documentIcon}>📄</ThemedText>
                  <View style={styles.documentDetails}>
                    <ThemedText style={styles.documentName}>{doc.name}</ThemedText>
                    <ThemedText style={styles.documentMeta}>
                      {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </ThemedText>
                  </View>
                </View>
                <Pressable onPress={() => handleRemoveDocument(doc.id)}>
                  <ThemedText style={styles.removeButton}>🗑️</ThemedText>
                </Pressable>
              </View>
            ))}
          </>
        )}

        {/* Start Verification Button */}
        {documents.length > 0 && (
          <Pressable style={styles.verifyButton} onPress={handleStartVerification}>
            <ThemedText style={styles.verifyButtonText}>
              Start Verification (₹499)
            </ThemedText>
          </Pressable>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>📤</ThemedText>
            <ThemedText style={styles.emptyText}>No documents uploaded yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Select a document type and upload your files
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  typeScroll: {
    marginBottom: 24,
  },
  typeCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 160,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    opacity: 0.6,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  documentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  removeButton: {
    fontSize: 24,
  },
  verifyButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
