import { Text, Layout } from '@ui-kitten/components';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';
import { GLOBAL_BORDER_RADIUS } from '../../../config/constants';
import { useTranslation } from 'react-i18next';
import Moment from 'moment';

interface DateInputFieldProps {
  value?: string;
  onChange: (date: string) => void;
  iconName?: string;
  handleOpenSheet: () => void;
  customBackgroundColor?: string;
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  value,
  onChange,
  iconName,
  handleOpenSheet,
  customBackgroundColor = theme['color-primary-BK'],
}) => {
  const { t } = useTranslation();
  const today = Moment().format('DD-MM-YYYY');
  const yesterday = Moment().subtract(1, 'days').format('DD-MM-YYYY');

  const renderIconLeft = () => {
    if (iconName) {
      return (
        <Layout
          style={[
            styles.iconContainer,
            { backgroundColor: customBackgroundColor },
          ]}>
          <Icon name={iconName} color={theme['text-hint-color']} size={28} />
        </Layout>
      );
    } else {
      <></>;
    }
  };

  const handleSelectDate = useCallback(
    (date: string) => {
      onChange(date);
    },
    [onChange],
  );

  return (
    <Layout
      style={[styles.container, { backgroundColor: customBackgroundColor }]}>
      <Layout
        style={[
          styles.topContainer,
          { backgroundColor: customBackgroundColor },
        ]}>
        {renderIconLeft()}
        {value === today || value === yesterday ? (
          <Layout
            style={[
              styles.bottomContainer,
              { backgroundColor: customBackgroundColor },
            ]}>
            <Button
              onPress={() => handleSelectDate(today)}
              size={'small'}
              buttonText={t<string>('TODAY')}
              backgroundColor={
                value !== today
                  ? theme['text-hint-color']
                  : theme['color-primary']
              }
              borderColor={
                value !== today
                  ? theme['text-hint-color']
                  : theme['color-primary']
              }
              style={styles.button}
            />
            <Button
              onPress={() => handleSelectDate(yesterday)}
              size={'small'}
              buttonText={t<string>('YESTERDAY')}
              backgroundColor={
                value !== yesterday
                  ? theme['text-hint-color']
                  : theme['color-primary']
              }
              borderColor={
                value !== yesterday
                  ? theme['text-hint-color']
                  : theme['color-primary']
              }
              style={styles.button}
            />
            <Button
              onPress={handleOpenSheet}
              size={'small'}
              buttonText={t<string>('CHOOSE')}
              backgroundColor={
                value !== new Date().toISOString()
                  ? theme['text-hint-color']
                  : theme['color-primary']
              }
              borderColor={
                value !== new Date().toISOString()
                  ? theme['text-hint-color']
                  : theme['color-primary']
              }
              style={styles.button}
            />
          </Layout>
        ) : (
          <TouchableWithoutFeedback onPress={handleOpenSheet}>
            <Layout style={styles.bottomContainerValue}>
              <Text style={styles.valueFont}>{value}</Text>
            </Layout>
          </TouchableWithoutFeedback>
        )}
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
    height: 60,
  },
  topContainerTitle: {
    fontSize: 16,
    color: theme['text-hint-color'],
    fontWeight: '500',
  },
  bottomContainer: {
    flexDirection: 'row',
    display: 'flex',
    flex: 1,
    gap: 15,
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
    width: 'auto',
    height: 35,
  },
  bottomContainerValue: {
    flexDirection: 'row',
    display: 'flex',
    flex: 1,
    gap: 15,
    backgroundColor: theme['color-basic-transparent'],
  },
  valueFont: {
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
