import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '@/config/constants';

const SHEET_HEIGHT = SCREEN_HEIGHT / 2.5;

export const ColorSheet: FC<SheetProps<'color-sheet'>> = ({
  payload,
  sheetId,
}) => {
  const { width } = useWindowDimensions();
  const selected = payload?.selected;
  const colors = payload?.colors ?? [];

  const itemSize = (width - HORIZONTAL_PADDING * 2 - 50) / 6;

  const handlePressColor = (color: string) => {
    SheetManager.hide(sheetId, { payload: { color } });
  };

  return (
    <ActionSheet
      id={sheetId}
      closable
      gestureEnabled
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {colors.map(color => (
            <Pressable
              key={color.id}
              style={[
                styles.colorButton,
                {
                  width: itemSize,
                  height: itemSize,
                  backgroundColor: color.hexCode,
                  borderWidth: selected === color.hexCode ? 3 : 0,
                  borderColor:
                    selected === color.hexCode
                      ? theme.colors.basic100
                      : 'transparent',
                },
              ]}
              onPress={() => handlePressColor(color.hexCode)}
            />
          ))}
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    height: SHEET_HEIGHT,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  colorButton: {
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
  },
});
