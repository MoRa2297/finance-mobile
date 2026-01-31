import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { theme } from '@/config/theme';
import {
  DAYS_NUMBER,
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  MONTH_NUMBER,
  SCREEN_HEIGHT,
  YEARS_NUMBER,
} from '@/config/constants';

const SHEET_HEIGHT = SCREEN_HEIGHT / 2.5;

export const DatePickerSheet: React.FC<SheetProps<'date-picker-sheet'>> = ({
  sheetId,
  payload,
}) => {
  const { t } = useTranslation('common');
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const [day, setDay] = useState(payload?.day || DAYS_NUMBER[0].name);
  const [month, setMonth] = useState(payload?.month || MONTH_NUMBER[0].name);
  const [year, setYear] = useState(payload?.year || YEARS_NUMBER[0].name);

  const handleConfirm = () => {
    SheetManager.hide(sheetId, {
      payload: { day, month, year },
    });
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={sheetId}
      gestureEnabled
      closable
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text category="h6" style={styles.title}>
          {t('common:selectDate')}
        </Text>

        {/* Pickers */}
        <View style={styles.pickersContainer}>
          {/* Day Picker */}
          <Picker
            mode="dialog"
            selectedValue={day}
            onValueChange={setDay}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {DAYS_NUMBER.map(item => (
              <Picker.Item
                key={item.id}
                label={item.name}
                value={item.name}
                color={theme.colors.basic100}
              />
            ))}
          </Picker>

          {/* Month Picker */}
          <Picker
            mode="dialog"
            selectedValue={month}
            onValueChange={setMonth}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {MONTH_NUMBER.map(item => (
              <Picker.Item
                key={item.id}
                label={item.name}
                value={item.name}
                color={theme.colors.basic100}
              />
            ))}
          </Picker>

          {/* Year Picker */}
          <Picker
            mode="dialog"
            selectedValue={year}
            onValueChange={setYear}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {YEARS_NUMBER.map(item => (
              <Picker.Item
                key={item.id}
                label={item.name}
                value={item.name}
                color={theme.colors.basic100}
              />
            ))}
          </Picker>
        </View>

        {/* Bottom Button */}
        <View style={styles.buttonContainer}>
          <Button
            buttonText={t('done')}
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
    height: SHEET_HEIGHT,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  title: {
    color: theme.colors.basic100,
    textAlign: 'center',
    paddingVertical: 15,
  },
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    color: theme.colors.basic100,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    width: '60%',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
