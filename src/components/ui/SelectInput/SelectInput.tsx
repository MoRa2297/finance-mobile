import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';

interface SelectInputProps {
  placeholder: string;
  value?: string;
  iconName?: string;
  iconNameRight?: string;
  selectedImageUrl?: string;
  selectedBorderColor?: string;
  valueBordered?: boolean;
  onPress: () => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  placeholder,
  value,
  iconName,
  iconNameRight = 'arrow-ios-forward-outline',
  selectedImageUrl,
  selectedBorderColor,
  valueBordered = false,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Left Icon */}
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={24} />
        </View>
      )}

      {/* Content */}
      <View style={styles.contentContainer}>
        {value ? (
          <View style={styles.valueContainer}>
            {selectedImageUrl && (
              <View
                style={[
                  styles.imageContainer,
                  selectedBorderColor && {
                    borderColor: selectedBorderColor,
                    borderWidth: 1,
                  },
                ]}>
                <Image
                  source={{ uri: selectedImageUrl }}
                  style={styles.image}
                />
              </View>
            )}
            <Text
              category="s1"
              style={[styles.value, valueBordered && styles.valueBordered]}>
              {value}
            </Text>
          </View>
        ) : (
          <Text category="s1" style={styles.placeholder}>
            {placeholder}
          </Text>
        )}
      </View>

      {/* Right Icon */}
      <View style={styles.iconRightContainer}>
        <Icon name={iconNameRight} color={theme.colors.textHint} size={24} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: theme.colors.transparent,
    borderBottomWidth: 0.7,
    borderBottomColor: theme.colors.textHint,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  value: {
    color: theme.colors.basic100,
    fontWeight: '500',
  },
  valueBordered: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    backgroundColor: theme.colors.secondaryBK,
  },
  placeholder: {
    color: theme.colors.textHint,
    fontWeight: '500',
  },
  iconRightContainer: {
    paddingLeft: 10,
  },
});
