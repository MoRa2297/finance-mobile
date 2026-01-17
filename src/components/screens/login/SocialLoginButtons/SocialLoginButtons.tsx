import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/ui';
import { theme } from '@/config/theme';

import { createSocialButtons, noop } from './SocialLoginButtons.helpers';

interface ISocialLoginButtonsProps {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
  onApplePress?: () => void;
  disabled?: boolean;
}

export const SocialLoginButtons: FC<ISocialLoginButtonsProps> = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  disabled = true,
}) => {
  const socialButtons = createSocialButtons(
    onGooglePress,
    onFacebookPress,
    onApplePress,
  );

  return (
    <View style={styles.container}>
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

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: theme.colors.transparent,
  },
  socialButton: {
    flex: 1,
    height: 55,
    backgroundColor: theme.colors.primaryBK,
    borderColor: theme.colors.textHint,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
