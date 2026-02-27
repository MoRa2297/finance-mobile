import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { Layout, List, Text } from '@ui-kitten/components';

import { theme } from '@config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '@config/constants';
import { BankCard } from '@/types';
import { useCardStore, cardSelectors } from '@/stores';
import { Icon } from '@components/ui/Icon';

export interface SelectCardSheetPayload {
  bankAccountIds: number[];
}
type SelectCardSheetProps = SheetProps<'select-card-sheet'>;

const LIST_MAX_HEIGHT = SCREEN_HEIGHT / 1.5;
const LIST_MIN_HEIGHT = SCREEN_HEIGHT / 4;
const ICON_SIZE = 24;
const ICON_CONTAINER_SIZE = 40;

const formatCardExpiry = (month: number, year: number) =>
  `${String(month).padStart(2, '0')}/${year}`;

const EmptyState = memo(() => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <Icon
        name="credit-card-outline"
        color={theme.colors.textHint}
        size={48}
      />
    </View>
    <Text category="s1" style={styles.emptyTitle}>
      No Cards Available
    </Text>
    <Text category="c1" style={styles.emptyDescription}>
      There are no cards linked to the selected accounts
    </Text>
  </View>
));

const ListItem = memo(
  ({
    item,
    onSelect,
  }: {
    item: BankCard;
    onSelect: (item: BankCard) => void;
  }) => {
    const handlePress = useCallback(() => onSelect(item), [item, onSelect]);
    const expiryDate = formatCardExpiry(item.monthExpiry, item.yearExpiry);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.listItem,
          pressed && styles.listItemPressed,
        ]}
        onPress={handlePress}
        accessibilityRole="button">
        <View style={styles.iconContainer}>
          <Icon
            name="credit-card-outline"
            color={theme.colors.basic100}
            size={ICON_SIZE}
          />
        </View>
        <View style={styles.cardInfo}>
          <Text category="s1" style={styles.cardName}>
            {item.name}
          </Text>
          <Text category="c1" style={styles.cardDetails}>
            {item.cardType?.name ? `${item.cardType.name} • ` : ''}
            {expiryDate}
          </Text>
        </View>
        <Icon
          name="arrow-ios-forward-outline"
          color={theme.colors.textHint}
          size={ICON_SIZE}
        />
      </Pressable>
    );
  },
);

export const SelectCardSheet: React.FC<SelectCardSheetProps> = ({
  payload,
  sheetId,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const cards = useCardStore(cardSelectors.cards);
  const fetchCards = useCardStore(state => state.fetchCards);

  useEffect(() => {
    if (cards.length === 0) fetchCards();
  }, []);

  const filteredCards = useMemo(() => {
    if (!cards?.length || !payload?.bankAccountIds?.length) return [];
    const accountIdSet = new Set(payload.bankAccountIds);
    return cards.filter(
      c => c.bankAccountId && accountIdSet.has(c.bankAccountId),
    );
  }, [cards, payload?.bankAccountIds]);

  const handleSelect = useCallback(
    (item: BankCard) => {
      SheetManager.hide(sheetId, { payload: { item } });
    },
    [sheetId],
  );

  const renderItem = useCallback(
    ({ item }: { item: BankCard }) => (
      <ListItem item={item} onSelect={handleSelect} />
    ),
    [handleSelect],
  );

  const renderSeparator = useCallback(
    () => <Layout style={styles.separator} />,
    [],
  );
  const keyExtractor = useCallback((item: BankCard) => item.id.toString(), []);

  return (
    <ActionSheet
      ref={actionSheetRef}
      drawUnderStatusBar
      closable
      closeOnTouchBackdrop
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.sheetContainer}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.content}>
        {filteredCards.length === 0 ? (
          <EmptyState />
        ) : (
          <List
            data={filteredCards}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        )}
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  } as ViewStyle,
  content: {
    paddingTop: 25,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  list: {
    maxHeight: LIST_MAX_HEIGHT,
    minHeight: LIST_MIN_HEIGHT,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  separator: {
    height: 0,
    backgroundColor: theme.colors.primaryBK,
  } as ViewStyle,
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 12,
    gap: 12,
  } as ViewStyle,
  listItemPressed: {
    backgroundColor: theme.colors.secondaryBK,
    opacity: 0.8,
  } as ViewStyle,
  iconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: ICON_CONTAINER_SIZE / 2,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  cardInfo: { flex: 1, gap: 2 } as ViewStyle,
  cardName: { color: theme.colors.basic100 } as TextStyle,
  cardDetails: { color: theme.colors.textHint } as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: HORIZONTAL_PADDING,
  } as ViewStyle,
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.secondaryBK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  } as ViewStyle,
  emptyTitle: {
    color: theme.colors.basic100,
    marginBottom: 8,
    textAlign: 'center',
  } as TextStyle,
  emptyDescription: {
    color: theme.colors.textHint,
    textAlign: 'center',
  } as TextStyle,
});
