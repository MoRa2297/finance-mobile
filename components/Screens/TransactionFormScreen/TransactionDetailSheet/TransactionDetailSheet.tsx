import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { theme } from '../../../../config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '../../../../config/constants';
import {
  BankAccount,
  BankCard,
  Category,
  Transaction,
} from '../../../../types/types';
import { Layout } from '@ui-kitten/components';
import { Icon } from '../../../UI/Icon/Icon';
import { Button } from '../../../UI/Button/Button';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../../hooks/useStores';
import Moment from 'moment';

type TransactionDetailSheetProps = {
  payload: {
    transaction: Transaction;
    handleEdit: (transaction: Transaction) => void;
  };
  sheetId: string;
};

export const TransactionDetailSheet: React.FunctionComponent<
  SheetProps<TransactionDetailSheetProps>
> = ({ payload }) => {
  const { dataStore, ui } = useStores();
  const { t } = useTranslation();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const [selectedBank, setSelectedBank] = useState<BankAccount>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedCard, setSelectedCard] = useState<BankCard>();

  const setData = useCallback(() => {
    if (payload && payload.transaction) {
      const selectedBankAccount = dataStore.bankAccount.find(
        bankAccount => bankAccount.id === payload.transaction.bankAccountId,
      );

      setSelectedBank(selectedBankAccount);

      const selectedCategoryItem = dataStore.categories.find(
        category => category.id === payload.transaction.categoryId,
      );

      setSelectedCategory(selectedCategoryItem);

      const selectedCardItem = dataStore.bankCard.find(
        card => card.id === payload.transaction.cardId,
      );

      setSelectedCard(selectedCardItem);
    }
  }, [
    dataStore.bankAccount,
    dataStore.bankCard,
    dataStore.categories,
    payload,
  ]);

  useEffect(() => {
    setData();
  }, []);

  return (
    <ActionSheet
      drawUnderStatusBar={true}
      ref={actionSheetRef}
      closable={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      closeOnTouchBackdrop
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.containerStyle}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.container}>
        <Layout style={styles.topContainer}>
          <Layout style={styles.topInfoContainer}>
            <Icon
              name={
                payload?.transaction?.recived
                  ? 'checkmark-circle'
                  : 'close-circle'
              }
              color={
                payload?.transaction?.recived
                  ? theme['color-green']
                  : theme['color-red']
              }
              size={40}
              pack="ionicons"
            />
            <Text style={styles.topInfo}>
              {t<string>('components.transactionDetailSheet.paid')}
            </Text>
          </Layout>
          <Layout style={styles.topInfoContainer}>
            <Icon
              name={
                payload?.transaction?.recurrent
                  ? 'checkmark-circle'
                  : 'close-circle'
              }
              color={
                payload?.transaction?.recurrent
                  ? theme['color-green']
                  : theme['color-red']
              }
              size={40}
            />
            <Text style={styles.topInfo}>
              {t<string>('components.transactionDetailSheet.recurring')}
            </Text>
          </Layout>
        </Layout>
        <Layout style={styles.separator} />
        <Layout style={styles.bottomContainer}>
          <Layout style={styles.bottomContainerLeft}>
            <Layout style={styles.horizontalInfoContainer}>
              <Icon
                name={'edit-outline'}
                color={theme['color-basic-100']}
                size={28}
              />
              <Layout style={styles.infoContainer}>
                <Text style={styles.topInfo}>
                  {t<string>('components.transactionDetailSheet.description')}
                </Text>
                <Text style={styles.dataInfo}>
                  {payload?.transaction?.description}
                </Text>
              </Layout>
            </Layout>
            <Layout style={styles.horizontalInfoContainer}>
              <Icon
                name={'calendar-outline'}
                color={theme['color-basic-100']}
                size={28}
              />
              <Layout style={styles.infoContainer}>
                <Text style={styles.topInfo}>
                  {t<string>('components.transactionDetailSheet.date')}
                </Text>
                <Text style={styles.dataInfo}>
                  {Moment(payload?.transaction?.date).format('DD-MM-YYYY ')}
                </Text>
              </Layout>
            </Layout>
            <Layout style={styles.horizontalInfoContainer}>
              <Icon
                name={'bookmark-outline'}
                color={theme['color-basic-100']}
                size={28}
              />
              <Layout style={styles.infoContainer}>
                <Text style={styles.topInfo}>
                  {t<string>('components.transactionDetailSheet.category')}
                </Text>
                <Text style={styles.dataInfo}>{selectedCategory?.name}</Text>
              </Layout>
            </Layout>
          </Layout>
          <Layout style={styles.bottomContainerRight}>
            <Layout style={styles.horizontalInfoContainer}>
              <Icon
                name={'cash-outline'}
                color={theme['color-basic-100']}
                size={28}
                pack="ionicons"
              />
              <Layout style={styles.infoContainer}>
                <Text style={styles.topInfo}>
                  {t<string>('components.transactionDetailSheet.value')}
                </Text>
                <Text style={styles.dataInfo}>
                  {payload?.transaction?.money}
                </Text>
              </Layout>
            </Layout>
            <Layout style={styles.horizontalInfoContainer}>
              <Icon
                name={'grid-outline'}
                color={theme['color-basic-100']}
                size={28}
              />
              <Layout style={styles.infoContainer}>
                <Text style={styles.topInfo}>
                  {selectedBank
                    ? t<string>('components.transactionDetailSheet.bankAccount')
                    : t<string>(
                        'components.transactionDetailSheet.cardAccount',
                      )}
                </Text>
                <Text style={styles.dataInfo}>
                  {selectedBank ? selectedBank?.name : selectedCard?.name}
                </Text>
              </Layout>
            </Layout>
            <Layout style={styles.horizontalInfoContainer}>
              <Icon
                name={'edit-outline'}
                color={theme['color-basic-100']}
                size={28}
              />
              <Layout style={styles.infoContainer}>
                <Text style={styles.topInfo}>
                  {t<string>('components.transactionDetailSheet.note')}
                </Text>
                <Text style={styles.dataInfo}>
                  {payload?.transaction?.note}
                </Text>
              </Layout>
            </Layout>
          </Layout>
        </Layout>
        <Layout
          style={[
            styles.buttonContainer,
            {
              paddingBottom: ui.bottomTabHeight,
            },
          ]}>
          <Button
            size="small"
            style={styles.button}
            backgroundColor={theme['color-primary']}
            borderColor={theme['color-primary']}
            textStyle={{ color: theme['color-basic-100'] }}
            onPress={() => payload?.handleEdit(payload?.transaction)}
            buttonText={t<string>('common.edit')}
          />
        </Layout>
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  container: {
    paddingTop: 25,
    minHeight: SCREEN_HEIGHT - SCREEN_HEIGHT / 3,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  topContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
  },
  bottomContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  separator: {
    height: 0.8,
    backgroundColor: theme['text-hint-color'],
    marginVertical: 15,
  },
  topInfoContainer: {
    flexDirection: 'column',
    flex: 1 / 5,
    alignItems: 'center',
  },
  topInfo: {
    color: theme['text-hint-color'],
    fontWeight: '300',
  },
  dataInfo: {
    color: theme['text-basic-color'],
    fontWeight: '400',
  },
  bottomContainerLeft: {
    flex: 1,
  },
  bottomContainerRight: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  horizontalInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
  },
  infoContainer: {
    marginLeft: 5,
  },
});
