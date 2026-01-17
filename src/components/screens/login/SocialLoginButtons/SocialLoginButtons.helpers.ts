export interface ISocialButtonConfig {
  id: string;
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
