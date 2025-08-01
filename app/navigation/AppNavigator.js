/**
 * React Navigation v6 based router
 * Replaces react-native-router-flux implementation
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import all screen components
import DynamicPage from '../components/DynamicPage';
import LoginPage from '../components/LoginPage';
import LoginWebPage from '../components/LoginWebPage';
import MyPage from '../components/MyPage';
import PersonInfoPage from '../components/PersonInfoPage';
import PhotoPage from '../components/PhotoPage';
import AboutPage from '../components/AboutPage';
import NotifyPage from '../components/NotifyPage';
import IssueDetail from '../components/IssueDetailPage';
import VersionPage from '../components/ReleasePage';
import PersonPage from '../components/PersonPage';
import CodeDetailPage from '../components/CodeDetailPage';
import SettingPage from '../components/SettingPage';
import RepositoryDetail from '../components/RepositoryDetailPage';
import PushDetailPage from '../components/PushDetailPage';
import TrendPage from '../components/TrendPage';
import WebPage from '../components/WebPage';
import SearchPage from '../components/SearchPage';
import ListPage from '../components/ListPage';
import WelcomePage from '../components/WelcomePage';

// Import modal components
import TextInputModal from '../components/common/CommonTextInputModal';
import CommentConfirmModal from '../components/common/CommonConfirmModal';
import LoadingModal from '../components/common/LoadingModal';
import CommonOptionModal from '../components/common/CommonOptionModal';

// Import custom components
import TabIcon from '../components/widget/TabIcon';
import DrawerFilter from '../components/widget/SearchDrawerFilter';
import CustomBackButton from '../components/widget/CustomBackButton';
import CustomDrawerButton from '../components/widget/CustomDrawerButton';
import SearchButton from '../components/widget/CustomSearchButton';
import CommonIconButton from '../components/common/CommonIconButton';

// Import utilities and styles
import styles from '../style';
import I18n from '../style/i18n';
import * as Constant from '../style/constant';
import BackUtils from '../utils/backUtils';
import { CommonMoreRightBtnPress, RepositoryDetailRightBtnPress } from '../utils/actionUtils';
import { screenWidth, drawerWidth } from '../style/index';
import NavigationService from './NavigationService';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ModalStack = createStackNavigator();

// Default screen options with safe area handling
const getDefaultScreenOptions = (insets) => ({
  headerStyle: [
    styles.navigationBar,
    {
      paddingTop: insets.top,
      height: 50 + insets.top, // base header height + status bar
    }
  ],
  headerTitleStyle: { color: Constant.titleTextColor },
  headerLeft: () => <CustomBackButton />,
});

// Tab Screen Component
function MainTabScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: Constant.tabBarHeight,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Constant.tabBackgroundColor,
        },
        tabBarShowLabel: false,
        headerStyle: [
          styles.navigationBar,
          {
            paddingTop: insets.top,
            height: 50 + insets.top, // base header height + status bar
          }
        ],
        headerTitleStyle: { color: Constant.titleTextColor },
        headerRight: () => <SearchButton />,
      }}
    >
      <Tab.Screen
        name="DynamicPage"
        component={DynamicPage}
        options={{
          title: I18n('tabDynamic'),
          tabBarIcon: (props) => <TabIcon {...props} tabIconName="tabDynamic" />,
        }}
      />
      <Tab.Screen
        name="TrendPage"
        component={TrendPage}
        options={{
          title: I18n('tabRecommended'),
          tabBarIcon: (props) => <TabIcon {...props} tabIconName="tabRecommended" />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          title: I18n('tabMy'),
          tabBarIcon: (props) => <TabIcon {...props} tabIconName="tabMy" />,
        }}
      />
    </Tab.Navigator>
  );
}

// Search Drawer Component
function SearchDrawer() {
  const insets = useSafeAreaInsets();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerFilter {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          width: drawerWidth,
        },
        headerLeft: () => <CustomBackButton />,
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="SearchPageInner"
        component={SearchPage}
        options={{
          title: I18n('search'),
          headerStyle: [
            styles.navigationBar,
            {
              paddingTop: insets.top,
              height: 50 + insets.top, // base header height + status bar
            }
          ],
          headerTitleStyle: { color: Constant.titleTextColor },
          headerRight: () => <CustomDrawerButton />,
        }}
      />
    </Drawer.Navigator>
  );
}

// Main Stack Navigator
function MainStack() {
  const insets = useSafeAreaInsets();
  const defaultScreenOptions = getDefaultScreenOptions(insets);
  return (
    <Stack.Navigator
      initialRouteName="WelcomePage"
      screenOptions={defaultScreenOptions}
    >
      {/* Welcome Screen */}
      <Stack.Screen
        name="WelcomePage"
        component={WelcomePage}
        options={{ headerShown: false }}
      />

      {/* Login Stack */}
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginWebPage"
        component={LoginWebPage}
        options={{
          title: I18n('Login'),
        }}
      />

      {/* Main App with Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabScreen}
        options={{ headerShown: false }}
      />

      {/* Individual Screens */}
      <Stack.Screen
        name="PersonPage"
        component={PersonPage}
        options={({ route }) => ({
          headerRight: () => (
            <CommonIconButton
              data={{
                needRightBtn: true,
                rightBtn: 'ellipsis-horizontal-outline',
                iconType: 2,
                rightBtnPress: (params) => CommonMoreRightBtnPress(params),
                ...route.params,
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="SettingPage"
        component={SettingPage}
        options={{ title: I18n('setting') }}
      />

      <Stack.Screen
        name="ListPage"
        component={ListPage}
        options={({ route }) => ({
          headerRight: () => <CommonIconButton data={route.params} />,
        })}
      />

      <Stack.Screen
        name="SearchPage"
        component={SearchDrawer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RepositoryDetail"
        component={RepositoryDetail}
        options={({ route }) => ({
          headerRight: () => (
            <CommonIconButton
              data={{
                needRightBtn: true,
                rightBtn: 'ellipsis-horizontal-outline',
                iconType: 2,
                rightBtnPress: (params) => RepositoryDetailRightBtnPress(params),
                ...route.params,
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="IssueDetail"
        component={IssueDetail}
        options={({ route }) => ({
          headerRight: () => (
            <CommonIconButton
              data={{
                needRightBtn: true,
                rightBtn: 'ellipsis-horizontal-outline',
                iconType: 2,
                rightBtnPress: (params) => CommonMoreRightBtnPress(params),
                ...route.params,
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="PushDetailPage"
        component={PushDetailPage}
        options={({ route }) => ({
          headerRight: () => (
            <CommonIconButton
              data={{
                needRightBtn: true,
                rightBtn: 'ellipsis-horizontal-outline',
                iconType: 2,
                rightBtnPress: (params) => CommonMoreRightBtnPress(params),
                ...route.params,
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="VersionPage"
        component={VersionPage}
        options={({ route }) => ({
          headerRight: () => <CommonIconButton data={route.params} />,
        })}
      />

      <Stack.Screen
        name="NotifyPage"
        component={NotifyPage}
        options={({ route }) => ({
          title: I18n('notify'),
          headerRight: () => <CommonIconButton data={route.params} />,
        })}
      />

      <Stack.Screen
        name="CodeDetailPage"
        component={CodeDetailPage}
        options={({ route }) => ({
          title: I18n('notify'),
          headerRight: () => (
            <CommonIconButton
              data={{
                needRightBtn: true,
                rightBtn: 'ellipsis-horizontal-outline',
                iconType: 2,
                rightBtnPress: (params) => CommonMoreRightBtnPress(params),
                ...route.params,
              }}
            />
          ),
        })}
      />

      <Stack.Screen
        name="AboutPage"
        component={AboutPage}
        options={{ title: I18n('about') }}
      />

      <Stack.Screen
        name="PersonInfoPage"
        component={PersonInfoPage}
        options={{ title: I18n('about') }}
      />

      <Stack.Screen
        name="WebPage"
        component={WebPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PhotoPage"
        component={PhotoPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Root Modal Stack Navigator
function RootNavigator() {
  return (
    <ModalStack.Navigator
      screenOptions={{ presentation: 'modal', headerShown: false }}
    >
      <ModalStack.Screen name="Main" component={MainStack}
        options={{
          presentation: 'transparentModal', // 设置为透明模态
          cardStyle: { backgroundColor: 'transparent' }, // 确保卡片背景透明
        }}

      />
      <ModalStack.Screen name="LoadingModal" component={LoadingModal}
        options={{
          presentation: 'transparentModal', // 设置为透明模态
          cardStyle: { backgroundColor: 'transparent' }, // 确保卡片背景透明
        }}
      />
      <ModalStack.Screen name="TextInputModal" component={TextInputModal}
        options={{
          presentation: 'transparentModal', // 设置为透明模态
          cardStyle: { backgroundColor: 'transparent' }, // 确保卡片背景透明
        }}
      />
      <ModalStack.Screen name="ConfirmModal" component={CommentConfirmModal}
        options={{
          presentation: 'transparentModal', // 设置为透明模态
          cardStyle: { backgroundColor: 'transparent' }, // 确保卡片背景透明
        }}
      />
      <ModalStack.Screen name="OptionModal" component={CommonOptionModal}
        options={{
          presentation: 'transparentModal', // 设置为透明模态
          cardStyle: { backgroundColor: 'transparent' }, // 确保卡片背景透明
        }}
      />
    </ModalStack.Navigator>
  );
}

// Main Navigation Container
export default function AppNavigator() {
  const navigationRef = React.useRef(null);

  const onReady = () => {
    NavigationService.setNavigatorRef(navigationRef.current);
  };

  const onStateChange = (state) => {
    const currentRouteName = state?.routes[state.index]?.name;
    NavigationService.setCurrentRoute({ name: currentRouteName });
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        hidden={false}
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <NavigationContainer
        ref={navigationRef}
        onReady={onReady}
        onStateChange={onStateChange}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}