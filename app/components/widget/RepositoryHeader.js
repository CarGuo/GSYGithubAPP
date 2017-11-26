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
            color: Constant.subTextColor, size: Constant.minIconSize,
            marginTop: Constant.normalMarginEdge / 2,
            marginLeft: -Constant.normalMarginEdge / 2
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
                    <IconTextItem
                        iconColor={Constant.subLightTextColor}
                        text={ownerName} icon={'user'}
                        textstyle={[styles.normalTextLight]}/>
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
                <View style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge}]}>
                    <TouchableOpacity style={[styles.flex, styles.centered,]}>
                        <Icon name="star-o" {...bottomIconStyle}/>
                        <Text style={[styles.subSmallText, {marginTop: 3}]}>{repositoryStar}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centered,
                        {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth}]}>
                        <Icon name="code-fork" {...bottomIconStyle}/>
                        <Text style={[styles.subSmallText, {marginTop: 3}]}>{repositoryFork}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.flex, styles.centered,
                        {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth},
                        {borderColor: Constant.lineColor, borderRightWidth: StyleSheet.hairlineWidth}]}>
                        <IconC name="eye" {...bottomIconStyle}/>
                        <Text style={[styles.subSmallText, {marginTop: 3}]}>{repositoryWatch}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centered,]}>
                        <IconC name="issue-opened" {...bottomIconStyle}/>
                        <Text style={[styles.subSmallText, {marginTop: 3}]}>{repositoryIssue}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.flexDirectionRowNotFlex, {
                    justifyContent: "flex-end"
                }]}>
                    <Text
                        style={{
                            color: Constant.primaryLightColor, fontSize: Constant.minTextSize,
                            marginVertical: Constant.normalMarginEdge
                        }}
                        numberOfLines={2}>
                        {infoText}
                    </Text>
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