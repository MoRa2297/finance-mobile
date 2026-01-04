import { StyleSheet } from 'react-native';
import { Button, Layout } from '@ui-kitten/components';
import React, { useRef, useState } from 'react';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';



import {GLOBAL_BORDER_RADIUS, HORIZONTAL_PADDING} from "../../../constants";
import {theme} from "../../../theme";
import {useDataStore} from "../../../stores";

interface ColorSheetScreenProps {}

export const ColorSheet: React.FunctionComponent<
  ColorSheetScreenProps & SheetProps
> = ({ ...props }) => {


  const colors = useDataStore((state ) => state.colors);


  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [width, setWidth] = useState(0);
  // TODO var selected = props.payload.selected;
  var selected = props?.payload || '';


  const handlePressColor = (color: string, index: number) => {
    // actionSheetRef.current?.hide({ color, index }); TODO FIX ERRORS
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={props.sheetId}
      closable={true}
      backgroundInteractionEnabled={true}
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      overdrawEnabled
      gestureEnabled
      isModal={false}
      headerAlwaysVisible={false}
      containerStyle={styles.containerStyle}
      onClose={data => {
        return data;
      }}>
      <Layout
        onLayout={event => setWidth(event.nativeEvent.layout.width)}
        style={styles.externalContainer}>
        <Layout style={[styles.internalContainer, { gap: width / 24 }]}>
          {colors?.map((color: { hexCode: string; }, index: React.Key | null | undefined) => ( // TODO FIX TYPO
            <Button
              // eslint-disable-next-line react-native/no-inline-styles
              key={index}
              style={{
                width: width / 6 - 13,
                height: width / 6 - 13,
                backgroundColor: color.hexCode,
                borderRadius: GLOBAL_BORDER_RADIUS,
                borderWidth: selected === color?.hexCode ? 4 : 0,
                borderColor:
                  selected === color?.hexCode
                    ? theme.colors.basic100
                    : theme.colors.transparent,
              }}
              onPress={() => {
                // handlePressColor(color.hexCode, index); TODO FIX INDEX ERROR
              }}
            />
          ))}
        </Layout>
      </Layout>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.primaryBK,
    borderTopLeftRadius: GLOBAL_BORDER_RADIUS,
    borderTopRightRadius: GLOBAL_BORDER_RADIUS,
  },
  externalContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 20,
    marginHorizontal: HORIZONTAL_PADDING,
  },
  internalContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});
