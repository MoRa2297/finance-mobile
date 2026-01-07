import { Input, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import {theme} from "../../../theme";


interface InputFiledProps {
  label?: string;
  value?: string;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  error?: string;
  onChange: (text: string) => void;
  onBlur?: (item: any) => void;
  onFocus?: (item: any) => void;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'phone-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  disabled?: boolean;
  secureTextEntry?: boolean;
  textContentType?:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | undefined;
}

export const InputField: React.FC<InputFiledProps> = ({
  value,
  placeholder,
  error,
  style,
  onChange,
  label,
  onBlur,
  onFocus,
  maxLength,
  autoCapitalize,
  keyboardType,
  disabled = false,
  secureTextEntry = false,
  textContentType,
}) => {
  const renderCaption = () => {
    return (
      <Text category={'s1'} style={styles.captionText}>
        {error}
      </Text>
    );
  };

  const renderLabel = () => {
    return (
      <Text category={'s1'} style={styles.label}>
        {label}
      </Text>
    );
  };

  return (
    <Input
      style={[styles.input, style]}
      onChangeText={onChange}
      value={value}
      placeholder={placeholder}
      autoCorrect={false}
      caption={error && renderCaption}
      textStyle={styles.inputText}
      label={label && renderLabel}
      onFocus={onFocus}
      onBlur={onBlur}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
      textContentType={textContentType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    // Reset initial vertical padding on TextInput for Android
    paddingVertical: 0,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: theme.colors.secondaryBK,
    borderColor: theme.colors.secondaryBK,
  },
  label: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.danger400,
    marginTop: 2,
    paddingHorizontal: 10,
  },
  inputText: { fontSize: 13, fontWeight: '300', minHeight: 46 },
});
