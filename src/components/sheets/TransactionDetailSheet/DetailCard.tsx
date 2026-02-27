import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { theme } from '@/config/theme';
import { Icon } from '@components/ui/Icon';

interface DetailCardProps {
  iconName: string;
  label: string;
  value?: string | null;
  accent?: string;
}

export const DetailCard: FC<DetailCardProps> = ({
  iconName,
  label,
  value,
  accent,
}) => (
  <View style={styles.card}>
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: (accent ?? theme.colors.primary) + '25' },
      ]}>
      <Icon name={iconName} color={accent ?? theme.colors.primary} size={17} />
    </View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={2}>
      {value || '-'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBK,
    borderRadius: 16,
    padding: 14,
    gap: 5,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
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
