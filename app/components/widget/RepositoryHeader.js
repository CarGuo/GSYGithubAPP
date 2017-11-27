/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import * as Constant from '../../style/constant'
import styles from '../../style'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'
import UserImage from './UserImage'
import IconTextItem from './IconTextItem'
import HTMLView from 'react-native-htmlview';
import I18n from '../../style/i18n'

/**
 * 仓库相关Item显示
 */
class RepositoryHeader extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {
            ownerName,
            ownerPic,
            repositoryName,
            repositoryStar,
            repositoryFork,
            repositoryWatch,
            repositoryType,
            repositoryIsFork,
            repositoryDes,
            repositorySize,
            repositoryIssue,
            repositoryLastActivity,
            repositoryStared,
            repositoryForked,
            repositoryWatched,
            repositoryParentName,
            created_at,
            push_at,
        } = this.props;

        let bottomIconStyle = {
            backgroundColor: Constant.transparentColor,
            color: Constant.subTextColor, size: 15,
            iconStyle: {marginRight: 3}
        };

        let createStr = repositoryIsFork ? I18n("forked_at") + " " + repositoryParentName + '\n'
            : I18n("created_at") + " " + created_at + " ";

        let updateStr = I18n("latest_commit") + push_at;

        let infoText = createStr + ((push_at) ? updateStr : '');

        return (
            <View style={[{
                backgroundColor: Constant.white,
                marginTop: Constant.normalMarginEdge,
                marginHorizontal: Constant.normalMarginEdge,
                paddingHorizontal: Constant.normalMarginEdge,
                paddingTop: Constant.normalMarginEdge,
                borderRadius: 4,
            }, styles.shadowCard]}>
                <View style={[styles.flexDirectionRowNotFlex]}>
                    <Text style={[styles.normalTextLight, {fontWeight: "bold"}]}>{ownerName}</Text>
                    <Text style={[styles.normalTextLight, {fontWeight: "bold"}]}>{" / "}</Text>
                    <Text style={[styles.normalText, {fontWeight: "bold"}]}>{repositoryName}</Text>
                </View>
                <View style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge / 2}]}>
                    <Text style={{
                        color: Constant.subTextColor,
                        fontSize: Constant.minTextSize,
                        marginRight: Constant.normalMarginEdge
                    }}
                          numberOfLines={1}>
                        {repositoryType}
                    </Text>
                    <Text style={{color: Constant.subTextColor, fontSize: Constant.minTextSize}}
                          numberOfLines={1}>
                        {repositorySize}
                    </Text>
                </View>
                <HTMLView
                    style={{marginTop: Constant.normalMarginEdge / 2,}}
                    numberOfLines={100}
                    value={repositoryDes}
                    textComponentProps={{
                        style: styles.subSmallText,
                        numberOfLines: 100
                    }}
                    textComponent={() => {
                        return (
                            <Text/>
                        )
                    }}
                />
                <View style={[styles.flexDirectionRowNotFlex, {
                    justifyContent: "flex-end",
                    marginTop: Constant.normalMarginEdge,
                    marginBottom: Constant.normalMarginEdge,
                }]}>
                    <Text
                        style={{
                            color: Constant.primaryLightColor, fontSize: Constant.minTextSize,
                        }}
                        numberOfLines={2}>
                        {infoText}
                    </Text>
                </View>
                <View style={[styles.flexDirectionRowNotFlex, {
                    marginTop: Constant.normalMarginEdge / 2,
                    paddingVertical: Constant.normalMarginEdge / 2,
                    borderColor: Constant.lineColor, borderTopWidth: StyleSheet.hairlineWidth
                }]}>
                    <TouchableOpacity style={[styles.flex, styles.centered,]}>
                        <Icon.Button name="star-o" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText,]}>{repositoryStar}</Text>
                        </Icon.Button>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centered,
                        {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth}]}>
                        <Icon.Button name="code-fork" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText,]}>{repositoryFork}</Text>
                        </Icon.Button>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.flex, styles.centered,
                        {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth},
                        {borderColor: Constant.lineColor, borderRightWidth: StyleSheet.hairlineWidth}]}>
                        <IconC.Button name="eye" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText,]}>{repositoryWatch}</Text>
                        </IconC.Button>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centered,]}>
                        <IconC.Button name="issue-opened" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText,]}>{repositoryIssue}</Text>
                        </IconC.Button>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const propTypes = {
    ownerName: PropTypes.string,
    ownerPic: PropTypes.string,
    repositoryName: PropTypes.string,
    repositorySize: PropTypes.string,
    repositoryStar: PropTypes.string,
    repositoryFork: PropTypes.string,
    repositoryWatch: PropTypes.string,
    repositoryIssue: PropTypes.string,
    repositoryType: PropTypes.string,
    repositoryDes: PropTypes.string,
    repositoryLastActivity: PropTypes.string,
    repositoryStared: PropTypes.bool,
    repositoryForked: PropTypes.bool,
    repositoryWatched: PropTypes.bool,
    repositoryIsFork: PropTypes.bool,
    repositoryParentName: PropTypes.string,
    created_at: PropTypes.string,
    push_at: PropTypes.string,
};

RepositoryHeader.propTypes = propTypes;
RepositoryHeader.defaultProps = {
    repositoryDes: '---',
    repositoryStar: '---',
    repositorySize: '---',
    repositoryFork: '---',
    repositoryWatch: '---',
    repositoryType: '---',
    repositoryIssue: '---',
    repositoryLastActivity: '---',
    created_at: '---',
    repositoryParentName: '---',
    repositoryStared: false,
    repositoryForked: false,
    repositoryWatched: false,
    repositoryIsFork: false,
};


export default RepositoryHeader;