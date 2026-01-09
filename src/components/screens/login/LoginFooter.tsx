import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Link } from 'expo-router';

import { theme } from '@config/theme';

export interface LoginFooterProps {
  message: string;
  linkText: string;
  linkHref: string;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({
  message,
  linkText,
  linkHref,
}) => {
  return (
    <Layout style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{message} </Text>
        <Link href={linkHref as any} asChild>
          <Pressable>
            <Text style={styles.linkText}>{linkText}</Text>
          </Pressable>
        </Link>
      </View>
    </Layout>
  );
};

export const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.textHint,
    fontSize: 14,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
