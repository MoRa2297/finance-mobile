import React, { useRef } from 'react';
import { StyleSheet, View, Pressable, useWindowDimensions } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { CATEGORY_ICONS } from '@/config';

export const IconSheet: React.FC<SheetProps<'icon-sheet'>> = props => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { width } = useWindowDimensions();
  const selected = props.payload?.selected;
  const selectedColor = props.payload?.selectedColor;

  const itemSize = (width - HORIZONTAL_PADDING * 2 - 50) / 6;

  const handlePressIcon = (icon: string) => {
    // TODO check
    // @ts-ignore
    actionSheetRef.current?.hide({ icon });
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
          {/*TODO CHECK IMPORT IS A DUPLICATED*/}
          {CATEGORY_ICONS.map(icon => (
            <Pressable
              key={icon.id}
              style={[
                styles.iconButton,
                {
                  width: itemSize,
                  height: itemSize,
                  backgroundColor:
                    selected === icon.iconName
                      ? selectedColor
                      : theme.colors.textHint,
                  borderWidth: selected === icon.iconName ? 3 : 0,
                  borderColor:
                    selected === icon.iconName
                      ? theme.colors.basic100
                      : 'transparent',
                },
              ]}
              onPress={() => handlePressIcon(icon.iconName)}>
              <Ionicons
                name={icon.iconName as any}
                size={24}
                color={theme.colors.basic100}
              />
            </Pressable>
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
  iconButton: {
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
