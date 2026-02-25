import React, { FC } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Category } from '@/types';

interface ICategoryListCardProps {
  category: Category;
  onPress: (category: Category) => void;
  onOptionsPress: (category: Category) => void;
}

export const CategoryListCard: FC<ICategoryListCardProps> = ({
  category,
  onPress,
  onOptionsPress,
}) => {
  const backgroundColor =
    category.categoryColor?.hexCode ?? theme.colors.textHint;
  const iconName = category.categoryIcon?.iconName ?? 'cube-outline';

  return (
    <Pressable style={styles.container} onPress={() => onPress(category)}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Icon name={iconName} color={theme.colors.basic100} size={28} />
      </View>

      <View style={styles.contentContainer}>
        <Text category="h6" style={styles.title}>
          {category.name}
        </Text>
      </View>

      <Pressable
        style={styles.optionsButton}
        onPress={() => onOptionsPress(category)}
        hitSlop={10}>
        <Icon
          name="more-horizontal-outline"
          color={theme.colors.basic100}
          size={28}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 15,
    backgroundColor: theme.colors.primaryBK,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: theme.colors.basic100,
  },
  optionsButton: {
    padding: 4,
  },
});
