import React, { FC, useMemo } from 'react';
import { StyleSheet, View, Pressable, TouchableHighlight } from 'react-native';
import { Text } from '@ui-kitten/components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Icon } from '@/components/ui/Icon';
import { theme } from '@/config/theme';
import { GLOBAL_BORDER_RADIUS } from '@/config/constants';
import { Transaction } from '@/types';
import { getExpenseCardData, formatSubtitle } from './ExpenseCard.helpers';

const SWIPE_THRESHOLD = -80;
const DELETE_BUTTON_WIDTH = 80;

interface IExpenseCardProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const ExpenseCard: FC<IExpenseCardProps> = ({
  transaction,
  onPress,
  onDelete,
}) => {
  const cardData = useMemo(
    () => getExpenseCardData(transaction),
    [transaction],
  );
  const subtitle = useMemo(() => formatSubtitle(cardData), [cardData]);

  const translateX = useSharedValue(0);
  const isOpen = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate(e => {
      if (isOpen.value) {
        translateX.value = Math.max(
          -DELETE_BUTTON_WIDTH + e.translationX,
          -DELETE_BUTTON_WIDTH,
        );
      } else {
        translateX.value = Math.min(0, e.translationX);
      }
    })
    .onEnd(e => {
      if (e.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
        isOpen.value = true;
      } else {
        translateX.value = withSpring(0);
        isOpen.value = false;
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      {/* Delete button — revealed by swipe */}
      <View style={styles.deleteButton}>
        <Pressable
          style={styles.deleteButtonInner}
          onPress={() => runOnJS(onDelete)(transaction)}>
          <Icon
            name="trash-2-outline"
            color={theme.colors.basic100}
            size={22}
          />
        </Pressable>
      </View>

      {/* Swipeable card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.animatedCard, animatedCardStyle]}>
          <TouchableHighlight
            onPress={() => {
              if (isOpen.value) {
                translateX.value = withSpring(0);
                isOpen.value = false;
                return;
              }
              onPress(transaction);
            }}
            underlayColor={theme.colors.primaryBK}
            style={styles.touchable}>
            <View style={styles.innerContent}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: cardData.iconBackgroundColor },
                ]}>
                <Icon
                  name={cardData.iconName}
                  color={theme.colors.basic100}
                  size={24}
                />
              </View>

              {/* Center */}
              <View style={styles.centerContainer}>
                <View style={styles.titleRow}>
                  <Text category="s1" style={styles.title} numberOfLines={1}>
                    {transaction.description}
                  </Text>
                  <View style={styles.badges}>
                    {cardData.isRecurrent && (
                      <Icon
                        name="sync-outline"
                        color={theme.colors.textHint}
                        size={14}
                      />
                    )}
                    {cardData.isTransfer && (
                      <Icon
                        name="swap-outline"
                        color={theme.colors.primary}
                        size={14}
                      />
                    )}
                  </View>
                </View>
                <Text category="p2" style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              </View>

              {/* Amount */}
              <Text
                category="s1"
                style={[styles.amount, { color: cardData.amountColor }]}>
                {cardData.amountPrefix}
                {transaction.amount.toFixed(2)} €
              </Text>
            </View>
          </TouchableHighlight>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.red,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonInner: {
    flex: 1,
    width: DELETE_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedCard: {
    borderRadius: 20,
    overflow: 'hidden', // ← mantiene bordi tondi durante lo slide
  },
  touchable: {
    borderRadius: 20,
    backgroundColor: theme.colors.primaryBK,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 70,
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_BORDER_RADIUS,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    flexShrink: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textHint,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
});
