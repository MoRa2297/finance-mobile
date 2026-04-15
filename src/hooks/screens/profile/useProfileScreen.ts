import { useCallback, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SheetManager } from 'react-native-actions-sheet';
import * as ImagePicker from 'expo-image-picker';

import { useAuthStore } from '@/stores';
import { authService } from '@/services';
import { parseDateToDisplay } from '@/utils';

export interface ProfileFormValues {
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  photoURI: string;
  photoBase64: string;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required(),
  surname: Yup.string().trim().required(),
  birthDate: Yup.string().required(),
});

const parseDateToISO = (displayDate: string): string => {
  const [day, month, year] = displayDate.split('-');
  return new Date(`${year}-${month}-${day}`).toISOString();
};

export const useProfileScreen = () => {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const [alertVisible, setAlertVisible] = useState(false);

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      email: user?.email ?? '',
      birthDate: user?.birthDate ? parseDateToDisplay(user.birthDate) : '',
      photoURI: '',
      photoBase64: '',
    },
    validationSchema,
    onSubmit: async values => {
      const updatedUser = await authService.updateProfile({
        name: values.name,
        surname: values.surname,
        birthDate: parseDateToISO(values.birthDate),
      });
      updateUser(updatedUser);
    },
  });

  const handleFieldChange = useCallback(
    (field: keyof ProfileFormValues) => (value: string) => {
      formik.setFieldValue(field, value);
    },
    [formik.setFieldValue],
  );

  const handleSubmit = useCallback(async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ name: true, surname: true, birthDate: true });
      setAlertVisible(true);
      return;
    }
    formik.handleSubmit();
  }, [formik]);

  const handleImagePicker = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

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
  }, [formik.setFieldValue]);

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
  }, [formik.values.birthDate, formik.setFieldValue]);

  const imageSource = useMemo(() => {
    if (formik.values.photoURI) return { uri: formik.values.photoURI };
    if (user?.imageUrl) return { uri: user.imageUrl };
    return require('@/assets/userPlaceholder.png');
  }, [formik.values.photoURI, user?.imageUrl]);

  const firstError = useMemo(() => {
    const { name, surname, birthDate } = formik.errors;
    return name || surname || birthDate || null;
  }, [formik.errors]);

  return {
    // form state
    values: formik.values,
    isSubmitting: formik.isSubmitting,
    // handlers
    handleFieldChange,
    handleSubmit,
    handleImagePicker,
    handleOpenDatePicker,
    // alert
    alertVisible,
    setAlertVisible,
    firstError,
    // derived
    imageSource,
  };
};
