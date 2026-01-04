import { Text, Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';

interface SelectInputProps {
  value: string | undefined;
  selectedCategoryIconName?: string | undefined;
  selectedBorderColor?: string | undefined;
  selectedImageUrl?: string | null;
  placeholder: string;
  handleOpenSheet: () => void;
  iconName?: string;
  iconNameRight: string;
  valueBordered?: boolean;
  iconType?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  value,
  iconName,
  iconNameRight,
  handleOpenSheet,
  placeholder,
  valueBordered = false,
  iconType = 'eva',
  selectedCategoryIconName = '',
  selectedBorderColor = '',
  selectedImageUrl = '',
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
    if (iconNameRight) {
      return (
        <Layout style={styles.iconContainer}>
          <Icon
            name={iconNameRight}
            color={theme['text-hint-color']}
            size={28}
          />
        </Layout>
      );
    } else {
      <></>;
    }
  };

  const renderCenterRight = () => {
    if (selectedCategoryIconName) {
      return (
        <Layout
          style={[
            styles.iconContainerIcons,
            {
              backgroundColor: selectedBorderColor,
            },
          ]}>
          <Icon
            name={selectedCategoryIconName}
            color={theme['color-basic-100']}
            size={18}
            pack={iconType}
          />
        </Layout>
      );
    } else if (selectedImageUrl) {
      return (
        <Layout style={[styles.iconContainerIcons]}>
          <Image source={{ uri: selectedImageUrl }} style={styles.image} />
        </Layout>
      );
    } else {
      return <></>;
    }
  };

  return (
    <TouchableWithoutFeedback
      style={styles.topContainer}
      onPress={handleOpenSheet}>
      <Layout style={styles.topContainer}>
        {renderIconLeft()}
        {!valueBordered ? (
          <Text
            style={[
              styles.topContainerTitle,
              {
                color: value
                  ? theme['color-basic-100']
                  : theme['text-hint-color'],
              },
            ]}>
            {value ? value : placeholder}
          </Text>
        ) : (
          <Layout style={styles.customTextContainer}>
            <Layout
              style={[
                styles.text,
                {
                  borderColor: value
                    ? selectedBorderColor
                    : theme['color-basic-transparent'], // TODO to set dinamically
                  paddingHorizontal: value ? 12 : 0,
                },
              ]}>
              {value &&
                (selectedCategoryIconName || selectedImageUrl) &&
                renderCenterRight()}
              <Text
                style={{
                  color: value
                    ? theme['color-basic-100']
                    : theme['text-hint-color'],
                  fontSize: 16,
                }}>
                {value ? value : placeholder}
              </Text>
            </Layout>
          </Layout>
        )}
        {renderIconRight()}
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
    borderWidth: 1,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
    gap: 3,
  },
  iconContainerIcons: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
});
