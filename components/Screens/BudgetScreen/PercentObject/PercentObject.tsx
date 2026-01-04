import { Layout } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../../../config/theme';
import { Icon } from '../../../UI/Icon/Icon';

/**
 * Function that calculates rotation of the semicircle for firstProgressLayer
 * ( when percent is less than equal to 50 ) or for the secondProgressLayer
 * when percent is greater than 50.
 **/
const rotateByStyle = (
  percent: number,
  base_degrees: number,
  clockwise: boolean,
) => {
  let rotateBy = base_degrees;
  if (clockwise) {
    rotateBy = base_degrees + percent * 3.6;
  } else {
    //anti clockwise progress
    rotateBy = base_degrees - percent * 3.6;
  }
  return {
    transform: [{ rotateZ: `${rotateBy}deg` }],
  };
};

const renderThirdLayer = (
  percent: number,
  commonStyles: ViewStyle,
  ringColorStyle: ViewStyle,
  ringBgColorStyle: ViewStyle,
  clockwise: boolean,
  bgRingWidth: number,
  progressRingWidth: number,
  innerRingStyle: ViewStyle,
  startDegrees: number,
) => {
  let rotation = 45 + startDegrees;
  let offsetLayerRotation = -135 + startDegrees;
  if (!clockwise) {
    rotation += 180;
    offsetLayerRotation += 180;
  }
  if (percent > 50) {
    /**
     * Third layer circles default rotation is kept 45 degrees for clockwise rotation, so by default it occupies the right half semicircle.
     * Since first 50 percent is already taken care  by second layer circle, hence we subtract it
     * before passing to the rotateByStyle function
     **/

    return (
      <View
        style={[
          styles.secondProgressLayer,
          rotateByStyle(percent - 50, rotation, clockwise),
          commonStyles,
          ringColorStyle,
        ]}
      />
    );
  } else {
    return (
      <View
        style={[
          styles.offsetLayer,
          innerRingStyle,
          ringBgColorStyle,
          { transform: [{ rotateZ: `${offsetLayerRotation}deg` }] },
        ]}
      />
    );
  }
};

interface PercentObjectProps {
  percent: number;
  ringColor: string;
  ringBgColor: string;
  clockwise: boolean;
  bgColor: string;
  maxWidth: number;
}

export const PercentObject: React.FunctionComponent<PercentObjectProps> = ({
  percent,
  ringColor,
  ringBgColor,
  clockwise,
  bgColor,
  maxWidth,
}) => {
  let radius = 35;
  let bgRingWidth = 7;
  let progressRingWidth = 5;
  let startDegrees = 0;

  const commonStyles = {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderTopWidth: progressRingWidth,
    borderLeftWidth: progressRingWidth,
    borderBottomWidth: progressRingWidth,
    borderRightWidth: progressRingWidth,
  };

  /**
   * Calculate radius for base layer and offset layer.
   * If progressRingWidth == bgRingWidth, innerRadius is equal to radius
   **/
  const widthDiff = progressRingWidth - bgRingWidth;
  const innerRadius = radius - progressRingWidth + bgRingWidth + widthDiff / 2;

  const innerRingStyle = {
    width: innerRadius * 2,
    height: innerRadius * 2,
    borderRadius: innerRadius,
    borderTopWidth: bgRingWidth,
    borderLeftWidth: bgRingWidth,
    borderBottomWidth: bgRingWidth,
    borderRightWidth: bgRingWidth,
  };

  const ringColorStyle = {
    borderRightColor: ringColor,
    borderTopColor: ringColor,
  };

  const ringBgColorStyle = {
    borderRightColor: ringBgColor,
    borderTopColor: ringBgColor,
  };

  const thickOffsetRingStyle = {
    borderRightColor: bgColor,
    borderTopColor: bgColor,
  };

  let rotation = -135 + startDegrees;

  /**
   * If we want our ring progress to be displayed in anti-clockwise direction
   **/
  if (!clockwise) {
    rotation += 180;
  }

  let firstProgressLayerStyle;
  /* when ther ring's border widths are different and percent is less than 50, then we need an offsetLayer
   * before the original offser layer to avoid ring color of the thick portion to be visible in the background.
   */
  let displayThickOffsetLayer = false;
  if (percent > 50) {
    firstProgressLayerStyle = rotateByStyle(50, rotation, clockwise);
  } else {
    firstProgressLayerStyle = rotateByStyle(percent, rotation, clockwise);
    if (progressRingWidth > bgRingWidth) {
      displayThickOffsetLayer = true;
    }
  }

  let offsetLayerRotation = -135 + startDegrees;
  if (!clockwise) {
    offsetLayerRotation += 200;
  }

  return (
    <Layout
      style={[
        {
          flex: 1 / 4,
          backgroundColor: theme['color-basic-transparent'],
        },
      ]}>
      <View
        style={[
          styles.container,
          {
            width: radius * 2,
            height: radius * 2,
            minWidth: maxWidth,
            minHeight: maxWidth,
          },
        ]}>
        <View
          style={[
            styles.baselayer,
            innerRingStyle,
            { borderColor: ringBgColor, borderWidth: bgRingWidth },
          ]}
        />
        <View
          style={[
            styles.firstProgressLayer,
            firstProgressLayerStyle,
            commonStyles,
            ringColorStyle,
            {
              borderTopWidth: progressRingWidth,
              borderRightWidth: progressRingWidth,
            },
          ]}
        />
        {displayThickOffsetLayer && (
          <View
            style={[
              styles.offsetLayer,
              commonStyles,
              thickOffsetRingStyle,
              {
                transform: [{ rotateZ: `${offsetLayerRotation}deg` }],
                borderWidth: progressRingWidth,
              },
            ]}
          />
        )}
        {renderThirdLayer(
          percent,
          commonStyles,
          ringColorStyle,
          ringBgColorStyle,
          clockwise,
          bgRingWidth,
          progressRingWidth,
          innerRingStyle,
          startDegrees,
        )}
        <Icon
          name="plus-circle-outline"
          color={theme['color-basic-100']}
          size={42}
        />
      </View>
    </Layout>
  );
};

/**
 * offsetLayer has transform:[{rotateZ: '-135deg'}] since
 * the offsetLayer rotation is fixed by us.
 **/
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baselayer: {
    position: 'absolute',
  },
  firstProgressLayer: {
    position: 'absolute',
    borderLeftColor: theme['color-basic-transparent'],
    borderBottomColor: theme['color-basic-transparent'],
    backgroundColor: theme['color-primary-BK'],
  },
  secondProgressLayer: {
    position: 'absolute',
    borderLeftColor: theme['color-basic-transparent'],
    borderBottomColor: theme['color-basic-transparent'],
  },
  offsetLayer: {
    position: 'absolute',
    borderLeftColor: theme['color-basic-transparent'],
    borderBottomColor: theme['color-basic-transparent'],
  },
  display: {
    position: 'absolute',
  },
});
