import { useCallback, useMemo, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import * as ImagePicker from 'expo-image-picker';

import { useAuthStore } from '@/stores';
import { authService } from '@/services';

export interface ProfileFormValues {
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  photoURI: string;
  photoBase64: string;
}

export const useProfileForm = () => {
  const { t } = useTranslation(['profilePage', 'common']);
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t('profilePage:alertNameError')),
    surname: Yup.string().trim().required(t('profilePage:alertSurnameError')),
    birthDate: Yup.string().required(t('profilePage:alertBirthDateError')),
  });

  const initialValues: ProfileFormValues = useMemo(
    () => ({
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      email: user?.email ?? '',
      birthDate: user?.birthDate
        ? (() => {
            const date = new Date(user.birthDate);
            return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
          })()
        : '',
      photoURI: '',
      photoBase64: '',
    }),
    [user],
  );

  const formik = useFormik<ProfileFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      // Converti DD-MM-YYYY → Date ISO per il backend
      const [day, month, year] = values.birthDate.split('-');
      const birthDateISO = new Date(`${year}-${month}-${day}`).toISOString();

      const updatedUser = await authService.updateProfile({
        name: values.name,
        surname: values.surname,
        birthDate: birthDateISO,
        // imageUrl: values.photoBase64
        //   ? `data:image/png;base64,${values.photoBase64}`
        //   : undefined,
      });
      updateUser(updatedUser);
    },
  });

  const handleImagePicker = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      formik.setFieldValue('photoURI', result.assets[0].uri);
      formik.setFieldValue('photoBase64', result.assets[0].base64 ?? '');
    }
  }, [formik]);

  const handleOpenDatePicker = useCallback(async () => {
    const [day, month, year] = formik.values.birthDate
      ? formik.values.birthDate.split('-')
      : ['1', '1', '2000'];

    const result = await SheetManager.show('date-picker-sheet', {
      payload: { day, month, year },
    });

    if (result) {
      const newDate = `${result.day.padStart(2, '0')}-${result.month.padStart(2, '0')}-${result.year}`;
      formik.setFieldValue('birthDate', newDate);
    }
  }, [formik]);

  const firstError = useMemo(() => {
    const errors = formik.errors;
    return errors.name || errors.surname || errors.birthDate || null;
  }, [formik.errors]);

  return {
    formik,
    user,
    firstError,
    handleImagePicker,
    handleOpenDatePicker,
  };
};
