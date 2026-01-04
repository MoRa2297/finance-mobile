import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { Icon } from '../../../UI/Icon/Icon';
import {
  BankAccount,
  BankCard,
  Category,
  Transaction,
} from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';
import { GLOBAL_BORDER_RADIUS } from '../../../../config/constants';

interface ExpenseCardProps {
  item: Transaction;
  handleSelectTransaction: (transaction: Transaction) => void;
}

export const ExpenseCard: React.FunctionComponent<ExpenseCardProps> = ({
  item,
  handleSelectTransaction,
}) => {
  const { dataStore } = useStores();
  const { t } = useTranslation();

  const category = dataStore.categories.find(
    (itemCategory: Category) => itemCategory.id === item.categoryId,
  );

  const bankAccount = dataStore.bankAccount.find(
    (itembankAccount: BankAccount) => itembankAccount.id === item.bankAccountId,
  );

  const bankCard = dataStore.bankCard.find(
    (itemBankCard: BankCard) => itemBankCard.id === item.cardId,
  );

  return (
    <TouchableOpacity onPress={() => handleSelectTransaction(item)}>
      <Layout style={styles.container}>
        <Layout style={styles.leftContainer}>
          <Layout
            style={[
              styles.iconContainerIcons,
              { backgroundColor: category?.categoryColor.hexCode },
            ]}>
            <Icon
              name={category?.categoryIcon.iconName}
              color={theme['color-basic-100']}
              size={28}
              pack="ionicons"
            />
          </Layout>
        </Layout>
        <Layout style={styles.centerContainer}>
          <Text category="s1" style={styles.title}>
            {item.description}
          </Text>
          <Text category="p2" style={styles.subTitle}>
            {category?.name ? category?.name : ''}
            {bankAccount ? ' | ' + bankAccount?.name : ' | ' + bankCard?.name}
            {item.recurrent
              ? ' | ' + t<string>('components.expenseCard.recurrent')
              : ''}
          </Text>
        </Layout>
        <Layout style={styles.rightContainer}>
          <Text category="p2">{item.money} €</Text>
          <Icon
            name={
              item.recived
                ? 'checkmark-circle-2-outline'
                : 'close-circle-outline'
            }
            color={item.recived ? theme['color-green'] : theme['color-red']}
            size={20}
            style={[styles.icon]}
          />
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 5,
    borderRadius: 20,
    height: 70,
    paddingHorizontal: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: theme['color-basic-transparent'],
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  rightContainer: {
    justifyContent: 'center',
    borderRadius: 20,
  },
  icon: {
    margin: 5,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 15,
  },
  subTitle: {
    fontSize: 12,
    color: theme['text-hint-color'],
  },
  iconContainerIcons: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
