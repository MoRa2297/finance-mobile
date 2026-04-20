import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING } from '@/config/constants';
import { CardType } from '@/types';
import { EntityImage } from '@components/ui/EntityImage';
import { useBankTypes, useCardTypes } from '@stores/lookup';

export const CardTypeSelectSheet: React.FC<
  SheetProps<'card-type-select-sheet'>
> = ({ sheetId }) => {
  const { t } = useTranslation(['bankCardsPage', 'common']);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { height } = useWindowDimensions();
  const { data: cardTypes = [] } = useCardTypes();

  const handleSelect = (cardType: CardType) => {
    SheetManager.hide(sheetId, { payload: { cardType } });
  };

  const renderItem = ({ item }: { item: CardType }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <EntityImage
        imageUrl={item.imageUrl}
        fallbackText={item.name}
        size={40}
        borderRadius={GLOBAL_BORDER_RADIUS / 2}
      />
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
        <Text category="h6" style={styles.title}>
          {t('bankCardsPage:typeCardPlaceholder')}
        </Text>

        <View style={{ minHeight: height * 0.3, maxHeight: height * 0.5 }}>
          <FlatList
            data={cardTypes}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('common:noResults')}</Text>
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
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 14,
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
