import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SheetProvider } from 'react-native-actions-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { customMapping } from '@config/customMapping';
import '@/services/sheets';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...customMapping }}>
          <ActionSheetProvider useCustomActionSheet useNativeDriver={false}>
            <SheetProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(unauth)" />
                <Stack.Screen name="(auth)" />
              </Stack>
            </SheetProvider>
          </ActionSheetProvider>
        </ApplicationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
