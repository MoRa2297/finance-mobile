import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import { theme } from '../../../../config/theme';
import {
  CARD_TYPE,
  GLOBAL_BORDER_RADIUS,
  SCREEN_HEIGHT,
} from '../../../../config/constants';
import { Layout, List } from '@ui-kitten/components';
import { CardSelectSheetListItem } from '../CardSelectSheetListItem/CardSelectSheetListItem';
import { useStores } from '../../../../hooks/useStores';
import { CardType } from '../../../../types/types';

type CardSelectSheetProps = {
  sheetId: string;
};

export const CardSelectSheet: React.FunctionComponent<
  SheetProps<CardSelectSheetProps>
> = ({ sheetId }) => {
  const { dataStore, sessionStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onSelect = (item: any) => {
    actionSheetRef.current?.hide({ item });
  };

  useEffect(() => {
    if (!dataStore.cardTypes) {
      dataStore.getCardTypes(sessionStore.sessionToken);
    }
  }, [dataStore, sessionStore.sessionToken]);

  return (
    <ActionSheet
      id={sheetId}
      drawUnderStatusBar={true}
      ref={actionSheetRef}
      closable={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding={false}
      closeOnTouchBackdrop
      isModal={false}
      defaultOverlayOpacity={0.7}
      containerStyle={styles.containerStyle}
      keyboardHandlerEnabled={false}>
      <Layout style={styles.container}>
        <List
          data={dataStore.cardTypes}
          style={styles.list}
          renderItem={(item: { item: CardType }) => (
            <CardSelectSheetListItem
              item={item.item}
              onSelect={() => onSelect(item.item)}
            />
          )}
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
    height: SCREEN_HEIGHT / 2,
  },
  container: {
    paddingTop: 25,
  },
  list: {
    backgroundColor: theme['color-primary-BK'],
    height: '100%',
  },
});
