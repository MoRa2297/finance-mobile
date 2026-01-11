import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';

import { Icon, Button } from '@/components/ui';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { COLORS } from '@/config';

interface ColorInputFieldProps {
  value: string;
  onChange: (color: string) => void;
  iconName?: string;
}

export const ColorInputField: React.FC<ColorInputFieldProps> = ({
  value,
  onChange,
  iconName,
}) => {
  const { t } = useTranslation();

  // Get first 3 colors for quick selection
  const quickColors = COLORS.slice(0, 3);

  const handleOpenSheet = useCallback(async () => {
    const result = await SheetManager.show('color-sheet', {
      payload: { selected: value },
    });
    if (result?.color) {
      onChange(result.color);
    }
  }, [value, onChange]);

  const handleSelectColor = useCallback(
    (color: string) => {
      onChange(color);
    },
    [onChange],
  );

  // Determine which colors to show (include selected if not in quick colors)
  const displayColors = quickColors.map((c, index) => {
    if (index === 0 && !quickColors.find(qc => qc.hexCode === value)) {
      return { ...c, hexCode: value, isSelected: true };
    }
    return { ...c, isSelected: c.hexCode === value };
  });

  return (
    <View style={styles.container}>
      {/* Top row */}
      <View style={styles.topRow}>
        {iconName && (
          <View style={styles.iconContainer}>
            <Icon name={iconName} color={theme.colors.textHint} size={24} />
          </View>
        )}
        <Text style={styles.label}>
          {t('components.colorInputField.title')}
        </Text>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        {displayColors.map((color, index) => (
          <Pressable
            key={index}
            style={[
              styles.colorButton,
              {
                backgroundColor: color.hexCode,
                borderWidth: color.hexCode === value ? 3 : 0,
                borderColor: theme.colors.basic100,
              },
            ]}
            onPress={() => handleSelectColor(color.hexCode)}
          />
        ))}
        <Button
          size="small"
          buttonText={t('components.colorInputField.buttonText')}
          style={styles.moreButton}
          backgroundColor={theme.colors.textHint}
          onPress={handleOpenSheet}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    borderBottomWidth: 0.7,
    borderBottomColor: theme.colors.textHint,
    paddingBottom: 15,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: theme.colors.textHint,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    gap: 12,
  },
  colorButton: {
    width: 35,
    height: 35,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
  },
  moreButton: {
    flex: 1,
    height: 35,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
  },
});
