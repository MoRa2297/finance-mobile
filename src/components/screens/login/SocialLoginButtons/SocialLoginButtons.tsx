import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@/components/ui';
import { theme } from '@/config/theme';

import { LoginDivider } from '../LoginDivider';
import { styles } from './SocialLoginButtons.styles';
import { createSocialButtons, noop } from './SocialLoginButtons.helpers';

export interface SocialLoginButtonsProps {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
  onApplePress?: () => void;
  disabled?: boolean;
  showDivider?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  disabled = true,
  showDivider = true,
}) => {
  const { t } = useTranslation();

  const socialButtons = createSocialButtons(
    onGooglePress,
    onFacebookPress,
    onApplePress,
  );

  return (
    <View style={styles.container}>
      {showDivider && (
        <LoginDivider text={t('common.or')} style={styles.divider} />
      )}

      <View style={styles.buttonsContainer}>
        {socialButtons.map(button => (
          <IconButton
            key={button.id}
            iconName={button.iconName}
            onPress={button.onPress || noop}
            iconColor={theme.colors.textHint}
            style={styles.socialButton}
            isDisabled={disabled}
          />
        ))}
      </View>
    </View>
  );
};
