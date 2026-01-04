import { Layout, TextProps } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import {
    BottomNavigation as BottomNavigationUI,
    BottomNavigationTab,
} from '@ui-kitten/components';
import {
    StyleProp,
    StyleSheet,
    useWindowDimensions,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
 import { TabLabel } from './TabLabel';
 import { useTranslation } from 'react-i18next';
 import { router } from 'expo-router';
 import {Icon} from "../Icon";
import {useUIStore} from "../../../stores";
import {selectSelectedBottomTab} from "../../../stores";
import {FloatingButton} from "./FloatingButton/FloatingButton";
import {theme} from "../../../theme";

const useBottomNavigationState = (initialState = 0) => {
    const selectedBottomTab = useUIStore(selectSelectedBottomTab);
    const setSelectedBottomTab = useUIStore((state) => state.setSelectedBottomTab);
    const [selectedIndex, setSelectedIndex] = React.useState(initialState);

    useEffect(() => {
        setSelectedIndex(selectedBottomTab);
    }, [selectedBottomTab]);

    const handleIndexChange = (newSelectedIndex: number) => {
        switch (newSelectedIndex) {
            case 0:
                router.navigate('/(auth)/(tabs)');
                setSelectedIndex(newSelectedIndex);
                setSelectedBottomTab(newSelectedIndex);
                break;

            case 1:
                router.navigate('/(auth)/(tabs)/expenses');
                setSelectedIndex(newSelectedIndex);
                setSelectedBottomTab(newSelectedIndex);
                break;

            case 3:
                router.navigate('/(auth)/(tabs)/budget');
                setSelectedIndex(newSelectedIndex);
                setSelectedBottomTab(newSelectedIndex);
                break;

            case 4:
                router.navigate('/(auth)/(tabs)/settings');
                setSelectedIndex(newSelectedIndex);
                setSelectedBottomTab(newSelectedIndex);
                break;
        }
    };

    return { selectedIndex, onSelect: handleIndexChange };
};

interface BottomNavigationProps {
    selectedTab: number;
    visible: boolean;
    getBarHeight?: (bottomNavigationHeight: number) => void;
}

export const BottomNavigation: React.FunctionComponent<
BottomNavigationProps
> = ({ selectedTab, visible, getBarHeight }) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const topState = useBottomNavigationState(selectedTab);
    const [height, setHeight] = useState<number>(60);

    useEffect(() => {
        getBarHeight && getBarHeight(height + 15);
    }, [getBarHeight, height]);

    const bottomNavigationExtraStyle: StyleProp<ViewStyle> = {
        display: visible ? 'flex' : 'none',
        bottom: insets.bottom + 15,
        width: width - 30,
        position: 'absolute',
    };

    // TODO fix typo 'income' | 'expense' | 'card_spending'
    const handleOpenTransactionForm = useCallback(
        (navigationType: string) => {
            router.push({
                pathname: '/(auth)/transaction',
                params: {
                    formType: navigationType,
                },
            });
        },
        [],
    );

    const homeIcon = () => {
        return <Icon name="home-outline" color={theme.colors.white} />;
    };

    const transactionsIcon = () => {
        return <Icon name="clipboard-outline" color={theme.colors.white} />;
    };

    const budgetIcon = () => {
        return <Icon name="flag-outline" color={theme.colors.white} />;
    };

    const otherIcon = () => {
        return <Icon name="more-horizontal-outline" color={theme.colors.white} />;
    };

    const addTransactionIcon = () => (
        <Layout
            style={{
                backgroundColor: theme.colors.transparent,
                position: 'absolute',
                height: 60,
                width: 60,
                bottom: 30,
            }}>
            <FloatingButton handlePressOption={handleOpenTransactionForm} />
        </Layout>
    );

    const onLayout = useCallback(
        (event: { nativeEvent: { layout: { height: number } } }) => {
            setHeight(event.nativeEvent.layout.height + 15);
        },
        [],
    );

    return (
        <BottomNavigationUI
            onLayout={onLayout}
            style={[
                styles.bottomNavigation,
                bottomNavigationExtraStyle,
                { height: height },
            ]}
            {...topState}
            appearance={'noIndicator'}>
            <BottomNavigationTab
                title={(textProps: TextProps | undefined) => {
                    return (
                        <TabLabel
                            textProps={textProps}
                            labelText={t('components.bottomNavigator.home')}
                            selected={topState.selectedIndex === 0}
                        />
                    );
                }}
                icon={homeIcon}
            />
            <BottomNavigationTab
                title={(textProps: TextProps | undefined) => {
                    return (
                        <TabLabel
                            textProps={textProps}
                            labelText={t('components.bottomNavigator.transaction')}
                            selected={topState.selectedIndex === 1}
                        />
                    );
                }}
                icon={transactionsIcon}
            />
            <BottomNavigationTab icon={addTransactionIcon} />
            <BottomNavigationTab
                title={(textProps: TextProps | undefined) => {
                    return (
                        <TabLabel
                            textProps={textProps}
                            labelText={t('components.bottomNavigator.budgets')}
                            selected={topState.selectedIndex === 3}
                        />
                    );
                }}
                icon={budgetIcon}
            />
            <BottomNavigationTab
                title={(textProps: TextProps | undefined) => {
                    return (
                        <TabLabel
                            textProps={textProps}
                            labelText={t('components.bottomNavigator.more')}
                            selected={topState.selectedIndex === 4}
                        />
                    );
                }}
                icon={otherIcon}
            />
        </BottomNavigationUI>
    );
};

const styles = StyleSheet.create({
    bottomNavigation: {
        position: 'absolute',
        alignSelf: 'center',
        borderRadius: 15,
        backgroundColor: theme.colors.basic500,

        shadowColor: '#000',
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: {
            height: 1,
            width: 1,
        },

        elevation: 9,
        alignItems: 'flex-end',
        zIndex: 10,
        minHeight: 60,
    },
    homeIcon: { width: 35, height: 35 },
    homeIconContainer: {
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 3,
        borderColor: theme.colors.primary,
        height: 60,
        width: 60,
    },
});
