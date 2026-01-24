import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { Picker } from '@react-native-picker/picker';

export const DatePickerSheet: React.FC<
  SheetProps<'date-picker-sheet'>
> = props => {
  const { t } = useTranslation();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const payload = props.payload || { day: '1', month: '1', year: '2000' };

  const [day, setDay] = useState(payload.day);
  const [month, setMonth] = useState(payload.month);
  const [year, setYear] = useState(payload.year);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  const handleConfirm = () => {
    // actionSheetRef.current?.hide({ day, month, year });
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={props.sheetId}
      gestureEnabled
      closable
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        <Text category="h6" style={styles.title}>
          {t('components.datePickerSheet.title')}
        </Text>

        <View style={styles.pickersContainer}>
          {/* Day Picker */}
          <View style={styles.pickerWrapper}>
            <Text category="c1" style={styles.label}>
              {t('components.datePickerSheet.day')}
            </Text>
            <Picker
              selectedValue={day}
              onValueChange={setDay}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              {days.map(d => (
                <Picker.Item
                  key={d}
                  label={d}
                  value={d}
                  color={theme.colors.basic100}
                />
              ))}
            </Picker>
          </View>

          {/* Month Picker */}
          <View style={styles.pickerWrapper}>
            <Text category="c1" style={styles.label}>
              {t('components.datePickerSheet.month')}
            </Text>
            <Picker
              selectedValue={month}
              onValueChange={setMonth}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              {months.map(m => (
                <Picker.Item
                  key={m}
                  label={m}
                  value={m}
                  color={theme.colors.basic100}
                />
              ))}
            </Picker>
          </View>

          {/* Year Picker */}
          <View style={styles.pickerWrapper}>
            <Text category="c1" style={styles.label}>
              {t('components.datePickerSheet.year')}
            </Text>
            <Picker
              selectedValue={year}
              onValueChange={setYear}
              style={styles.picker}
              itemStyle={styles.pickerItem}>
              {years.map(y => (
                <Picker.Item
                  key={y}
                  label={y}
                  value={y}
                  color={theme.colors.basic100}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            buttonText={t('common.save')}
            onPress={handleConfirm}
            backgroundColor={theme.colors.primary}
            style={styles.button}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 20,
  },
  title: {
    color: theme.colors.basic100,
    textAlign: 'center',
    marginBottom: 20,
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: theme.colors.textHint,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 150,
  },
  pickerItem: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
