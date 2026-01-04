import { Text, Layout } from '@ui-kitten/components';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';
import { SheetManager } from 'react-native-actions-sheet';
import { Button as KittenButton } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { CategoryIcon } from '../../../types/types';

interface IconInputFieldProps {
  value: string;
  onChange: (text: string) => void;
  iconName?: string;
  selectedColor: string;
  icons?: CategoryIcon[];
}

export const IconInputField: React.FC<IconInputFieldProps> = ({
  value,
  onChange,
  iconName,
  selectedColor,
  icons,
}) => {
  const { t } = useTranslation();

  const renderIconLeft = () => {
    if (iconName) {
      return (
        <Layout style={styles.iconContainer}>
          <Icon name={iconName} color={theme['text-hint-color']} size={28} />
        </Layout>
      );
    } else {
      <></>;
    }
  };

  const handleSelectIcon = useCallback(
    (icon: string) => {
      onChange(icon);
    },
    [onChange],
  );

  const handleColorSheet = useCallback(async () => {
    let result: { icon: string } = await SheetManager.show('icon-sheet', {
      payload: { selected: value, selectedColor: selectedColor },
    });

    onChange(result.icon);
  }, [onChange, selectedColor, value]);

  const renderIcon = (name: string) => {
    return (
      <Layout style={styles.iconContainerIcons}>
        <Icon
          name={name}
          color={theme['color-basic-100']}
          size={20}
          pack="ionicons"
        />
      </Layout>
    );
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.topContainer}>
        {renderIconLeft()}
        <Layout>
          <Text style={styles.topContainerTitle}>
            {t<string>('components.iconInputField.title')}
          </Text>
        </Layout>
      </Layout>
      <Layout style={styles.bottomContainer}>
        {icons?.slice(0, 3).map((icon, index) => {
          if (index === 0) {
            if (icons[0].iconName === value) {
              return (
                <KittenButton
                  key={index}
                  style={[
                    styles.colorButton,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor: selectedColor,
                      borderRadius: GLOBAL_BORDER_RADIUS,
                      borderWidth: value === icon?.iconName ? 4 : 0,
                      borderColor:
                        value === icon?.iconName
                          ? theme['color-basic-100']
                          : theme['color-basic-transparent'],
                    },
                  ]}
                  onPress={() => {
                    handleSelectIcon(icon.iconName);
                  }}
                  children={() => renderIcon(icon.iconName)}
                />
              );
            } else {
              if (value === icons[1].iconName || value === icons[2].iconName) {
                return (
                  <KittenButton
                    key={index}
                    style={[
                      styles.colorButton,
                      {
                        backgroundColor: selectedColor,
                        borderRadius: GLOBAL_BORDER_RADIUS,
                      },
                    ]}
                    onPress={() => {
                      handleSelectIcon(icon.iconName);
                    }}
                    children={() => renderIcon(icon.iconName)}
                  />
                );
              } else {
                return (
                  <KittenButton
                    key={index}
                    style={[
                      styles.colorButton,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        backgroundColor: selectedColor,
                        borderRadius: GLOBAL_BORDER_RADIUS,
                        borderWidth: 4,
                        borderColor: theme['color-basic-100'],
                      },
                    ]}
                    onPress={() => {
                      handleSelectIcon(value);
                    }}
                    children={() => renderIcon(value)}
                  />
                );
              }
            }
          } else {
            return (
              <KittenButton
                style={[
                  styles.colorButton,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: selectedColor,
                    borderRadius: GLOBAL_BORDER_RADIUS,
                    borderWidth: value === icon?.iconName ? 4 : 0,
                    borderColor:
                      value === icon?.iconName
                        ? theme['color-basic-100']
                        : theme['color-basic-transparent'],
                  },
                ]}
                onPress={() => {
                  handleSelectIcon(icon.iconName);
                }}
                children={() => renderIcon(icon.iconName)}
              />
            );
          }
        })}

        <Button
          onPress={handleColorSheet}
          size={'small'}
          buttonText={t<string>('components.iconInputField.buttonText')}
          backgroundColor={theme['text-hint-color']}
          borderColor={theme['text-hint-color']}
          style={styles.button}
        />
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    display: 'flex',
    backgroundColor: theme['color-basic-transparent'],
    borderBottomColor: theme['text-hint-color'],
    borderBottomWidth: 0.7,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    marginBottom: 10,
    height: 60,
  },
  topContainerTitle: {
    fontSize: 16,
    color: theme['text-hint-color'],
    fontWeight: '500',
  },
  bottomContainer: {
    flexDirection: 'row',
    marginLeft: '12%',
    gap: 15,
    height: 60,
  },
  colorButton: {
    width: 35,
    height: 35,
  },
  inputText: { fontSize: 16, fontWeight: '300', minHeight: 46 },
  iconContainer: {
    flex: 0.14,
    alignItems: 'center',
  },
  button: {
    borderRadius: GLOBAL_BORDER_RADIUS,
    flex: 1,
    height: 40,
  },
  iconContainerIcons: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme['color-basic-transparent'],
  },
});
