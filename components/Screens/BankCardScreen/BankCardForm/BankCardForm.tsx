import { Layout, Text } from '@ui-kitten/components';
import { useFormik } from 'formik';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  MONTH_NUMBER,
  YEARS_NUMBER,
} from '../../../../config/constants';
import { Button } from '../../../UI/Button/Button';
import { InputIconField } from '../../../UI/InputIconField/InputIconField';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { Alert } from '../../../common/Alert/Alert';
import { SelectInput } from '../../../UI/SelectInput/SelectInput';
import { SheetManager } from 'react-native-actions-sheet';
import { SelectPickerInput } from '../../../UI/SelectPickerInput/SelectPickerInput';
import { useStores } from '../../../../hooks/useStores';

interface BankCardFormProps {
  bankCard: BankCardFormValues | null;
  handleSubmitForm: (value: BankCardFormValues) => void;

  submitError?: string;
}

export type BankCardFormValues = {
  id?: number | undefined;
  bankAccountId: number;
  cardLimit: string;
  monthExpiry: number;
  cardTypeId: number;
  yearExpiry: number;
  name: string;
};

export const BankCardForm: React.FunctionComponent<BankCardFormProps> = ({
  bankCard,
  handleSubmitForm,
  submitError,
}) => {
  const { dataStore, ui } = useStores();
  const { t } = useTranslation();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>(
    t<string>('components.bankCardForm.alertTitle'),
  );
  const [alertSubTitle, setAlertSubTitle] = useState<string>('');
  const [alertButtonText, setAlertButtonText] = useState<string>('');
  const [selectedImageBank, setSelectedImageBank] = useState<any>('');

  const [selectedBank, setSelectedBank] = useState<any>('');
  const [selectedCardType, setSelectedCardType] = useState<any>('');

  const onValidate = useCallback(
    (values: {
      monthExpiry: number | undefined;
      yearExpiry: number | undefined;
      bankAccountId: any;
      name: any;
      cardLimit: number;
      cardTypeId: any;
    }) => {
      let errors: any = {};
      if (!values.bankAccountId) {
        setAlertSubTitle(
          t<string>('components.bankCardForm.alertBankAccountIdError'),
        );
        setAlertButtonText(
          t<string>('components.bankCardForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.bankAccountId = 'Required';
      } else if (!values.name) {
        setAlertSubTitle(t<string>('components.bankCardForm.alertNameError'));
        setAlertButtonText(
          t<string>('components.bankCardForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.name = 'Required';
      } else if (!values.cardLimit) {
        setAlertSubTitle(
          t<string>('components.bankCardForm.alertCardLimitError'),
        );
        setAlertButtonText(
          t<string>('components.bankCardForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.cardLimit = 'Required';
      } else if (!values.cardTypeId) {
        setAlertSubTitle(t<string>('components.bankCardForm.alertTypeError'));
        setAlertButtonText(
          t<string>('components.bankCardForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.cardTypeId = 'Required';
      } else if (!values.monthExpiry) {
        setAlertSubTitle(
          t<string>('components.bankCardForm.alertMonthExpiryError'),
        );
        setAlertButtonText(
          t<string>('components.bankCardForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.monthExpiry = 'Required';
      } else if (!values.yearExpiry) {
        setAlertSubTitle(
          t<string>('components.bankCardForm.alertYearExpiryError'),
        );
        setAlertButtonText(
          t<string>('components.bankCardForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.yearExpiry = 'Required';
      }
      return errors;
    },
    [t],
  );

  const formik = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      id: bankCard?.id,
      bankAccountId: bankCard?.bankAccountId || undefined,
      name: bankCard?.name || undefined,
      cardLimit: bankCard?.cardLimit || '',
      cardTypeId: bankCard?.cardTypeId || undefined,
      monthExpiry: bankCard?.monthExpiry || MONTH_NUMBER[0].id,
      yearExpiry: bankCard?.yearExpiry || YEARS_NUMBER[0].id,
    },
    validate: onValidate,
    onSubmit: values => {
      handleSubmitForm_(values);
    },
  });

  const handleCloseAlert = useCallback(() => {
    setIsAlertVisible(false);
  }, []);

  const handleSubmitForm_ = useCallback(
    (values: any) => {
      handleSubmitForm(values);
    },
    [handleSubmitForm],
  );

  const handleOpenCardTypeSheet = useCallback(async () => {
    let result: any = await SheetManager.show('card-type-select-sheet');
    setSelectedCardType(result.item);
    formik.setFieldValue('cardTypeId', result.item.id);
  }, [formik]);

  const handleOpenBankAccountTypeSheet = useCallback(async () => {
    let result: any = await SheetManager.show(
      'current-bank-account-select-sheet',
    );

    const bankAccount = dataStore.bankAccount.find(
      account => account.id === result.item.id,
    );

    const bankTypeImage = dataStore.bankTypes.find(
      bankType => bankType.id === bankAccount?.bankAccountTypeId,
    );

    setSelectedImageBank(bankTypeImage?.imageUrl);

    setSelectedBank(result.item);
    formik.setFieldValue('bankAccountId', result.item.id);
  }, [dataStore.bankAccount, dataStore.bankTypes, formik]);

  const handleOpenBankClosingDaySheet = useCallback(
    async (typeValues: string) => {
      let dataToInject;

      if (typeValues === 'monthExpiry') {
        dataToInject = MONTH_NUMBER;
      } else {
        dataToInject = YEARS_NUMBER;
      }

      let result: any = await SheetManager.show('picker-sheet', {
        payload: { data: dataToInject },
      });
      formik.setFieldValue(typeValues, result.item);
    },
    [formik],
  );

  const setData = useCallback(() => {
    if (bankCard) {
      const selectedCardTypeId = dataStore.cardTypes.find(
        cardType => cardType.id === bankCard.cardTypeId,
      );

      const selectedbankAccountId = dataStore.bankAccount.find(
        bankAccount => bankAccount.id === bankCard.bankAccountId,
      );

      const bankTypeImage = dataStore.bankTypes.find(
        bankType => bankType.id === selectedbankAccountId?.bankAccountTypeId,
      );

      setSelectedImageBank(bankTypeImage?.imageUrl);
      setSelectedCardType(selectedCardTypeId);
      setSelectedBank(selectedbankAccountId);

      formik.setFieldValue('cardTypeId', selectedCardTypeId?.id);
      formik.setFieldValue('bankAccountId', selectedbankAccountId?.id);
      // TODO to check why it doesn't work whitout it
      formik.setFieldValue('cardLimit', String(bankCard.cardLimit));
    }
  }, [
    bankCard,
    dataStore.bankAccount,
    dataStore.bankTypes,
    dataStore.cardTypes,
    formik,
  ]);

  const showErrorFormSubmit = useCallback(() => {
    if (submitError) {
      setAlertSubTitle(submitError);
      setAlertButtonText(t<string>('components.bankCardForm.alertButtonText'));
      setIsAlertVisible(true);
    }
  }, [submitError, t]);

  useEffect(() => {
    showErrorFormSubmit();
    setData();
  }, []);

  return (
    <Layout style={styles.container}>
      <Layout style={styles.formContent}>
        <Layout style={styles.formContentTop}>
          <Text category="p2">
            {t<string>('components.bankCardForm.cardLimitTitle')}
          </Text>
          <InputIconField
            placeholder={t<string>(
              'components.bankCardForm.cardLimitPlaceholder',
            )}
            onChange={formik.handleChange('cardLimit')}
            value={formik.values.cardLimit}
            borderBottom={false}
            keyboardType="numeric"
          />
        </Layout>
        <Layout style={styles.formContentBottom}>
          <Layout style={styles.mainInputContainer}>
            <InputIconField
              placeholder={t<string>('components.bankCardForm.namePlaceholder')}
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              iconName={'edit-outline'}
            />
            <SelectInput
              placeholder={t<string>(
                'components.bankCardForm.typeCardPlaceholder',
              )}
              value={selectedCardType.name}
              iconName="grid-outline"
              iconNameRight="arrow-ios-forward-outline"
              valueBordered={true}
              handleOpenSheet={handleOpenCardTypeSheet}
              selectedImageUrl={selectedCardType.imageUrl}
              selectedBorderColor={theme['text-hint-color']}
            />

            <SelectInput
              placeholder={t<string>('components.bankCardForm.selectBank')}
              value={selectedBank.name}
              selectedBorderColor={theme['text-hint-color']}
              iconName="grid-outline"
              iconNameRight="arrow-ios-forward-outline"
              valueBordered={true}
              handleOpenSheet={handleOpenBankAccountTypeSheet}
              selectedImageUrl={selectedImageBank}
            />

            <SelectPickerInput
              placeholder={t<string>(
                'components.bankCardForm.monthExpiryPlaceholder',
              )}
              value={formik.values.monthExpiry}
              iconName="calendar-outline"
              handleOpenSheet={() =>
                handleOpenBankClosingDaySheet('monthExpiry')
              }
            />

            <SelectPickerInput
              placeholder={t<string>(
                'components.bankCardForm.yearExpiryPlaceholder',
              )}
              value={formik.values.yearExpiry}
              iconName="calendar-outline"
              handleOpenSheet={() =>
                handleOpenBankClosingDaySheet('yearExpiry')
              }
            />
          </Layout>

          <Layout
            style={[
              styles.buttonContainer,
              {
                paddingBottom: ui.bottomTabHeight,
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
      </Layout>
      <Alert
        visible={isAlertVisible}
        title={alertTitle}
        subTitle={alertSubTitle}
        buttonTextPrimary={alertButtonText}
        handlePrimary={handleCloseAlert}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
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
  },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  formContent: {
    flex: 1,
    backgroundColor: theme['color-basic-transparent'],
    gap: 5,
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
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    justifyContent: 'space-between',
  },
  mainInputContainer: {
    paddingTop: 15,
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});
