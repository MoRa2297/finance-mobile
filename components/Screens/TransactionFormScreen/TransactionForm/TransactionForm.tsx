import { Layout, Text } from '@ui-kitten/components';
import { useFormik } from 'formik';
import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../../config/constants';
import { Button } from '../../../UI/Button/Button';
import { InputIconField } from '../../../UI/InputIconField/InputIconField';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../../config/theme';
import { Alert } from '../../../common/Alert/Alert';
import {
  BankAccount,
  BankCard,
  Category,
  Transaction,
} from '../../../../types/types';
import { SheetManager } from 'react-native-actions-sheet';
import { useStores } from '../../../../hooks/useStores';
import { SwitchInput } from '../../../UI/SwitchInput/SwitchInput';
import { SelectInput } from '../../../UI/SelectInput/SelectInput';
import { DateInputField } from '../../../UI/DateInputField/DateInputField';
import Moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { useIsKeyboardOpen } from '../../../../hooks/useIsKeyboardOpen';

interface TransactionFormProps {
  formType: 'income' | 'expense' | 'card_spending';
  transaction?: Transaction;
  handleSubmitForm: (value: TransactionFormValues) => void;
  submitError?: string;
}

export type TransactionFormValues = {
  id: number | undefined;
  bankAccountId: number | undefined;
  cardId: number | undefined;
  categoryId: number | undefined;
  money: string;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
};

// TODO OPTIMIZE

