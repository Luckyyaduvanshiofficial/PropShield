import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import type { Database } from './database.types';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// No-op storage for SSR
const NoOpStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

// Custom storage adapter for Supabase
const createStorageAdapter = () => {
  // For native platforms, always use SecureStore
  if (Platform.OS !== 'web') {
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  }

  // For web during SSR, use no-op storage
  if (!isBrowser) {
    return NoOpStorage;
  }

  // For web in browser, use AsyncStorage
  // Import dynamically to avoid SSR issues
  try {
    // This will only execute in browser
    // @ts-ignore - Dynamic import for browser only
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AsyncStorageModule = require('@react-native-async-storage/async-storage');
    const AsyncStorage = AsyncStorageModule.default || AsyncStorageModule;
    
    return {
      getItem: (key: string) => AsyncStorage.getItem(key),
      setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
      removeItem: (key: string) => AsyncStorage.removeItem(key),
    };
  } catch {
    console.warn('AsyncStorage not available, using no-op storage');
    return NoOpStorage;
  }
};

// Initialize Supabase client with generated types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter() as any,
    autoRefreshToken: true,
    persistSession: isBrowser && Platform.OS === 'web', // Only persist on web in browser
    detectSessionInUrl: false,
    flowType: 'pkce', // Use PKCE flow for better security
  },
});
