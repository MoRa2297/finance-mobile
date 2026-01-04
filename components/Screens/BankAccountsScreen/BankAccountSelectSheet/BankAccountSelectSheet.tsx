import React, { useEffect, useMemo, useRef } from 'react';
import { SectionList, StyleSheet } from 'react-native';
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
import { Text, Layout } from '@ui-kitten/components';
import { BankAccountSelectSheetListItem } from '../BankAccountSelectSheetListItem/BankAccountSelectSheetListItem';
import { useStores } from '../../../../hooks/useStores';

type BankAccountSelectSheetProps = {
  sheetId: string;
};

export const BankAccountSelectSheet: React.FunctionComponent<
  SheetProps<BankAccountSelectSheetProps>
> = ({ sheetId }) => {
  const { dataStore, sessionStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onSelect = (item: any) => {
    actionSheetRef.current?.hide({ item });
  };

  useEffect(() => {
    if (!dataStore.bankTypes) {
      dataStore.getBankTypes(sessionStore.sessionToken);
    }
  }, [dataStore, sessionStore.sessionToken]);

  const orderDataFormatted = useMemo(() => {
    let data = dataStore.bankTypes.reduce((r, e) => {
      // get first letter of name of current element
      let group: string = e.name[0];
      // if there is no property in accumulator with this letter create it
      if (!r[group]) {
        r[group] = { title: group, data: [e] };
      }
      // if there is push current element to children array for that letter
      else {
        r[group].data.push(e);
      }
      // return accumulator
      return r;
    }, {});

    return data;
  }, [dataStore.bankTypes]);

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
        <SectionList
          sections={Object.values(orderDataFormatted)}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <BankAccountSelectSheetListItem
              item={item}
              onSelect={() => {
                onSelect(item);
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text category="p1" style={styles.header}>
              {title}
            </Text>
          )}
          ItemSeparatorComponent={() => <Layout style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: SCREEN_HEIGHT / 1.5 }}
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
