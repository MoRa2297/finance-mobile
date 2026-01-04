import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { theme } from '../../../config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '../../../config/constants';
import { Layout, Text } from '@ui-kitten/components';
import { Picker } from '@react-native-picker/picker';
import { t } from 'i18next';

type PickerSheetProps = {
  sheetId: string;
};

export const PickerSheet: React.FunctionComponent<
  SheetProps<PickerSheetProps>
> = ({ sheetId, payload }) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [selectedLanguage, setSelectedLanguage] = useState();

  const onSelect = () => {
    actionSheetRef.current?.hide({ item: selectedLanguage });
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
        <Picker
          mode="dialog"
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedLanguage(itemValue);
          }}
          style={styles.picker}
          itemStyle={styles.pickerItem}>
          {payload?.data?.map(item => (
            <Picker.Item label={item.name} value={item.name} />
          ))}
        </Picker>
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
});
