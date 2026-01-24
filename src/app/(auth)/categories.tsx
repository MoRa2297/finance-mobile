import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetManager } from 'react-native-actions-sheet';

import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { Category } from '@/types';
import { ScreenContainer } from '@components/ui/ScreenContainer';
import { SliderBar } from '@components/ui/SliderBar';
import { Header } from '@components/ui/Header';
import { Alert } from '@components/ui/Alert';
import { EmptyData } from '@components/common';
import { CategoryListCard } from '@components/screens/settings';

const TABS = [
  { title: 'common:expenses', value: 'expenses' },
  { title: 'common:income', value: 'income' },
];

export default function CategoriesScreen() {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  const categories = useDataStore(state => state.categories);
  const deleteCategory = useDataStore(state => state.deleteCategory);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const [selectedTab, setSelectedTab] = useState(TABS[0].value);
  const [alertVisible, setAlertVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Filter categories based on selected tab (expenses/income)
  const filteredCategories = useMemo(
    () => categories.filter(cat => cat.type === selectedTab),
    [categories, selectedTab],
  );

  // Memoized action sheet container style to avoid recreation on each render
  const actionSheetContainerStyle = useMemo(
    () => ({
      ...styles.actionSheetContainer,
      marginBottom: insets.bottom,
    }),
    [insets.bottom],
  );

  // Handle tab switch between expenses and income
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  // Open edit sheet when category is pressed
  const handleCategoryPress = useCallback((category: Category) => {
    SheetManager.show('category-form-sheet', {
      payload: { category, type: category.type as 'income' | 'expenses' },
    });
  }, []);

  // Open create category sheet
  const openCreateCategorySheet = useCallback(() => {
    SheetManager.show('category-form-sheet', {
      payload: { category: null, type: selectedTab as 'income' | 'expenses' },
    });
  }, [selectedTab]);

  // Show action sheet with "Create Category" option
  const handleAddCategory = useCallback(() => {
    const options = [t('categoriesPage:createCategory'), t('common:cancel')];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        containerStyle: actionSheetContainerStyle,
        textStyle: styles.actionSheetText,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          openCreateCategorySheet();
        }
      },
    );
  }, [
    t,
    showActionSheetWithOptions,
    actionSheetContainerStyle,
    openCreateCategorySheet,
  ]);

  // Show action sheet with Edit/Delete options for a category
  const handleOptionsPress = useCallback(
    (category: Category) => {
      const options = [
        t('common:edit'),
        t('common:delete'),
        t('common:cancel'),
      ];
      const destructiveButtonIndex = 1;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          containerStyle: actionSheetContainerStyle,
          textStyle: styles.actionSheetText,
        },
        selectedIndex => {
          switch (selectedIndex) {
            case 0: // Edit
              handleCategoryPress(category);
              break;
            case 1: // Delete
              setCategoryToDelete(category);
              setAlertVisible(true);
              break;
          }
        },
      );
    },
    [
      t,
      showActionSheetWithOptions,
      actionSheetContainerStyle,
      handleCategoryPress,
    ],
  );

  // Confirm category deletion
  const handleDeleteConfirm = useCallback(() => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setAlertVisible(false);
    }
  }, [categoryToDelete, deleteCategory]);

  // Cancel category deletion
  const handleDeleteCancel = useCallback(() => {
    setCategoryToDelete(null);
    setAlertVisible(false);
  }, []);

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
      {/* Header with back button and settings */}
      <Header
        left={{ type: 'back', variant: 'icon' }}
        right={{ type: 'settings', onPress: handleAddCategory }}
      />

      {/* Tab selector for expenses/income */}
      <View style={styles.sliderContainer}>
        <SliderBar tabs={TABS} onTabChange={handleTabChange} />
      </View>

      {/* Category list */}
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

      {/* Delete confirmation alert */}
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
  actionSheetContainer: {
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.primaryBK,
  },
  actionSheetText: {
    textAlign: 'center',
    color: theme.colors.basic100,
  },
});
