import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon as KittenIcon } from '@ui-kitten/components';

interface IconProps {
  name: string;
  color: string;
  size?: number;
  style?: any;
  props?: any;
  onPress?: () => void;
  pack?: string;
}

export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  color,
  size,
  style,
  props,
  onPress,
  pack = 'eva',
}) => {
  return (
    <KittenIcon
      style={[
        size ? { width: size, height: size } : styles.icon,
        { tintColor: color },
        style,
      ]}
      fill={color}
      name={name}
      pack={pack}
      onPress={onPress}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
