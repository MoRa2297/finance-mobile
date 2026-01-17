import React, { FC } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '@/config/theme';

interface ITopRoundedContainerProps {
  children: React.ReactNode;
  height?: DimensionValue;
  paddingTop?: number;
  style?: ViewStyle;
}

export const TopRoundedContainer: FC<ITopRoundedContainerProps> = ({
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
    justifyContent: 'space-evenly',
  },
});
