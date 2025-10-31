/**
 * Login Screen
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppConfig } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGithub } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGithub();
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message || 'Failed to sign in with GitHub');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <ThemedText style={styles.logo}>🏠🔐</ThemedText>
            <ThemedText type="title" style={styles.title}>
              {AppConfig.appName}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {AppConfig.appSlogan}
            </ThemedText>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <ThemedText type="subtitle" style={styles.formTitle}>
              Welcome Back
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <Pressable onPress={() => router.push('/forgot-password')}>
              <ThemedText style={styles.forgotPassword}>
                Forgot Password?
              </ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </ThemedText>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>or</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={[styles.socialButton, styles.githubButton]}
              onPress={handleGithubLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.githubButtonText}>
                  ⚫ Continue with GitHub
                </ThemedText>
              )}
            </Pressable>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Don't have an account?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/signup')}>
                <ThemedText style={styles.link}>Sign Up</ThemedText>
              </Pressable>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'right',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.5,
  },
  socialButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  githubButton: {
    backgroundColor: '#24292e',
    borderColor: '#24292e',
  },
  githubButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
