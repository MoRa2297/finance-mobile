import { UnauthStackParamList } from '../screens/AppNavigator';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends UnauthStackParamList {}
  }
}
