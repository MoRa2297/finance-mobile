import React, { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  BottomNavigation as BottomNavigationUI,
  BottomNavigationTab,
  TextProps,
} from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui';
import { theme } from '@/config/theme';

import { TabLabel } from './TabLabel';
import { FloatingButton } from './FloatingButton';
import {
  getSelectedIndex,
  navigateToTab,
  navigateToTransaction,
  TransactionType,
} from './BottomNavigation.helpers';

interface BottomNavigationProps {
  visible?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  visible = true,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const pathname = usePathname();

  const [height, setHeight] = useState(60);
  const selectedIndex = getSelectedIndex(pathname);

  const handleSelect = useCallback((index: number) => {
    // Index 2 è il FloatingButton, non navigare
    if (index === 2) return;
    navigateToTab(index);
  }, []);

  const handleOpenTransaction = useCallback((type: TransactionType) => {
    navigateToTransaction(type);
  }, []);

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      setHeight(event.nativeEvent.layout.height + 15);
    },
    [],
  );

  if (!visible) return null;

  return (
    <BottomNavigationUI
      onLayout={onLayout}
      style={[
        styles.bottomNavigation,
        {
          bottom: insets.bottom + 15,
          width: width - 30,
          height,
        },
      ]}
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      appearance="noIndicator">
      {/* Home */}
      <BottomNavigationTab
        title={(props: TextProps | undefined) => (
          <TabLabel
            textProps={props}
            labelText={t('components.bottomNavigator.home')}
            selected={selectedIndex === 0}
          />
        )}
        icon={() => <Icon name="home-outline" color={theme.colors.white} />}
      />

      {/* Expenses */}
      <BottomNavigationTab
        title={(props: TextProps | undefined) => (
          <TabLabel
            textProps={props}
            labelText={t('components.bottomNavigator.transaction')}
            selected={selectedIndex === 1}
          />
        )}
        icon={() => (
          <Icon name="clipboard-outline" color={theme.colors.white} />
        )}
      />

      {/* Floating Button (center) */}
      <BottomNavigationTab
        icon={() => (
          <View style={styles.floatingButtonContainer}>
            <FloatingButton handlePressOption={handleOpenTransaction} />
          </View>
        )}
      />

      {/* Budget */}
      <BottomNavigationTab
        title={(props: TextProps | undefined) => (
          <TabLabel
            textProps={props}
            labelText={t('components.bottomNavigator.budgets')}
            selected={selectedIndex === 3}
          />
        )}
        icon={() => <Icon name="flag-outline" color={theme.colors.white} />}
      />

      {/* Settings */}
      <BottomNavigationTab
        title={(props: TextProps | undefined) => (
          <TabLabel
            textProps={props}
            labelText={t('components.bottomNavigator.more')}
            selected={selectedIndex === 4}
          />
        )}
        icon={() => (
          <Icon name="more-horizontal-outline" color={theme.colors.white} />
        )}
      />
    </BottomNavigationUI>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors.primary500,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { height: 1, width: 1 },
    elevation: 9,
    alignItems: 'flex-end',
    zIndex: 10,
    minHeight: 60,
  },
  floatingButtonContainer: {
    backgroundColor: theme.colors.transparent,
    position: 'absolute',
    height: 60,
    width: 60,
    bottom: 30,
  },
});
