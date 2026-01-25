import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { GenericSmallDetail } from '@components/ui/GenericSmallDetail';
import { Header } from '@components/ui/Header';
import { useBankAccountDetailScreen } from '@/hooks/screens/bankAccounts';

export default function BankAccountDetailScreen() {
  const { t } = useTranslation('bankAccountPage');
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const { bankType, stats, formattedValues, handleSettingsPress, isNotFound } =
    useBankAccountDetailScreen();

  if (isNotFound) {
    return (
      <ScreenContainer style={styles.container}>
        <Header left={{ type: 'back', variant: 'icon' }} />
        <View style={styles.errorContainer}>
          <Text category="s1" style={styles.errorText}>
            {t('screens.bankAccountDetailScreen.notFound')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{ type: 'back', variant: 'icon' }}
        right={{ type: 'settings', onPress: handleSettingsPress }}
      />

      <View
        style={[styles.contentContainer, { paddingBottom: bottomTabHeight }]}>
        <BalanceSection
          label={t('bankAccountPage:currentBalance')}
          amount={formattedValues.currentBalance}
        />

        <View style={styles.detailsSection}>
          <DetailRow>
            <GenericSmallDetail
              title={t('bankAccountPage:bankName')}
              imageUrl={bankType?.imageUrl}
              value={bankType?.name}
            />
          </DetailRow>

          <DetailRow>
            <GenericSmallDetail
              title={t('bankAccountPage:accountType')}
              iconName="grid-outline"
              value={formattedValues.accountTypeName}
            />
            <GenericSmallDetail
              title={t('bankAccountPage:startingBalance')}
              iconName="award-outline"
              value={formattedValues.startingBalance}
            />
          </DetailRow>

          <DetailRow>
            <GenericSmallDetail
              title={t('bankAccountPage:spentQuantity')}
              iconName="trending-down-outline"
              value={stats.countSpent}
              valueColor={theme.colors.red}
            />
            <GenericSmallDetail
              title={t('bankAccountPage:incomeQuantity')}
              iconName="trending-up-outline"
              value={stats.countIncome}
              valueColor={theme.colors.green}
            />
          </DetailRow>

          <DetailRow>
            <GenericSmallDetail
              title={t('bankAccountPage:totalTransfers')}
              iconName="repeat-outline"
              value={stats.totalTransfers}
            />
          </DetailRow>
        </View>
      </View>
    </ScreenContainer>
  );
}

// ============ Sub-components ============

interface BalanceSectionProps {
  label: string;
  amount: string;
}

const BalanceSection: React.FC<BalanceSectionProps> = ({ label, amount }) => (
  <View style={styles.balanceSection}>
    <Text category="p2" style={styles.balanceLabel}>
      {label}
    </Text>
    <Text category="h4" style={styles.balanceAmount}>
      {amount}
    </Text>
  </View>
);

interface DetailRowProps {
  children: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ children }) => (
  <View style={styles.rowContainer}>{children}</View>
);

// ============ Styles ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: theme.colors.textHint,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 15,
  },
  balanceSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    borderBottomWidth: 0.7,
    borderBottomColor: theme.colors.textHint,
  },
  balanceLabel: {
    color: theme.colors.textHint,
    fontSize: 16,
  },
  balanceAmount: {
    color: theme.colors.basic100,
    marginTop: 8,
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 20,
    gap: 15,
  },
  rowContainer: {
    flexDirection: 'row',
  },
});
