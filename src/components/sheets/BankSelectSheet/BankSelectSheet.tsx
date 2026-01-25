import React, { useRef, useMemo } from 'react';
import { StyleSheet, View, SectionList, Image, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { Icon } from '@/components/ui/Icon';
import { useDataStore } from '@/stores';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { BankType } from '@/types';

interface SectionData {
  title: string;
  data: BankType[];
}

export const BankSelectSheet: React.FC<SheetProps<'bank-select-sheet'>> = ({
  sheetId,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const bankTypes = useDataStore(state => state.bankTypes);

  // Group banks alphabetically
  const sections: SectionData[] = useMemo(() => {
    const grouped = bankTypes.reduce<Record<string, BankType[]>>(
      (acc, bank) => {
        const letter = bank.name[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(bank);
        return acc;
      },
      {},
    );

    return Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter],
      }));
  }, [bankTypes]);

  const handleSelect = (bank: BankType) => {
    SheetManager.hide(sheetId, {
      payload: { bank },
    });
  };

  const renderItem = ({ item }: { item: BankType }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
        <SectionList
          sections={sections}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
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
    paddingTop: 10,
    // maxHeight: '100%',
    borderColor: 'black',
    borderWidth: 1,
  },
  list: {
    maxHeight: 400,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 10,
    backgroundColor: theme.colors.primaryBK,
  },
  sectionHeaderText: {
    color: theme.colors.textHint,
    fontSize: 17,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  itemText: {
    flex: 1,
    color: theme.colors.basic100,
  },
});
