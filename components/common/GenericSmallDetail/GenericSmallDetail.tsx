import { Layout, Text } from '@ui-kitten/components';
import React, { ReactElement } from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from '../../UI/Icon/Icon';
import { theme } from '../../../config/theme';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';

interface GenericSmallDetailProps {
  title: string;
  value: string;
  iconName?: string;
  style?: ViewStyle;
  valueColor?: string;
  imageUrl?: string;
}

export const GenericSmallDetail: React.FunctionComponent<
  GenericSmallDetailProps
> = ({ title, iconName, value, valueColor, imageUrl }) => {
  const renderAccessoryLeft = (): ReactElement => {
    if (imageUrl) {
      return (
        <Layout style={styles.accessoryLeftContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </Layout>
      );
    } else if (iconName) {
      return (
        <Layout style={styles.accessoryLeftContainer}>
          <Layout style={[styles.iconLeftContainer]}>
            <Icon name={iconName} color={theme['color-basic-100']} size={28} />
          </Layout>
        </Layout>
      );
    } else {
      <></>;
    }
  };

  const renderContent = (): React.ReactElement => (
    <Layout style={styles.contentTop}>
      <Text category="c2" style={styles.title}>
        {title}
      </Text>
      <Text
        category="h6"
        style={[
          styles.value,
          { color: valueColor ? valueColor : theme['color-basic-100'] },
        ]}>
        {value}
      </Text>
    </Layout>
  );

  return (
    <Layout style={styles.listItem}>
      {renderAccessoryLeft()}
      {renderContent()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    flex: 1,
    minHeight: 60,
    height: 60,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
  },
  accessoryLeftContainer: {
    height: '100%',
    backgroundColor: theme['color-basic-transparent'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: GLOBAL_BORDER_RADIUS,
    backgroundColor: theme['color-basic-transparent'],
  },
  contentTop: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme['color-basic-transparent'],
    gap: 5,
    width: '100%',
  },
  value: {
    color: theme['color-basic-100'],
    fontSize: 16,
  },
  title: {
    color: theme['text-hint-color'],
    fontSize: 14,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    resizeMode: 'cover',
  },
});
