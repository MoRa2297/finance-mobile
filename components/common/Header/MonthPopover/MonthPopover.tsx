import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../UI/Icon/Icon';
import { theme } from '../../../../config/theme';
import { Button } from '../../../UI/Button/Button';
import { months } from '../../../../services/utils';
import Moment from 'moment';

interface MonthPopoverProps {
  handleSelectedMonth: (index: number) => void;
}

export const MonthPopover: React.FunctionComponent<MonthPopoverProps> = ({
  handleSelectedMonth,
}) => {
  const MONTHS = months();
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { t } = useTranslation();
  const currentYear = Moment().get('year');

  const onItemSelect = (index: { row: React.SetStateAction<number> }): void => {
    setSelectedIndex(index.row);
    handleSelectedMonth(index.row as number);
    setVisible(false);
  };

  const accessoryRight = () => (
    <Icon
      name="arrow-ios-downward-outline"
      color={theme['color-basic-100']}
      size={20}
    />
  );

  const renderToggleButton = (): React.ReactElement => (
    <Layout>
      <Button
        onPress={() => setVisible(true)}
        appearance="ghost"
        accessoryRight={accessoryRight}
        buttonText={
          MONTHS[selectedIndex].year === currentYear
            ? t<string>(`common.month.${MONTHS[selectedIndex].month}`)
            : t<string>(`common.month.${MONTHS[selectedIndex].month}`) +
              ' ' +
              MONTHS[selectedIndex].year
        }
      />
    </Layout>
  );

  return (
    <Layout style={styles.container} level="1">
      <OverflowMenu
        anchor={renderToggleButton}
        visible={visible}
        fullWidth={false}
        horizontal={true}
        appearance="noDivider"
        onSelect={onItemSelect}
        onBackdropPress={() => setVisible(false)}
        style={styles.overflow}
        contentContainerStyle={styles.overflowContentContainerStyle}
        indicatorStyle={'white'}
        showsHorizontalScrollIndicator={false}>
        {MONTHS.map((item, index) => (
          <MenuItem
            key={index}
            title={
              currentYear !== item.year
                ? t<string>(`common.month.${item.month}`) + ' ' + item.year
                : t<string>(`common.month.${item.month}`)
            }
            style={styles.menuItem}
          />
        ))}
      </OverflowMenu>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme['color-basic-transparent-100'],
  },
  menuItem: {
    borderRadius: 20,
    backgroundColor: theme['color-primary'],
    marginHorizontal: 5,
  },
  overflow: {
    borderColor: theme['color-basic-transparent'],
    width: 'auto',
    backgroundColor: theme['color-primary-BK'],
  },
  overflowContentContainerStyle: {
    backgroundColor: theme['color-primary-BK'],
    shadowColor: theme['background-basic-color-1'],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
  },
});
