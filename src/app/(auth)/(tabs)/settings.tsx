import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { SettingsHeader, SettingRow } from '@/components/screens/settings';
import { useAuthStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { ROUTES } from '@/config/constants';
import { SettingsList } from '@/types';
import { SliderBar } from '@components/ui/SliderBar';
import { ScreenContainer } from '@components/ui/ScreenContainer';

const TABS = [
  { title: 'settingsPage:general', value: 'general' },
  { title: 'settingsPage:charts', value: 'charts' },
  { title: 'settingsPage:profile', value: 'profile' },
];

export default function SettingsScreen() {
  const { t } = useTranslation('settingsPage');
  const router = useRouter();

  // Stores
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // State
  const [selectedTab, setSelectedTab] = useState(TABS[0].value);

  // Handlers
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  const handleNavigate = useCallback(
    (route: string) => {
      router.push(route as any);
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    logout();
    router.replace(ROUTES.LOGIN);
  }, [logout, router]);

  const handleDeleteAccount = useCallback(() => {
    // TODO: Show confirmation modal
    console.log('Delete account');
  }, []);

  // TODO create CONSTS
  // Menu configuration
  const menuList: SettingsList[] = useMemo(
    () => [
      {
        value: 'general',
        rows: [
          {
            title: t('settingsPage:menuCategories'),
            iconName: 'bookmark-outline',
            navigationScreen: '/(auth)/categories',
          },
          {
            title: t('settingsPage:menuBankAccounts'),
            iconName: 'grid-outline',
            navigationScreen: '/(auth)/bank-accounts/bank-accounts',
          },
          {
            title: t('settingsPage:menuBankCards'),
            iconName: 'credit-card-outline',
            navigationScreen: '/(auth)/bank-cards',
          },
        ],
      },
      {
        value: 'charts',
        rows: [],
      },
      {
        value: 'profile',
        rows: [
          {
            title: t('settingsPage:profile'),
            iconName: 'person-outline',
            navigationScreen: '/(auth)/profile',
          },
          {
            title: t('settingsPage:deleteAccount'),
            iconName: 'person-delete-outline',
            color: theme.colors.red,
            callback: handleDeleteAccount,
          },
          {
            title: t('settingsPage:logOut'),
            iconName: 'log-out-outline',
            color: theme.colors.red,
            callback: handleLogout,
          },
        ],
      },
    ],
    [t, handleDeleteAccount, handleLogout],
  );

  // Get current menu items
  const currentMenu = useMemo(
    () => menuList.find(menu => menu.value === selectedTab),
    [menuList, selectedTab],
  );

  const userName = user ? `${user.name} ${user.surname}` : 'User';

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Header with user info */}
      <SettingsHeader
        name={userName}
        email={user?.email || ''}
        imageUrl={user?.imageUrl}
      />

      {/* Tab selector */}
      <View style={styles.sliderContainer}>
        <SliderBar tabs={TABS} onTabChange={handleTabChange} />
      </View>

      {/* Menu items */}
      <ScrollView
        style={[styles.scrollView, { marginBottom: bottomTabHeight }]}
        contentContainerStyle={styles.scrollContent}>
        {currentMenu?.rows.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Coming soon</Text>
          </View>
        ) : (
          currentMenu?.rows.map((row, index) => (
            <SettingRow
              key={row.title}
              title={row.title}
              iconName={row.iconName}
              color={row.color}
              isLast={index === (currentMenu?.rows.length || 0) - 1}
              onPress={() =>
                row.navigationScreen
                  ? handleNavigate(row.navigationScreen)
                  : row.callback?.()
              }
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
  },
  sliderContainer: {
    marginHorizontal: 50,
    backgroundColor: theme.colors.transparent,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 10,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textHint,
    fontSize: 16,
  },
});
