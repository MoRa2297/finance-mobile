import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { DateInputField } from '@components/ui/DateInputField';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { useProfileForm } from '@/hooks/screens/profile/useProfileForm';

export const ProfileForm: React.FC = () => {
  const { t } = useTranslation(['profilePage', 'common']);
  const [alertVisible, setAlertVisible] = useState(false);

  const { formik, user, firstError, handleImagePicker, handleOpenDatePicker } =
    useProfileForm();

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ name: true, surname: true, birthDate: true });
      setAlertVisible(true);
      return;
    }
    formik.handleSubmit();
  };

  const imageSource = formik.values.photoURI
    ? { uri: formik.values.photoURI }
    : user?.imageUrl
      ? { uri: user.imageUrl }
      : require('@/assets/userPlaceholder.png');

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          {/* Profile Image */}
          <Pressable
            onPress={handleImagePicker}
            style={styles.heroContainer}
            disabled={formik.isSubmitting}>
            <Image source={imageSource} style={styles.heroImage} />
          </Pressable>

          <DateInputField
            value={formik.values.birthDate}
            iconName="calendar-outline"
            placeholder={t('profilePage:birthDatePlaceholder')}
            customBackgroundColor={theme.colors.secondaryBK}
            onPress={handleOpenDatePicker}
          />

          <InputIconField
            placeholder={t('profilePage:namePlaceholder')}
            value={formik.values.name}
            onChange={v => formik.setFieldValue('name', v)}
            iconName="edit-outline"
            editable={!formik.isSubmitting}
          />

          <InputIconField
            placeholder={t('profilePage:surnamePlaceholder')}
            value={formik.values.surname}
            onChange={v => formik.setFieldValue('surname', v)}
            iconName="edit-outline"
            editable={!formik.isSubmitting}
          />

          <InputIconField
            placeholder={t('profilePage:emailPlaceholder')}
            value={formik.values.email}
            onChange={v => formik.setFieldValue('email', v)}
            iconName="email-outline"
            keyboardType="email-address"
            editable={!formik.isSubmitting}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            buttonText={t('common:save')}
            onPress={handleSubmit}
            backgroundColor={theme.colors.primary}
            style={styles.button}
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          />
        </View>
      </View>

      <Alert
        visible={alertVisible}
        title={t('profilePage:alertTitle')}
        subtitle={firstError ?? ''}
        primaryButtonText={t('common:ok')}
        onPrimaryPress={() => setAlertVisible(false)}
      />
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
    backgroundColor: theme.colors.secondaryBK,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    paddingTop: 15,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  heroContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  buttonContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
    paddingTop: 15,
  },
  button: {
    width: '60%',
    alignSelf: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
