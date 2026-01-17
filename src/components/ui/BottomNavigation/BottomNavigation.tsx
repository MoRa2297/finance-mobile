import React, { FC, useCallback, useState } from 'react';
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

// TODO improve animations on switch screens and selected screen UI
export const BottomNavigation = ({}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useTranslation('common');
  const pathname = usePathname();

  const [height, setHeight] = useState(60);
  const selectedIndex = getSelectedIndex(pathname);

  const handleSelect = useCallback((index: number) => {
    // Index 2 it's the FloatingButton, not navigate
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

  return (
    <BottomNavigationUI
      onLayout={onLayout}
      style={[
        styles.bottomNavigation,
        {
          bottom: insets.bottom + 5,
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
            labelText={t('common:bottomNavigator.home')}
            selected={selectedIndex === 0}
          />
        )}
        icon={() => (
          <Icon
            name="home-outline"
            color={
              selectedIndex === 0
                ? theme.colors.basic100
                : theme.colors.basic400
            }
          />
        )}
      />

      {/* Expenses */}
      <BottomNavigationTab
        title={(props: TextProps | undefined) => (
          <TabLabel
            textProps={props}
            labelText={t('common:bottomNavigator.transaction')}
            selected={selectedIndex === 1}
          />
        )}
        icon={() => (
          <Icon
            name="clipboard-outline"
            color={
              selectedIndex === 1
                ? theme.colors.basic100
                : theme.colors.basic400
            }
          />
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
            labelText={t('common:bottomNavigator.budgets')}
            selected={selectedIndex === 3}
          />
        )}
        icon={() => (
          <Icon
            name="flag-outline"
            color={
              selectedIndex === 3
                ? theme.colors.basic100
                : theme.colors.basic400
            }
          />
        )}
      />

      {/* Settings */}
      <BottomNavigationTab
        title={(props: TextProps | undefined) => (
          <TabLabel
            textProps={props}
            labelText={t('common:bottomNavigator.more')}
            selected={selectedIndex === 4}
          />
        )}
        icon={() => (
          <Icon
            name="more-horizontal-outline"
            color={
              selectedIndex === 4
                ? theme.colors.basic100
                : theme.colors.basic400
            }
          />
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
    backgroundColor: theme.colors.primaryBK,
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
