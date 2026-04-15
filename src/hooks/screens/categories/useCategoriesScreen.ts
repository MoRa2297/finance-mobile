import { useState, useCallback, useMemo } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import { useActionSheetStyles } from '@/hooks';
import { useUIStore } from '@/stores';
import { Category, CategoryType } from '@/types';
import { useCategories, useDeleteCategory } from '@stores/category';

export const CategoryTypeValue = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

const TABS = [
  { title: 'common:expenses', value: CategoryTypeValue.EXPENSE },
  { title: 'common:income', value: CategoryTypeValue.INCOME },
];

export const useCategoriesScreen = () => {
  const { t } = useTranslation(['categoriesPage', 'common']);
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetStyles = useActionSheetStyles();

  const bottomTabHeight = useUIStore(state => state.bottomTabHeight);

  const { data: categories = [], isLoading } = useCategories();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const [selectedTab, setSelectedTab] = useState<CategoryType>(
    CategoryTypeValue.EXPENSE,
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const filteredCategories = useMemo(
    () => categories.filter(c => c.type === selectedTab),
    [categories, selectedTab],
  );

  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value as CategoryType);
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    SheetManager.show('category-form-sheet', {
      payload: { category, type: category.type as CategoryType },
    });
  }, []);

  const handleAddCategory = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: [t('categoriesPage:createCategory'), t('common:cancel')],
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
      showActionSheetWithOptions(
        {
          options: [t('common:edit'), t('common:delete'), t('common:cancel')],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          ...actionSheetStyles,
        },
        selectedIndex => {
          if (selectedIndex === 0) handleCategoryPress(category);
          if (selectedIndex === 1) {
            setCategoryToDelete(category);
            setAlertVisible(true);
          }
        },
      );
    },
    [t, showActionSheetWithOptions, actionSheetStyles, handleCategoryPress],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
    setAlertVisible(false);
  }, [categoryToDelete, deleteCategory]);

  const handleDeleteCancel = useCallback(() => {
    setCategoryToDelete(null);
    setAlertVisible(false);
  }, []);

  const keyExtractor = useCallback((item: Category) => item.id.toString(), []);

  const listContentStyle = useMemo(
    () => ({ paddingBottom: bottomTabHeight }),
    [bottomTabHeight],
  );

  return {
    tabs: TABS,
    filteredCategories,
    isLoading: isLoading || isDeleting,
    alertVisible,
    keyExtractor,
    listContentStyle,
    handleTabChange,
    handleCategoryPress,
    handleOptionsPress,
    handleAddCategory,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
