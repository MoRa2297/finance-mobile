import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetManager } from 'react-native-actions-sheet';

import {
  ScreenContainer,
  Header,
  SliderBar,
  EmptyData,
  Alert,
} from '@/components/ui';
import { CategoryListCard } from '@/components/screens/settings/categories';
import { useDataStore, useUIStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { Category } from '@/types/types';

const TABS = [
  { title: 'expenses', value: 'expenses' },
  { title: 'income', value: 'income' },
];

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Stores
  const categories = useDataStore(state => state.categories);
  const deleteCategory = useDataStore(state => state.deleteCategory);
  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  // State
  const [selectedTab, setSelectedTab] = useState(TABS[0].value);
  const [alertVisible, setAlertVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Filter categories by type
  const filteredCategories = useMemo(
    () => categories.filter(cat => cat.type === selectedTab),
    [categories, selectedTab],
  );

  // Handlers - TUTTI definiti al livello top del componente
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    // Open edit sheet
    SheetManager.show('category-form-sheet', {
      payload: { category, type: category.type as 'income' | 'expenses' },
    });
  }, []);

  // Handler per aggiungere categoria - definito QUI, non dentro showActionSheetWithOptions
  const openCreateCategorySheet = useCallback(() => {
    console.log('SHOWWW');
    SheetManager.show('category-form-sheet', {
      payload: { category: null, type: selectedTab as 'income' | 'expenses' },
    })
      .then(r => console.log('r: ', r))
      .catch(e => console.error(e));
  }, [selectedTab]);

  const handleAddCategory = useCallback(() => {
    const options = [
      t('screens.categoriesScreen.createCategory'),
      t('common.cancel'),
    ];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        containerStyle: [
          styles.actionSheetContainer,
          { marginBottom: insets.bottom },
        ],
        textStyle: styles.actionSheetText,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          // Chiama la funzione già definita
          openCreateCategorySheet();
        }
      },
    );
  }, [t, insets.bottom, showActionSheetWithOptions, openCreateCategorySheet]);

  const handleOptionsPress = useCallback(
    (category: Category) => {
      const options = [
        t('screens.categoriesScreen.edit'),
        t('screens.categoriesScreen.delete'),
        t('common.cancel'),
      ];
      const destructiveButtonIndex = 1;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          containerStyle: [
            styles.actionSheetContainer,
            { marginBottom: insets.bottom },
          ],
          textStyle: styles.actionSheetText,
        },
        selectedIndex => {
          switch (selectedIndex) {
            case 0:
              // Edit - chiama funzione esistente
              handleCategoryPress(category);
              break;
            case 1:
              // Delete
              setCategoryToDelete(category);
              setAlertVisible(true);
              break;
          }
        },
      );
    },
    [t, insets.bottom, showActionSheetWithOptions, handleCategoryPress],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setAlertVisible(false);
    }
  }, [categoryToDelete, deleteCategory]);

  const handleDeleteCancel = useCallback(() => {
    setCategoryToDelete(null);
    setAlertVisible(false);
  }, []);

  // Render functions
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
    () => <EmptyData title={t('screens.categoriesScreen.emptyData')} />,
    [t],
  );

  const keyExtractor = useCallback((item: Category) => item.id.toString(), []);

  return (
    <ScreenContainer
      style={styles.container}
      horizontalPadding={false}
      forceNoBottomPadding>
      {/* Header */}
      <Header
        title={t('screens.categoriesScreen.title')}
        showBackButton
        onSettingsPress={handleAddCategory}
      />

      {/* Tab Selector */}
      <View style={styles.sliderContainer}>
        <SliderBar tabs={TABS} onTabChange={handleTabChange} />
      </View>

      {/* List */}
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

      {/* Delete Confirmation Alert */}
      <Alert
        visible={alertVisible}
        title={t('screens.categoriesScreen.deleteTitle')}
        subtitle={t('screens.categoriesScreen.deleteSubtitle')}
        primaryButtonText={t('common.delete')}
        secondaryButtonText={t('common.cancel')}
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
