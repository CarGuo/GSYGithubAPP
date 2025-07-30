/**
 * Created by guoshuyu on 2017/11/7.
 */

import React, {Component, createRef} from 'react';
import {
    View, Image, StatusBar, Platform, Animated, Easing
} from 'react-native';
import {Actions} from '../navigation/Actions';
import styles, {screenHeight, screenWidth} from "../style"
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Constant from "../style/constant"
import LottieView from 'lottie-react-native';

/**
 * 欢迎页
 */

@connect(
    state => ({
        state
    }), dispatch => ({
        actions: bindActionCreators(loginActions, dispatch),
    })
)
export default class WelcomePage extends Component {

    constructor(props) {
        super(props);
        this.toNext = this.toNext.bind(this);
        this.lottieViewRef = createRef();
        this.state = {
            progress: new Animated.Value(0),
        };
    }


    componentDidMount() {
        //是否登陆，是否用户信息
        userActions.initUserInfo().then((res) => {
            this.toNext(res)
        });
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
        }).start();
    }

    componentWillUnmount() {
        if (this.lottieViewRef.current) {
            this.lottieViewRef.current.reset();
        }
    }

    toNext(res) {
        setTimeout(() => {
            if (res && res.result) {
                Actions.reset("root");
            } else {
                Actions.reset("LoginPage");
            }
        }, 2100);
    }

    render() {
        return (
            <View style={[styles.mainBox, {backgroundColor: Constant.white}]}>
                <StatusBar hidden={true}/>
                <View style={[styles.centered, {flex: 1}]}>
                    <Image source={require("../img/welcome.png")}
                           resizeMode={"contain"}
                           style={{width: screenWidth, height: screenHeight}}/>
                    <View style={[styles.absoluteFull, styles.centered, {justifyContent: "flex-end"}]}>
                        <View style={[styles.centered, {width: 150, height:150}]}>
                            <LottieView
                                ref={this.lottieViewRef}
                                style={{
                                    width: 150,
                                    height: 150,
                                }}
                                source={require('../style/lottie/animation-w800-h800.json')}
                                animatedProgress={this.state.progress}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

