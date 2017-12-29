import React, {Component} from 'react';
import {
    BackHandler
} from 'react-native';

import I18n from '../style/i18n'
import Toast from '../components/common/ToastProxy'
import SplashScreen from '../components/widget/native/SplashNative'

import {Router, Actions, Scene} from 'react-native-router-flux';

export default function BackUtils() {
    let hasTip = false;
    let ts;
    return function () {
        if (Actions.state.routes[0].index > 0) {
            Actions.pop();
            return true;
        }
        ts = Date.now();
        if (!hasTip) {
            let handler = function () {
                let now = Date.now();
                if (now - ts < 1000) {
                    requestAnimationFrame(handler)
                } else {
                    hasTip = false
                }
            };
            handler();
            hasTip = true;
            Toast(I18n("doublePressExit"));
            return true
        } else {
            //BackHandler.exitApp();
            SplashScreen.exit();
            return true
        }
    }
}
