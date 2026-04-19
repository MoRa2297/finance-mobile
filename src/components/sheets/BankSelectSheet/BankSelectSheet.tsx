import React, { useRef, useMemo, useState, FC } from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Text, Input } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { Icon } from '@/components/ui/Icon';
import { useLookupStore, lookupSelectors } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankType } from '@/types';
import { EntityImage } from '@components/ui/EntityImage';
import { useTranslation } from 'react-i18next';

interface SectionData {
  title: string;
  data: BankType[];
}

export const BankSelectSheet: FC<SheetProps<'bank-select-sheet'>> = ({
  sheetId,
}) => {
  const { t } = useTranslation(['bankAccountPage', 'common']);

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { height } = useWindowDimensions();
  const bankTypes = useLookupStore(lookupSelectors.bankTypes);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      search.trim()
        ? bankTypes.filter(b =>
            b.name.toLowerCase().includes(search.toLowerCase()),
          )
        : bankTypes,
    [bankTypes, search],
  );

  const sections: SectionData[] = useMemo(() => {
    const grouped = filtered.reduce<Record<string, BankType[]>>((acc, bank) => {
      const letter = bank.name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(bank);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map(letter => ({ title: letter, data: grouped[letter] }));
  }, [filtered]);

  const handleSelect = (bank: BankType) => {
    SheetManager.hide(sheetId, { payload: { bank } });
  };

  const renderItem = ({ item }: { item: BankType }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <EntityImage fallbackText={item.name} size={40} />
      <Text category="s1" style={styles.itemText}>
        {item.name}
      </Text>
      <Icon
        name="arrow-ios-forward-outline"
        color={theme.colors.textHint}
        size={24}
      />
    </Pressable>
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text category="p1" style={styles.sectionHeaderText}>
        {section.title}
      </Text>
    </View>
  );

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={sheetId}
      gestureEnabled
      closable
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      containerStyle={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text category="h6" style={styles.title}>
          {t('bankAccountPage:selectBank')}
        </Text>

        {/* Search */}
        <Input
          placeholder={t('common:search')}
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          accessoryLeft={() => (
            <Icon
              name="search-outline"
              color={theme.colors.textHint}
              size={20}
            />
          )}
        />

        <View style={{ minHeight: height * 0.4, maxHeight: height * 0.5 }}>
          <SectionList
            sections={sections}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {t('bankAccountPage:noBankFound')}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  content: {
    paddingTop: 15,
  },
  title: {
    color: theme.colors.basic100,
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 10,
  },
  search: {
    marginHorizontal: HORIZONTAL_PADDING,
    marginBottom: 10,
    backgroundColor: theme.colors.secondaryBK,
    borderRadius: GLOBAL_BORDER_RADIUS / 2,
    borderColor: theme.colors.transparent,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 8,
    backgroundColor: theme.colors.primaryBK,
  },
  sectionHeaderText: {
    color: theme.colors.textHint,
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textHint,
  },
});
