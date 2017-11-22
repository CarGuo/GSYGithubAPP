/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import styles, {screenWidth, screenHeight} from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-spinkit';
import {Actions} from "react-native-router-flux";


/**
 * 登陆Modal
 */
class LoadingModal extends Component {

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        this.refs.loginModal.open();
        BackHandler.addEventListener('hardwareBackPress', this.onClose)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onClose)
    }

    onClose() {
        if (this.props.backExit) {
            Actions.pop();
            return true;
        }
        return true;

    }

    render() {
        return (
            <View style={[{height: screenHeight, width: screenWidth, backgroundColor: '#000000', opacity: 0.2}]}>
                <Modal ref={"loginModal"}
                       style={[{height: screenHeight, width: screenWidth, backgroundColor: '#000000', opacity: 0}]}
                       position={"center"}
                       backdrop={this.props.backExit}
                       backButtonClose={this.props.backExit}
                       swipeToClose={this.props.backExit}
                       backdropOpacity={0.8}>
                    <View style={[styles.centered, {flex: 1}]}>
                        <Spinner style={[styles.centered]}
                                 isVisible={true}
                                 size={50} type="9CubeGrid"
                                 color="#FFFFFF"/>
                        <Text style={styles.normalTextWhite}>{this.props.text}</Text>
                    </View>
                </Modal>
            </View>
        )
    }
}

LoadingModal.propTypes = {
    text: PropTypes.string,
    backExit: PropTypes.bool,
};
LoadingModal.defaultProps = {
    text: I18n('loading'),
    backExit: true,
};


export default LoadingModal;