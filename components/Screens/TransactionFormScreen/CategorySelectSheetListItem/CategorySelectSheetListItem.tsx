import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../../../../config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { Text, Layout, ListItem } from '@ui-kitten/components';
import { Icon } from '../../../UI/Icon/Icon';
import { Category } from '../../../../types/types';

type CategorySelectSheetListItemProps = {
  item: Category;
  onSelect: (item: Category) => void;
};

export const CategorySelectSheetListItem: React.FunctionComponent<
  CategorySelectSheetListItemProps
> = ({ item, onSelect }) => {
  return (
    <ListItem style={styles.container} onPress={() => onSelect(item)}>
      <Layout
        style={[
          styles.iconContainerIcons,
          { backgroundColor: item?.categoryColor.hexCode },
        ]}>
        <Icon
          name={item?.categoryIcon.iconName}
          color={theme['color-basic-100']}
          size={28}
          pack="ionicons"
        />
      </Layout>

      <Text style={{ flex: 1 }}>{item.name}</Text>
      <Layout style={styles.iconContainer}>
        <Icon
          name={'arrow-ios-forward-outline'}
          color={theme['text-hint-color']}
          size={28}
        />
      </Layout>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: HORIZONTAL_PADDING / 2,
    backgroundColor: theme['color-primary-BK'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    fontSize: 17,
    backgroundColor: theme['color-secondary-BK'],
    paddingVertical: 10,
    color: theme['text-hint-color'],
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    resizeMode: 'contain',
  },
  iconContainer: {
    flex: 0.16,
    alignItems: 'center',
  },
  iconContainerIcons: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
