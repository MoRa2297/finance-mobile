import React, { useCallback, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableWithoutFeedback,
    Platform,
    ScrollView,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from "../../../stores";
import { useKeyboardVisible } from "../../../hooks/useKeyboardVisible";
import {IconButton, Button, InputField, ScreenContainer} from "../../../components";
import {theme} from "../../../theme";


export default function LoginScreen() {
    const [isKeyboardOpen] = useKeyboardVisible();
    const { t } = useTranslation();
    const login = useAuthStore((state) => state.login);

    const [errorText, setErrorText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const schema = Yup.object().shape({
        email: Yup.string()
            .email(t('messages.formValidations.general.emailNotValid'))
            .required(t('messages.formValidations.general.required')),
        password: Yup.string()
            .required(t('messages.formValidations.general.required'))
            .min(7, t('messages.formValidations.general.min7'))
            .matches(/[0-9]/, t('messages.formValidations.general.number'))
            .matches(/[a-z]/, t('messages.formValidations.general.lowercaseLetter'))
            .matches(/[A-Z]/, t('messages.formValidations.general.uppercaseLetter'))
            .matches(/[^\w]/, t('messages.formValidations.general.symbol')),
    });

    const handleLogin = useCallback(
        async (email: string, password: string) => {
            try {
                setIsLoading(true);
                setErrorText('');
                await login(email, password);
                router.replace('/(auth)/(tabs)');
            } catch (error: any) {
                if (error.error === 'UNAUTHORIZED') {
                    setErrorText(t('messages.apiErrors.unauthorizedError'));
                } else if (error.error === 'TRY_AGAIN') {
                    if (error.details) {
                        setErrorText(error.details);
                    } else {
                        setErrorText(t('messages.apiErrors.tryAgainError'));
                    }
                } else {
                    setErrorText(t('messages.apiErrors.genericError'));
                }
            } finally {
                setIsLoading(false);
            }
        },
        [login, t],
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.main}>
                <ScreenContainer
                    style={styles.container}
                    horizontalMargin={true}
                    isKeyboardOpen={isKeyboardOpen}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={schema}
                            onSubmit={(values) => handleLogin(values.email, values.password)}>
                            {({ handleChange, handleSubmit, values, errors }) => (
                                <Layout style={styles.mainContainer}>
                                    <Layout style={styles.titleContainer}>
                                        <Text category="h1">
                                            {t('screens.loginScreen.welcome')}
                                        </Text>
                                        <Text category="c2" appearance="hint">
                                            {t('screens.loginScreen.welcomeSub')}
                                        </Text>
                                    </Layout>

                                    <Layout style={styles.formContainer}>
                                        <InputField
                                            placeholder={t('screens.loginScreen.emailPlaceholder')}
                                            value={values.email}
                                            textContentType="emailAddress"
                                            onChange={handleChange('email')}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />

                                        {errors.email && (
                                            <Text
                                                category="c2"
                                                style={[styles.errorInput, { marginBottom: 15 }]}>
                                                {errors.email}
                                            </Text>
                                        )}

                                        <InputField
                                            placeholder={t('screens.loginScreen.passwordPlaceholder')}
                                            value={values.password}
                                            textContentType="password"
                                            secureTextEntry
                                            onChange={handleChange('password')}
                                        />
                                        {errors.password && (
                                            <Text category="c2" style={styles.errorInput}>
                                                {errors.password}
                                            </Text>
                                        )}
                                    </Layout>

                                    {errorText && (
                                        <Text category="c2" style={styles.errorFormApi}>
                                            {errorText}
                                        </Text>
                                    )}

                                    <Layout style={styles.forgotPasswordContainer}>
                                        <Text category="s1" style={styles.textAccent}>
                                            {t('screens.loginScreen.forgotPassword')}
                                        </Text>
                                    </Layout>

                                    <Layout>
                                        <Button
                                            onPress={() => handleSubmit()}
                                            style={styles.buttonStyle}
                                            buttonText={t('screens.loginScreen.signIn')}
                                            textStyle={styles.buttonTextStyle}
                                            isLoading={isLoading}
                                        />
                                    </Layout>

                                    <Layout style={styles.dividerContainer}>
                                        <LinearGradient
                                            colors={[theme.colors.primaryBK, theme.colors.textHint]}
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.lineLeft}
                                        />
                                        <Text category="s1" style={styles.dividerText}>
                                            {t('screens.loginScreen.or')}
                                        </Text>
                                        <LinearGradient
                                            colors={[theme.colors.textHint, theme.colors.primaryBK]}
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.lineLeft}
                                        />
                                    </Layout>

                                    <Layout style={styles.socialButtonsContainer}>
                                        <IconButton
                                            iconName="google"
                                            onPress={() => {}}
                                            iconColor={theme.colors.textHint}
                                            style={styles.socialButton}
                                            isDisabled
                                        />
                                        <IconButton
                                            iconName="facebook"
                                            onPress={() => {}}
                                            iconColor={theme.colors.textHint}
                                            style={styles.socialButton}
                                            isDisabled
                                        />
                                    </Layout>
                                </Layout>
                            )}
                        </Formik>
                        <Layout style={styles.newAccountContainer}>
                            <Text category="p1">
                                {t('screens.loginScreen.noAccount')}{' '}
                                <Link href="/register" asChild>
                                    <Text style={styles.textAccent}>
                                        {t('screens.loginScreen.signUp')}
                                    </Text>
                                </Link>
                            </Text>
                        </Layout>
                    </ScrollView>
                </ScreenContainer>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    main: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primaryBK,
    },
    container: {
        width: '100%',
        backgroundColor: theme.colors.primaryBK,
    },
    mainContainer: {
        justifyContent: 'center',
        flex: 1,
        flexGrow: 1,
        backgroundColor: theme.colors.transparent,
    },
    titleContainer: {
        flexDirection: 'column',
        paddingVertical: '12%',
        rowGap: 10,
        backgroundColor: theme.colors.transparent,
    },
    formContainer: {
        flexDirection: 'column',
        backgroundColor: theme.colors.transparent,
    },
    forgotPasswordContainer: {
        marginBottom: '5%',
        marginTop: '5%',
        backgroundColor: theme.colors.transparent,
    },
    dividerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '7%',
        backgroundColor: theme.colors.transparent,
    },
    lineLeft: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 15,
        fontWeight: '300',
        color: theme.colors.textHint,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        columnGap: 20,
        backgroundColor: theme.colors.transparent,
    },
    socialButton: {
        flex: 1,
        backgroundColor: theme.colors.primaryBK,
        height: 55,
        borderColor: theme.colors.textHint,
        borderWidth: 1,
        borderRadius: 15,
    },
    newAccountContainer: {
        marginTop: '4%',
        alignItems: 'center',
        backgroundColor: theme.colors.transparent,
    },
    textAccent: {
        color: theme.colors.primary,
    },
    errorInput: {
        color: theme.colors.danger400,
        marginTop: -10,
        marginHorizontal: 7,
        fontSize: 14,
    },
    errorFormApi: {
        color: theme.colors.danger400,
        marginVertical: 10,
        marginHorizontal: 7,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
    },
    buttonStyle: {
        backgroundColor: theme.colors.basic100,
        height: 55,
    },
    buttonTextStyle: {
        color: theme.colors.black,
        fontWeight: '700',
    },
});
