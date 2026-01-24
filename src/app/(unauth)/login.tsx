import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  LoginDivider,
  LoginFooter,
  LoginForm,
  LoginHeader,
  SocialLoginButtons,
} from '@components/screens/login';
import { useLogin } from '@hooks/screens/login';
import { ScreenContainer } from '@components/ui/ScreenContainer';

// TODO lock the scroll
export default function LoginScreen() {
  const { t } = useTranslation(['loginPage']);

  // TODO handle clearError in LoginForm
  const { isLoading, errorMessage, handleLogin, clearError } = useLogin();

  return (
    <ScreenContainer scrollable={true}>
      <View style={styles.content}>
        {/*<View style={styles.mainSection}>*/}
        {/*  <LoginHeader />*/}
        {/*  <LoginForm*/}
        {/*    isLoading={isLoading}*/}
        {/*    errorMessage={errorMessage}*/}
        {/*    onSubmit={handleLogin}*/}
        {/*  />*/}
        {/*  <LoginDivider text={t('loginPage:or')} />*/}
        {/*  <SocialLoginButtons disabled />*/}
        {/*</View>*/}

        {/*<LoginFooter*/}
        {/*  message={t('loginPage:noAccount')}*/}
        {/*  linkText={t('loginPage:signUp')}*/}
        {/*  linkHref={''}*/}
        {/*/>*/}
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
    flexShrink: 1,
    justifyContent: 'center',
    gap: 32,
  },
});
