/**
 * Created by guoshuyu on 2017/11/7.
 */
import React, {Component} from 'react';
import {
    Scene,
    Router,
    Lightbox, Drawer
} from 'react-native-router-flux';
import DynamicPage from './components/DynamicPage'
import LoginPage from './components/LoginPage'
import MyPage from './components/MyPage'
import RecommendPage from './components/RecommendPage'
import PersonPage from './components/PersonPage'
import SettingPage from './components/SettingPage'
import TrendPage from './components/TrendPage'
import SearchPage from './components/SearchPage'
import UserListPage from './components/UserListPage'
import TabIcon from './components/widget/TabIcon'
import LoadingModal from './components/widget/LoadingModal'
import DrawerFilter from './components/widget/DrawerFilter'
import CustomBackButton from './components/widget/CustomBackButton'
import CustomDrawerButton from './components/widget/CustomDrawerButton'
import SearchButton from './components/widget/CustomSearchButton'
import styles from './style'
import I18n, {changeLocale} from './style/i18n'
import * as Constant from './style/constant'
import BackUtils from './utils/backUtils'

import WelcomePage from "./components/WelcomePage"
import {screenWidth, drawerWidth} from "./style/index";


const getRouter = () => {
    changeLocale();
    return (
        <Router
            getSceneStyle={() => {
                return styles.routerStyle
            }}
            backAndroidHandler={
                BackUtils()}>
            <Lightbox>
                <Scene key="root"
                       navigationBarStyle={styles.navigationBar}
                       titleStyle={{color: Constant.titleTextColor}}>
                    <Scene key="main">
                        <Scene key="WelcomePage" component={WelcomePage} hideNavBar hideTabBar hide/>
                    </Scene>
                    <Scene key="mainTabPage"
                           tabs
                           lazy
                           wrap={false}
                           showLabel={false}
                           tabBarPosition={"bottom"}
                           title={I18n('appName')}
                           renderRightButton={
                               () => <SearchButton/>
                           }
                           tabBarStyle={{
                               height: Constant.tabBarHeight,
                               alignItems: 'center',
                               justifyContent: 'center',
                               backgroundColor: Constant.tabBackgroundColor
                           }}>
                        <Scene
                            key="DynamicPage"
                            component={DynamicPage}
                            icon={TabIcon}
                            title={I18n('tabDynamic')}
                            tabIconName={'tabDynamic'}
                        />
                        <Scene
                            key="TrendPage"
                            component={TrendPage}
                            icon={TabIcon}
                            title={I18n('tabRecommended')}
                            tabIconName={'tabRecommended'}
                        />
                        <Scene
                            key="MyPage"
                            component={MyPage}
                            icon={TabIcon}
                            title={I18n('tabMy')}
                            tabIconName={'tabMy'}
                        />
                    </Scene>
                    <Scene key="LoginPage" component={LoginPage}
                           showLabel={false}
                           hideNavBar/>
                    <Scene key="PersonPage" component={PersonPage}
                           renderLeftButton={() => <CustomBackButton/>}/>
                    <Scene key="SettingPage" component={SettingPage} title={I18n('setting')}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="UserListPage" component={UserListPage}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Drawer key="SearchPageDrawer" title={I18n('search')}
                            contentComponent={DrawerFilter}
                            drawerPosition={'right'}
                            hideNavBar
                            drawerWidth={drawerWidth}
                            drawerIcon={<CustomDrawerButton/>}
                            renderLeftButton={() => <CustomBackButton/>}>
                        <Scene key="SearchPage" component={SearchPage}/>
                    </Drawer>
                </Scene>
                <Scene key="LoadingModal" component={LoadingModal}/>
            </Lightbox>
        </Router>
    )
};


export default getRouter;