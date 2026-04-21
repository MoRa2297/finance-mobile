import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useAuthStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { ROUTES } from '@/config/constants';
import { SettingsList } from '@/types';
import { useLanguage } from '@hooks/screens/settings/useLanguage';

const TABS = [
  { title: 'settingsPage:general', value: 'general' },
  { title: 'settingsPage:charts', value: 'charts' },
  { title: 'settingsPage:profile', value: 'profile' },
];

export const useSettingsScreen = () => {
  const { t } = useTranslation('settingsPage');
  const router = useRouter();
  const { currentLanguage, openLanguageSheet } = useLanguage();

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const [selectedTab, setSelectedTab] = useState(TABS[0].value);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const userName = user ? `${user.name} ${user.surname}` : 'User';

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

  const handleDeleteAccountConfirm = useCallback(() => {
    // TODO: chiamata API delete account
    setDeleteAlertVisible(false);
  }, []);

  const menuList: SettingsList[] = useMemo(
    () => [
      {
        value: 'general',
        rows: [
          {
            title: t('menuCategories'),
            iconName: 'bookmark-outline',
            navigationScreen: '/(auth)/categories',
          },
          {
            title: t('menuBankAccounts'),
            iconName: 'grid-outline',
            navigationScreen: '/(auth)/bank-accounts',
          },
          {
            title: t('menuBankCards'),
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
            title: t('profile'),
            iconName: 'person-outline',
            navigationScreen: '/(auth)/profile',
          },
          {
            title: t('language'),
            iconName: 'globe-outline',
            rightLabel: `${currentLanguage.flag}  ${currentLanguage.label}`,
            callback: openLanguageSheet,
          },
          {
            title: t('deleteAccount'),
            iconName: 'person-delete-outline',
            color: theme.colors.red,
            callback: () => setDeleteAlertVisible(true),
          },
          {
            title: t('logOut'),
            iconName: 'log-out-outline',
            color: theme.colors.red,
            callback: handleLogout,
          },
        ],
      },
    ],
    [t, handleLogout],
  );

  const currentMenu = useMemo(
    () => menuList.find(menu => menu.value === selectedTab),
    [menuList, selectedTab],
  );

  return {
    tabs: TABS,
    user,
    userName,
    selectedTab,
    currentMenu,
    bottomTabHeight,
    deleteAlertVisible,
    setDeleteAlertVisible,
    handleTabChange,
    handleNavigate,
    handleLogout,
    handleDeleteAccountConfirm,
  };
};
