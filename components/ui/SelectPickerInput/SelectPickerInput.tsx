import { Text, Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';

interface SelectPickerInputProps {
  value: number | string | undefined;
  placeholder: string;
  handleOpenSheet: () => void;
  iconName?: string;
}

export const SelectPickerInput: React.FC<SelectPickerInputProps> = ({
  value,
  iconName,
  handleOpenSheet,
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

  const renderValueRight = () => {
    return (
      <Layout style={styles.valueTextContainer}>
        <Text
          style={[
            styles.text,
            {
              color: value
                ? theme['color-basic-100']
                : theme['text-hint-color'],
            },
          ]}>
          {value}
        </Text>
      </Layout>
    );
  };

  return (
    <TouchableWithoutFeedback
      style={styles.topContainer}
      onPress={() => {
        handleOpenSheet();
      }}>
      <Layout style={styles.topContainer}>
        {renderIconLeft()}
        <Text style={[styles.topContainerTitle]}>{placeholder}</Text>
        {renderValueRight()}
      </Layout>
    </TouchableWithoutFeedback>
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
    fontSize: 16,
    fontWeight: '500',
    justifyContent: 'center',
  },
  valueTextContainer: {
    flex: 0.16,
    alignItems: 'center',
  },
});
