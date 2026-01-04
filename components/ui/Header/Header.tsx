import React, {JSX} from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TouchableWebElement } from '@ui-kitten/components/devsupport';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
 import { useNavigation } from '@react-navigation/native';
import {theme} from "../../../theme";

interface HeaderProps {
  title: () => JSX.Element | string;
  subtitle?: string;
  onPressSettings?: () => void;
  renderBackActionIcon?: boolean;
  backText?: string;
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  title,
  subtitle,
  onPressSettings,
  renderBackActionIcon = true,
  backText,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // eslint-disable-next-line react/no-unstable-nested-components
  const BackIcon = () => (
    <Layout style={styles.backIconContainer}>
      <Icon name="arrow-ios-back-outline" color={theme.colors.basic100} />
    </Layout>
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const SettingsIcon = () => (
    <Layout style={styles.settingsIconContainer}>
      <Icon name="more-horizontal-outline" color={theme.colors.basic100} />
    </Layout>
  );

  const renderBackAction = (): TouchableWebElement =>
    renderBackActionIcon ? (
      <TopNavigationAction
        icon={BackIcon}
        onPress={() => navigation.goBack()}
      />
    ) : (
      <TouchableWithoutFeedback
        onPress={() => navigation.goBack()}
        style={styles.backActionContainer}>
        <Text category="p1" style={styles.backActionText}>
          {backText}
        </Text>
      </TouchableWithoutFeedback>
    );

  const renderRightAction = (): TouchableWebElement => (
    <TopNavigationAction icon={SettingsIcon} onPress={onPressSettings} />
  );

  return (
    <Layout style={[styles.container, { paddingTop: insets.top }]} level="1">
      <TopNavigation
        alignment="center"
        title={title}
        subtitle={subtitle}
        accessoryLeft={renderBackAction}
        accessoryRight={onPressSettings && renderRightAction}
        style={{
          backgroundColor: theme.colors.transparent,
        }}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  backIconContainer: {
    borderColor: theme.colors.basic100,
    borderWidth: 0.7,
    borderRadius: 13,
    padding: 2,
    backgroundColor: theme.colors.transparent,
  },
  settingsIconContainer: {
    padding: 2,
    backgroundColor: theme.colors.transparent,
  },
  backActionContainer: {
    backgroundColor: theme.colors.transparent,
  },
  backActionText: {
    marginLeft: 10,
    backgroundColor: theme.colors.transparent,
  },
});
