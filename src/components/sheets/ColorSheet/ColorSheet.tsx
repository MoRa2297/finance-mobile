import React, { useRef, useState } from 'react';
import { StyleSheet, View, Pressable, useWindowDimensions } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { COLORS } from '@/config';

export const ColorSheet: React.FC<SheetProps<'color-sheet'>> = props => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { width } = useWindowDimensions();
  const selected = props.payload?.selected;

  const itemSize = (width - HORIZONTAL_PADDING * 2 - 50) / 6;

  const handlePressColor = (color: string) => {
    // TODO check
    // @ts-ignore
    actionSheetRef.current?.hide({ color });
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={props.sheetId}
      closable
      gestureEnabled
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.grid}>
          {COLORS.map(color => (
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
