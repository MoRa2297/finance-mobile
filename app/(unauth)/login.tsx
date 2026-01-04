import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { colors, spacing, fontSize, borderRadius } from '../../theme';

// Schema di validazione
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Campo obbligatorio')
        .email('Email non valida'),
    password: z
        .string()
        .min(1, 'Campo obbligatorio')
        .min(7, 'Minimo 7 caratteri')
        .regex(/[0-9]/, 'Deve contenere un numero')
        .regex(/[a-z]/, 'Deve contenere una lettera minuscola')
        .regex(/[A-Z]/, 'Deve contenere una lettera maiuscola')
        .regex(/[^\w]/, 'Deve contenere un simbolo'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setApiError(null);

            // TODO: Chiamata API login
            console.log('Login:', data);

            // Simula delay API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Naviga alla home dopo login
            router.replace('/(auth)/(tabs)');
        } catch (error) {
            setApiError('Credenziali non valide. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Bentornato</Text>
                        <Text style={styles.subtitle}>Accedi per continuare</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Email"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    textContentType="emailAddress"
                                    error={!!errors.email}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Password"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    textContentType="password"
                                    error={!!errors.password}
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password.message}</Text>
                        )}
                    </View>

                    {/* API Error */}
                    {apiError && (
                        <Text style={styles.apiError}>{apiError}</Text>
                    )}

                    {/* Forgot Password */}
                    <View style={styles.forgotPasswordContainer}>
                        <Text style={styles.accentText}>Password dimenticata?</Text>
                    </View>

                    {/* Submit Button */}
                    <Button
                        text="Accedi"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isLoading}
                    />

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <LinearGradient
                            colors={[colors.primaryBK, colors.textHint]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.dividerLine}
                        />
                        <Text style={styles.dividerText}>oppure</Text>
                        <LinearGradient
                            colors={[colors.textHint, colors.primaryBK]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.dividerLine}
                        />
                    </View>

                    {/* Social Buttons */}
                    <View style={styles.socialContainer}>
                        <Button
                            text="G"
                            onPress={() => {}}
                            variant="outline"
                            style={styles.socialButton}
                            disabled
                        />
                        <Button
                            text="f"
                            onPress={() => {}}
                            variant="outline"
                            style={styles.socialButton}
                            disabled
                        />
                    </View>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Non hai un account?{' '}
                            <Link href="/register" asChild>
                                <Text style={styles.accentText}>Registrati</Text>
                            </Link>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryBK,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
    },
    titleContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textHint,
    },
    formContainer: {
        marginBottom: spacing.md,
    },
    errorText: {
        color: colors.danger400,
        fontSize: fontSize.sm,
        marginTop: -spacing.sm,
        marginBottom: spacing.md,
        marginHorizontal: spacing.sm,
    },
    apiError: {
        color: colors.danger400,
        fontSize: fontSize.md,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    forgotPasswordContainer: {
        marginBottom: spacing.lg,
    },
    accentText: {
        color: colors.primary,
        fontSize: fontSize.md,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        color: colors.textHint,
        marginHorizontal: spacing.md,
        fontSize: fontSize.sm,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    socialButton: {
        flex: 1,
    },
    registerContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    registerText: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
    },
});
