import { Layout, ListItem, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { Icon } from '../../../UI/Icon/Icon';
import { BankAccount } from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';

interface BankAccountListCardProps {
  bankAccount: BankAccount;
  onOpenModify: (bankAccount: BankAccount['id']) => void;
  onOpenDetail: (bankAccountID: BankAccount['id']) => void;
}

export const BankAccountListCard: React.FunctionComponent<
  BankAccountListCardProps
> = ({ bankAccount, onOpenModify, onOpenDetail }) => {
  const { dataStore, sessionStore } = useStores();
  const { t } = useTranslation();

  // TODO Handle loading of the api call

  const bankTypeImage = dataStore.bankTypes.find(
    bankType => bankType.id === bankAccount.bankAccountTypeId,
  );

  const getTransaction = useCallback(async () => {
    if (!sessionStore.user || !sessionStore.user.id) {
      throw new Error();
    }

    if (dataStore.transactions.length === 0) {
      await dataStore.getTransactions(
        sessionStore.sessionToken,
        String(sessionStore.user.id),
      );
    }
  }, [dataStore, sessionStore.sessionToken, sessionStore.user]);

  useEffect(() => {
    if (dataStore.transactions.length === 0) {
      getTransaction();
    }
  }, [dataStore.transactions.length]);

  const currentBalance = useMemo(() => {
    const foundSpent = dataStore.transactions.filter(
      transaction =>
        transaction.type === 'expense' || transaction.type === 'card_spending',
    );

    const foundIncome = dataStore.transactions.filter(
      transaction => transaction.type === 'income',
    );

    let totIncome = 0;
    let totSpent = 0;
    foundIncome.forEach(
      transaction => (totIncome = totIncome + parseFloat(transaction.money)),
    );

    foundSpent.forEach(
      transaction => (totSpent = totSpent + parseFloat(transaction.money)),
    );

    let tot = bankAccount.startingBalance + totIncome;

    return tot - totSpent;
  }, [bankAccount.startingBalance, dataStore.transactions]);

  const renderAccessoryLeft = (): React.ReactElement => (
    <Layout style={styles.accessoryLeftContainer}>
      <Layout style={[styles.iconLeftContainer]}>
        {bankTypeImage?.imageUrl && (
          <Image
            source={{ uri: bankTypeImage?.imageUrl }}
            style={styles.image}
          />
        )}
      </Layout>
    </Layout>
  );

  const renderContent = (): React.ReactElement => (
    <Layout style={styles.contentContainer}>
      <Layout style={styles.contentTop}>
        <Text category="h6" style={styles.title}>
          {bankAccount.name}
        </Text>

        <Icon
          name="more-horizontal-outline"
          color={theme['color-basic-100']}
          size={32}
          onPress={() => {
            onOpenModify(bankAccount.id);
          }}
        />
      </Layout>
      <Layout style={styles.contentBottom}>
        <Text category="s1" style={styles.subTitle}>
          {t<string>('components.bankAccountListCard.currentBalance')}
        </Text>

        <Text category="c2" style={styles.money}>
          {currentBalance} $
        </Text>
      </Layout>
    </Layout>
  );

  return (
    <ListItem
      style={styles.listItem}
      onPress={() => onOpenDetail(bankAccount.id)}>
      {renderAccessoryLeft()}
      {renderContent()}
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: HORIZONTAL_PADDING * 2,
    fontSize: 20,
    display: 'flex',
    gap: 15,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    paddingVertical: HORIZONTAL_PADDING * 1.5,
  },
  accessoryLeftContainer: {
    height: '100%',
    backgroundColor: theme['color-basic-transparent'],
  },
  iconLeftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme['color-basic-transparent'],
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: theme['color-basic-transparent'],
  },
  contentTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme['color-basic-transparent'],
  },
  contentBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme['color-basic-transparent'],
  },
  title: {
    color: theme['color-basic-100'],
  },
  subTitle: {
    color: theme['text-hint-color'],
  },
  money: {
    width: 'auto',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    resizeMode: 'contain',
    borderColor: 'red',
    borderWidth: 1,
  },
});
