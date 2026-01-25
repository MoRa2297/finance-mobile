import { useState, useCallback, useMemo } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';

import { useDataStore } from '@/stores';
import {
  selectCategories,
  selectCategoriesByType,
} from '@/stores/data/data.selectors';
import { Category } from '@/types';
import { theme } from '@/config/theme';

type CategoryType = 'income' | 'expenses';

const TABS = [
  { title: 'common:expenses', value: 'expenses' },
  { title: 'common:income', value: 'income' },
];

export const useCategoriesScreen = () => {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store
  const categories = useDataStore(selectCategories);
  const deleteCategory = useDataStore(state => state.deleteCategory);

  // Local state
  const [selectedTab, setSelectedTab] = useState<CategoryType>('expenses');
  const [alertVisible, setAlertVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Derived
  const filteredCategories = useMemo(
    () => selectCategoriesByType(categories, selectedTab),
    [categories, selectedTab],
  );

  // Action sheet styles
  const actionSheetStyles = useMemo(
    () => ({
      containerStyle: {
        borderRadius: 20,
        backgroundColor: theme.colors.secondaryBK,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.colors.primaryBK,
        marginBottom: insets.bottom,
      },
      textStyle: {
        textAlign: 'center' as const,
        color: theme.colors.basic100,
      },
    }),
    [insets.bottom],
  );

  // Handlers
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value as CategoryType);
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    SheetManager.show('category-form-sheet', {
      payload: { category, type: category.type as CategoryType },
    });
  }, []);

  const handleAddCategory = useCallback(() => {
    const options = [t('categoriesPage:createCategory'), t('common:cancel')];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        ...actionSheetStyles,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          SheetManager.show('category-form-sheet', {
            payload: { category: null, type: selectedTab },
          });
        }
      },
    );
  }, [t, showActionSheetWithOptions, actionSheetStyles, selectedTab]);

  const handleOptionsPress = useCallback(
    (category: Category) => {
      const options = [
        t('common:edit'),
        t('common:delete'),
        t('common:cancel'),
      ];

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          ...actionSheetStyles,
        },
        selectedIndex => {
          if (selectedIndex === 0) {
            handleCategoryPress(category);
          } else if (selectedIndex === 1) {
            setCategoryToDelete(category);
            setAlertVisible(true);
          }
        },
      );
    },
    [t, showActionSheetWithOptions, actionSheetStyles, handleCategoryPress],
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

  return {
    // Constants
    tabs: TABS,

    // Data
    filteredCategories,

    // State
    alertVisible,

    // Handlers
    handleTabChange,
    handleCategoryPress,
    handleOptionsPress,
    handleAddCategory,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
