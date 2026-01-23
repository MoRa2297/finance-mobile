import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
  FC,
} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';

import {
  SwipePickerMonth,
  generateMonths,
  getCurrentMonthIndex,
  formatMonthLabel,
} from './MonthSwipePicker.helpers';

interface IMonthSwipePickerProps {
  onSelectMonth: (month: SwipePickerMonth) => void;
  containerWidth?: number;
  showArrows?: boolean;
}

// TODO improve buttons UI and horizontal scroll with finger (its working only if press the button)
export const MonthSwipePicker: FC<IMonthSwipePickerProps> = ({
  onSelectMonth,
  containerWidth = 150,
  showArrows = true,
}) => {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList<SwipePickerMonth>>(null);

  // Generate months data
  const months = useMemo(() => generateMonths(), []);
  const currentYear = useMemo(() => dayjs().year(), []);
  const initialIndex = useMemo(() => getCurrentMonthIndex(months), [months]);

  // State
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Scroll to initial position on mount
  useEffect(() => {
    if (flatListRef.current && initialIndex > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [initialIndex]);

  // Notify parent of initial selection
  useEffect(() => {
    if (months[initialIndex]) {
      onSelectMonth(months[initialIndex]);
    }
  }, []);

  // Handle scroll end to snap to nearest item
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / containerWidth);
      const clampedIndex = Math.max(0, Math.min(index, months.length - 1));

      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
        onSelectMonth(months[clampedIndex]);
      }
    },
    [containerWidth, months, currentIndex, onSelectMonth],
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onSelectMonth(months[newIndex]);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  }, [currentIndex, months, onSelectMonth]);

  const handleNext = useCallback(() => {
    if (currentIndex < months.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onSelectMonth(months[newIndex]);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  }, [currentIndex, months, onSelectMonth]);

  // Render helpers
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth],
  );

  const renderItem = useCallback(
    ({ item }: { item: SwipePickerMonth }) => (
      <View style={[styles.item, { width: containerWidth }]}>
        <Text style={styles.itemText}>
          {formatMonthLabel(item, currentYear, t)}
        </Text>
      </View>
    ),
    [containerWidth, currentYear, t],
  );

  const keyExtractor = useCallback(
    (item: SwipePickerMonth) => item.id.toString(),
    [],
  );

  const onScrollToIndexFailed = useCallback((info: { index: number }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: false,
      });
    }, 100);
  }, []);

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {/* Previous Button */}
      {showArrows && currentIndex > 0 && (
        <Pressable
          style={[styles.arrowButton, styles.arrowLeft]}
          onPress={handlePrevious}
          hitSlop={10}>
          <Icon
            name="chevron-left-outline"
            color={theme.colors.basic100}
            size={24}
          />
        </Pressable>
      )}

      {/* Month List */}
      <FlatList
        ref={flatListRef}
        data={months}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToInterval={containerWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />

      {/* Next Button */}
      {showArrows && currentIndex < months.length - 1 && (
        <Pressable
          style={[styles.arrowButton, styles.arrowRight]}
          onPress={handleNext}
          hitSlop={10}>
          <Icon
            name="chevron-right-outline"
            color={theme.colors.basic100}
            size={24}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  itemText: {
    color: theme.colors.basic100,
    fontSize: 16,
    fontWeight: '500',
  },
  arrowButton: {
    position: 'absolute',
    zIndex: 10,
    padding: 4,
    backgroundColor: theme.colors.transparent,
  },
  arrowLeft: {
    left: -30,
  },
  arrowRight: {
    right: -30,
  },
});
