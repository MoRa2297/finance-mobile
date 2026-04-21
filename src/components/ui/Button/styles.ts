import { StyleSheet } from 'react-native';

export const BUTTON_BORDER_RADIUS = 15;

export const buttonStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: BUTTON_BORDER_RADIUS,
    position: 'relative',
  },
  button: {
    borderRadius: BUTTON_BORDER_RADIUS,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BUTTON_BORDER_RADIUS,
  },
  disabled: {
    opacity: 0.4,
  },
  loading: {
    opacity: 0.85,
  },
});

export const iconButtonStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
