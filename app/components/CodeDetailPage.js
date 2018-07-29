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
import {generateCode2HTml, formName, generateHtml, launchUrl} from '../utils/htmlUtils'
import {Actions} from 'react-native-router-flux';
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
        this._BackHandler = this._BackHandler.bind(this)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.props.needRequest) {
                reposActions.getReposFileDir(this.props.ownerName,
                    this.props.repositoryName, this.props.path, this.props.branch, this.props.textStyle).then((res) => {
                        if (res && res.result) {
                            let startTag = `class="instapaper_body `;
                            let startLang = res.data.indexOf(startTag);
                            let endLang = res.data.indexOf(`" data-path="`);
                            let lang;
                            if (startLang >= 0 && endLang >= 0) {
                                let tmpLang = res.data.substring(startLang + startTag.length, endLang);
                                if (tmpLang) {
                                    lang = formName(tmpLang.toLowerCase());
                                }
                            }
                            if (__DEV__) {
                                console.log("Code Lang ", lang)
                            }
                            if (!lang) {
                                lang = this.props.lang
                            }
                            if ('markdown' === lang) {
                                this.setState({
                                    detail: generateHtml(res.data)
                                })
                            } else {
                                this.setState({
                                    detail: generateCode2HTml(res.data, Constant.webDraculaBackgroundColor, lang),
                                })
                            }
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
        this.handle = BackHandler.addEventListener('CodeDetailPage-hardwareBackPress', this._BackHandler)
    }


    componentWillUnmount() {
        if (this.handle) {
            this.handle.remove();
        }
    }

    _BackHandler() {
        Actions.pop();
        return true
    }

    render() {
        let {detail} = this.state;
        return (
            <View style={[styles.mainBox]}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <WebComponent
                    gsygithubLink={(url) => {
                        if (url) {
                            let owner = this.props.ownerName;
                            let repo = this.props.repositoryName;
                            let branch = this.props.branch ? this.props.branch : "master";
                            let currentPath = url.replace("gsygithub://.", "").replace("gsygithub://", "/");
                            let fixedUrl = "https://github.com/" + owner + "/" + repo + "/blob/" + branch + currentPath;
                            launchUrl(fixedUrl);
                        }
                    }}
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
    lang: PropTypes.string,
    textStyle: PropTypes.bool,
};


CodeDetailPage.defaultProps = {
    path: '',
    title: '',
    ownerName: '',
    repositoryName: '',
    branch: 'master',
    needRequest: true,
    textStyle: false,
    lang: 'java',
};

export default CodeDetailPage