/**
 * Verification Status Screen
 * Shows real-time progress of property verification
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  icon: string;
}

export default function VerificationStatusScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: '1',
      title: 'Document Upload',
      description: 'Documents received successfully',
      status: 'completed',
      icon: '📄',
    },
    {
      id: '2',
      title: 'OCR Processing',
      description: 'Extracting data from documents',
      status: 'processing',
      icon: '🤖',
    },
    {
      id: '3',
      title: 'Data Validation',
      description: 'Verifying with government records',
      status: 'pending',
      icon: '✅',
    },
    {
      id: '4',
      title: 'Fraud Analysis',
      description: 'Calculating risk score',
      status: 'pending',
      icon: '🔍',
    },
    {
      id: '5',
      title: 'Report Generation',
      description: 'Preparing final report',
      status: 'pending',
      icon: '📊',
    },
  ]);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate step completion
  useEffect(() => {
    if (progress > 20 && steps[1].status === 'processing') {
      updateStepStatus('2', 'completed');
      updateStepStatus('3', 'processing');
    }
    if (progress > 50 && steps[2].status === 'processing') {
      updateStepStatus('3', 'completed');
      updateStepStatus('4', 'processing');
    }
    if (progress > 75 && steps[3].status === 'processing') {
      updateStepStatus('4', 'completed');
      updateStepStatus('5', 'processing');
    }
    if (progress >= 100 && steps[4].status === 'processing') {
      updateStepStatus('5', 'completed');
    }
  }, [progress]);

  const updateStepStatus = (id: string, status: VerificationStep['status']) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, status } : step
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'processing': return '#007AFF';
      case 'failed': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'processing': return '⟳';
      case 'failed': return '✗';
      default: return '○';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Verification in Progress
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            This usually takes 15-30 minutes
          </ThemedText>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <ThemedText style={styles.progressText}>{progress}%</ThemedText>
            <ThemedText style={styles.progressLabel}>Complete</ThemedText>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* Verification Steps */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Verification Steps
        </ThemedText>

        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepCard}>
            <View 
              style={[
                styles.stepIndicator,
                { backgroundColor: getStatusColor(step.status) }
              ]}
            >
              <ThemedText style={styles.stepIndicatorText}>
                {step.status === 'processing' ? step.icon : getStatusIcon(step.status)}
              </ThemedText>
            </View>

            {index < steps.length - 1 && (
              <View style={[
                styles.stepConnector,
                step.status === 'completed' && styles.stepConnectorCompleted
              ]} />
            )}

            <View style={styles.stepContent}>
              <ThemedText style={styles.stepTitle}>{step.title}</ThemedText>
              <ThemedText style={styles.stepDescription}>{step.description}</ThemedText>
              {step.status === 'processing' && (
                <ThemedText style={styles.stepStatus}>Processing...</ThemedText>
              )}
              {step.status === 'completed' && (
                <ThemedText style={[styles.stepStatus, { color: '#34C759' }]}>Completed</ThemedText>
              )}
            </View>
          </View>
        ))}

        {/* Estimated Time */}
        <View style={styles.infoCard}>
          <ThemedText style={styles.infoIcon}>⏱️</ThemedText>
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoTitle}>Estimated Time</ThemedText>
            <ThemedText style={styles.infoText}>
              {progress < 100 ? `${Math.ceil((100 - progress) / 2)} minutes remaining` : 'Completed!'}
            </ThemedText>
          </View>
        </View>

        {/* Actions */}
        {progress >= 100 ? (
          <Pressable style={styles.primaryButton} onPress={() => router.push('/modal')}>
            <ThemedText style={styles.primaryButtonText}>
              View Report
            </ThemedText>
          </Pressable>
        ) : (
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <ThemedText style={styles.secondaryButtonText}>
              Continue in Background
            </ThemedText>
          </Pressable>
        )}

        <View style={styles.notificationNote}>
          <ThemedText style={styles.notificationText}>
            🔔 We'll notify you when verification is complete
          </ThemedText>
        </View>
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#007AFF',
  },
  progressText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  stepIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepIndicatorText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  stepConnector: {
    position: 'absolute',
    left: 23,
    top: 48,
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
  },
  stepConnectorCompleted: {
    backgroundColor: '#34C759',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  stepStatus: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationNote: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  notificationText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
});
