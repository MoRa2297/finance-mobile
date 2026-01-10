import React from 'react';
import { Text } from '@ui-kitten/components';

import { ScreenContainer } from '@/components/ui';

export default function SettingsScreen() {
  return (
    <ScreenContainer centered>
      <Text category="h1">Impostazioni</Text>
      <Text category="p1" appearance="hint">
        Configura l'app
      </Text>
    </ScreenContainer>
  );
}
