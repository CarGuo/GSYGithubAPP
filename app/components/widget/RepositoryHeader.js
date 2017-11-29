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
    ImageBackground,
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
            color: Constant.miWhite, size: 15,
        };

        let createStr = repositoryIsFork ? I18n("forked_at") + " " + repositoryParentName + '\n'
            : I18n("created_at") + " " + created_at + " ";

        let updateStr = I18n("latest_commit") + push_at;

        let infoText = createStr + ((push_at) ? updateStr : '');

        return (
            <ImageBackground
                style={[styles.shadowCard, {
                    backgroundColor: Constant.primaryColor,
                    marginTop: Constant.normalMarginEdge,
                    marginHorizontal: Constant.normalMarginEdge,
                    paddingHorizontal: Constant.normalMarginEdge,
                    paddingTop: Constant.normalMarginEdge,
                    borderRadius: 4,
                }]}
                blurRadius={14}
                source={{uri: (ownerPic) ? ownerPic : ""}}
                resizeMethod="scale">
                <View style={[styles.flexDirectionRowNotFlex, {
                    backgroundColor: Constant.transparentColor,
                }]}>
                    <Text style={[styles.normalTextMitWhite, {fontWeight: "bold"}, {
                        backgroundColor: Constant.transparentColor,
                    }]}>{ownerName}</Text>
                    <Text style={[styles.normalTextMitWhite, {fontWeight: "bold"}, {
                        backgroundColor: Constant.transparentColor,
                    }]}>{" / "}</Text>
                    <Text style={[styles.normalTextMitWhite, {fontWeight: "bold"}, {
                        backgroundColor: Constant.transparentColor,
                    }]}>{repositoryName}</Text>
                </View>
                <View style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge / 2}, {
                    backgroundColor: Constant.transparentColor,
                }]}>
                    <Text style={{
                        color: Constant.miWhite,
                        fontSize: Constant.minTextSize,
                        marginRight: Constant.normalMarginEdge,
                        backgroundColor: Constant.transparentColor,
                    }}
                          numberOfLines={1}>
                        {repositoryType}
                    </Text>
                    <Text style={{
                        color: Constant.miWhite, fontSize: Constant.minTextSize,
                        backgroundColor: Constant.transparentColor,
                    }}
                          numberOfLines={1}>
                        {repositorySize}
                    </Text>
                </View>
                <HTMLView
                    style={{
                        marginTop: Constant.normalMarginEdge / 2,
                        backgroundColor: Constant.transparentColor,
                    }}
                    numberOfLines={100}
                    value={repositoryDes}
                    textComponentProps={{
                        style: styles.miLightSmallText,
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
                    backgroundColor: Constant.transparentColor,
                }]}>
                    <Text
                        style={{
                            color: Constant.white, fontSize: Constant.minTextSize,
                            backgroundColor: Constant.transparentColor,
                        }}
                        numberOfLines={2}>
                        {infoText}
                    </Text>
                </View>
                <View style={[styles.flexDirectionRowNotFlex, {
                    marginTop: Constant.normalMarginEdge / 2,
                    paddingVertical: Constant.normalMarginEdge / 2,
                    borderColor: Constant.lineColor, borderTopWidth: StyleSheet.hairlineWidth,
                    backgroundColor: Constant.transparentColor,
                }]}>
                    <TouchableOpacity
                        style={[styles.flex, styles.centered, {paddingVertical: Constant.normalMarginEdge}]}>
                        <Icon name="star-o" {...bottomIconStyle}>
                            <Text style={[styles.miLightSmallText,]}>{" " + repositoryStar}</Text>
                        </Icon>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centered,
                        {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth}
                        , {paddingVertical: Constant.normalMarginEdge}]}>
                        <Icon name="code-fork" {...bottomIconStyle} >
                            <Text style={[styles.miLightSmallText,]}>{" " + repositoryFork}</Text>
                        </Icon>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.flex, styles.centered,
                        {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth},
                        {borderColor: Constant.lineColor, borderRightWidth: StyleSheet.hairlineWidth}
                        , {paddingVertical: Constant.normalMarginEdge}]}>
                        <IconC name="eye" {...bottomIconStyle}>
                            <Text style={[styles.miLightSmallText,]}>{" " + repositoryWatch}</Text>
                        </IconC>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.flex, styles.centered, {paddingVertical: Constant.normalMarginEdge}]}>
                        <IconC name="issue-opened" {...bottomIconStyle}>
                            <Text style={[styles.miLightSmallText,]}>{" " + repositoryIssue}</Text>
                        </IconC>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
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