import { Platform } from 'react-native';

const _FORCE_PRODUCTION = false;
const _IS_ENV_DEVELOPMENT = __DEV__ && !_FORCE_PRODUCTION;

export default {
  IS_DEV: _IS_ENV_DEVELOPMENT,
  IS_ANDROID: Platform.OS === 'android',
  IS_IOS: Platform.OS === 'ios',
  STATIC_TOKEN: '',
  BASE_API_LOCAL: _IS_ENV_DEVELOPMENT
    ? 'http://localhost:4000/api/v1'
    : 'https://production-backend-personalfinance.onrender.com/api/v1',
};

