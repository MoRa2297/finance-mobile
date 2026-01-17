import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { theme } from '@/config/theme';

import { Tab } from './SliderBar.helpers';
import { GLOBAL_BORDER_RADIUS } from '@config/constants';

interface SliderBarProps {
  tabs: Tab[];
  onTabChange: (value: string) => void;
  initialTab?: string;
}

// TODO agg gesture
export const SliderBar: React.FC<SliderBarProps> = ({
  tabs,
  onTabChange,
  initialTab,
}) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(initialTab || tabs[0]?.value);

  const handleTabPress = useCallback(
    (value: string) => {
      setSelectedTab(value);
      onTabChange(value);
    },
    [onTabChange],
  );

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isSelected = selectedTab === tab.value;

        return (
          <Pressable
            key={tab.value}
            style={[styles.tab, isSelected && styles.tabSelected]}
            onPress={() => handleTabPress(tab.value)}>
            <Text
              category="s2"
              style={[styles.tabText, isSelected && styles.tabTextSelected]}>
              {t(`common.tabs.${tab.title}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS,
    padding: 4,
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS - 2,
  },
  tabSelected: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textHint,
  },
  tabTextSelected: {
    color: theme.colors.basic100,
    fontWeight: '600',
  },
});
