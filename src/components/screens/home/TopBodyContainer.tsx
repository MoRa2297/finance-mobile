import React from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '@/config/theme';

interface TopBodyContainerProps {
  children: React.ReactNode;
  height: DimensionValue;
  paddingTop?: number;
  style?: ViewStyle;
}

export const TopBodyContainer: React.FC<TopBodyContainerProps> = ({
  children,
  height,
  paddingTop = 0,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          minHeight: height,
          paddingTop,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    backgroundColor: theme.colors.primaryBK,
    width: '100%',
  },
});
