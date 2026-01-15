import { Stack } from 'expo-router';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SheetProvider } from 'react-native-actions-sheet';
import '@services/sheets.tsx';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <ActionSheetProvider
          useCustomActionSheet={true}
          useNativeDriver={false}>
          <SheetProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(unauth)" />
              <Stack.Screen name="(auth)" />
            </Stack>
          </SheetProvider>
        </ActionSheetProvider>
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}
