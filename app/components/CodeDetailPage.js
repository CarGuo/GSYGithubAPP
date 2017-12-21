/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, StatusBar, InteractionManager, BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../style"
import I18n from '../style/i18n'
import reposActions from '../store/actions/repository'
import WebComponent from './widget/CustomWebComponent'
import {generateCode2HTml} from '../utils/htmlUtils'
import {Actions, Tabs} from 'react-native-router-flux';
import * as Constant from '../style/constant'

/**
 * 代码详情
 */
class CodeDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: this.props.detail
        };
        this._backHandler = this._backHandler.bind(this)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.props.needRequest) {
                reposActions.getReposFileDir(this.props.ownerName,
                    this.props.repositoryName, this.props.path, this.props.branch).then((res) => {
                        if (res && res.result) {
                            this.setState({
                                detail: generateCode2HTml(res.data, Constant.primaryColor),
                            })
                        } else {
                            this.setState({
                                detail: "<h1>" + I18n("fileNotSupport") + "</h1>",
                            })
                        }
                        setTimeout(() => {
                            if (this.refs.pullList) {
                                this.refs.pullList.refreshComplete(false);
                            }
                        }, 500);

                    }
                )
            }
            Actions.refresh({titleData: {html_url: this.props.html_url}})
        });
        this.handle = BackHandler.addEventListener('CodeDetailPage-hardwareBackPress', this._backHandler)
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('CodeDetailPage-hardwareBackPress', this.handle)
    }

    _backHandler() {
        Actions.pop();
        return true
    }

    render() {
        let {detail} = this.state;
        return (
            <View style={[styles.mainBox]}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <WebComponent
                    source={{html: detail}}/>
            </View>
        )
    }
}


CodeDetailPage.propTypes = {
    path: PropTypes.string,
    ownerName: PropTypes.string,
    repositoryName: PropTypes.string,
    title: PropTypes.string,
    branch: PropTypes.string,
    detail: PropTypes.string,
    needRequest: PropTypes.bool,
};


CodeDetailPage.defaultProps = {
    path: '',
    title: '',
    ownerName: '',
    repositoryName: '',
    branch: 'master',
    needRequest: true,
};

export default CodeDetailPage