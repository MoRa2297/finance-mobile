import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { theme } from '../../../config/theme';
import Modal from 'react-native-modal';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';

interface AlertProps {
  visible: boolean;
  title: string;
  subTitle?: string;
  buttonTextPrimary: string;
  buttonTextSecondary?: string;
  handlePrimary: () => void;
  handleSecondary?: () => void;
}

export const Alert: React.FunctionComponent<AlertProps> = ({
  visible,
  title,
  subTitle,
  buttonTextPrimary,
  buttonTextSecondary,
  handlePrimary,
  handleSecondary,
}) => {
  return (
    <Modal
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      supportedOrientations={['landscape', 'portrait']}
      isVisible={visible}
      statusBarTranslucent={true}
      hasBackdrop={true}
      style={styles.modal}>
      <Layout style={styles.modalContainer}>
        <Layout style={styles.header}>
          <Text category="s1">{title}</Text>
          {subTitle && <Text category="p2">{subTitle}</Text>}
        </Layout>
        <Layout style={styles.footer}>
          {handleSecondary && (
            <Button style={styles.button} onPress={handleSecondary}>
              <Text category="s1">{buttonTextSecondary}</Text>
            </Button>
          )}
          <Button style={styles.button} onPress={handlePrimary}>
            <Text category="s1">{buttonTextPrimary}</Text>
          </Button>
        </Layout>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    width: '70%',
    backgroundColor: theme['color-secondary-BK'],
    borderRadius: GLOBAL_BORDER_RADIUS - 25,
  },
  header: {
    backgroundColor: theme['color-basic-transparent'],
    padding: 20,
    width: '100%',
    alignItems: 'center',
    gap: 5,
    borderColor: theme['text-hint-color'],
    borderBottomWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: theme['color-basic-transparent'],
    // padding: 20,
    width: '100%',
    alignItems: 'center',
    gap: 5,
  },
  button: {
    backgroundColor: theme['color-basic-transparent'],
    borderColor: theme['color-basic-transparent'],
    padding: 20,
    // width: '100%',
    flex: 1,
    alignItems: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS - 25,
  },
});
