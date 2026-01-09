import React from 'react';
import { View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/config/theme';

import { LoginDividerProps } from './LoginDivider.types';
import { styles } from './LoginDivider.styles';

export const LoginDivider: React.FC<LoginDividerProps> = ({ text, style }) => {
  if (!text) {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={[theme.colors.primaryBK, theme.colors.textHint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.line}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[theme.colors.primaryBK, theme.colors.textHint]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
      <Text category="s1" style={styles.text}>
        {text}
      </Text>
      <LinearGradient
        colors={[theme.colors.textHint, theme.colors.primaryBK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
    </View>
  );
};
