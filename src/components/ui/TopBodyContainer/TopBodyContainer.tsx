import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '@/config/theme';

interface TopBodyContainerProps {
  children: React.ReactNode;
  height?: string | number;
  paddingTop?: number;
  style?: ViewStyle;
}
// TOD its duplicated
export const TopBodyContainer: React.FC<TopBodyContainerProps> = ({
  children,
  height = '30%',
  paddingTop = 0,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          height: height as any,
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
    backgroundColor: theme.colors.secondaryBK,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: 'space-evenly',
  },
});
