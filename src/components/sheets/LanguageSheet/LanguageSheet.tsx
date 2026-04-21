import React, { useRef, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { theme } from '@/config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '@/config/constants';
import { LanguageCode, LANGUAGES } from '@/config';

const SHEET_HEIGHT = SCREEN_HEIGHT / 2.5;

type LanguageItem = (typeof LANGUAGES)[number];

export const LanguageSheet: React.FC<SheetProps<'language-sheet'>> = ({
  sheetId,
  payload,
}) => {
  const { t } = useTranslation('common');
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const [selected, setSelected] = useState<LanguageCode>(
    payload?.currentLanguage ?? LANGUAGES[0].code,
  );

  const handleConfirm = () => {
    SheetManager.hide(sheetId, {
      payload: { code: selected },
    });
  };

  const renderItem = ({ item }: { item: LanguageItem }) => {
    const isSelected = item.code === selected;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && styles.pressed,
        ]}
        onPress={() => setSelected(item.code)}>
        <Text style={styles.flag}>{item.flag}</Text>
        <Text category="s1" style={styles.itemText}>
          {item.label}
        </Text>
        {isSelected && (
          <Icon
            name="checkmark-outline"
            fill={theme.colors.primary}
            style={styles.check}
          />
        )}
      </Pressable>
    );
  };

  return (
    <ActionSheet
      id={sheetId}
      ref={actionSheetRef}
      closable
      gestureEnabled
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text category="h6" style={styles.title}>
          {t('common:selectLanguage')}
        </Text>

        {/* List */}
        <FlatList
          data={LANGUAGES as unknown as LanguageItem[]}
          keyExtractor={item => item.code}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />

        {/* Bottom Button */}
        <View style={styles.buttonContainer}>
          <Button
            buttonText={t('common:save')}
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
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.basic700,
    paddingHorizontal: 5,
  },
  pressed: {
    backgroundColor: theme.colors.secondaryBK,
  },
  flag: {
    fontSize: 22,
    marginRight: 14,
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
    fontSize: 18,
  },
  check: {
    width: 22,
    height: 22,
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
