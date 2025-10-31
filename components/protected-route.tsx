/**
 * Protected Route Component
 * Wraps screens that require authentication
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSegments } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'upload-document' || segments[0] === 'verification-status';

    if (!user && inAuthGroup) {
      // Redirect to login if trying to access protected route
      router.replace('/login');
    } else if (user && (segments[0] === 'login' || segments[0] === 'signup')) {
      // Redirect to home if already logged in
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.text}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
});
