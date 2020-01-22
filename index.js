import {AppRegistry, Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Main from './src/Main';
// import App from './App';
import {name as appName} from './app.json';

NetInfo.fetch().then(state => {
  if (state.isConnected.toString() == 'false') {
    Alert.alert(
      'No network connection',
      'No internet connection. connect to the internet and try again.',
      [
        {
          text: 'ok',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  }
});

AppRegistry.registerComponent(appName, () => Main);
