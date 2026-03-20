import React, { useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';
import dayjs from 'dayjs';

import { Frequency } from '@/types';
import { SelectInput } from '@components/ui/SelectInput';
import { SwitchInput } from '@components/ui/SwitchInput';
import { DateInputField } from '@components/ui/DateInputField';

const DATE_FORMAT = 'DD-MM-YYYY';

export interface RecurrenceValues {
  recurrent: boolean;
  frequency: Frequency | null;
  endDate: string | null;
}

interface RecurrenceSelectorProps {
  values: RecurrenceValues;
  onChange: (values: RecurrenceValues) => void;
  disabled?: boolean;
}

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  values,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation('transactionPage');

  const handleToggle = useCallback(
    (v: boolean) => {
      onChange({
        recurrent: v,
        frequency: null,
        endDate: null,
      });
    },
    [onChange],
  );

  const handleOpenFrequencySheet = useCallback(async () => {
    const result = await SheetManager.show('select-frequency-sheet');
    if (result?.frequency) {
      onChange({ ...values, frequency: result.frequency });
    }
  }, [values, onChange]);

  const handleOpenEndDatePicker = useCallback(async () => {
    const prevDate = values.endDate
      ? dayjs(values.endDate, DATE_FORMAT)
      : dayjs().add(1, 'month');

    const result = await SheetManager.show('date-picker-sheet', {
      payload: {
        day: String(prevDate.date()),
        month: String(prevDate.month() + 1),
        year: String(prevDate.year()),
      },
    });

    if (result) {
      const newDate = dayjs()
        .year(parseInt(result.year))
        .month(parseInt(result.month) - 1)
        .date(parseInt(result.day))
        .format(DATE_FORMAT);
      onChange({ ...values, endDate: newDate });
    }
  }, [values, onChange]);

  const frequencyLabel = values.frequency
    ? t(`recurrence.frequency.${values.frequency.toLowerCase()}`)
    : undefined;

  return (
    <View style={styles.container}>
      <SwitchInput
        placeholder={t('recurrentPlaceholder')}
        value={values.recurrent}
        iconName="sync-outline"
        onValueChange={handleToggle}
        disabled={disabled}
      />

      {values.recurrent && (
        <>
          <SelectInput
            placeholder={t('recurrence.frequencyPlaceholder')}
            value={frequencyLabel}
            iconName="repeat-outline"
            valueBordered
            onPress={handleOpenFrequencySheet}
          />

          <DateInputField
            value={values.endDate ?? ''}
            iconName="calendar-outline"
            placeholder={t('recurrence.endDatePlaceholder')}
            onPress={handleOpenEndDatePicker}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {} as ViewStyle,
});
