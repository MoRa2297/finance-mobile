import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { theme } from '../../../../config/theme';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
  SCREEN_HEIGHT,
} from '../../../../config/constants';
import { BankCard } from '../../../../types/types';
import { useStores } from '../../../../hooks/useStores';
import { Layout, List } from '@ui-kitten/components';
import { CardSelectSheetListItem } from '../CardSelectSheetListItem/CardSelectSheetListItem';

type SelectCardSheetProps = {
  payload: {
    bankAccountId: number[];
  };
  sheetId: string;
};

export const SelectCardSheet: React.FunctionComponent<
  SheetProps<SelectCardSheetProps>
> = ({ payload }) => {
  const { dataStore, sessionStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onSelect = (item: BankCard) => {
    actionSheetRef.current?.hide({ item });
  };

  const filteredCard = useMemo(() => {
    return dataStore.bankCard.filter(card => {
      if (
        payload?.bankAccountId.find(bankId => bankId === card.bankAccountId)
      ) {
        return card.bankAccountId;
      }
    });
  }, [dataStore.bankCard, payload?.bankAccountId]);

  useEffect(() => {
    if (!dataStore.bankCard) {
      dataStore.getBankCard(sessionStore.sessionToken, sessionStore.user?.id);
    }
  }, [dataStore, sessionStore.sessionToken, sessionStore.user?.id]);

  return (
    <ActionSheet
      drawUnderStatusBar={true}
      ref={actionSheetRef}
      closable={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      closeOnTouchBackdrop
      isModal={false}
      defaultOverlayOpacity={0.2}
      containerStyle={styles.containerStyle}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.container}>
        <List
          data={filteredCard}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <CardSelectSheetListItem
              item={item}
              onSelect={() => {
                onSelect(item);
              }}
            />
          )}
          ItemSeparatorComponent={() => <Layout style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            maxHeight: SCREEN_HEIGHT / 1.5,
            minHeight: SCREEN_HEIGHT / 4,
            backgroundColor: theme['color-primary-BK'],
          }}
        />
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: theme['color-primary-BK'],
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  container: {
    paddingTop: 25,
  },
  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    fontSize: 17,
    backgroundColor: theme['color-primary-BK'],
    paddingVertical: 10,
    color: theme['text-hint-color'],
  },
  separator: {
    height: 0,
    backgroundColor: theme['color-primary-BK'],
  },
});
