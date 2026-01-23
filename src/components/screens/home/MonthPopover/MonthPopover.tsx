import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { MenuItem, OverflowMenu } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Button } from '@/components/ui';
import { theme } from '@/config/theme';

import {
  generateMonths,
  getCurrentMonthIndex,
  MonthItem,
} from './MonthPopover.helpers';
import { Icon } from '@components/ui/Icon';

interface MonthPopoverProps {
  onSelectMonth: (month: MonthItem) => void;
}

// TODO to improve the UI. It's not good enough (Maybe use sheet)
export const MonthPopover: React.FC<MonthPopoverProps> = ({
  onSelectMonth,
}) => {
  const { t } = useTranslation('common');

  const months = useMemo(() => generateMonths(), []);
  const currentYear = useMemo(() => dayjs().year(), []);

  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(() =>
    getCurrentMonthIndex(months),
  );

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  const handleItemSelect = useCallback(
    (index: { row: number }) => {
      setSelectedIndex(index.row);
      onSelectMonth(months[index.row]);
      closeMenu();
    },
    [months, onSelectMonth, closeMenu],
  );

  const formatMonthLabel = useCallback(
    (month: MonthItem): string => {
      const monthText = t(`common:month.${month.month}`);
      return month.year === currentYear
        ? monthText
        : `${monthText} ${month.year}`;
    },
    [t, currentYear],
  );

  const selectedMonthLabel = useMemo(
    () => formatMonthLabel(months[selectedIndex]),
    [formatMonthLabel, months, selectedIndex],
  );

  // Render helpers
  const renderAccessoryRight = useCallback(
    () => (
      <Icon
        name="arrow-ios-downward-outline"
        color={theme.colors.basic100}
        size={20}
      />
    ),
    [],
  );

  const renderToggleButton = useCallback(
    () => (
      <View>
        <Button
          onPress={openMenu}
          appearance="ghost"
          accessoryRight={renderAccessoryRight}
          buttonText={selectedMonthLabel}
        />
      </View>
    ),
    [openMenu, renderAccessoryRight, selectedMonthLabel],
  );

  const renderMenuItem = useCallback(
    (item: MonthItem) => (
      <MenuItem
        key={item.id}
        title={formatMonthLabel(item)}
        style={[
          styles.menuItem,
          item.id === selectedIndex && styles.menuItemSelected,
        ]}
      />
    ),
    [formatMonthLabel, selectedIndex],
  );

  return (
    <View style={styles.container}>
      <OverflowMenu
        anchor={renderToggleButton}
        visible={visible}
        fullWidth={false}
        horizontal
        appearance="noDivider"
        onSelect={handleItemSelect}
        onBackdropPress={closeMenu}
        style={styles.overflow}
        contentContainerStyle={styles.overflowContent}
        showsHorizontalScrollIndicator={false}>
        {months.map(renderMenuItem)}
      </OverflowMenu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  menuItem: {
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 5,
  },
  menuItemSelected: {
    backgroundColor: theme.colors.primaryBK,
  },
  overflow: {
    borderColor: theme.colors.transparent,
    width: 'auto',
    backgroundColor: theme.colors.primaryBK,
  },
  overflowContent: {
    backgroundColor: theme.colors.primaryBK,
  },
});
