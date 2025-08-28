import 'expo-router/entry';
import { AuthProvider } from './context/auth';
import { LanguageProvider, useLanguage } from './context/language';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppLayout from './app/_layout';
import LanguageSelector from './components/LanguageSelector';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { debugDatabase } from './services/sqliteService';

function AppContent() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Get language context with fallback
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (err) {
    console.error('Language context error:', err);
    languageContext = {
      isFirstLaunch: false,
      completeFirstLaunch: () => {},
      isLanguageReady: true
    };
  }
  
  const { isFirstLaunch, completeFirstLaunch, isLanguageReady } = languageContext;

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('=== APP INITIALIZATION START ===');
        console.log('Language ready:', isLanguageReady);
        console.log('First launch:', isFirstLaunch);
        
        // Wait for database to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced to 1 second
        
        // Test database connection
        const dbTest = await debugDatabase();
        console.log('Database test result:', dbTest);
        
        setDbReady(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('App initialization error:', error);
        setError(error.message);
        setDbReady(true); // Still allow app to load
      }
    };

    if (isLanguageReady) {
      initializeApp();
    }
  }, [isLanguageReady]);

  // Show error if any
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff6b6b', padding: 20 }}>
        <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
          App Error
        </Text>
        <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
          {error}
        </Text>
        <StatusBar style="light" />
      </View>
    );
  }

  // Loading screen
  if (!isLanguageReady || !dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#64a12d' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>
          {!isLanguageReady ? 'Loading language...' : 'Loading database...'}
        </Text>
        <StatusBar style="light" />
      </View>
    );
  }

  // Show language selector on first launch
  if (isFirstLaunch) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LanguageSelector onLanguageSelected={completeFirstLaunch} />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Main app
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <AppLayout />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}