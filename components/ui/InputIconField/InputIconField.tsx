import { Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { theme } from '../../../config/theme';
import { Icon } from '../Icon/Icon';

interface InputIconFieldProps {
  value?: any;
  placeholder?: string;
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
  iconName?: string;
  borderBottom?: boolean;
  height?: number;
}

export const InputIconField: React.FC<InputIconFieldProps> = ({
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  maxLength,
  autoCapitalize,
  keyboardType,
  disabled = true,
  secureTextEntry = false,
  textContentType,
  iconName,
  borderBottom = true,
  height,
}) => {
  const renderIconLeft = () => {
    if (iconName) {
      return (
        <Layout style={styles.iconContainer}>
          <Icon name={iconName} color={theme['text-hint-color']} size={28} />
        </Layout>
      );
    } else {
      <></>;
    }
  };

  return (
    <Layout
      style={[
        styles.inputContainer,
        {
          borderBottomColor: borderBottom
            ? theme['text-hint-color']
            : theme['color-basic-transparent'],
          borderBottomWidth: borderBottom ? 0.7 : 0,
          height: height ? height : 60,
        },
      ]}>
      {renderIconLeft()}
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        autoCorrect={false}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        editable={disabled}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        placeholderTextColor={theme['text-hint-color']}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme['color-basic-transparent'],
  },
  input: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: theme['color-basic-transparent'],
    borderBottomColor: theme['text-hint-color'],
    fontSize: 16,
    flex: 1,
    height: 60,
    color: theme['color-basic-100'],
    fontWeight: '500',
  },
  iconContainer: {
    flex: 0.14,
    alignItems: 'center',
    backgroundColor: theme['color-basic-transparent'],
  },
});
