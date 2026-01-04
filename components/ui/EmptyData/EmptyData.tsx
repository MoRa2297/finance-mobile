import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import {theme} from "../../../theme";


interface EmptyDataProps {
  title: string;
  subtitle?: string;
}

export const EmptyData: React.FunctionComponent<EmptyDataProps> = ({
  title,
  subtitle,
}) => {
  return (
    <Layout style={styles.container} level="1">
      <Text category="h6" style={styles.title}>
        {title}
      </Text>

      {subtitle && (
        <Text category="c2" style={styles.subTitle}>
          {title}
        </Text>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    maxWidth: '70%',
    textAlign: 'center',
  },
  subTitle: {
    maxWidth: '65%',
    textAlign: 'center',
    marginVertical: 10,
  },
});
