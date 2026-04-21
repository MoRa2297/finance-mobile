export interface ISocialButtonConfig {
  id: string;
  name: string;
  iconName: string;
  onPress?: () => void;
}

export const createSocialButtons = (
  onGooglePress?: () => void,
  onFacebookPress?: () => void,
  onApplePress?: () => void,
): ISocialButtonConfig[] => {
  const buttons: ISocialButtonConfig[] = [
    {
      id: 'google',
      name: 'Google',
      iconName: 'google',
      onPress: onGooglePress,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      iconName: 'facebook',
      onPress: onFacebookPress,
    },
  ];

  if (onApplePress) {
    buttons.push({
      id: 'apple',
      name: 'Apple',
      iconName: 'apple',
      onPress: onApplePress,
    });
  }

  return buttons;
};

interface SocialButton {
  id: string;
  name: string; // ← nuovo
  iconName: string;
  onPress?: () => void;
}

export const noop = () => {};
