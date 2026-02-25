import { useState, useCallback, useMemo, useEffect } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';

import { useCategoryStore, categorySelectors } from '@/stores';
import { Category } from '@/types';
import { theme } from '@/config/theme';

type CategoryType = 'income' | 'expense';

const TABS = [
  { title: 'common:expenses', value: 'expense' },
  { title: 'common:income', value: 'income' },
];

export const useCategoriesScreen = () => {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  // Store
  const categories = useCategoryStore(categorySelectors.categories);
  const isLoading = useCategoryStore(categorySelectors.isLoading);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const deleteCategory = useCategoryStore(state => state.deleteCategory);

  // Local state
  const [selectedTab, setSelectedTab] = useState<CategoryType>('expense');
  const [alertVisible, setAlertVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Fetch al mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Derived
  const filteredCategories = useMemo(
    () => categories.filter(c => c.type === selectedTab),
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

  const handleDeleteConfirm = useCallback(async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setAlertVisible(false);
    }
  }, [categoryToDelete, deleteCategory]);

  const handleDeleteCancel = useCallback(() => {
    setCategoryToDelete(null);
    setAlertVisible(false);
  }, []);

  return {
    tabs: TABS,
    filteredCategories,
    isLoading,
    alertVisible,
    handleTabChange,
    handleCategoryPress,
    handleOptionsPress,
    handleAddCategory,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
