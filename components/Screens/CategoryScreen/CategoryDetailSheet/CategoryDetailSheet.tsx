import React, { useEffect, useRef } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

interface CategoryDetailSheetScreenProps {
  children: any;
  visible?: boolean;
}

export const CategoryDetailSheet: React.FunctionComponent<
  CategoryDetailSheetScreenProps
> = ({ children, visible }) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <ActionSheet
      ref={actionSheetRef}
      closable={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding
      closeOnTouchBackdrop
      // overdrawEnabled
      gestureEnabled
      isModal={false}
      // headerAlwaysVisible={false}
    >
      {children}
    </ActionSheet>
  );
};
