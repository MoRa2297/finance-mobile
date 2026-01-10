import React, { useEffect } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import {
  ActivityIndicator,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import { theme } from '@config/theme';
import env from '@config/env';

interface LoadingSpinnerProps {
  color?: string;
  size?: number | 'small' | 'large';
  fullScreen?: boolean;
  inline?: boolean;
  overlayText?: string;
  backgroundColor?: string;
  textStyle?: StyleProp<TextStyle>;
}

export const LoadingSpinner: React.FunctionComponent<LoadingSpinnerProps> = ({
  color = theme.colors.primaryBK,
  size = 'large',
  fullScreen = false,
  inline = false,
  overlayText,
  backgroundColor = theme.colors.primaryBK,
  textStyle,
}) => {
  const fullScreenStyle = {
    backgroundColor: backgroundColor,
  };

  useEffect(() => {
    if (env.IS_ANDROID && fullScreen) {
      StatusBar.setBackgroundColor(backgroundColor);
    }
  }, [backgroundColor, fullScreen]);

  const spinner = inline ? (
    <ActivityIndicator color={color} size={size} />
  ) : (
    <Layout style={[styles.container, fullScreenStyle]}>
      {!!overlayText && (
        <Layout style={[styles.textContainer]}>
          <Text style={[styles.textContent, { color: color }, textStyle]}>
            {overlayText}
          </Text>
        </Layout>
      )}
      <ActivityIndicator color={color} size={size} />
    </Layout>
  );

  return !fullScreen ? (
    spinner
  ) : (
    <Modal
      animationInTiming={1}
      supportedOrientations={['landscape', 'portrait']}
      isVisible={true}
      statusBarTranslucent={true}
      hasBackdrop={false}
      style={styles.modal}>
      {spinner}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 0 },
  activityIndicator: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  textContainer: { backgroundColor: theme.colors.transparent },
  textContent: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
