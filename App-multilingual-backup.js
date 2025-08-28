import 'expo-router/entry';
import { AuthProvider } from './context/auth';
import { LanguageProvider, useLanguage } from './context/language';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppLayout from './app/_layout';
import LanguageSelector from './components/LanguageSelector';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { debugDatabase } from './services/sqliteService';

function AppContent() {
  const [dbReady, setDbReady] = useState(false);
  const { isFirstLaunch, completeFirstLaunch, isLanguageReady } = useLanguage();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('=== APP INITIALIZATION ===');
        console.log('Initializing database...');
        
        // Wait for database to be fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test database connection
        const dbTest = await debugDatabase();
        console.log('Database test result:', dbTest);
        
        setDbReady(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('App initialization error:', error);
        setDbReady(true);
      }
    };

    if (isLanguageReady) {
      initializeApp();
    }
  }, [isLanguageReady]);

  if (!isLanguageReady || !dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#64a12d' }}>
        <ActivityIndicator size="large" color="#fff" />
        <View style={{ marginTop: 16 }}>
          <StatusBar style="light" />
        </View>
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