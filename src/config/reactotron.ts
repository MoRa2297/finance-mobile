import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactotron = Reactotron.setAsyncStorageHandler?.(AsyncStorage)
  .configure({
    name: 'Personal Finance',
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .connect();

// clean to every reload
reactotron.clear?.();

export default reactotron;

// to use console.log on reactotron
// console.tron = reactotron;
