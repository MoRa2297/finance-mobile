import { Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../../../config/theme';

interface Props {
  children: any;
  height: string; //percentage height
  paddingTop?: number;
}

export const TopBodyContainer: React.FunctionComponent<Props> = ({
  children,
  height,
  paddingTop = 0,
}) => {
  return (
    <Layout
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          minHeight: height,
          paddingTop: paddingTop ? paddingTop : 0,
        },
      ]}>
      {children}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    backgroundColor: theme['color-primary-500'],
    width: '100%',
  },
});
