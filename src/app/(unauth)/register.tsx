import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '@components/ui/ScreenContainer';
import {
  LoginDivider,
  LoginFooter,
  SocialLoginButtons,
} from '@components/screens/login';
import { useRegisterScreen } from '@hooks/screens/register/useRegisterScreen';
import { ROUTES } from '@config/constants';
import { RegisterForm, RegisterHeader } from '@components/screens/register';

export default function RegisterScreen() {
  const { t } = useTranslation(['registerPage']);
  const { isLoading, errorMessage, handleRegister, clearError } =
    useRegisterScreen();

  return (
    <ScreenContainer scrollable>
      <View style={styles.content}>
        <View style={styles.mainSection}>
          <RegisterHeader />
          <RegisterForm
            isLoading={isLoading}
            errorMessage={errorMessage ?? ''}
            onSubmit={handleRegister}
            onClearError={clearError}
          />
          <LoginDivider text={t('registerPage:or')} />
          <SocialLoginButtons disabled />
        </View>

        <LoginFooter
          message={t('registerPage:hasAccount')}
          linkText={t('registerPage:signIn')}
          linkHref={ROUTES.LOGIN}
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
    flexShrink: 1,
    justifyContent: 'center',
    gap: 32,
  },
});
