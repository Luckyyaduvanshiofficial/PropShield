import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppConfig } from '@/constants/config';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {AppConfig.appName}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {AppConfig.appSlogan}
          </ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable 
            style={styles.ctaCard}
            onPress={() => router.push('/upload' as any)}
          >
            <View style={styles.ctaIcon}>
              <ThemedText style={styles.ctaIconText}>📄</ThemedText>
            </View>
            <ThemedText type="subtitle" style={styles.ctaTitle}>
              Upload Property Documents
            </ThemedText>
            <ThemedText style={styles.ctaDescription}>
              Start verifying your property in just a few clicks
            </ThemedText>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable 
              style={styles.actionCard}
              onPress={() => router.push('/verification-status')}
            >
              <ThemedText style={styles.actionIcon}>⏱️</ThemedText>
              <ThemedText style={styles.actionText}>View Status</ThemedText>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => router.push('/login')}
            >
              <ThemedText style={styles.actionIcon}>👤</ThemedText>
              <ThemedText style={styles.actionText}>Login</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Features Grid */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          How It Works
        </ThemedText>
        
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>📸</ThemedText>
            <ThemedText style={styles.featureTitle}>1. Scan Documents</ThemedText>
            <ThemedText style={styles.featureText}>
              Upload or scan your property documents
            </ThemedText>
          </View>

          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>🤖</ThemedText>
            <ThemedText style={styles.featureTitle}>2. AI Analysis</ThemedText>
            <ThemedText style={styles.featureText}>
              Our AI extracts and verifies data
            </ThemedText>
          </View>

          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>✅</ThemedText>
            <ThemedText style={styles.featureTitle}>3. Get Report</ThemedText>
            <ThemedText style={styles.featureText}>
              Receive detailed verification report
            </ThemedText>
          </View>

          <View style={styles.featureCard}>
            <ThemedText style={styles.featureIcon}>⚖️</ThemedText>
            <ThemedText style={styles.featureTitle}>4. Legal Review</ThemedText>
            <ThemedText style={styles.featureText}>
              Optional lawyer consultation
            </ThemedText>
          </View>
        </View>

        {/* Recent Verifications (Empty State) */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Verifications
        </ThemedText>
        
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyIcon}>📋</ThemedText>
          <ThemedText style={styles.emptyText}>
            No verifications yet
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Upload your first document to get started
          </ThemedText>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>24hr</ThemedText>
            <ThemedText style={styles.statLabel}>Avg. Turnaround</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>95%</ThemedText>
            <ThemedText style={styles.statLabel}>Accuracy Rate</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>5K+</ThemedText>
            <ThemedText style={styles.statLabel}>Verifications</ThemedText>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            🔐 Secure • 🚀 Fast • ✅ Reliable
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  quickActions: {
    marginBottom: 32,
  },
  ctaCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ctaIcon: {
    marginBottom: 12,
  },
  ctaIconText: {
    fontSize: 48,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
