import React, { useCallback, useRef, FC } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Button } from '@components/ui/Button';
import { StatusPill } from './StatusPill';
import { DetailCard } from './DetailCard';
import { NoteCard } from './NoteCard';
import { TransactionFormTypes } from '@/types';

export const TransactionDetailSheet: FC<
  SheetProps<'transaction-detail-sheet'>
> = props => {
  const { t } = useTranslation(['expensesPage', 'common']);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const handleEdit = useCallback(() => {
    if (props.payload?.transaction && props.payload?.onEdit) {
      props.payload.onEdit(props.payload.transaction);
    }
  }, [props.payload]);

  const handleDelete = useCallback(() => {
    if (props.payload?.transaction && props.payload?.onDelete) {
      props.payload.onDelete(props.payload.transaction);
    }
  }, [props.payload]);

  if (!props.payload?.transaction) return null;

  const { transaction } = props.payload;

  const isExpense = transaction.type === TransactionFormTypes.EXPENSE;
  const isIncome = transaction.type === TransactionFormTypes.INCOME;
  const isTransfer = transaction.type === TransactionFormTypes.TRANSFER;

  const amountColor = isIncome
    ? theme.colors.green
    : isExpense
      ? theme.colors.red
      : theme.colors.primary;

  const amountPrefix = isIncome ? '+' : isExpense ? '-' : '';

  const accountName =
    transaction.bankAccount?.name ?? transaction.card?.name ?? '-';
  const accountLabel = transaction.bankAccount
    ? t('expensesPage:transactionDetailSheet.bankAccount')
    : t('expensesPage:transactionDetailSheet.cardAccount');

  return (
    <ActionSheet
      ref={actionSheetRef}
      drawUnderStatusBar
      closable
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      closeOnTouchBackdrop
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.sheetContainer}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.container}>
        <View style={styles.handle} />

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}
            {transaction.amount.toFixed(2)} €
          </Text>
          <Text style={styles.date}>
            {dayjs(transaction.date).format('DD MMMM YYYY')}
          </Text>
        </View>

        {/* Pills */}
        <View style={styles.pillsRow}>
          {isTransfer ? (
            <StatusPill
              isActive
              activeLabel={t('expensesPage:transactionDetailSheet.transfer')}
              inactiveLabel=""
              activeColor={theme.colors.primary}
              inactiveColor={theme.colors.primary}
              iconActive="swap-outline"
              iconInactive="swap-outline"
            />
          ) : (
            <StatusPill
              isActive={isIncome}
              activeLabel={t('expensesPage:transactionDetailSheet.income')}
              inactiveLabel={t('expensesPage:transactionDetailSheet.expense')}
              activeColor={theme.colors.green}
              inactiveColor={theme.colors.red}
              iconActive="arrow-circle-down-outline"
              iconInactive="arrow-circle-up-outline"
            />
          )}
          <StatusPill
            isActive={transaction.recurrent}
            activeLabel={t('expensesPage:transactionDetailSheet.recurring')}
            inactiveLabel={t(
              'expensesPage:transactionDetailSheet.notRecurring',
            )}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.textHint}
            iconActive="sync-outline"
            iconInactive="sync-outline"
          />
        </View>

        {/* Detail Cards */}
        <View style={styles.cardsRow}>
          {isTransfer ? (
            <>
              <DetailCard
                iconName="grid-outline"
                label={t('expensesPage:transactionDetailSheet.fromAccount')}
                value={transaction.transferDetail?.fromAccount?.name}
              />
              <DetailCard
                iconName="grid-outline"
                label={t('expensesPage:transactionDetailSheet.toAccount')}
                value={transaction.transferDetail?.toAccount?.name}
              />
            </>
          ) : (
            <>
              <DetailCard
                iconName="bookmark-outline"
                label={t('expensesPage:transactionDetailSheet.category')}
                value={transaction.category?.name}
                accent={transaction.category?.categoryColor?.hexCode}
              />
              <DetailCard
                iconName="grid-outline"
                label={accountLabel}
                value={accountName}
              />
            </>
          )}
        </View>

        {/* Note */}
        {!!transaction.note && (
          <NoteCard
            label={t('expensesPage:transactionDetailSheet.note')}
            value={transaction.note}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleDelete}
            buttonText={t('common:delete')}
            style={styles.deleteButton}
          />
          <Button
            onPress={handleEdit}
            buttonText={t('common:edit')}
            style={styles.editButton}
          />
        </View>
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  container: {
    paddingBottom: 30,
    backgroundColor: theme.colors.transparent,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textHint,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
    opacity: 0.4,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
  },
  description: {
    color: theme.colors.textHint,
    fontSize: 14,
    marginBottom: 6,
  },
  amount: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1,
  },
  date: {
    color: theme.colors.textHint,
    fontSize: 13,
    marginTop: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 8,
    gap: 10,
  },
  deleteButton: {
    flex: 1,
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme.colors.red,
    borderColor: theme.colors.red,
  },
  editButton: {
    flex: 1,
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
