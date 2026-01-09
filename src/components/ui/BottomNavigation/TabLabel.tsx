import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Text, TextProps } from '@ui-kitten/components';

import { theme } from '@/config/theme';

interface TabLabelProps {
  textProps?: TextProps;
  selected: boolean;
  labelText?: string;
}

export const TabLabel: React.FC<TabLabelProps> = ({
  textProps,
  selected,
  labelText,
}) => {
  const extraStyle: StyleProp<TextStyle> = {
    fontWeight: selected ? 'bold' : '300',
    color: selected ? theme.colors.basic100 : theme.colors.basic400,
  };

  return <Text style={[textProps?.style, extraStyle]}>{labelText}</Text>;
};
