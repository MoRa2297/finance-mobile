import React from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';
import { theme } from '../../../../config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { Text, Layout, ListItem } from '@ui-kitten/components';
import { Icon } from '../../../UI/Icon/Icon';
import { useTranslation } from 'react-i18next';

type BankAccountTypeSheetListItemProps = {
  item: ListRenderItemInfo<any>;
  onSelect: (item: any) => void;
};

export const BankAccountTypeSheetListItem: React.FunctionComponent<
  BankAccountTypeSheetListItemProps
> = ({ item, onSelect }) => {
  const { t } = useTranslation();

  return (
    <ListItem style={styles.container} onPress={() => onSelect(item)}>
      <Layout style={styles.iconContainer}>
        {/* TODO to map the icons */}
        <Icon
          name={'arrow-ios-forward-outline'}
          color={theme['color-basic-100']}
          size={28}
        />
      </Layout>
      <Text style={{ flex: 1, color: 'white' }}>
        {t<string>(
          `components.bankAccountTypeSheetListItem.types.${item.item.name}`,
        )}
      </Text>
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
  iconContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme['color-primary'],
  },
});
