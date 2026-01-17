import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar } from '@ui-kitten/components';

import { theme } from '@/config/theme';

interface ICustomAvatarProps {
  size: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  source?: string;
}

export const CustomAvatar: FC<ICustomAvatarProps> = ({ size, source }) => {
  return (
    <Avatar
      style={styles.container}
      source={
        source ? { uri: source } : require('@/assets/userPlaceholder.png')
      }
      shape="round"
      size={size}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
  },
});
