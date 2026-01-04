import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { theme } from '../../../../config/theme';
import { HORIZONTAL_PADDING } from '../../../../config/constants';
import { Text, Layout, ListItem } from '@ui-kitten/components';
import { Icon } from '../../../UI/Icon/Icon';
import { BankType } from '../../../../types/types';

type BankAccountSelectSheetListItemProps = {
  item: BankType;
  onSelect: (item: BankType) => void;
};

export const BankAccountSelectSheetListItem: React.FunctionComponent<
  BankAccountSelectSheetListItemProps
> = ({ item, onSelect }) => {
  return (
    <ListItem style={styles.container} onPress={() => onSelect(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
});
