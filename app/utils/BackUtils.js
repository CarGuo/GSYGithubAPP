import React, {Component} from 'react';
import {
    BackHandler
} from 'react-native';

import I18n from '../style/i18n'
import Toast from '../components/widget/ToastProxy'


export default function BackUtils() {
    let hasTip = false;
    let ts;
    return function () {
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
            BackHandler.exitApp();
            return true
        }
    }
}
