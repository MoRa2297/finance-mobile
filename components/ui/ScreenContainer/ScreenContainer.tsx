import { Layout } from '@ui-kitten/components';
import React from 'react';
import { StatusBar, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

 import {HORIZONTAL_PADDING} from "../../../constants";
import {theme} from "../../../theme";
import env from "../../../env";

interface Props {
  horizontalMargin?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | React.ReactNode[];
  isKeyboardOpen?: boolean;
  forceNoBottomPadding?: boolean;
}

export const ScreenContainer: React.FunctionComponent<Props> = ({
  horizontalMargin = true,
  style,
  isKeyboardOpen,
  forceNoBottomPadding = false,
  ...props
}) => {
  if (env.IS_ANDROID) {
    StatusBar.setBackgroundColor(theme.colors.transparent);
    StatusBar.setTranslucent(true);
  }

  const insets = useSafeAreaInsets();

  const extraStyle = {
    backgroundColor: theme.colors.primaryBK,
    paddingHorizontal: horizontalMargin ? HORIZONTAL_PADDING : 0,
    paddingTop: insets.top,
    paddingBottom: isKeyboardOpen || forceNoBottomPadding ? 0 : insets.bottom,
  };

  return (
    <Layout
      {...props}
      style={[
        styles.container,
        extraStyle,
        style,
        {
          marginTop: -insets.top,
        },
      ]}>
      {props.children}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
