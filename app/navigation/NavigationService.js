/**
 * Navigation service to replace react-native-router-flux Actions
 * Provides a global navigation interface compatible with existing Actions usage
 */
import { CommonActions, StackActions } from '@react-navigation/native';

class NavigationService {
  constructor() {
    this._navigator = null;
    this._currentRoute = null;
  }

  setNavigatorRef = (navigatorRef) => {
    this._navigator = navigatorRef;
  };

  navigate = (routeName, params) => {
    if (this._navigator) {
      this._navigator.dispatch(
        CommonActions.navigate({
          name: routeName,
          params,
        })
      );
    }
  };

  push = (routeName, params) => {
    if (this._navigator) {
      this._navigator.dispatch(
        StackActions.push(routeName, params)
      );
    }
  };

  pop = () => {
    if (this._navigator) {
      this._navigator.dispatch(StackActions.pop());
    }
  };

  popTo = (routeName) => {
    if (this._navigator) {
      this._navigator.dispatch(StackActions.popTo(routeName));
    }
  };

  replace = (routeName, params) => {
    if (this._navigator) {
      this._navigator.dispatch(
        StackActions.replace(routeName, params)
      );
    }
  };

  reset = (routeName, params) => {
    if (this._navigator) {
      this._navigator.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName, params }],
        })
      );
    }
  };

  goBack = () => {
    if (this._navigator) {
      this._navigator.dispatch(CommonActions.goBack());
    }
  };

  getCurrentRoute = () => {
    return this._currentRoute;
  };

  setCurrentRoute = (route) => {
    this._currentRoute = route;
  };

  // Legacy compatibility methods for react-native-router-flux Actions
  get currentScene() {
    return this._currentRoute?.name;
  }

  get state() {
    if (this._navigator) {
      return this._navigator.getRootState();
    }
    return { routes: [{ index: 0 }] };
  }

  // Screen-specific navigation methods to match existing Actions usage
  WelcomePage = (params) => this.navigate('WelcomePage', params);
  LoginPage = (params) => this.reset('LoginPage', params);
  LoginWebPage = (params) => this.navigate('LoginWebPage', params);
  mainTabPage = (params) => this.reset('MainTabs', params);
  DynamicPage = (params) => this.navigate('DynamicPage', params);
  TrendPage = (params) => this.navigate('TrendPage', params);
  MyPage = (params) => this.navigate('MyPage', params);
  PersonPage = (params) => this.navigate('PersonPage', params);
  SettingPage = (params) => this.navigate('SettingPage', params);
  ListPage = (params) => this.navigate('ListPage', params);
  SearchPage = (params) => this.navigate('SearchPage', params);
  RepositoryDetail = (params) => this.navigate('RepositoryDetail', params);
  IssueDetail = (params) => this.navigate('IssueDetail', params);
  PushDetailPage = (params) => this.navigate('PushDetailPage', params);
  VersionPage = (params) => this.navigate('VersionPage', params);
  NotifyPage = (params) => this.navigate('NotifyPage', params);
  CodeDetailPage = (params) => this.navigate('CodeDetailPage', params);
  AboutPage = (params) => this.navigate('AboutPage', params);
  PersonInfoPage = (params) => this.navigate('PersonInfoPage', params);
  WebPage = (params) => this.navigate('WebPage', params);
  PhotoPage = (params) => this.navigate('PhotoPage', params);
  
  // Modal screens
  LoadingModal = (params) => this.navigate('LoadingModal', params);
  TextInputModal = (params) => this.navigate('TextInputModal', params);
  ConfirmModal = (params) => this.navigate('ConfirmModal', params);
  OptionModal = (params) => this.navigate('OptionModal', params);
}

export default new NavigationService();