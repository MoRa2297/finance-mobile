import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar } from '@ui-kitten/components';

import { theme } from '@/config/theme';

interface CustomAvatarProps {
  size: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  source?: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({ size, source }) => {
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
