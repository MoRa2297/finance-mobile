import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { theme } from '../../../../config/theme';
import { HORIZONTAL_PADDING } from '../../../../config/constants';
import { Text, Layout, ListItem } from '@ui-kitten/components';
import { Icon } from '../../../UI/Icon/Icon';
import { BankAccount } from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';

type CurrentBankAccountsSelectSheetListItemProps = {
  item: BankAccount;
  onSelect: (item: any) => void;
};

export const CurrentBankAccountsSelectSheetListItem: React.FunctionComponent<
  CurrentBankAccountsSelectSheetListItemProps
> = ({ item, onSelect }) => {
  const { dataStore } = useStores();

  const bankTypeImage = dataStore.bankTypes.find(
    bankType => bankType.id === item.bankAccountTypeId,
  );

  return (
    <ListItem style={styles.container} onPress={() => onSelect(item)}>
      {bankTypeImage?.imageUrl && (
        <Image source={{ uri: bankTypeImage?.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.name}</Text>
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
  title: {
    flex: 1,
  },
});
