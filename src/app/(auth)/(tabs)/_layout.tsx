import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BottomNavigation } from '@/components/ui';
import { theme } from '@/config/theme';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Slot />
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryBK,
  },
});
