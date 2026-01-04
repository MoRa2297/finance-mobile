import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { theme } from '../../../config/theme';
import {
  DAYS_NUMBER,
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  MONTH_NUMBER,
  SCREEN_HEIGHT,
  YEARS_NUMBER,
} from '../../../config/constants';
import { Layout, Text } from '@ui-kitten/components';
import { Picker } from '@react-native-picker/picker';
import { t } from 'i18next';

type DatePickerSheetProps = {
  sheetId: string;
};

export const DatePickerSheet: React.FunctionComponent<
  SheetProps<DatePickerSheetProps>
> = ({ sheetId, payload }) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [day, setDay] = useState(payload.day || DAYS_NUMBER[0]);
  const [month, setMonth] = useState(payload.month || MONTH_NUMBER[0]);
  const [year, setYear] = useState(payload.year || YEARS_NUMBER[0]);

  const onSelect = () => {
    actionSheetRef.current?.hide({
      day: day,
      month: month,
      year: year,
    });
  };

  return (
    <ActionSheet
      id={sheetId}
      drawUnderStatusBar={true}
      ref={actionSheetRef}
      closable={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      closeOnTouchBackdrop
      isModal={false}
      defaultOverlayOpacity={0.7}
      containerStyle={styles.containerStyle}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.container}>
        <Layout style={styles.textContainer}>
          <Text onPress={onSelect}>{t<string>('common.done')}</Text>
        </Layout>
        <Layout style={styles.pickersContainer}>
          <Picker
            mode="dialog"
            selectedValue={day}
            onValueChange={itemValue => {
              setDay(itemValue);
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {DAYS_NUMBER.map(item => (
              <Picker.Item label={item.name} value={item.name} />
            ))}
          </Picker>
          <Picker
            mode="dialog"
            selectedValue={month}
            onValueChange={itemValue => {
              setMonth(itemValue);
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {MONTH_NUMBER.map(item => (
              <Picker.Item label={item.name} value={item.name} />
            ))}
          </Picker>
          <Picker
            mode="dialog"
            selectedValue={year}
            onValueChange={itemValue => {
              setYear(itemValue);
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {YEARS_NUMBER.map(item => (
              <Picker.Item label={item.name} value={item.name} />
            ))}
          </Picker>
        </Layout>
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    height: SCREEN_HEIGHT / 2.5,
    justifyContent: 'center',
  },
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  textContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: HORIZONTAL_PADDING * 2,
    paddingVertical: HORIZONTAL_PADDING,
  },
  picker: {
    flex: 1,
    color: theme['color-basic-100'],
  },
  pickerItem: {
    flex: 1,
    color: theme['color-basic-100'],
  },
  pickersContainer: {
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    flexDirection: 'row',
    flex: 1,
  },
});
