import { UnauthStackParamList } from '../screens/AppNavigator';

// TODO remove
declare global {
  namespace ReactNavigation {
    interface RootParamList extends UnauthStackParamList {}
  }
}
