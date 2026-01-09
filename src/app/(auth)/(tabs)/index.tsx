import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import { ScreenContainer } from '@/components/ui';
import { theme } from '@/config/theme';

export default function HomeScreen() {
  return (
    <ScreenContainer centered>
      <Text category="h1" style={styles.title}>
        Home
      </Text>
      <Text category="p1" appearance="hint">
        Benvenuto nell'app!
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
});
