import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { theme } from '../../../config/theme';

export type Tab = {
  title: string;
  value: string;
};

interface Props {
  tabs: Tab[];
  handleGetSelectedTab: (value: string) => void;
  shadow?: boolean;
}

export const SliderBar: React.FunctionComponent<Props> = ({
  tabs,
  handleGetSelectedTab,
  shadow = false,
}) => {
  const { t } = useTranslation();
  const [viewWidth, setViewWidth] = useState(0);
  const [positions, setPositions] = useState(new Array(tabs.length));

  let translateX = useMemo(() => new Animated.Value(0), []);
  const [active, setActive] = useState(0);

  const handlePress = useCallback(
    (type: any, index: number, value: string) => {
      setActive(index);
      Animated.spring(translateX, {
        toValue: type,
        delay: 100,
        useNativeDriver: true,
      }).start();

      handleGetSelectedTab(value);
    },
    [handleGetSelectedTab, translateX],
  );

  const extraStyle = shadow
    ? {
        shadowColor: '#000',
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      }
    : {};

  return (
    <View
      onLayout={event => {
        var { width } = event.nativeEvent.layout;
        setViewWidth(width);
      }}>
      <View style={styles.container}>
        <View style={[styles.subContainer, extraStyle]}>
          <Animated.View
            style={[
              styles.sliderView,
              {
                width: viewWidth / tabs.length,
                transform: [
                  {
                    translateX,
                  },
                ],
              },
            ]}
          />
          {tabs.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onLayout={event => {
                positions[index] = event.nativeEvent.layout.x;
                setPositions(positions);
              }}
              onPress={() => handlePress(positions[index], index, item.value)}>
              <Text
                style={{
                  color: active === index ? '#fff' : theme['color-primary'],
                }}>
                {t(`components.sliderBar.tabs.${item.title}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    position: 'relative',
    backgroundColor: theme['color-primary-BK'],
    borderRadius: 30,
  },
  sliderView: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: theme['color-primary'],
    borderRadius: 30,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
