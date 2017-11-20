/**
 * Created by guoshuyu on 2017/11/7.
 */
import React, {Component} from 'react';
import {
    Scene,
    Router,
    Lightbox
} from 'react-native-router-flux';
import DynamicPage from './components/DynamicPage'
import LoginPage from './components/LoginPage'
import MyPage from './components/UserPage'
import RecommendPage from './components/RecommendPage'
import TabIcon from './components/widget/TabIcon'
import LoadingModal from './components/widget/LoadingModal'
import styles from './style'
import I18n, {changeLocale} from './style/i18n'
import * as Constant from './style/constant'
import BackUtils from './utils/backUtils'

import WelcomePage from "./components/WelcomePage"


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
                <Scene key="root">
                    <Scene key="main">
                        <Scene key="WelcomePage" component={WelcomePage} hideNavBar hideTabBar hide/>
                    </Scene>
                    <Scene key="mainTabPage"
                           tabs
                           lazy
                           wrap={false}
                           navigationBarStyle={styles.navigationBar}
                           showLabel={false}
                           title={I18n('appName')}
                           tabBarPosition={"bottom"}
                           tabBarStyle={{
                               height: Constant.tabBarHeight,
                               alignItems: 'center',
                               justifyContent: 'center',
                               backgroundColor: Constant.tabBackgroundColor
                           }}>
                        <Scene
                            key="RecommendPage"
                            component={RecommendPage}
                            icon={TabIcon}
                            title={I18n('tabRecommended')}
                            tabIconName={'tabRecommended'}
                        />
                        <Scene
                            key="DynamicPage"
                            component={DynamicPage}
                            icon={TabIcon}
                            title={I18n('tabDynamic')}
                            tabIconName={'tabDynamic'}
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
                </Scene>
                <Scene key="LoadingModal" component={LoadingModal}/>
            </Lightbox>
        </Router>
    )
};


export default getRouter;