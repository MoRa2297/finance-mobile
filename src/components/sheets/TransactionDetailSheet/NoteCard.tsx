import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { theme } from '@/config/theme';
import { HORIZONTAL_PADDING } from '@/config/constants';
import { Icon } from '@components/ui/Icon';

interface NoteCardProps {
  label: string;
  value: string;
}

export const NoteCard: FC<NoteCardProps> = ({ label, value }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <Icon name="file-text-outline" color={theme.colors.primary} size={17} />
    </View>
    <View style={styles.content}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: HORIZONTAL_PADDING,
    marginBottom: 16,
    backgroundColor: theme.colors.secondaryBK,
    borderRadius: 16,
    padding: 14,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  label: {
    color: theme.colors.textHint,
    fontSize: 11,
  },
  value: {
    color: theme.colors.basic100,
    fontSize: 15,
    fontWeight: '500',
  },
});
