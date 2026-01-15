import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/config/theme';

interface ILoginDividerProps {
  text?: string;
  style?: StyleProp<ViewStyle>;
}

export const LoginDivider: FC<ILoginDividerProps> = ({ text, style }) => {
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

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 16,
    color: theme.colors.textHint,
    fontWeight: '300',
  },
});
