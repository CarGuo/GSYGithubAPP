/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, TextInput, InteractionManager, Keyboard, TouchableOpacity, StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import CodeFileItem from './widget/CodeFileItem'
import reposActions from '../store/actions/repository'
import PullListView from './widget/PullLoadMoreListView'
import WebComponent from './widget/WebComponent'
import * as Config from '../config/'
import {generateMd2Html} from '../utils/htmlUtils'


class CodeDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            html: {}
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            reposActions.getReposFileDir(this.props.ownerName,
                this.props.repositoryName, this.props.path).then((res) => {
                    if (res && res.result) {
                        this.setState({
                            detail: generateMd2Html(res.data, this.props.ownerName,
                                this.props.repositoryName, this.props.branch, false),
                        })
                    }
                    setTimeout(() => {
                        if (this.refs.pullList) {
                            this.refs.pullList.refreshComplete(false);
                        }
                    }, 500);

                }
            )
        })
    }

    componentWillUnmount() {

    }


    render() {
        let {detail} = this.state;
        return (
            <View style={styles.mainBox}>
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
};


CodeDetailPage.defaultProps = {
    path: '',
    title: '',
    ownerName: '',
    repositoryName: '',
    branch: 'master',
};

export default CodeDetailPage