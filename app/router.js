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
import {changeLocale} from './style/i18n'

import WelcomePage from "./components/WelcomePage"

//设置router的样式
const getSceneStyle = (props, computedProps) => {
    const style = {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        shadowRadius: null,
    };
    return style;
};


const getRouter = () => {
    changeLocale();
    return (
        <Router getSceneStyle={getSceneStyle}>
            <Scene key="modal" component={Modal}>
                <Scene key="root">
                    <Scene key="main">
                        <Scene key="enter" component={WelcomePage} hideNavBar hideTabBar hide/>
                    </Scene>
                </Scene>
            </Scene>
        </Router>
    )
};


export default getRouter;