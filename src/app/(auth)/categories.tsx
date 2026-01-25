import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { Category } from '@/types';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { SliderBar } from '@components/ui/SliderBar';
import { Header } from '@components/ui/Header';
import { Alert } from '@components/ui/Alert';
import { EmptyData } from '@components/common';
import { CategoryListCard } from '@components/screens/settings';
import { useCategoriesScreen } from '@/hooks/screens/categories';

export default function CategoriesScreen() {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const {
    tabs,
    filteredCategories,
    alertVisible,
    handleTabChange,
    handleCategoryPress,
    handleOptionsPress,
    handleAddCategory,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useCategoriesScreen();

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryListCard
        category={item}
        onPress={handleCategoryPress}
        onOptionsPress={handleOptionsPress}
      />
    ),
    [handleCategoryPress, handleOptionsPress],
  );

  const renderEmpty = useCallback(
    () => <EmptyData title={t('categoriesPage:emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback((item: Category) => item.id.toString(), []);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      <Header
        left={{ type: 'back', variant: 'icon' }}
        right={{ type: 'settings', onPress: handleAddCategory }}
      />

      <View style={styles.sliderContainer}>
        <SliderBar tabs={tabs} onTabChange={handleTabChange} />
      </View>

      <View style={[styles.listContainer, { paddingBottom: bottomTabHeight }]}>
        <FlatList
          data={filteredCategories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            filteredCategories.length === 0 && styles.listContentEmpty,
          ]}
        />
      </View>

      <Alert
        visible={alertVisible}
        title={t('categoriesPage:alertTitle')}
        subtitle={t('categoriesPage:alertSubTitle')}
        primaryButtonText={t('categoriesPage:alertButtonYes')}
        secondaryButtonText={t('categoriesPage:alertButtonNo')}
        onPrimaryPress={handleDeleteConfirm}
        onSecondaryPress={handleDeleteCancel}
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
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginTop: 10,
    overflow: 'hidden',
  },
  listContent: {
    paddingTop: 15,
  },
  listContentEmpty: {
    flex: 1,
  },
});
