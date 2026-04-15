import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Category, CategoryType, Color, CategoryIcon } from '@/types';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/stores/category/category.mutations';

interface CategoryFormState {
  name: string;
  colorId: number;
  iconId: number;
  alertMessage: string | null;
}

interface UseCategoryFormProps {
  category: Category | null;
  type: CategoryType;
  colors: Color[];
  categoryIcons: CategoryIcon[];
  onClose: () => void;
}

interface UseCategoryFormReturn {
  state: CategoryFormState;
  isSubmitting: boolean;
  selectedColor: string;
  selectedIcon: string;
  set: (patch: Partial<CategoryFormState>) => void;
  handleColorChange: (hexCode: string) => void;
  handleIconChange: (iconName: string) => void;
  handleSubmit: () => Promise<void>;
}

export const useCategoryForm = ({
  category,
  type,
  colors,
  categoryIcons,
  onClose,
}: UseCategoryFormProps): UseCategoryFormReturn => {
  const { t } = useTranslation('categoriesPage');

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory();

  const defaultColor = colors[0];
  const defaultIcon = categoryIcons[0];

  const initialColorId = category?.colorId
    ? Number(category.colorId)
    : defaultColor?.id;

  const initialIconId = category?.iconId
    ? Number(category.iconId)
    : defaultIcon?.id;

  const [state, setState] = useState<CategoryFormState>({
    name: category?.name ?? '',
    colorId: initialColorId,
    iconId: initialIconId,
    alertMessage: null,
  });

  const set = useCallback(
    (patch: Partial<CategoryFormState>) =>
      setState(prev => ({ ...prev, ...patch })),
    [],
  );

  const selectedColor =
    colors.find(c => c.id === state.colorId)?.hexCode ??
    defaultColor?.hexCode ??
    '#5d4c86';

  const selectedIcon =
    categoryIcons.find(i => i.id === state.iconId)?.iconName ??
    defaultIcon?.iconName ??
    'cart-outline';

  const handleColorChange = useCallback(
    (hexCode: string) => {
      const found = colors.find(c => c.hexCode === hexCode);
      if (found) set({ colorId: found.id });
    },
    [colors, set],
  );

  const handleIconChange = useCallback(
    (iconName: string) => {
      const found = categoryIcons.find(i => i.iconName === iconName);
      if (found) set({ iconId: found.id });
    },
    [categoryIcons, set],
  );

  const handleSubmit = useCallback(async () => {
    if (!state.name.trim()) {
      set({ alertMessage: t('categoryForm.alertNameError') });
      return;
    }

    const payload = {
      name: state.name.trim(),
      colorId: state.colorId,
      iconId: state.iconId,
      type,
    };

    if (category?.id) {
      await updateCategory({ id: category.id, payload });
    } else {
      await createCategory(payload);
    }
    onClose();
  }, [
    state,
    category?.id,
    type,
    createCategory,
    updateCategory,
    onClose,
    t,
    set,
  ]);

  return {
    state,
    isSubmitting: isCreating || isUpdating,
    selectedColor,
    selectedIcon,
    set,
    handleColorChange,
    handleIconChange,
    handleSubmit,
  };
};
