import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { SettingsHeader, SettingRow } from '@/components/screens/settings';
import { theme } from '@/config/theme';
import { SliderBar } from '@components/ui/SliderBar';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { Alert } from '@components/ui/Alert';
import { useSettingsScreen } from '@hooks/screens/settings/useSettingsScreen';

export default function SettingsScreen() {
  const { t } = useTranslation('settingsPage');

  const {
    tabs,
    user,
    userName,
    currentMenu,
    bottomTabHeight,
    deleteAlertVisible,
    setDeleteAlertVisible,
    handleTabChange,
    handleNavigate,
    handleDeleteAccountConfirm,
  } = useSettingsScreen();

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <SettingsHeader
        name={userName}
        email={user?.email ?? ''}
        imageUrl={user?.imageUrl ?? undefined}
      />

      <View style={styles.sliderContainer}>
        <SliderBar tabs={tabs} onTabChange={handleTabChange} />
      </View>

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
              isLast={index === currentMenu.rows.length - 1}
              onPress={() =>
                row.navigationScreen
                  ? handleNavigate(row.navigationScreen)
                  : row.callback?.()
              }
            />
          ))
        )}
      </ScrollView>

      <Alert
        destructive
        visible={deleteAlertVisible}
        title={t('deleteAccountAlertTitle')}
        subtitle={t('deleteAccountAlertSubtitle')}
        primaryButtonText={t('deleteAccountAlertConfirm')}
        secondaryButtonText={t('common:cancel')}
        onPrimaryPress={handleDeleteAccountConfirm}
        onSecondaryPress={() => setDeleteAlertVisible(false)}
      />
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
