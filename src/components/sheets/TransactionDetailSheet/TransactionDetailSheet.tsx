import React, { useCallback, useEffect, useRef, useState, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Icon, Button } from '@/components/ui';
import { theme } from '@/config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
  BOTTOM_NAV_HEIGHT,
} from '@/config/constants';
import { useDataStore } from '@/stores';
import { Transaction, BankAccount, BankCard, Category } from '@/types';

// ============================================================
// TYPES
// ============================================================

type TransactionDetailSheetPayload = {
  payload: {
    transaction: Transaction;
    handleEdit: (transaction: Transaction) => void;
  };
  sheetId: string;
};

// ============================================================
// COMPONENT
// ============================================================

export const TransactionDetailSheet: FC<
  SheetProps<'transaction-detail-sheet'>
> = props => {
  const { t } = useTranslation(['expensesPage', 'common']);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  // Stores
  const categories = useDataStore(state => state.categories);
  const bankAccounts = useDataStore(state => state.bankAccounts);
  const bankCards = useDataStore(state => state.bankCards);

  // Local state
  const [selectedBank, setSelectedBank] = useState<BankAccount | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [selectedCard, setSelectedCard] = useState<BankCard | undefined>();

  // Set related data on mount
  useEffect(() => {
    if (!props.payload?.transaction) return;

    const { bankAccountId, categoryId, cardId } = props.payload?.transaction;

    setSelectedBank(bankAccounts.find(b => b.id === bankAccountId));
    setSelectedCategory(categories.find(c => c.id === categoryId));
    setSelectedCard(bankCards.find(c => c.id === cardId));
  }, [props.payload?.transaction, bankAccounts, categories, bankCards]);

  // Handlers
  const handleEdit = useCallback(() => {
    if (props.payload?.transaction && props.payload?.onEdit) {
      props.payload?.onEdit(props.payload?.transaction);
    }
  }, [props.payload]);

  if (!props.payload?.transaction) return null;

  const { transaction } = props.payload;

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
        {/* Top Section - Status Icons */}
        <View style={styles.topSection}>
          <StatusIcon
            isActive={transaction.recived} // ← 'recived' non 'received' TODO FIX TYPO NAME
            label={t('expensesPage:transactionDetailSheet.paid')}
          />
          <StatusIcon
            isActive={transaction.recurrent}
            label={t('expensesPage:transactionDetailSheet.recurring')}
          />
        </View>

        <View style={styles.separator} />

        {/* Bottom Section - Details */}
        <View style={styles.detailsSection}>
          {/* Left Column */}
          <View style={styles.detailsColumn}>
            <DetailRow
              iconName="edit-outline"
              label={t('expensesPage:transactionDetailSheet.description')}
              value={transaction.description}
            />
            <DetailRow
              iconName="calendar-outline"
              label={t('expensesPage:transactionDetailSheet.date')}
              value={dayjs(transaction.date).format('DD-MM-YYYY')}
            />
            <DetailRow
              iconName="bookmark-outline"
              label={t('expensesPage:transactionDetailSheet.category')}
              value={selectedCategory?.name}
            />
          </View>

          {/* Right Column */}
          <View style={styles.detailsColumn}>
            {/*<DetailRow*/}
            {/*  iconName="pricetags-outline"*/}
            {/*  label={t('transactionDetail.value')}*/}
            {/*  value={`${transaction.amount.toFixed(2)} €`}*/}
            {/*/>*/}
            <DetailRow
              iconName="pricetags-outline"
              label={t('expensesPage:transactionDetailSheet.value')}
              value={`${transaction.money} €`} // ← 'money' non 'amount'
            />
            <DetailRow
              iconName="grid-outline"
              label={
                selectedBank
                  ? t('expensesPage:transactionDetailSheet.bankAccount')
                  : t('expensesPage:transactionDetailSheet.cardAccount')
              }
              value={selectedBank?.name ?? selectedCard?.name}
            />
            <DetailRow
              iconName="file-text-outline"
              label={t('expensesPage:transactionDetailSheet.note')}
              value={transaction.note}
            />
          </View>
        </View>

        {/* Edit Button */}
        <View style={styles.buttonContainer}>
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

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface StatusIconProps {
  isActive?: boolean;
  label: string;
}

const StatusIcon: FC<StatusIconProps> = ({ isActive, label }) => (
  <View style={styles.statusContainer}>
    <Icon
      name={isActive ? 'checkmark-circle-outline' : 'close-circle-outline'}
      color={isActive ? theme.colors.green : theme.colors.red}
      size={40}
    />
    <Text style={styles.statusLabel}>{label}</Text>
  </View>
);

interface DetailRowProps {
  iconName: string;
  label: string;
  value?: string | null;
}

const DetailRow: FC<DetailRowProps> = ({ iconName, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={iconName} color={theme.colors.basic100} size={28} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  </View>
);

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  container: {
    paddingTop: 25,
    minHeight: SCREEN_HEIGHT - SCREEN_HEIGHT / 2,
    paddingHorizontal: HORIZONTAL_PADDING,
    backgroundColor: theme.colors.transparent,
  },

  // Top Section
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusContainer: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    color: theme.colors.textHint,
    fontWeight: '300',
    marginTop: 4,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: theme.colors.textHint,
    marginVertical: 15,
    opacity: 0.3,
  },

  // Details Section
  detailsSection: {
    flexDirection: 'row',
    flex: 1,
  },
  detailsColumn: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  detailTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  detailLabel: {
    color: theme.colors.textHint,
    fontWeight: '300',
    fontSize: 12,
  },
  detailValue: {
    color: theme.colors.basic100,
    fontWeight: '400',
    fontSize: 14,
    marginTop: 2,
  },

  // Button
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: theme.colors.basic100,
  },
});
