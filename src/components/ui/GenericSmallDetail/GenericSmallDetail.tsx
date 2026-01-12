import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';

interface GenericSmallDetailProps {
  title: string;
  value?: string | number;
  valueColor?: string;
  iconName?: string;
  imageUrl?: string;
}

export const GenericSmallDetail: React.FC<GenericSmallDetailProps> = ({
  title,
  value,
  valueColor = theme.colors.basic100,
  iconName,
  imageUrl,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon or Image */}
      <View style={styles.iconContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : iconName ? (
          <Icon name={iconName} color={theme.colors.basic100} size={24} />
        ) : null}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text category="c1" style={styles.title}>
          {title}
        </Text>
        <Text category="s1" style={[styles.value, { color: valueColor }]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.transparent,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.textHint,
  },
  value: {
    fontWeight: '500',
  },
});
