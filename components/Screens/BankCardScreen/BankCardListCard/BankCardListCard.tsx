import { Layout, ListItem, ProgressBar, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { theme } from '../../../../config/theme';
import { Icon } from '../../../UI/Icon/Icon';
import { BankCard, CardType } from '../../../../types/types';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../../hooks/useStores';

interface BankCardListCardProps {
  bankCard: BankCard;
  onOpenModify: (bankCard: BankCard['id']) => void;
  onOpenDetail: (bankCardID: BankCard['id']) => void;
}

export const BankCardListCard: React.FunctionComponent<
  BankCardListCardProps
> = ({ bankCard, onOpenModify, onOpenDetail }) => {
  const { dataStore, sessionStore } = useStores();
  const { t } = useTranslation();
  const [foundCardType, setFoundCardType] = useState<CardType>();
  const [spentValue, setSpentValue] = useState<number>();

  const getData = useCallback(async () => {
    const foundCardTypeResult = dataStore.cardTypes.find(
      cardType => cardType.id === bankCard.cardTypeId,
    );

    if (!sessionStore.user || !sessionStore.user.id) {
      throw new Error();
    }

    if (dataStore.transactions.length === 0) {
      await dataStore.getTransactions(
        sessionStore.sessionToken,
        String(sessionStore.user.id),
      );
    }

    const foundSpent = dataStore.transactions.filter(
      transaction =>
        transaction.type === 'card_spending' && transaction.recived,
    );

    let totSpent = 0;

    foundSpent.forEach(
      transaction => (totSpent = totSpent + parseFloat(transaction.money)),
    );
    setSpentValue(totSpent);

    setFoundCardType(foundCardTypeResult);
  }, [
    bankCard.cardTypeId,
    dataStore,
    sessionStore.sessionToken,
    sessionStore.user,
  ]);

  useEffect(() => {
    getData();
  }, []);

  const renderBankIcon = (): React.ReactElement => (
    <Layout style={styles.accessoryLeftContainer}>
      <Layout style={styles.iconLeftContainer}>
        <Image source={{ uri: foundCardType?.imageUrl }} style={styles.image} />
      </Layout>
    </Layout>
  );

  const renderContent = (): React.ReactElement => (
    <Layout style={styles.contentContainer}>
      <Layout style={styles.contentTop}>
        <Text category="h6" style={styles.title}>
          {bankCard.name}
        </Text>

        <Icon
          name="more-horizontal-outline"
          color={theme['color-basic-100']}
          size={32}
          onPress={() => {
            onOpenModify(bankCard.id);
          }}
        />
      </Layout>
    </Layout>
  );

  const renderSpentValue = (): React.ReactElement => {
    let partialOperation = (100 / parseFloat(bankCard.cardLimit)) * spentValue;

    if (spentValue) {
      return (
        <Layout style={styles.spentValueContainer}>
          <Layout style={styles.spentValueContainerTop}>
            <Text category="s1" style={styles.title}>
              {t<string>('components.bankCardListCard.spentValue')}
            </Text>

            <Text category="s2" style={styles.title}>
              € {spentValue}
            </Text>
          </Layout>
          <Layout style={styles.spentValueContainerBottom}>
            <ProgressBar
              progress={partialOperation / 100}
              size="giant"
              style={{
                height: 15,
                backgroundColor: theme['color-secondary-BK'],
              }}
              status={'info'}
            />
          </Layout>
        </Layout>
      );
    }
  };

  return (
    <ListItem style={styles.listItem} onPress={() => onOpenDetail(bankCard.id)}>
      <Layout style={styles.container}>
        {renderBankIcon()}
        {renderContent()}
      </Layout>
      {renderSpentValue()}
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
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: theme['color-basic-transparent'],
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
    alignItems: 'center',
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
  spentValueContainer: {
    flex: 1,
    width: '100%',
    gap: 10,
    backgroundColor: theme['color-basic-transparent'],
  },
  spentValueContainerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme['color-basic-transparent'],
  },
  spentValueContainerBottom: {
    backgroundColor: theme['color-basic-transparent'],
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    resizeMode: 'cover',
  },
});
