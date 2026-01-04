import { Layout } from '@ui-kitten/components';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HORIZONTAL_PADDING } from '../../../config/constants';
import { theme } from '../../../config/theme';
import { Icon } from '../../UI/Icon/Icon';
import { CustomAvatar } from '../CustomAvatar/CustomAvatar';
import { MonthPopover } from './MonthPopover/MonthPopover';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStores } from '../../../hooks/useStores';

const MONEY_IS_VISIBLE = 'eye-outline';
const MONEY_IS_NOT_VISIBLE = 'eye-off-outline';

interface DefaultHeaderProps {
  monthSelector: boolean;
  profileImage?: string;
  handleSelectedMonth?: (index: number) => void;
  handleSetMoneyVisible: () => void;
}

export const DefaultHeader: React.FunctionComponent<DefaultHeaderProps> = ({
  monthSelector,
  profileImage,
  handleSelectedMonth,
  handleSetMoneyVisible,
}) => {
  const { ui } = useStores();
  const insets = useSafeAreaInsets();

  const leftItem = () => <CustomAvatar size="medium" source={profileImage} />;

  const rightItem = () => (
    <TouchableOpacity onPress={handleSetMoneyVisible}>
      <Icon
        name={ui.moneyIsVisible ? MONEY_IS_VISIBLE : MONEY_IS_NOT_VISIBLE}
        color={theme['color-basic-100']}
      />
    </TouchableOpacity>
  );

  const centerItem = () => (
    <MonthPopover handleSelectedMonth={monthSelector && handleSelectedMonth} />
  );

  return (
    <Layout style={[styles.container, { paddingTop: insets.top }]}>
      {leftItem()}
      {monthSelector && centerItem()}
      {rightItem()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
