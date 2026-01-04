import { Text, Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';
import ToggleSwitch from 'toggle-switch-react-native';

interface SwitchInputProps {
  value: boolean;
  placeholder: string;
  handleChange: (value: boolean) => void;
  iconName?: string;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  value,
  iconName,
  handleChange,
  placeholder,
}) => {
  const renderIconLeft = () => {
    if (iconName) {
      return (
        <Layout style={styles.iconContainer}>
          <Icon name={iconName} color={theme['text-hint-color']} size={28} />
        </Layout>
      );
    } else {
      <></>;
    }
  };

  const renderIconRight = () => {
    return (
      <Layout style={styles.toggleContainer}>
        <ToggleSwitch
          isOn={value}
          onColor={theme['color-primary']}
          offColor={theme['color-secondary-BK']}
          size="large"
          onToggle={handleChange}
        />
      </Layout>
    );
  };

  return (
    <Layout style={styles.topContainer}>
      {renderIconLeft()}
      <Text style={[styles.topContainerTitle]}>{placeholder}</Text>
      {renderIconRight()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    height: 60,
    backgroundColor: theme['color-basic-transparent'],
    borderBottomColor: theme['text-hint-color'],
    borderBottomWidth: 0.7,
  },
  topContainerTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: theme['text-hint-color'],
  },
  customTitleContainer: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomContainer: {
    flexDirection: 'row',
    marginLeft: '12%',
    gap: 15,
    height: 60,
  },
  colorButton: {
    width: 35,
    height: 35,
  },
  inputText: { fontSize: 16, fontWeight: '300', minHeight: 46 },
  iconContainer: {
    flex: 0.16,
    alignItems: 'center',
  },
  toggleContainer: {
    alignItems: 'center',
  },
  button: {
    borderRadius: GLOBAL_BORDER_RADIUS,
    flex: 1,
    height: 40,
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    resizeMode: 'contain',
  },
  customTextContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-start',
  },
  text: {
    borderWidth: 1,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
    gap: 3,
  },
});
