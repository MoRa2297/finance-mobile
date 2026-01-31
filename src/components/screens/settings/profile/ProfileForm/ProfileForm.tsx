import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import * as ImagePicker from 'expo-image-picker';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { User } from '@/types';
import { DateInputField } from '@components/ui/DateInputField';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';

interface ProfileFormProps {
  user: User | null;
  onSubmit: (values: ProfileFormValues, photoBase64?: string) => void;
  submitError?: string;
  isSubmitting?: boolean;
}

export interface ProfileFormValues {
  email?: string;
  name?: string;
  surname?: string;
  birthDate?: string;
  imageUrl?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  submitError,
  isSubmitting = false,
}) => {
  const { t } = useTranslation(['profilePage', 'common']);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [birthDate, setBirthDate] = useState(() => {
    if (user?.birthDate) {
      const date = new Date(user.birthDate);
      return `${date.getDate().toString().padStart(2, '0')}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;
    }
    return '';
  });

  // Image state
  const [photoURI, setPhotoURI] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Show error from props
  useEffect(() => {
    if (submitError) {
      setAlertMessage(submitError);
      setAlertVisible(true);
    }
  }, [submitError]);

  // Handlers
  const handleImagePicker = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setAlertMessage(t('profilePage:permissionDenied'));
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoURI(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 || '');
    }
  }, [t]);

  const handleOpenDatePicker = useCallback(async () => {
    const [day, month, year] = birthDate
      ? birthDate.split('-')
      : ['1', '1', '2000'];

    const result = await SheetManager.show('date-picker-sheet', {
      payload: { day, month, year },
    });

    if (result) {
      console.log('result: ', result);
      const newDate = `${result.day.padStart(2, '0')}-${result.month.padStart(
        2,
        '0',
      )}-${result.year}`;
      setBirthDate(newDate);
    }
  }, [birthDate]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    // Validation
    if (!name.trim()) {
      setAlertMessage(t('profilePage:alertNameError'));
      setAlertVisible(true);
      return;
    }
    if (!surname.trim()) {
      setAlertMessage(t('profilePage:alertSurnameError'));
      setAlertVisible(true);
      return;
    }
    if (!birthDate) {
      setAlertMessage(t('profilePage:alertBirthDateError'));
      setAlertVisible(true);
      return;
    }

    const values: ProfileFormValues = {
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      birthDate,
      imageUrl: photoBase64
        ? `data:image/png;base64,${photoBase64}`
        : undefined,
    };

    onSubmit(values, photoBase64);
  }, [name, surname, email, birthDate, photoBase64, onSubmit, isSubmitting, t]);

  // Get image source
  const imageSource = photoURI
    ? { uri: photoURI }
    : user?.imageUrl
      ? { uri: user.imageUrl }
      : require('@/assets/userPlaceholder.png');

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Form Content */}
        <View style={styles.formContent}>
          <View style={styles.inputsContainer}>
            {/* Profile Image */}
            <Pressable
              onPress={handleImagePicker}
              style={styles.heroContainer}
              disabled={isSubmitting}>
              <Image source={imageSource} style={styles.heroImage} />
            </Pressable>

            {/* Birth Date */}
            <DateInputField
              value={birthDate}
              iconName="calendar-outline"
              placeholder={t('profilePage:birthDatePlaceholder')}
              customBackgroundColor={theme.colors.secondaryBK}
              onPress={handleOpenDatePicker}
            />

            {/* Name */}
            <InputIconField
              placeholder={t('profilePage:namePlaceholder')}
              value={name}
              onChange={setName}
              iconName="edit-outline"
              editable={!isSubmitting}
            />

            {/* Surname */}
            <InputIconField
              placeholder={t('profilePage:surnamePlaceholder')}
              value={surname}
              onChange={setSurname}
              iconName="edit-outline"
              editable={!isSubmitting}
            />

            {/* Email */}
            <InputIconField
              placeholder={t('profilePage:emailPlaceholder')}
              value={email}
              onChange={setEmail}
              iconName="email-outline"
              keyboardType="email-address"
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <View style={[styles.buttonContainer]}>
            <Button
              buttonText={t('common:save')}
              onPress={handleSubmit}
              backgroundColor={theme.colors.primary}
              style={styles.button}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </View>
        </View>

        {/* Alert */}
        <Alert
          visible={alertVisible}
          title={t('profilePage:alertTitle')}
          subtitle={alertMessage}
          primaryButtonText={t('common:ok')}
          onPrimaryPress={() => setAlertVisible(false)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  formContent: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    paddingTop: 15,
    paddingHorizontal: HORIZONTAL_PADDING,
    backgroundColor: theme.colors.secondaryBK,
  },
  heroContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent,
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  buttonContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,

    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },
  button: {
    width: '60%',
    alignSelf: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
    marginBottom: 20,
  },
});
