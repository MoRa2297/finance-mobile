import { Button, Layout, ListItem, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { theme } from '../../../../config/theme';
import { Icon } from '../../../UI/Icon/Icon';
import { Category } from '../../../../types/types';

interface CategoryListCardProps {
  category: Category;
  onOpenModify: (category: any) => void;
  onOpenDetail: (category: any) => void;
}

export const CategoryListCard: React.FunctionComponent<
  CategoryListCardProps
> = ({ category, onOpenModify, onOpenDetail }) => {
  const renderAccessoryLeft = (): React.ReactElement => (
    <Layout
      style={[
        styles.iconLeftContainer,
        { backgroundColor: category.categoryColor.hexCode },
      ]}>
      <Icon
        name={category.categoryIcon.iconName}
        color={theme['color-basic-100']}
        size={28}
        pack="ionicons"
      />
    </Layout>
  );

  const renderAccessoryRight = (): React.ReactElement => (
    <Button
      style={styles.settingsIconContainer}
      appearance="ghost"
      activeOpacity={0.9}
      focusable={false}
      onPress={() => onOpenModify(category)}>
      <Icon
        name="more-horizontal-outline"
        color={theme['color-basic-100']}
        size={32}
      />
    </Button>
  );

  const renderTitle = (): React.ReactElement => (
    <Text category="h6" style={styles.title}>
      {category.name}
    </Text>
  );

  return (
    <ListItem
      title={renderTitle}
      accessoryLeft={renderAccessoryLeft}
      accessoryRight={renderAccessoryRight}
      style={styles.listItem}
      onPress={() => onOpenDetail(category)}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: HORIZONTAL_PADDING * 2,
    fontSize: 20,
    display: 'flex',
    gap: 15,
  },
  iconLeftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  settingsIconContainer: {
    backgroundColor: theme['color-basic-transparent'],
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  title: {
    color: theme['color-basic-100'],
  },
});
