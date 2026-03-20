import React, { FC, memo, useCallback, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@config/constants';
import { Frequency } from '@/types';
import { Icon } from '@components/ui/Icon';

type SelectFrequencySheetProps = SheetProps<'select-frequency-sheet'>;

const FREQUENCIES: Frequency[] = [
  Frequency.DAILY,
  Frequency.WEEKLY,
  Frequency.MONTHLY,
  Frequency.YEARLY,
];

const ICON_SIZE = 24;

interface FrequencyItemProps {
  frequency: Frequency;
  onSelect: (f: Frequency) => void;
}

const FrequencyItem: FC<FrequencyItemProps> = memo(
  ({ frequency, onSelect }) => {
    const { t } = useTranslation('transactionPage');
    const handlePress = useCallback(
      () => onSelect(frequency),
      [frequency, onSelect],
    );

    const iconMap: Record<Frequency, string> = {
      [Frequency.DAILY]: 'sun-outline',
      [Frequency.WEEKLY]: 'calendar-outline',
      [Frequency.MONTHLY]: 'calendar-outline',
      [Frequency.YEARLY]: 'star-outline',
    };

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
            name={iconMap[frequency]}
            color={theme.colors.basic100}
            size={ICON_SIZE}
          />
        </View>
        <Text category="s1" style={styles.label}>
          {t(`recurrence.frequency.${frequency.toLowerCase()}`)}
        </Text>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.textHint}
          size={ICON_SIZE}
        />
      </Pressable>
    );
  },
);

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
      ref={actionSheetRef}
      drawUnderStatusBar
      closable
      closeOnTouchBackdrop
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.sheetContainer}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.content}>
        {FREQUENCIES.map((f, i) => (
          <React.Fragment key={f}>
            <FrequencyItem frequency={f} onSelect={handleSelect} />
            {i < FREQUENCIES.length - 1 && <Layout style={styles.separator} />}
          </React.Fragment>
        ))}
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  } as ViewStyle,
  content: {
    paddingTop: 25,
    paddingBottom: 20,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  separator: {
    height: 0,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  } as ViewStyle,
  listItemPressed: {
    backgroundColor: theme.colors.secondaryBK,
    opacity: 0.8,
  } as ViewStyle,
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  label: { flex: 1, color: theme.colors.basic100 } as TextStyle,
});
