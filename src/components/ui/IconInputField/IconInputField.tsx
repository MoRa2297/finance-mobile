import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { SheetManager } from 'react-native-actions-sheet';

import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { CATEGORY_ICONS } from '@config/icons';
import { Icon } from '@components/ui/Icon';
import { Button } from '@components/ui/Button';

interface IconInputFieldProps {
  value: string;
  onChange: (icon: string) => void;
  selectedColor: string;
  iconName?: string;
}

export const IconInputField: React.FC<IconInputFieldProps> = ({
  value,
  onChange,
  selectedColor,
  iconName,
}) => {
  const { t } = useTranslation('common');

  // Get first 3 icons for quick selection
  const quickIcons = CATEGORY_ICONS.slice(0, 3);

  const handleOpenSheet = useCallback(async () => {
    const result = await SheetManager.show('icon-sheet', {
      payload: { selected: value, selectedColor },
    });
    if (result?.icon) {
      onChange(result.icon);
    }
  }, [value, selectedColor, onChange]);

  const handleSelectIcon = useCallback(
    (icon: string) => {
      onChange(icon);
    },
    [onChange],
  );

  // Determine which icons to show (include selected if not in quick icons)
  const displayIcons = quickIcons.map((ic, index) => {
    if (index === 0 && !quickIcons.find(qi => qi.iconName === value)) {
      return { ...ic, iconName: value, isSelected: true };
    }
    return { ...ic, isSelected: ic.iconName === value };
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
        <Text style={styles.label}>{t('common:iconInputField.title')}</Text>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        {displayIcons.map((icon, index) => (
          <Pressable
            key={index}
            style={[
              styles.iconButton,
              {
                backgroundColor: selectedColor,
                borderWidth: icon.iconName === value ? 3 : 0,
                borderColor: theme.colors.basic100,
              },
            ]}
            onPress={() => handleSelectIcon(icon.iconName)}>
            <Icon
              name={icon.iconName}
              size={20}
              color={theme.colors.basic100}
            />
          </Pressable>
        ))}
        <Button
          size="small"
          buttonText={t('common:iconInputField.buttonText')}
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
  iconButton: {
    width: 35,
    height: 35,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    flex: 1,
    height: 35,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
  },
});
