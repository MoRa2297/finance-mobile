import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Icon } from '../../UI/Icon/Icon';
import { theme } from '../../../config/theme';
import { useTranslation } from 'react-i18next';
import { SwipePickerMonth } from '../../../types/types';
import Moment from 'moment';

interface PropsSwipePicker {
  showSwipeBtn: boolean;
  arrSwipeData: SwipePickerMonth[];
  currentSelectIndex: any;
  onScreenChange: (item: SwipePickerMonth, index: number) => void;
  containerWidth: number;
}

export const SwipePicker: React.FunctionComponent<PropsSwipePicker> = ({
  showSwipeBtn,
  arrSwipeData,
  currentSelectIndex,
  onScreenChange,
  containerWidth,
}) => {
  const { t } = useTranslation();
  var slider: any = useRef<FlatList>(null);

  const [childViewHeight, setChildViewHeight] = useState(50);
  const [initialScrollIndex, setInitialScrollIndex] = useState(50);
  const [viewabilityConfig, setViewabilityConfig] = useState({
    viewAreaCoveragePercentThreshold: 50,
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems, changed }) => {
      if (viewableItems && viewableItems.length > 0) {
        onScreenChange(viewableItems[0].item, viewableItems[0].index);
      }
    },
    [onScreenChange],
  );

  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  const _onPressNextBtn = () => {
    if (currentSelectIndex < arrSwipeData.length - 1) {
      slider?.current?.scrollToIndex({
        index: currentSelectIndex + 1,
        animated: true,
      });
    }
  };
  const _onPressBackBtn = () => {
    if (currentSelectIndex !== 0) {
      slider?.current?.scrollToIndex({
        index: currentSelectIndex - 1,
        animated: true,
      });
    }
  };

  const getItemLayout = (data: any, index: number) => ({
    length: containerWidth,
    offset: containerWidth * index,
    index,
  });

  const onViewLayout = (event: {
    nativeEvent: { layout: { height: any } };
  }) => {
    let contentHeight = event.nativeEvent.layout.height;
    setChildViewHeight(contentHeight);
  };

  const renderItem = ({ item, index }) => {
    const currentYear = Moment().get('year');

    return (
      <View
        key={index}
        style={[
          styles.flatListItem,
          {
            width: containerWidth,
          },
        ]}
        onLayout={onViewLayout}>
        <Text style={styles.flatListItemText}>
          {t<string>(`common.month.${item.month}`)}{' '}
          {currentYear !== item.year ? item.year : ''}
        </Text>
      </View>
    );
  };

  const setInitPosition = useCallback(() => {
    let currentMonth = 0;
    arrSwipeData.forEach((month, index) => {
      if (
        month.date.isSame(Moment(), 'year') &&
        month.date.isSame(Moment(), 'month')
      ) {
        currentMonth = index;
      }
    });

    setInitialScrollIndex(currentMonth);
  }, [arrSwipeData]);

  useEffect(() => {
    setInitPosition();
  }, [setInitPosition]);

  return (
    <View
      style={[
        {
          width: containerWidth,
        },
      ]}>
      {currentSelectIndex > 0 && showSwipeBtn ? (
        <TouchableOpacity
          style={[
            styles.iconContainer,
            {
              height: childViewHeight,
              left: -25,
            },
          ]}
          onPress={_onPressBackBtn}>
          <View style={styles.viewBtn}>
            <Icon
              name={'chevron-left-outline'}
              color={theme['color-basic-100']}
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      <FlatList
        ref={slider}
        keyboardShouldPersistTaps="always"
        scrollEnabled={true}
        data={arrSwipeData}
        keyExtractor={(item, index) => (index + 1).toString()}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        getItemLayout={getItemLayout}
        horizontal
        directionalLockEnabled
        pagingEnabled
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialScrollIndex}
      />

      {currentSelectIndex < arrSwipeData.length - 1 && showSwipeBtn ? (
        <TouchableOpacity
          style={[
            styles.iconContainer,
            {
              right: -25,
              height: childViewHeight,
            },
          ]}
          onPress={_onPressNextBtn}>
          <View style={styles.viewBtn}>
            <Icon
              name={'chevron-right-outline'}
              color={theme['color-basic-100']}
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  swiper: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
    backgroundColor: theme['color-basic-100'],
  },
  iconContainer: {
    position: 'absolute',
    backgroundColor: theme['color-basic-transparent'],
    justifyContent: 'center',
    zIndex: 999,
  },
  icon: {
    width: 40,
    height: 40,
  },
  viewBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeBtnStyle: {
    fontSize: 50,
    color: theme['color-basic-100'],
    justifyContent: 'center',
  },
  flatListItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flatListItemText: {
    color: theme['color-basic-100'],
  },
});
