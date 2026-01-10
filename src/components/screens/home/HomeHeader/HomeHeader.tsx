import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import { Icon } from '@/components/ui';
import { CustomAvatar } from '@/components/common';
import { theme } from '@/config/theme';

import { MonthPopover, MonthItem } from '../MonthPopover';
import { HORIZONTAL_PADDING } from '@config/constants';

interface HomeHeaderProps {
  profileImage?: string;
  showMonthSelector?: boolean;
  moneyIsVisible: boolean;
  onSelectMonth: (month: MonthItem) => void;
  onToggleMoneyVisibility: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  profileImage,
  showMonthSelector = true,
  moneyIsVisible,
  onSelectMonth,
  onToggleMoneyVisibility,
}) => (
  <View style={[styles.container]}>
    {/* Profile Avatar */}
    <CustomAvatar size="medium" source={profileImage} />

    {/* Month Selector */}
    {showMonthSelector && <MonthPopover onSelectMonth={onSelectMonth} />}

    {/* Toggle Money Visibility */}
    <Pressable onPress={onToggleMoneyVisibility}>
      <Icon
        name={moneyIsVisible ? 'eye-outline' : 'eye-off-outline'}
        color={theme.colors.basic100}
      />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
