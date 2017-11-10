/**
 * Created by guoshuyu on 2017/11/7.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Navigator,
    Platform,
    StatusBar

} from 'react-native';
import {
    Scene,
    Router,
    Modal
} from 'react-native-router-flux';
import DynamicPage from './components/DynamicPage'
import MyPage from './components/MyPage'
import RecommendPage from './components/RecommendPage'
import TabIcon from './components/widget/TabIcon'
import styles from './style'
import I18n, {changeLocale} from './style/i18n'
import * as Constant from './style/constant'

import WelcomePage from "./components/WelcomePage"


const getRouter = () => {
    changeLocale();
    return (
        <Router getSceneStyle={() => {return styles.routerStyle}}>
            <Scene key="modal" component={Modal}>
                <Scene key="root">
                    <Scene key="mainTabPage"
                           tabs
                           hideNavBar
                           showLabel={false}
                           tabBarPosition={"bottom"}
                           tabBarStyle={{height:Constant.tabBarHeight,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          backgroundColor:Constant.tabBackgroundColor }}>
                        <Scene
                            hideNavBar
                            key="RecommendPage"
                            component={RecommendPage}
                            icon={TabIcon}
                            title={I18n('tabRecommended')}
                        />
                        <Scene
                            hideNavBar
                            key="DynamicPage"
                            component={DynamicPage}
                            icon={TabIcon}
                            title={I18n('tabDynamic')}
                        />
                        <Scene
                            hideNavBar
                            key="MyPage"
                            component={MyPage}
                            icon={TabIcon}
                            title={I18n('tabMy')}
                        />
                    </Scene>
                    <Scene key="main">
                        <Scene key="enter" component={WelcomePage} hideNavBar hideTabBar hide/>
                    </Scene>
                </Scene>
            </Scene>
        </Router>
    )
};


export default getRouter;