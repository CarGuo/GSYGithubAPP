/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component, createRef} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Image,
    BackHandler,
    Keyboard,
    Linking,
    Easing, DeviceEventEmitter,
} from 'react-native';
import styles, {screenHeight, screenWidth} from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from '../navigation/Actions';
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Entypo'
import {Fumi} from 'react-native-textinput-effects';
import Toast from './common/ToastProxy'
import LottieView from 'lottie-react-native';
import AddressLocal from '../net/address';

const animaTime = 600;

/**
 * 登陆Modal
 */

@connect(
    state => ({state}),
    dispatch => ({
        login: bindActionCreators(loginActions, dispatch)
    })
)
export default class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.userInputChange = this.userInputChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.toLogin = this.toLogin.bind(this);
        this.lottieViewRef = createRef();
        this.userNameInputRef = createRef();
        this.passwordInputRef = createRef();
        this.params = {
            userName: '',
            password: ''
        };
        this.state = {
            saveUserName: '',
            savePassword: '',
            secureTextEntry: true,
            secureIcon: "eye-with-line",
            opacity: new Animated.Value(0),
        }
        this.thisUnmount = false;
    }

    componentDidMount() {
        this.onOpen();
        this.handle = BackHandler.addEventListener('hardwareBackPress-LoginPage', this.onClose)
        Animated.timing(this.state.opacity, {
            duration: animaTime,
            toValue: 1,
            useNativeDriver: false,
        }).start();
        this.startAnimation();

        this.subscription = DeviceEventEmitter.addListener(
            `LoginPage`,
            (params) => {
                let code = params["code"]
                Actions.LoadingModal({backExit: false});
                Keyboard.dismiss();
                let {login} = this.props;
                login.doLogin(code, (res) => {
                    this.exitLoading();
                    if (!res) {
                        Toast(I18n('LoginFailTip'));
                    } else {
                        Actions.reset("MainTabs")
                    }
                })
            });
    }

    componentWillUnmount() {
        this.thisUnmount = true;
        if (this.handle) {
            this.handle.remove();
        }
        if (this.lottieViewRef.current) {
            this.lottieViewRef.current.reset();
        }
        this.subscription.remove();
    }


    startAnimation() {
        if (this.thisUnmount) {
            return;
        }
    }

    onOpen() {
        loginActions.getLoginParams().then((res) => {
            this.setState({
                saveUserName: res.userName,
                savePassword: res.password
            });
            this.params.userName = res.userName;
            this.params.password = res.password;
        });
    }

    onClose() {
        if (Actions.state.index === 0) {
            return false;
        }
        Animated.timing(this.state.opacity, {
            duration: animaTime,
            toValue: 0,
            useNativeDriver: false,
        }).start(Actions.pop());
        return true;

    }

    userInputChange(text) {
        this.params.userName = text;
    }

    passwordChange(text) {
        this.params.password = text;
    }

    exitLoading() {
        if (Actions.currentScene === 'LoadingModal') {
            Actions.pop();
        }
    }

    toLogin() {
        let {login} = this.props;

        Actions.LoginWebPage({uri: AddressLocal.getAuthorizationWeb()})

        return;

        /*if (!this.params.userName || this.params.userName.length === 0) {
            Toast(I18n('LoginNameTip'));
            return
        }
        if (!this.params.password || this.params.password.length === 0) {
            Toast(I18n('LoginPWTip'));
            return
        }
        this.setState({
            saveUserName: this.params.userName,
            savePassword: this.params.password
        });
        Actions.LoadingModal({backExit: false});
        Keyboard.dismiss();
        login.doLogin(this.params.userName, this.params.password, (res) => {
            this.exitLoading();
            if (!res) {
                Toast(I18n('LoginFailTip'));
            } else {
                Actions.reset("MainTabs")
            }
        })*/
    }

    render() {
        let textInputProps = {
            style: {width: 250, height: 70, backgroundColor: Constant.miWhite},
            activeColor: Constant.primaryColor,
            passiveColor: '#dadada',
            iconClass: Icon,
            iconColor: Constant.primaryColor,
            iconSize: 25,
            clearButtonMode: "always"
        };
        return (
            <Animated.View
                style={[styles.centered, styles.absoluteFull, {backgroundColor: Constant.primaryColor}, {opacity: this.state.opacity}]}>
                <View style={[styles.absoluteFull, {zIndex: -999, justifyContent: 'flex-end'}]}>
                    <View style={{width: screenWidth, height: screenHeight / 2}}>
                        <LottieView
                            ref={this.lottieViewRef}
                            style={{width: screenWidth, height: screenHeight / 2}}
                            source={require('../style/lottie/animation-login.json')}              
                            autoPlay={true}
                            loop={false}
                        />
                    </View>
                </View>
                <View
                    style={[{backgroundColor: Constant.miWhite}, {
                        height: 360,
                        width: screenWidth - 80,
                        margin: 50,
                        borderRadius: 10
                    }]}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Image source={require("../img/logo.png")}
                               resizeMode={"contain"}
                               style={{width: 80, height: 80}}/>
                    </View>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            ref={this.userNameInputRef}
                            {...textInputProps}
                            label={I18n('UserName')}
                            iconName={'user-circle-o'}
                            value={this.state.saveUserName}
                            onChangeText={this.userInputChange}
                        />
                    </View>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            ref={this.passwordInputRef}
                            {...textInputProps}
                            label={I18n('Password')}
                            returnKeyType={'send'}
                            secureTextEntry={this.state.secureTextEntry}
                            password={this.state.secureTextEntry}
                            iconName={'keyboard-o'}
                            value={this.state.savePassword}
                            onChangeText={this.passwordChange}
                        />
                        <View style={[{
                            position: "absolute",
                            left: screenWidth - 150,
                            right: 2 * Constant.normalMarginEdge,
                            zIndex: 12,
                        }, styles.alignItemsEnd]}>
                            <TouchableOpacity style={[styles.centered, {
                                marginTop: Constant.normalMarginEdge,
                                padding: Constant.normalMarginEdge
                            }]}
                                              onPress={() => {
                                                  this.setState({
                                                      saveUserName: this.params.userName,
                                                      savePassword: this.params.password,
                                                      secureIcon: (this.state.secureTextEntry) ? "eye" : "eye-with-line",
                                                      secureTextEntry: !this.state.secureTextEntry,
                                                  });
                                              }}>
                                <IconC name={this.state.secureIcon}
                                       backgroundColor={Constant.transparentColor}
                                       color={Constant.primaryColor} size={13}
                                       style={styles.centered}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                    </View>
                    <TouchableOpacity style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}
                                      onPress={() => {
                                          this.toLogin();
                                      }}>
                        <View
                            style={[styles.centered, {
                                backgroundColor: Constant.primaryColor,
                                width: 230,
                                marginTop: Constant.normalMarginEdge,
                                paddingHorizontal: Constant.normalMarginEdge,
                                paddingVertical: Constant.normalMarginEdge,
                                borderRadius: 5
                            }]}>
                            <Text style={[styles.normalTextWhite]}>{I18n('Login')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}
                                      onPress={() => {
                                          Linking.openURL("https://github.com/join")
                                      }}>
                        <Text
                            style={[styles.subSmallText,]}>{" " + I18n('register') + " "}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}
