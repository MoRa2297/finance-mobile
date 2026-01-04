import { Text, Layout } from '@ui-kitten/components';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
 import { SheetManager } from 'react-native-actions-sheet';

import { Button as KittenButton } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { Color } from '../../../types/types';
import {theme} from "../../../theme";
import {Button} from "../Button";
import {Icon} from "../Icon";
import {GLOBAL_BORDER_RADIUS} from "../../../constants";

interface ColorInputFieldProps {
  value?: string;
  onChange: (text: string) => void;
  iconName?: string;
  colors?: Color[];
}

export const ColorInputField: React.FC<ColorInputFieldProps> = ({
  value,
  onChange,
  iconName,
  colors,
}) => {
  const { t } = useTranslation();

  const renderIconLeft = () => {
    if (iconName) {
      return (
        <Layout style={styles.iconContainer}>
          <Icon name={iconName} color={theme.colors.textHint} size={28} />
        </Layout>
      );
    } else {
      <></>;
    }
  };

  const handleSelectColor = useCallback(
    (color: string) => {
      onChange(color);
    },
    [onChange],
  );

  const handleColorSheet = useCallback(async () => {
    let result: { color: string } = await SheetManager.show('color-sheet', {
      payload: { selected: value },
    } as any); // TODO fix with not as any

    onChange(result.color);
  }, [onChange, value]);

  return (
    <Layout style={styles.container}>
      <Layout style={styles.topContainer}>
        {renderIconLeft()}
        <Layout>
          <Text style={styles.topContainerTitle}>
            {t('components.colorInputField.title')}
          </Text>
        </Layout>
      </Layout>
      <Layout style={styles.bottomContainer}>
        {colors?.slice(0, 3).map((color, index) => {
          if (index === 0) {
            if (colors[0].hexCode === value) {
              return (
                <KittenButton
                  key={index}
                  style={[
                    styles.colorButton,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor: color.hexCode,
                      borderRadius: GLOBAL_BORDER_RADIUS,
                      borderWidth: value === color?.hexCode ? 4 : 0,
                      borderColor:
                        value === color?.hexCode
                          ? theme.colors.basic100
                          : theme.colors.transparent,
                    },
                  ]}
                  onPress={() => {
                    handleSelectColor(color.hexCode);
                  }}
                />
              );
            } else {
              if (value === colors[1].hexCode || value === colors[2].hexCode) {
                return (
                  <KittenButton
                    key={index}
                    style={[
                      styles.colorButton,
                      {
                        backgroundColor: color.hexCode,
                        borderRadius: GLOBAL_BORDER_RADIUS,
                      },
                    ]}
                    onPress={() => {
                      handleSelectColor(color.hexCode);
                    }}
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
                        backgroundColor: value,
                        borderRadius: GLOBAL_BORDER_RADIUS,
                        borderWidth: 4,
                        borderColor: theme.colors.basic100,
                      },
                    ]}
                    onPress={() => {
                      // handleSelectColor(value); TODO fix
                    }}
                  />
                );
              }
            }
          } else {
            return (
              <KittenButton
                key={index}
                style={[
                  styles.colorButton,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: color.hexCode,
                    borderRadius: GLOBAL_BORDER_RADIUS,
                    borderWidth: value === color?.hexCode ? 4 : 0,
                    borderColor:
                      value === color?.hexCode
                        ? theme.colors.basic100
                        : theme.colors.transparent,
                  },
                ]}
                onPress={() => {
                  handleSelectColor(color.hexCode);
                }}
              />
            );
          }
        })}

        <Button
          onPress={handleColorSheet}
          size={'small'}
          buttonText={t('components.colorInputField.buttonText')}
          backgroundColor={theme.colors.textHint}
          borderColor={theme.colors.textHint}
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
    backgroundColor: theme.colors.transparent,
    borderBottomColor: theme.colors.textHint,
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
    color: theme.colors.textHint,
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
});
