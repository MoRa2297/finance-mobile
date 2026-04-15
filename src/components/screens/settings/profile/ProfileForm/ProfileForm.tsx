import React from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ImageSourcePropType } from 'react-native';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { DateInputField } from '@components/ui/DateInputField';
import { InputIconField } from '@components/ui/InputIconField';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { ProfileFormValues } from '@hooks/screens/profile/useProfileScreen';

interface ProfileFormProps {
  values: ProfileFormValues;
  isSubmitting: boolean;
  imageSource: ImageSourcePropType;
  firstError: string | null;
  alertVisible: boolean;
  setAlertVisible: (v: boolean) => void;
  handleFieldChange: (
    field: keyof ProfileFormValues,
  ) => (value: string) => void;
  handleSubmit: () => void;
  handleImagePicker: () => void;
  handleOpenDatePicker: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  values,
  isSubmitting,
  imageSource,
  firstError,
  alertVisible,
  setAlertVisible,
  handleFieldChange,
  handleSubmit,
  handleImagePicker,
  handleOpenDatePicker,
}) => {
  const { t } = useTranslation(['profilePage', 'common']);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          <Pressable
            onPress={handleImagePicker}
            style={styles.heroContainer}
            disabled={isSubmitting}>
            <Image source={imageSource} style={styles.heroImage} />
          </Pressable>

          <DateInputField
            value={values.birthDate}
            iconName="calendar-outline"
            placeholder={t('profilePage:birthDatePlaceholder')}
            customBackgroundColor={theme.colors.secondaryBK}
            onPress={handleOpenDatePicker}
          />

          <InputIconField
            placeholder={t('profilePage:namePlaceholder')}
            value={values.name}
            onChange={handleFieldChange('name')}
            iconName="edit-outline"
            editable={!isSubmitting}
          />

          <InputIconField
            placeholder={t('profilePage:surnamePlaceholder')}
            value={values.surname}
            onChange={handleFieldChange('surname')}
            iconName="edit-outline"
            editable={!isSubmitting}
          />

          <InputIconField
            placeholder={t('profilePage:emailPlaceholder')}
            value={values.email}
            onChange={handleFieldChange('email')}
            iconName="email-outline"
            keyboardType="email-address"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.buttonContainer}>
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
  scrollView: { flex: 1, backgroundColor: theme.colors.transparent },
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
    justifyContent: 'space-between',
  },
  inputsContainer: { paddingTop: 15, paddingHorizontal: HORIZONTAL_PADDING },
  heroContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: { width: 130, height: 130, borderRadius: 65 },
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
