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
import { CurrentBankAccountsSelectSheetListItem } from '../CurrentBankAccountsSelectSheetListItem/CurrentBankAccountsSelectSheetListItem';
import { useStores } from '../../../../hooks/useStores';

type CurrentBankAccountsSelectSheetProps = {
  sheetId: string;
};

export const CurrentBankAccountsSelectSheet: React.FunctionComponent<
  SheetProps<CurrentBankAccountsSelectSheetProps>
> = ({ sheetId }) => {
  const { dataStore, sessionStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onSelect = (item: any) => {
    actionSheetRef.current?.hide({ item });
  };

  useEffect(() => {
    if (!dataStore.bankAccount && sessionStore.user?.id) {
      dataStore.getBankAccounts(
        sessionStore.sessionToken,
        String(sessionStore.user?.id),
      );
    }
  }, [dataStore, sessionStore.sessionToken, sessionStore.user?.id]);

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
          data={dataStore.bankAccount}
          style={styles.list}
          renderItem={item => (
            <CurrentBankAccountsSelectSheetListItem
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
