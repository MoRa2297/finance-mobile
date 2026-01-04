import { StyleSheet } from 'react-native';
import { Button, Layout } from '@ui-kitten/components';
import React, { useRef, useState } from 'react';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  GLOBAL_BORDER_RADIUS,
  HORIZONTAL_PADDING,
} from '../../../config/constants';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';
import { useStores } from '../../../hooks/useStores';

interface IconSheetScreenProps {}

export const IconSheet: React.FunctionComponent<
  IconSheetScreenProps & SheetProps
> = ({ ...props }) => {
  const { dataStore } = useStores();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [width, setWidth] = useState(0);
  var selected = props.payload.selected;
  var selectedColor = props.payload.selectedColor;

  const handlePressColor = (icon: string, index: number) => {
    actionSheetRef.current?.hide({ icon, index });
  };

  const renderIcon = (name: string) => {
    return (
      <Layout
        key={name}
        style={[
          styles.iconContainer,
          {
            width: width / 6 - 13,
            height: width / 6 - 13,
          },
        ]}>
        <Icon
          name={name}
          color={theme['color-basic-100']}
          size={28}
          pack="ionicons"
        />
      </Layout>
    );
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
          {dataStore.categoryIcon?.map((icon, index) => (
            <Button
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: width / 6 - 13,
                height: width / 6 - 13,
                backgroundColor:
                  selected === icon?.iconName
                    ? selectedColor
                    : theme['text-hint-color'],
                borderRadius: GLOBAL_BORDER_RADIUS,
                borderWidth: selected === icon?.iconName ? 4 : 0,
                borderColor:
                  selected === icon?.iconName
                    ? theme['color-basic-100']
                    : theme['color-basic-transparent'],
              }}
              onPress={() => {
                handlePressColor(icon.iconName, index);
              }}
              children={() => renderIcon(icon.iconName)}
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
    backgroundColor: theme['color-primary-BK'],
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme['color-basic-transparent'],
  },
});
