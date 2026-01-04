import { Layout, Text } from '@ui-kitten/components';
import { useFormik } from 'formik';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { ColorInputField } from '../../../UI/ColorInputField/ColorInputField';
import { Button } from '../../../UI/Button/Button';
import { InputIconField } from '../../../UI/InputIconField/InputIconField';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { Alert } from '../../../common/Alert/Alert';
import { Color } from '../../../../types/types';
import { SelectInput } from '../../../UI/SelectInput/SelectInput';
import { SheetManager } from 'react-native-actions-sheet';
import { useStores } from '../../../../hooks/useStores';

interface BankAccountFormProps {
  bankAccount: BankAccountFormValues | null;
  handleSubmitForm: (value: BankAccountFormValues) => void;

  colors?: Color[];
}

export type BankAccountFormValues = {
  id: number | undefined;
  bankId: number;
  name: string;
  startingMoney: string;
  type: number;
  color: string;
};

export const BankAccountForm: React.FunctionComponent<BankAccountFormProps> = ({
  bankAccount,
  handleSubmitForm,
  colors,
}) => {
  const { dataStore, ui } = useStores();
  const { t } = useTranslation();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>(
    t<string>('components.bankAccountForm.alertTitle'),
  );
  const [alertSubTitle, setAlertSubTitle] = useState<string>('');
  const [alertButtonText, setAlertButtonText] = useState<string>('');

  const [selectedBank, setSelectedBank] = useState<any>('');
  const [selectedType, setSelectedType] = useState<any>('');

  const onValidate = useCallback(
    (values: {
      bankId: any;
      name: any;
      startingMoney: any;
      type: any;
      color: any;
    }) => {
      let errors: any = {};
      if (!values.bankId) {
        setAlertSubTitle(
          t<string>('components.bankAccountForm.alertBankIDError'),
        );
        setAlertButtonText(
          t<string>('components.bankAccountForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.bankId = 'Required';
      } else if (!values.name) {
        setAlertSubTitle(
          t<string>('components.bankAccountForm.alertNameError'),
        );
        setAlertButtonText(
          t<string>('components.bankAccountForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.name = 'Required';
      } else if (!values.startingMoney) {
        setAlertSubTitle(
          t<string>('components.bankAccountForm.alertStartingMoneyError'),
        );
        setAlertButtonText(
          t<string>('components.bankAccountForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.startingMoney = 'Required';
      } else if (!values.type) {
        setAlertSubTitle(
          t<string>('components.bankAccountForm.alertTypeError'),
        );
        setAlertButtonText(
          t<string>('components.bankAccountForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.type = 'Required';
      } else if (!values.color) {
        setAlertSubTitle(
          t<string>('components.bankAccountForm.alertColorError'),
        );
        setAlertButtonText(
          t<string>('components.bankAccountForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.color = 'Required';
      }
      return errors;
    },
    [t],
  );

  const formik = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      id: bankAccount?.id,
      bankId: bankAccount?.bankId || '',
      name: bankAccount?.name || undefined,
      startingMoney: bankAccount?.startingMoney || '',
      type: bankAccount?.type || undefined,
      color: bankAccount?.color || '#5d4c86',
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

  const handleOpenBankAccountSheet = useCallback(async () => {
    let result: any = await SheetManager.show('bank-account-select-sheet');

    setSelectedBank(result.item);
    formik.setFieldValue('bankId', result.item.id);
  }, [formik]);

  const handleOpenBankAccountTypeSheet = useCallback(async () => {
    let result: any = await SheetManager.show('bank-type-select-sheet');

    setSelectedType(result.item.item);
    formik.setFieldValue('type', result.item.item.id);
  }, [formik, setSelectedType]);

  const setData = useCallback(() => {
    if (bankAccount) {
      const selectedBankType = dataStore.bankAccountType.find(
        bankAccountType => bankAccountType.id === bankAccount.bankId,
      );

      setSelectedType(selectedBankType);
      formik.setFieldValue('type', selectedBankType?.id);
      const selectedBankAccount = dataStore.bankTypes.find(
        bankType => bankType.id === bankAccount.type,
      );

      setSelectedBank(selectedBankAccount);
      formik.setFieldValue('bankId', selectedBankAccount?.id);
    }
  }, [bankAccount, dataStore.bankAccountType, dataStore.bankTypes, formik]);

  useEffect(() => {
    setData();
  }, []);

  return (
    <Layout style={styles.container}>
      <Layout style={styles.formContent}>
        <Layout style={styles.formContentTop}>
          <Text category="p2">
            {t<string>('components.bankAccountForm.moneybalanceTItle')}
          </Text>
          <InputIconField
            placeholder={t<string>(
              'components.bankAccountForm.moneyBalancePlaceholder',
            )}
            onChange={formik.handleChange('startingMoney')}
            value={formik.values.startingMoney}
            borderBottom={false}
            keyboardType="number-pad"
          />
        </Layout>
        <Layout style={styles.formContentBottom}>
          <Layout style={styles.mainInputContainer}>
            <SelectInput
              placeholder={t<string>(
                'components.bankAccountForm.bankSelectPlaceholder',
              )}
              value={selectedBank.name}
              iconName="grid-outline"
              iconNameRight="arrow-ios-forward-outline"
              handleOpenSheet={handleOpenBankAccountSheet}
            />
            <InputIconField
              placeholder={t<string>(
                'components.bankAccountForm.namePlaceholder',
              )}
              onChange={formik.handleChange('name')}
              value={formik.values.name}
              iconName={'edit-outline'}
            />
            <SelectInput
              placeholder={t<string>(
                'components.bankAccountForm.typeSelectPlaceholder',
              )}
              value={
                selectedType.name
                  ? t<string>(
                      `components.bankAccountTypeSheetListItem.types.${selectedType.name}`,
                    )
                  : undefined
              }
              iconName="grid-outline"
              iconNameRight="arrow-ios-forward-outline"
              handleOpenSheet={handleOpenBankAccountTypeSheet}
            />
            <ColorInputField
              onChange={formik.handleChange('color')}
              value={formik.values.color}
              iconName={'color-palette-outline'}
              colors={colors}
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
