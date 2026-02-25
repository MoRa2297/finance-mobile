import React, { FC, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '@ui-kitten/components';

import { theme } from '@/config/theme';

interface IEntityImageProps {
  imageUrl?: string | null;
  fallbackText?: string | null;
  size?: number;
  borderRadius?: number;
}

export const EntityImage: FC<IEntityImageProps> = ({
  imageUrl,
  fallbackText,
  size = 40,
  borderRadius = size / 2,
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = fallbackText
    ? fallbackText
        .trim()
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase())
        .join('')
    : null;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius,
  };

  // Show image
  if (imageUrl && !imageError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, containerStyle]}
        onError={() => setImageError(true)}
      />
    );
  }

  // Show initials
  if (initials) {
    return (
      <View style={[styles.initialsContainer, containerStyle]}>
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
          {initials}
        </Text>
      </View>
    );
  }

  // Empty placeholder
  return <View style={[styles.placeholder, containerStyle]} />;
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
  },
  initialsContainer: {
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.basic100,
    fontWeight: '600',
  },
  placeholder: {
    backgroundColor: theme.colors.secondaryBK,
    borderWidth: 1,
    borderColor: theme.colors.textHint,
    borderStyle: 'dashed',
  },
});
