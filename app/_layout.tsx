import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import EntryAnimation from '@/components/EntryAnimation';

export default function RootLayout() {
  useFrameworkReady();
  const [showEntry, setShowEntry] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showEntry && <EntryAnimation onFinish={() => setShowEntry(false)} />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
