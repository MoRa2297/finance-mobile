import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '@/config/constants';
import { Icon } from '@components/ui/Icon';

const SHEET_HEIGHT = SCREEN_HEIGHT / 2.5;

export const IconSheet: FC<SheetProps<'icon-sheet'>> = ({
  sheetId,
  payload,
}) => {
  const { width } = useWindowDimensions();
  const selected = payload?.selected;
  const selectedColor = payload?.selectedColor;
  const categoryIcons = payload?.categoryIcons ?? [];

  const itemSize = (width - HORIZONTAL_PADDING * 2 - 50) / 6;

  const handlePressIcon = (icon: string) => {
    SheetManager.hide(sheetId, { payload: { icon } });
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
          {categoryIcons.map(icon => (
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
              <Icon
                name={icon.iconName}
                size={24}
                color={theme.colors.basic100}
              />
            </Pressable>
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
  iconButton: {
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
