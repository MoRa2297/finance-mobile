import React, { FC, memo, useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '@config/constants';
import { Frequency, FrequencyTypes } from '@/types';
import { Icon } from '@components/ui/Icon';

type SelectFrequencySheetProps = SheetProps<'select-frequency-sheet'>;

const LIST_MAX_HEIGHT = SCREEN_HEIGHT / 1.8;
const ICON_SIZE = 24;

interface FrequencyOption {
  frequency: Frequency;
  icon: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { frequency: FrequencyTypes.DAILY, icon: 'sun-outline' },
  { frequency: FrequencyTypes.WEEKLY, icon: 'calendar-outline' },
  { frequency: FrequencyTypes.BIWEEKLY, icon: 'calendar-outline' },
  { frequency: FrequencyTypes.MONTHLY, icon: 'calendar-outline' },
  { frequency: FrequencyTypes.BIMONTHLY, icon: 'calendar-outline' },
  { frequency: FrequencyTypes.QUARTERLY, icon: 'calendar-outline' },
  { frequency: FrequencyTypes.SEMIANNUAL, icon: 'calendar-outline' },
  { frequency: FrequencyTypes.YEARLY, icon: 'star-outline' },
];

interface FrequencyItemProps {
  option: FrequencyOption;
  onSelect: (f: Frequency) => void;
}

const FrequencyItem: FC<FrequencyItemProps> = memo(({ option, onSelect }) => {
  const { t } = useTranslation('transactionPage');
  const handlePress = useCallback(
    () => onSelect(option.frequency),
    [option, onSelect],
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.listItem,
        pressed && styles.listItemPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button">
      <View style={styles.iconContainer}>
        <Icon
          name={option.icon}
          color={theme.colors.basic100}
          size={ICON_SIZE}
        />
      </View>
      <Text category="s1" style={styles.label}>
        {t(`recurrence.frequency.${option.frequency.toLowerCase()}`)}
      </Text>
      <Icon
        name="arrow-ios-forward-outline"
        color={theme.colors.textHint}
        size={ICON_SIZE}
      />
    </Pressable>
  );
});

export const SelectFrequencySheet: FC<SelectFrequencySheetProps> = ({
  sheetId,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const handleSelect = useCallback(
    (frequency: Frequency) => {
      SheetManager.hide(sheetId, { payload: { frequency } });
    },
    [sheetId],
  );

  return (
    <ActionSheet
      id={sheetId}
      ref={actionSheetRef}
      closable
      gestureEnabled
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.sheetContainer}>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {FREQUENCY_OPTIONS.map((option, i) => (
          <React.Fragment key={option.frequency}>
            <FrequencyItem option={option} onSelect={handleSelect} />
            {i < FREQUENCY_OPTIONS.length - 1 && (
              <Layout style={styles.separator} />
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
    overflow: 'hidden',
  },

  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
  separator: {
    height: 0,
    backgroundColor: theme.colors.primaryBK,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  },
  listItemPressed: {
    backgroundColor: theme.colors.secondaryBK,
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, color: theme.colors.basic100 },
});
