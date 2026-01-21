import React, { FC } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';

interface ISettingsHeaderProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export const SettingsHeader: FC<ISettingsHeaderProps> = ({
  name,
  email,
  imageUrl,
}) => {
  return (
    <View style={[styles.container, { paddingTop: 20 }]}>
      <Image
        source={
          imageUrl ? { uri: imageUrl } : require('@/assets/userPlaceholder.png')
        }
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text category="s1" style={styles.name}>
          {name}
        </Text>
        {email && (
          <Text category="p1" style={styles.email}>
            {email}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  textContainer: {
    alignItems: 'center',
    gap: 5,
  },
  name: {
    color: theme.colors.basic100,
    fontSize: 24,
  },
  email: {
    color: theme.colors.basic100,
    fontSize: 14,
  },
});
