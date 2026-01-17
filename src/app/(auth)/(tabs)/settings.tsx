import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui';
import { SettingsHeader, SettingRow } from '@/components/screens/settings';
import { useAuthStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { ROUTES } from '@/config/constants';
import { SettingsList } from '@/types/types';
import { SliderBar } from '@components/ui/SliderBar';

const TABS = [
  { title: 'general', value: 'general' },
  { title: 'charts', value: 'charts' },
  { title: 'profile', value: 'profile' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
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

  // Menu configuration
  const menuList: SettingsList[] = useMemo(
    () => [
      {
        value: 'general',
        rows: [
          {
            title: t('screens.settingsScreen.menuCategories'),
            iconName: 'bookmark-outline',
            navigationScreen: '/(auth)/categories',
          },
          {
            title: t('screens.settingsScreen.menuBankAccounts'),
            iconName: 'grid-outline',
            navigationScreen: '/(auth)/bank-accounts',
          },
          {
            title: t('screens.settingsScreen.menuBankCards'),
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
            title: t('screens.settingsScreen.profile'),
            iconName: 'person-outline',
            navigationScreen: '/(auth)/profile',
          },
          {
            title: t('screens.settingsScreen.deleteAccount'),
            iconName: 'person-delete-outline',
            color: theme.colors.red,
            callback: handleDeleteAccount,
          },
          {
            title: t('screens.settingsScreen.logOut'),
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
