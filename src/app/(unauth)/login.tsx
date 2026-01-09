import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  LoginFooter,
  LoginForm,
  LoginHeader,
  SocialLoginButtons,
} from '@components/screens/login';
import { ScreenContainer } from '@components/ui';
import { useLogin } from '@hooks/screens/login';

export default function LoginScreen() {
  const { t } = useTranslation();

  // TODO handle clearError in LoginForm
  const { isLoading, errorMessage, handleLogin, clearError } = useLogin();

  return (
    <ScreenContainer scrollable>
      <View style={styles.content}>
        <View style={styles.mainSection}>
          <LoginHeader />

          <LoginForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleLogin}
          />

          <SocialLoginButtons disabled />
        </View>

        <LoginFooter
          message={t('screens.loginScreen.noAccount')}
          linkText={t('screens.loginScreen.signUp')}
          linkHref={''}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
});
