/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import getRouter from './app/router';
import {Provider} from 'react-redux';
import store from './app/store/'
import {getLanguageCurrent} from './app/utils/actionUtils'
import {changeLocale} from './app/style/i18n'
import {getRefreshHandler} from './app/utils/actionUtils'
import * as Constant from './app/style/constant'

export default class App extends Component<{}> {

    constructor() {
        super();
        this.state = {
            store: store,
            show: false
        };
        getLanguageCurrent().then((res) => {
            changeLocale(res.language);
            this.setState({
                show: true
            })
        });

        //切换语言
        getRefreshHandler().set(Constant.REFRESH_LANGUAGE, () => {
            this.setState({
                show: false
            });
            setTimeout(() => {
                this.setState({
                    show: true
                })
            }, 500)
        })
    }


    render() {
        if (!this.state.show) {
            return <View/>
        }
        return (
            <Provider store={this.state.store}>
                {getRouter()}
            </Provider>
        );
    }
}