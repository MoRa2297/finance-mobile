import React, { FunctionComponent } from 'react';
import { Category } from '@/types';
import { Layout, ListItem } from '@ui-kitten/components';
import { Icon } from '@components/ui/Icon';
import { theme } from '@config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@config/constants';
import { StyleSheet } from 'react-native';

type CategorySelectSheetListItemProps = {
  item: Category;
  onSelect: (item: Category) => void;
};

export const CategorySelectSheetListItem: FunctionComponent<
  CategorySelectSheetListItemProps
> = ({ item, onSelect }) => {
  return (
    <ListItem style={styles.container} onPress={() => onSelect(item)}>
      <Layout
        style={[
          styles.iconContainerIcons,
          { backgroundColor: item?.categoryColor.hexCode },
        ]}>
        {/*<Icon*/}
        {/*  name={item?.categoryIcon.iconName}*/}
        {/*  color={theme.colors.basic100}*/}
        {/*  size={28}*/}
        {/*  pack="ionicons"*/}
        {/*/>*/}
      </Layout>

      {/*<Text style={{ flex: 1 }}>{item.name}</Text>*/}
      <Layout style={styles.iconContainer}>
        {/*<Icon*/}
        {/*  name={'arrow-ios-forward-outline'}*/}
        {/*  color={theme.colors.textHint}*/}
        {/*  size={28}*/}
        {/*/>*/}
      </Layout>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: HORIZONTAL_PADDING / 2,
    backgroundColor: theme.colors.primaryBK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    fontSize: 17,
    backgroundColor: theme.colors.secondaryBK,
    paddingVertical: 10,
    color: theme.colors.textHint,
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
