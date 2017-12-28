import {NativeModules, Platform} from 'react-native';

const splash = (Platform.OS === "android") ? NativeModules.SplashScreen : {};

export default splash;