/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component, createRef} from 'react';
import {
    Text,
    View,
    BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import styles, {screenWidth, screenHeight} from "../../style/index"
import I18n from '../../style/i18n'
import Modal from './ModalBox';
import Spinner from 'react-native-spinkit-fix-new';
import {Actions} from '../../navigation/Actions';


/**
 * 加载中Modal
 */
class LoadingModal extends Component {

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.loginModalRef = createRef();
    }

    componentDidMount() {
        if (this.loginModalRef.current) {
            this.loginModalRef.current.open();
        }
        this.handle = BackHandler.addEventListener('loaddingBack', this.onClose)
    }

    componentWillUnmount() {
        if (this.handle) {
            this.handle.remove();
        }
    }

    onClose() {
        Actions.pop();
        return true;
    }

    render() {
        return (
            <Modal ref={this.loginModalRef}
                   style={[{height: screenHeight, width: screenWidth, backgroundColor: "#F0000000"}]}
                   position={"center"}
                   backButtonClose={false}
                   swipeToClose={this.props.backExit}
                   backdropOpacity={0.8}>
                <View style={[styles.centered, {flex: 1}]}>
                    <View>
                        <Spinner style={[styles.centered]}
                                 isVisible={true}
                                 size={50} type="9CubeGrid"
                                 color="#FFFFFF"/>
                        <Text style={styles.normalTextWhite}>{this.props.text}</Text>
                    </View>
                </View>
            </Modal>
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
