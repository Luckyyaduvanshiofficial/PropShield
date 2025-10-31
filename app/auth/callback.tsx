/**
 * OAuth Callback Handler
 * Handles the redirect from OAuth providers (GitHub, Google, etc.)
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // Give a moment for auth state to update
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText style={styles.text}>
        Completing sign in...
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
});
