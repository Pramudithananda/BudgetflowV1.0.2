import 'expo-router/entry';
import { AuthProvider } from './context/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppLayout from './app/_layout';
import SimpleLanguageSelector from './components/SimpleLanguageSelector';
import i18n from './utils/i18n';
import { StatusBar } from 'expo-status-bar'; //test
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { debugDatabase } from './services/sqliteService';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [languageReady, setLanguageReady] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('=== APP INITIALIZATION ===');
        
        // Initialize i18n first
        await i18n.init();
        console.log('Language initialized:', i18n.getCurrentLanguage());
        console.log('Test translation:', i18n.t('home'));
        
        // Check if first launch
        const isFirst = await i18n.isFirstLaunch();
        if (isFirst) {
          setShowLanguageSelector(true);
          setLanguageReady(true);
          return;
        }
        
        setLanguageReady(true);
        
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
        setLanguageReady(true);
        setDbReady(true);
      }
    };

    initializeApp();
  }, []);

  const handleLanguageSelected = async () => {
    setShowLanguageSelector(false);
    // Initialize database after language selection
    try {
      console.log('Initializing database after language selection...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dbTest = await debugDatabase();
      console.log('Database test result:', dbTest);
      setDbReady(true);
    } catch (error) {
      console.error('Database initialization error:', error);
      setDbReady(true);
    }
  };

  if (!languageReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#64a12d' }}>
        <ActivityIndicator size="large" color="#fff" />
        <View style={{ marginTop: 16 }}>
          <StatusBar style="light" />
        </View>
      </View>
    );
  }

  if (showLanguageSelector) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SimpleLanguageSelector onLanguageSelected={handleLanguageSelected} />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#64a12d' }}>
        <ActivityIndicator size="large" color="#fff" />
        <View style={{ marginTop: 16 }}>
          <StatusBar style="light" />
        </View>
      </View>
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
