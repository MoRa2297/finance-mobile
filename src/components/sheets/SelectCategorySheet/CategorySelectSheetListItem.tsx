import React, { FunctionComponent } from 'react';
import { Category } from '@/types';
import { Text } from '@ui-kitten/components';
import { Icon } from '@components/ui/Icon';
import { theme } from '@config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@config/constants';
import { Pressable, StyleSheet, View } from 'react-native';

type CategorySelectSheetListItemProps = {
  item: Category;
  onSelect: (item: Category) => void;
};

export const CategorySelectSheetListItem: FunctionComponent<
  CategorySelectSheetListItemProps
> = ({ item, onSelect }) => {
  return (
    <Pressable style={styles.itemContainer} onPress={() => onSelect(item)}>
      <View style={styles.imagePlaceholder}>
        <Icon
          name={item?.categoryIcon.iconName}
          color={theme.colors.basic100}
          size={24}
        />
      </View>

      <Text category="s1" style={styles.itemText}>
        {item.name}
      </Text>
      <Icon
        name="arrow-ios-forward-outline"
        color={theme.colors.textHint}
        size={24}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
  },
});
