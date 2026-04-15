import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/config/theme';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { TopRoundedContainer } from '@components/ui/TopRoundedContainer';
import { Header } from '@components/ui/Header';
import { BalanceSummary } from '@components/screens/home';
import { useHomeScreen } from '@hooks/screens/home';

export default function HomeScreen() {
  const { user, balance, moneyIsVisible, handleToggleMoneyVisibility } =
    useHomeScreen();

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <TopRoundedContainer height="35%" paddingTop={10}>
        <Header
          left={{
            type: 'avatar',
            source: user?.imageUrl ?? undefined,
            onPress: () => {},
          }}
          right={{
            type: 'visibility',
            isVisible: moneyIsVisible,
            onToggle: handleToggleMoneyVisibility,
          }}
        />
        <BalanceSummary balance={balance} moneyIsVisible={moneyIsVisible} />
      </TopRoundedContainer>

      {/* TODO: Add transactions list, charts, etc. */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
});
