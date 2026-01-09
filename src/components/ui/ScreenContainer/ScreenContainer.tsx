import React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Layout } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@config/constants';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  horizontalPadding?: boolean;
  forceNoBottomPadding?: boolean;
  scrollable?: boolean;
  centered?: boolean;
  keyboardAvoiding?: boolean;
  dismissKeyboardOnTap?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  contentStyle,
  horizontalPadding = true,
  forceNoBottomPadding = false,
  scrollable = false,
  centered = false,
  keyboardAvoiding = true,
  dismissKeyboardOnTap = true,
}) => {
  const insets = useSafeAreaInsets();

  // Android StatusBar
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(theme.colors.transparent);
    StatusBar.setTranslucent(true);
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
    paddingTop: insets.top,
    paddingBottom: forceNoBottomPadding ? 0 : insets.bottom,
    paddingHorizontal: horizontalPadding ? HORIZONTAL_PADDING : 0,
  };

  const scrollContentStyle: ViewStyle = {
    flexGrow: 1,
    ...(centered && { justifyContent: 'center' }),
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          contentContainerStyle={[scrollContentStyle, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      );
    }

    return (
      <Layout
        style={[styles.content, centered && styles.centered, contentStyle]}>
        {children}
      </Layout>
    );
  };

  const renderWithKeyboard = () => {
    if (keyboardAvoiding) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          {renderContent()}
        </KeyboardAvoidingView>
      );
    }

    return renderContent();
  };

  const renderWithDismiss = () => {
    if (dismissKeyboardOnTap) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {renderWithKeyboard()}
        </TouchableWithoutFeedback>
      );
    }

    return renderWithKeyboard();
  };

  return <Layout style={[containerStyle, style]}>{renderWithDismiss()}</Layout>;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
  },
  centered: {
    justifyContent: 'center',
  },
});
