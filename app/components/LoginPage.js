/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    TextInput,
    BackHandler,
    TouchableOpacity,
    AsyncStorage,
    InteractionManager
} from 'react-native';
import styles, {screenWidth} from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Modal from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome'
import {Isao, Fumi} from 'react-native-textinput-effects';


/**
 * 登陆Modal
 */
class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.userInputChange = this.userInputChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.toLogin = this.toLogin.bind(this);
        this.params = {
            userName: '',
            password: ''
        }
        this.state = {
            saveUserName: '',
            savePassword: '',
        }
    }

    componentDidMount() {
        this.refs.loginModal.open();
    }

    componentWillUnmount() {
    }


    onOpen() {
        AsyncStorage.getItem(Constant.USER_NAME_KEY).then((text) => {
            if (text) {
                this.setState({
                    saveUserName: text
                });
                this.params.userName = text;
            }
        });
        AsyncStorage.getItem(Constant.PW_KEY).then((text) => {
            if (text) {
                this.setState({
                    savePassword: text
                })
                this.params.password = text;
            }
        })
    }

    onClose() {
        try {
            Actions.pop();
        } catch (e) {

        }
    }

    userInputChange(text) {
        this.params.userName = text;
    }

    passwordChange(text) {
        this.params.password = text;
    }

    toLogin() {
        let {login} = this.props;
        if (!this.params.userName || this.params.userName.length == 0) {
            alert(I18n('LoginNameTip'));
            return
        }
        if (!this.params.password || this.params.password.length == 0) {
            alert(I18n('LoginPWTip'));
            return
        }
        AsyncStorage.setItem(Constant.USER_NAME_KEY, this.params.userName);
        login.doLogin(this.params.userName, this.params.password)
    }

    render() {
        let textInputProps = {
            style: {width: 250, height: 70},
            activeColor: Constant.primaryColor,
            passiveColor: '#dadada',
            iconClass: Icon,
            iconColor: Constant.actionColor,
            iconSize: 25,
        };
        return (
            <Modal ref={"loginModal"} style={[{height: 360, width: screenWidth - 80,marginRight: 50, borderRadius: 10}]}
                   position={"center"}
                   onClosed={this.onClose}
                   onOpened={this.onOpen}>
                <View>
                    <View style={[styles.centered, {marginTop:Constant.normalMarginEdge}]}>
                        <Icon name={"github-square"} size={Constant.largeIconSize} color={Constant.primaryColor}/>
                    </View>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            ref={"userNameInput"}
                            {...textInputProps}
                            label={I18n('UserName')}
                            iconName={'user-circle-o'}
                            value={this.state.saveUserName}
                            onChangeText={this.userInputChange}
                        />
                    </View>
                    <View style={[styles.centered , {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            ref={"passwordInput"}
                            {...textInputProps}
                            label={I18n('Password')}
                            returnKeyType={'send'}
                            secureTextEntry={true}
                            password={true}
                            iconName={'keyboard-o'}
                            value={this.state.savePassword}
                            onChangeText={this.passwordChange}
                        />
                    </View>
                    <View>
                    </View>
                    <TouchableOpacity style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}
                                      onPress={()=>{
                                          this.toLogin();
                                      }}>
                        <View
                            style={[styles.centered , {backgroundColor:Constant.primaryColor, width:230, marginTop: Constant.normalMarginEdge,
                                paddingHorizontal: Constant.normalMarginEdge, paddingVertical: Constant.normalMarginEdge , borderRadius: 5}]}>
                            <Text style={[styles.normalTextWhite]}>{I18n('Login')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

export default connect(state => ( {state}), dispatch => ({
        login: bindActionCreators(loginActions, dispatch)
    })
)(LoginPage)