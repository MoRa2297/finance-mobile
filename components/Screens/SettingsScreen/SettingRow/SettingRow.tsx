import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../config/theme';
import { Icon } from '../../../UI/Icon/Icon';

interface SettingRowProps {
  title: string;
  iconName: string;
  borderBottom: boolean;
  handleNavigate: () => void;
  color?: string;
}

export const SettingRow: React.FunctionComponent<SettingRowProps> = ({
  title,
  iconName,
  borderBottom,
  handleNavigate,
  color,
}) => {
  return (
    <TouchableOpacity onPress={handleNavigate}>
      <Layout
        style={[
          styles.container,
          {
            borderBottomWidth: borderBottom ? 0 : 1,
            borderColor: borderBottom ? 'none' : '#828995',
          },
        ]}>
        <Icon
          name={iconName}
          color={color ? color : theme['color-basic-100']}
          size={20}
        />
        <Text style={{ color: color ? color : theme['color-basic-100'] }}>
          {title}
        </Text>
      </Layout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme['color-basic-transparent'],
  },
});
