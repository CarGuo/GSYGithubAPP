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
    TouchableOpacity
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
        super(props)
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        this.refs.loginModal.open()
    }

    componentWillUnmount() {
    }


    onOpen() {
        //todo get something when open
    }

    onClose() {
        try {
            Actions.pop();
        } catch (e) {

        }
    }

    render() {
        let textInputProps = {
            style: {width: 250, height: 70},
            activeColor: Constant.primaryColor,
            passiveColor: '#dadada',
            keyboardType: 'email-address',
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
                            {...textInputProps}
                            label={I18n('UserName')}
                            iconName={'user-circle-o'}
                        />
                    </View>
                    <View style={[styles.centered , {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            {...textInputProps}
                            label={I18n('Password')}
                            returnKeyType={'send'}
                            secureTextEntry={true}
                            iconName={'keyboard-o'}
                        />
                    </View>
                    <View>
                    </View>
                    <TouchableOpacity style={[styles.centered, {marginTop: Constant.normalMarginEdge} ]}>
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
        actions: bindActionCreators(loginActions, dispatch)
    })
)(LoginPage)