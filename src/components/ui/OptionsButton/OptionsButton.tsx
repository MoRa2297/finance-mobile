import React, { FC } from 'react';
import { Pressable } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';

interface IOptionsButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  iconName?: string;
}

export const OptionsButton: FC<IOptionsButtonProps> = ({
  onPress,
  size = 28,
  color = theme.colors.basic100,
  iconName = 'more-horizontal-outline',
}) => (
  <Pressable onPress={onPress} hitSlop={10}>
    <Icon name={iconName} color={color} size={size} />
  </Pressable>
);
