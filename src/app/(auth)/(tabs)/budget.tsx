import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { Icon } from '@components/ui/Icon';

export default function BudgetScreen() {
  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon
            name="pie-chart-outline"
            color={theme.colors.primary}
            size={64}
          />
        </View>
        <Text category="h5" style={styles.title}>
          Coming Soon
        </Text>
        <Text category="p1" style={styles.subtitle}>
          Budget management is on its way.{'\n'}Stay tuned!
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    color: theme.colors.basic100,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textHint,
    textAlign: 'center',
    lineHeight: 22,
  },
});
