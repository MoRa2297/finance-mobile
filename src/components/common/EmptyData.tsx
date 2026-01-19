import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';

interface EmptyDataProps {
  title: string;
  subtitle?: string;
}

export const EmptyData: React.FC<EmptyDataProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text category="h6" style={styles.title}>
        {title}
      </Text>

      {subtitle && (
        <Text category="c2" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent,
  },
  title: {
    maxWidth: '70%',
    textAlign: 'center',
    color: theme.colors.textHint,
  },
  subtitle: {
    maxWidth: '65%',
    textAlign: 'center',
    marginVertical: 10,
    color: theme.colors.textHint,
  },
});