export const TransactionForm: React.FunctionComponent<TransactionFormProps> = ({
  transaction,
  handleSubmitForm,
  formType,
  submitError,
}) => {
  const [isKeyboardOpen] = useIsKeyboardOpen();
  const { dataStore, ui } = useStores();
  const { t } = useTranslation();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>(
    t<string>('components.transactionForm.alertTitle'),
  );
  const [alertSubTitle, setAlertSubTitle] = useState<string>('');
  const [alertButtonText, setAlertButtonText] = useState<string>('');

  const [selectedRecived, setSelectedRecived] = useState<boolean>(false);
  const [selectedRecurrent, setSelectedRecurrent] = useState<boolean>(false);
  const [selectedRepeat, setSelectedRepeat] = useState<boolean>(false);

  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [selectedImageBank, setSelectedImageBank] = useState<string | null>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);

  const isFocused = useIsFocused();

  const onValidate = useCallback(
    (values: TransactionFormValues) => {
      let errors: any = {};
      if (formType === 'expense' && !values.bankAccountId) {
        setAlertSubTitle(
          t<string>('components.transactionForm.alertBankIDError'),
        );
        setAlertButtonText(
          t<string>('components.transactionForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.bankAccountId = 'Required';
      } else if (!values.categoryId) {
        setAlertSubTitle(
          t<string>('components.transactionForm.alertCategoryIDError'),
        );
        setAlertButtonText(
          t<string>('components.transactionForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.categoryId = 'Required';
      } else if (!values.money || values.money === '0') {
        setAlertSubTitle(
          t<string>('components.transactionForm.alertMoneyError'),
        );
        setAlertButtonText(
          t<string>('components.transactionForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.money = 'Required';
      } else if (!values.date) {
        setAlertSubTitle(t<string>('components.transactionForm.dateError'));
        setAlertButtonText(
          t<string>('components.transactionForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.date = 'Required';
      } else if (!values.description) {
        setAlertSubTitle(
          t<string>('components.transactionForm.descriptionError'),
        );
        setAlertButtonText(
          t<string>('components.transactionForm.alertButtonText'),
        );
        setIsAlertVisible(true);
        errors.description = 'Required';
      }
      return errors;
    },
    [formType, t],
  );

  const formik = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      id: transaction?.id,
      bankAccountId: undefined || transaction?.bankAccountId,
      cardId: undefined || transaction?.cardId,
      categoryId: undefined || transaction?.categoryId,
      money: '0' || transaction?.money,
      recived: transaction?.recived || false,
      date:
        Moment(transaction?.date).format('DD-MM-YYYY') ||
        Moment().format('DD-MM-YYYY'),
      description: transaction?.description || '',
      recurrent: transaction?.recurrent || false,
      repeat: transaction?.repeat || false,
      note: transaction?.note || '',
    },
    validate: onValidate,
    onSubmit: values => {
      handleSubmitForm_(values);
    },
    enableReinitialize: true,
  });

  const setData = useCallback(() => {
    if (transaction) {
      const selectedBankAccount = dataStore.bankAccount.find(
        bankAccount => bankAccount.id === transaction.bankAccountId,
      );

      const bankTypeImage = dataStore.bankTypes.find(
        bankType => bankType.id === selectedBankAccount?.bankAccountTypeId,
      );

      setSelectedImageBank(bankTypeImage?.imageUrl || null);
      setSelectedBank(selectedBankAccount || null);
      formik.setFieldValue('bankAccountId', selectedBankAccount?.id);

      const selectedCategoryItem = dataStore.categories.find(
        category => category.id === transaction.categoryId,
      );

      setSelectedCategory(selectedCategoryItem || null);
      formik.setFieldValue('categoryId', selectedCategoryItem?.id);

      const selectedCardItem = dataStore.bankCard.find(
        card => card.id === transaction.cardId,
      );
      setSelectedCard(selectedCardItem || null);
      formik.setFieldValue('cardId', selectedCardItem?.id);

      formik.setFieldValue('money', String(transaction.money));

      setSelectedRecived(transaction.recived);
      formik.setFieldValue('recived', transaction.recived);

      setSelectedRecived(transaction.recived);
      formik.setFieldValue('recived', transaction.recived);

      setSelectedRecurrent(transaction.recurrent);
      formik.setFieldValue('recurrent', transaction.recurrent);

      setSelectedRepeat(transaction.repeat);
      formik.setFieldValue('repeat', transaction.repeat);

      formik.setFieldValue(
        'date',
        Moment(transaction.date).format('DD-MM-YYYY '),
      );

      formik.setFieldValue('description', transaction.description);

      formik.setFieldValue('note', transaction.note);
    }
  }, [
    dataStore.bankAccount,
    dataStore.bankCard,
    dataStore.bankTypes,
    dataStore.categories,
    formik,
    transaction,
  ]);

  const clearData = () => {
    // need it
    formik.setFieldValue('money', '');
    formik.setFieldValue('description', '');
    formik.setFieldValue('note', '');

    setSelectedImageBank('');
    setSelectedBank(null);
    setSelectedCategory(null);
    setSelectedCard(null);
    setSelectedRecived(false);
    setSelectedRecurrent(false);
    setSelectedRepeat(false);
  };

  const handleCloseAlert = useCallback(() => {
    setIsAlertVisible(false);
  }, []);

  const handleSubmitForm_ = useCallback(
    (values: any) => {
      handleSubmitForm(values);
    },
    [handleSubmitForm],
  );

  const handleChangeRecived = useCallback(
    (value: boolean) => {
      setSelectedRecived(value);
      formik.setFieldValue('recived', value);
    },
    [formik],
  );

  const handleChangeRecurrent = useCallback(
    (value: boolean) => {
      setSelectedRecurrent(value);
      formik.setFieldValue('recurrent', value);
    },
    [formik],
  );

  const handleChangeRepeat = useCallback(
    (value: boolean) => {
      setSelectedRepeat(value);
      formik.setFieldValue('repeat', value);
    },
    [formik],
  );

  const handleOpenDatePickerSheet = async () => {
    const prevDate = Moment(formik.values.date, 'DD-MM-YYYY');

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

    formik.setFieldValue('date', newDate);
  };

  const handleOpenCategoryTypeSheet = useCallback(async () => {
    let result: any = await SheetManager.show('select-category-sheet', {
      payload: {
        type:
          formType === 'card_spending' || formType === 'expense'
            ? 'expenses'
            : 'income',
      },
    });

    setSelectedCategory(result.item);
    formik.setFieldValue('categoryId', result.item.id);
  }, [formType, formik]);

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

    setSelectedImageBank(bankTypeImage?.imageUrl || null);

    setSelectedBank(result.item);
    formik.setFieldValue('bankAccountId', result.item.id);
  }, [dataStore.bankAccount, dataStore.bankTypes, formik]);

  const handleOpenCardTypeSheet = useCallback(async () => {
    const bankAccountIds = dataStore.bankAccount.map(bank => bank.id);

    let result: any = await SheetManager.show('select-card-sheet', {
      payload: {
        bankAccountId: bankAccountIds,
      },
    });

    setSelectedCard(result.item);
    formik.setFieldValue('cardId', result.item.id);
  }, [dataStore.bankAccount, formik]);

  const showErrorFormSubmit = useCallback(() => {
    if (submitError) {
      setAlertSubTitle(submitError);
      setAlertButtonText(
        t<string>('components.transactionForm.alertButtonText'),
      );
      setIsAlertVisible(true);
    }
  }, [submitError, t]);

  useEffect(() => {
    showErrorFormSubmit();
  }, [showErrorFormSubmit]);

  useEffect(() => {
    if (isFocused) {
      clearData(); // replace with your function
    }

    if (transaction !== null) {
      setData();
    }
  }, [isFocused, transaction]);

  return (
    <ScrollView
      contentContainerStyle={styles.general}
      showsVerticalScrollIndicator={false}
      style={styles.general}
      scrollEnabled={isKeyboardOpen}>
      <Layout style={styles.container}>
        <Layout style={styles.formContent}>
          <Layout style={styles.formContentTop}>
            <Text category="p2">
              {t<string>(
                `components.transactionForm.moneyValueTypes.${formType}`,
              )}
            </Text>
            <InputIconField
              placeholder={t<string>(
                'components.transactionForm.moneyValuePlaceholder',
              )}
              onChange={formik.handleChange('money')}
              value={formik.values.money}
              borderBottom={false}
              keyboardType="number-pad"
            />
          </Layout>
          <Layout style={styles.formContentBottom}>
            <Layout
              style={[
                styles.mainInputContainer,
                {
                  marginBottom: isKeyboardOpen ? 15 : 0,
                },
              ]}>
              {formType !== 'card_spending' && (
                <SwitchInput
                  placeholder={t<string>(
                    'components.transactionForm.recivedPlaceholder',
                  )}
                  value={selectedRecived}
                  iconName="checkmark-circle-outline"
                  handleChange={handleChangeRecived}
                />
              )}

              <DateInputField
                onChange={formik.handleChange('date')}
                value={formik.values.date}
                iconName="calendar-outline"
                handleOpenSheet={handleOpenDatePickerSheet}
              />

              <InputIconField
                placeholder={t<string>(
                  'components.transactionForm.descriptionPlaceholder',
                )}
                onChange={formik.handleChange('description')}
                value={formik.values.description}
                iconName="edit-outline"
              />

              <SelectInput
                placeholder={t<string>(
                  'components.transactionForm.selectCategoryPlaceholder',
                )}
                value={selectedCategory?.name}
                selectedCategoryIconName={
                  selectedCategory &&
                  selectedCategory.categoryIcon &&
                  selectedCategory.categoryIcon.iconName
                    ? selectedCategory.categoryIcon.iconName
                    : ''
                }
                selectedBorderColor={
                  selectedCategory &&
                  selectedCategory.categoryColor &&
                  selectedCategory.categoryColor.hexCode
                    ? selectedCategory.categoryColor.hexCode
                    : ''
                }
                iconType="ionicons"
                iconName="bookmark-outline"
                iconNameRight="arrow-ios-forward-outline"
                valueBordered={true}
                handleOpenSheet={handleOpenCategoryTypeSheet}
              />

              {formType !== 'card_spending' && (
                <SelectInput
                  placeholder={t<string>(
                    'components.transactionForm.selectBankPlaceholder',
                  )}
                  value={selectedBank?.name}
                  selectedBorderColor={theme['text-hint-color']}
                  iconType="ionicons"
                  iconName="grid-outline"
                  iconNameRight="arrow-ios-forward-outline"
                  valueBordered={true}
                  handleOpenSheet={handleOpenBankAccountTypeSheet}
                  selectedImageUrl={selectedImageBank}
                />
              )}

              {formType === 'card_spending' && (
                <SelectInput
                  placeholder={t<string>(
                    'components.transactionForm.selectCardPlaceholder',
                  )}
                  value={selectedCard?.name}
                  iconName="credit-card-outline"
                  iconNameRight="arrow-ios-forward-outline"
                  valueBordered={true}
                  handleOpenSheet={handleOpenCardTypeSheet}
                />
              )}

              <SwitchInput
                placeholder={t<string>(
                  'components.transactionForm.recurrentPlaceholder',
                )}
                value={selectedRecurrent}
                iconName="text-outline"
                handleChange={handleChangeRecurrent}
              />

              <SwitchInput
                placeholder={t<string>(
                  'components.transactionForm.repeatPlaceholder',
                )}
                value={selectedRepeat}
                iconName="text-outline"
                handleChange={handleChangeRepeat}
              />

              <InputIconField
                placeholder={t<string>(
                  'components.transactionForm.notePlaceholder',
                )}
                onChange={formik.handleChange('note')}
                value={formik.values.note}
                iconName={'edit-outline'}
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
    // {/* </KeyboardAvoidingView> */}
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
