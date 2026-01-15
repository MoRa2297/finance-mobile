export interface SocialButtonConfig {
  id: string;
  iconName: string;
  onPress?: () => void;
}

export const createSocialButtons = (
  onGooglePress?: () => void,
  onFacebookPress?: () => void,
  onApplePress?: () => void,
): SocialButtonConfig[] => {
  const buttons: SocialButtonConfig[] = [
    {
      id: 'google',
      iconName: 'google',
      onPress: onGooglePress,
    },
    {
      id: 'facebook',
      iconName: 'facebook',
      onPress: onFacebookPress,
    },
  ];

  if (onApplePress) {
    buttons.push({
      id: 'apple',
      iconName: 'apple',
      onPress: onApplePress,
    });
  }

  return buttons;
};

// TODO fix empty function
export const noop = () => {};
