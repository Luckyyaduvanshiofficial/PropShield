import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Custom storage adapter for Supabase using SecureStore on native and AsyncStorage on web
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Only use AsyncStorage if we're in a browser environment
      if (!isBrowser) {
        return Promise.resolve(null);
      }
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      // Only use AsyncStorage if we're in a browser environment
      if (!isBrowser) {
        return Promise.resolve();
      }
      return AsyncStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Only use AsyncStorage if we're in a browser environment
      if (!isBrowser) {
        return Promise.resolve();
      }
      return AsyncStorage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Initialize Supabase client with generated types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: isBrowser && Platform.OS === 'web', // Only persist on web in browser
    detectSessionInUrl: false,
    flowType: 'pkce', // Use PKCE flow for better security
  },
});
