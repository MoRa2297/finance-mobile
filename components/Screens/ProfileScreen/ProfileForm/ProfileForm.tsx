import { Layout } from '@ui-kitten/components';
import { useFormik } from 'formik';
import React, { useState, useCallback, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { Button } from '../../../UI/Button/Button';
import { InputIconField } from '../../../UI/InputIconField/InputIconField';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { Alert } from '../../../common/Alert/Alert';
import { User } from '../../../../types/types';
import { SheetManager } from 'react-native-actions-sheet';
import { useStores } from '../../../../hooks/useStores';
import { DateInputField } from '../../../UI/DateInputField/DateInputField';
import Moment from 'moment';
import { useIsKeyboardOpen } from '../../../../hooks/useIsKeyboardOpen';
import * as ImagePicker from 'react-native-image-picker';

interface ProfileFormProps {
  user: User;
  handleSubmitForm: (value: ProfileFormValues, photoBase64: string) => void;
  submitError?: string;
}

export type ProfileFormValues = {
  email: string | undefined;
  password: string | undefined;
  name?: string | undefined;
  surname?: string | undefined;
  birthDate?: string;
  sex?: string | undefined;
  imageUrl?: string | undefined;
  acceptedTerms: boolean | undefined;
};

// TODO OPTIMIZE

export const ProfileForm: React.FunctionComponent<ProfileFormProps> = ({
  user,
  handleSubmitForm,
  submitError,
}) => {
  const [isKeyboardOpen] = useIsKeyboardOpen();
  const { dataStore, ui } = useStores();
  const { t } = useTranslation();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>(
    t<string>('components.profileForm.alertTitle'),
  );
  const [alertSubTitle, setAlertSubTitle] = useState<string | undefined>(
    undefined,
  );
  const [alertButtonText, setAlertButtonText] = useState<string>('');

  const [photoURI, setPhotoURI] = useState<string>('');
  const [photoBase64, setPhotoBase64] = useState<string>('');

  const onValidate = useCallback(
    (values: ProfileFormValues) => {
      let errors: any = {};
      if (!values.birthDate) {
        setAlertSubTitle(
          t<string>('components.profileForm.alertBirthDateError'),
        );
        setAlertButtonText(t<string>('components.profileForm.alertButtonText'));
        setIsAlertVisible(true);
        errors.birthDate = 'Required';
      }
      if (!values.name) {
        setAlertSubTitle(t<string>('components.profileForm.alertNameError'));
        setAlertButtonText(t<string>('components.profileForm.alertButtonText'));
        setIsAlertVisible(true);
        errors.name = 'Required';
      }
      if (!values.surname) {
        setAlertSubTitle(t<string>('components.profileForm.alertSurnameError'));
        setAlertButtonText(t<string>('components.profileForm.alertButtonText'));
        setIsAlertVisible(true);
        errors.surname = 'Required';
      }
      return errors;
    },
    [t],
  );

  const formik = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      email: user.email,
      password: user.password,
      birthDate:
        Moment(user?.birthDate).format('DD-MM-YYYY') ||
        Moment().format('DD-MM-YYYY'),
      name: user.name,
      surname: user.surname,
      acceptedTerms: true,
    },
    validate: onValidate,
    onSubmit: values => {
      handleSubmitForm_(values, photoBase64);
    },
    enableReinitialize: true,
  });

  const handleCloseAlert = useCallback(() => {
    setIsAlertVisible(false);
  }, []);

  const handleSubmitForm_ = useCallback(
    (values: any, newPhotoBase64: string) => {
      handleSubmitForm(values, newPhotoBase64);
    },
    [handleSubmitForm],
  );

  const handleOpenDatePickerSheet = async () => {
    const prevDate = Moment(formik.values.birthDate, 'DD-MM-YYYY');

    let result: any = await SheetManager.show('date-picker-sheet', {
      payload: {
        day: String(prevDate.get('date')),
        month: String(prevDate.get('months') + 1),
        year: String(prevDate.get('years')),
      },
    });

    const newDate = Moment()
      .year(result.year)
      .month(result.month - 1)
      .date(result.day)
      .format('DD-MM-YYYY');

    formik.setFieldValue('birthDate', newDate);
  };

  const showErrorFormSubmit = useCallback(() => {
    if (submitError) {
      setAlertSubTitle(submitError);
      setAlertButtonText(t<string>('components.profileForm.alertButtonText'));
      setIsAlertVisible(true);
    }
  }, [submitError, t]);

  useEffect(() => {
    showErrorFormSubmit();
  }, [showErrorFormSubmit]);

  const handleImagePicker = useCallback(() => {
    ImagePicker.launchImageLibrary({ includeBase64: true }, response => {
      if (response.error) {
        throw new Error();
      }

      setPhotoURI(response.assets[0].uri);
      setPhotoBase64(response.assets[0].base64); // update the local state, this will rerender your TomarFoto component with the photo uri path.
    });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.general}
      showsVerticalScrollIndicator={false}
      style={styles.general}
      scrollEnabled={isKeyboardOpen}>
      <Layout style={styles.container}>
        <Layout style={styles.formContent}>
          <Layout
            style={[
              styles.mainInputContainer,
              {
                marginBottom: isKeyboardOpen ? 15 : 0,
              },
            ]}>
            <TouchableOpacity onPress={handleImagePicker}>
              <Layout style={styles.heroContainer}>
                <Image
                  source={
                    photoURI || user.imageUrl
                      ? { uri: photoURI || user.imageUrl }
                      : require('../../../../assets/userPlaceholder.png')
                  }
                  style={styles.heroImage}
                />
              </Layout>
            </TouchableOpacity>
            <DateInputField
              onChange={formik.handleChange('date')}
              value={formik.values.birthDate}
              iconName="calendar-outline"
              handleOpenSheet={handleOpenDatePickerSheet}
              customBackgroundColor={theme['color-secondary-BK']}
            />

            <InputIconField
              placeholder={t<string>('components.profileForm.namePlaceholder')}
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              iconName="edit-outline"
            />
            <InputIconField
              placeholder={t<string>(
                'components.profileForm.surnamePlaceholder',
              )}
              onChange={formik.handleChange('surname')}
              value={formik.values.surname}
              iconName="edit-outline"
            />

            <InputIconField
              placeholder={t<string>('components.profileForm.emailPlaceholder')}
              onChange={formik.handleChange('email')}
              value={formik.values.email}
              iconName="edit-outline"
            />
          </Layout>

          <Layout
            style={[
              styles.buttonContainer,
              {
                paddingBottom: isKeyboardOpen ? 20 : ui.bottomTabHeight,
              },
            ]}>
            <Button
              size="small"
              style={styles.button}
              backgroundColor={theme['color-primary']}
              borderColor={theme['color-primary']}
              textStyle={{ color: theme['color-basic-100'] }}
              onPress={formik.handleSubmit}
              buttonText={t<string>('common.save')}
            />
          </Layout>
        </Layout>
        <Alert
          visible={isAlertVisible}
          title={alertTitle}
          subTitle={alertSubTitle}
          buttonTextPrimary={alertButtonText}
          handlePrimary={handleCloseAlert}
        />
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  general: {
    flexGrow: 1,
    backgroundColor: theme['color-basic-transparent'],
  },
  container: {
    flex: 1,
    backgroundColor: theme['color-basic-transparent'],
  },
  keyboardAvoidingView: {
    height: 'auto',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: theme['color-basic-transparent'],
  },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  formContent: {
    flex: 1,
    backgroundColor: theme['color-secondary-BK'],
    gap: 5,
    justifyContent: 'space-between',
  },
  formContentTop: {
    paddingTop: 15,
    backgroundColor: theme['color-basic-transparent'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    marginHorizontal: HORIZONTAL_PADDING,
    gap: 0,
  },
  formContentBottom: {
    flex: 1,
    backgroundColor: theme['color-secondary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    justifyContent: 'space-between',
  },
  mainInputContainer: {
    paddingTop: 15,
    backgroundColor: theme['color-secondary-BK'],
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  heroContainer: {
    gap: 10,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme['color-basic-transparent'],
    flexDirection: 'column',
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
  },
});
