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
    StyleSheet,
    Platform
} from 'react-native';

import * as Constant from '../../style/constant'
import {Actions} from 'react-native-router-flux'
import styles from '../../style'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'
import UserImage from './UserImage'
import IconTextItem from './IconTextItem'
import HTMLView from '../common/CommonHtmlView';
import I18n from '../../style/i18n'
import TagGroup from "./TagGroup";

/**
 * 仓库相关Item显示
 */
class RepositoryHeader extends Component {
    constructor(props) {
        super(props)
        this.getOptionItem = this.getOptionItem.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }


    getOptionItem = () => {
        let {
            repositoryIssue,
            repositoryIssueClose,
            repositoryIssueAll,
        } = this.props;
        if (!repositoryIssue) {
            repositoryIssue = "---"
        }
        if (!repositoryIssueClose) {
            repositoryIssueClose = "---"
        }
        if (!repositoryIssueAll) {
            repositoryIssueAll = "---"
        }
        let data = [];
        let item1 = {
            itemName: "Open: " + repositoryIssue,
            itemClick: () => {
            }, itemStyle: {
                borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
            }
        };
        let item2 = {
            itemName: "Closed: " + repositoryIssueClose,
            itemClick: () => {
            }, itemStyle: {
                borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
            }
        };
        let item3 = {
            itemName: "All: " + repositoryIssueAll,
            itemClick: () => {
            }, itemStyle: {
                borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
            }
        };
        data.push(item1);
        data.push(item2);
        data.push(item3);
        return data;
    };


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
            repositoryParentName,
            created_at,
            push_at,
            topics,
            license
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
                    borderRadius: 4,
                }]}
                blurRadius={Platform.OS === 'ios' ? 14 : 5}
                source={{uri: (ownerPic) ? ownerPic : ""}}
                resizeMethod="scale">
                <View style={{
                    backgroundColor: Constant.primaryColor, opacity: 0.5,
                    padding: Constant.normalMarginEdge,
                    borderRadius: 4,
                }}>
                    <View style={[styles.flexDirectionRowNotFlex, {
                        backgroundColor: Constant.transparentColor,
                    }]}>
                        <TouchableOpacity
                            onPress={() => {
                                Actions.PersonPage({currentUser: ownerName})
                            }}>
                            <Text style={[styles.normalTextMitWhite, styles.shadowText, {fontWeight: "bold"}, {
                                backgroundColor: Constant.transparentColor,
                            }]}>{ownerName}</Text>
                        </TouchableOpacity>
                        <Text style={[styles.normalTextMitWhite, styles.shadowText, {fontWeight: "bold"}, {
                            backgroundColor: Constant.transparentColor,
                        }]}>{" / "}</Text>
                        <Text selectable={true}
                              style={[styles.normalTextMitWhite, styles.shadowText, {fontWeight: "bold"}, {
                                  backgroundColor: Constant.transparentColor,
                              }]}>{repositoryName}</Text>
                    </View>
                    <View style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge / 2}, {
                        backgroundColor: Constant.transparentColor,
                    }]}>
                        <Text style={[styles.shadowText, {
                            color: Constant.miWhite,
                            fontSize: Constant.minTextSize,
                            marginRight: Constant.normalMarginEdge,
                            backgroundColor: Constant.transparentColor,
                        }]}
                              numberOfLines={1}>
                            {repositoryType}
                        </Text>
                        <Text style={[styles.shadowText, {
                            color: Constant.miWhite, fontSize: Constant.minTextSize,
                            marginRight: Constant.normalMarginEdge,
                            backgroundColor: Constant.transparentColor,
                        }]}
                              numberOfLines={1}>
                            {repositorySize}
                        </Text>
                        <Text style={[styles.shadowText, {
                            color: Constant.miWhite, fontSize: Constant.minTextSize,
                            backgroundColor: Constant.transparentColor,
                        }]}
                              numberOfLines={1}>
                            {license}
                        </Text>
                    </View>
                    <HTMLView
                        style={[{
                            marginTop: Constant.normalMarginEdge / 2,
                            backgroundColor: Constant.transparentColor
                        }]}
                        numberOfLines={100}
                        value={repositoryDes}
                        textComponentProps={{
                            style: styles.miLightSmallText,
                            numberOfLines: 100,
                        }}
                        selectable={true}
                        textComponent={() => {
                            return (
                                <Text/>
                            )
                        }}
                    />
                    <TouchableOpacity
                        style={[styles.flexDirectionRowNotFlex, {
                            justifyContent: "flex-end",
                            marginTop: Constant.normalMarginEdge,
                            marginBottom: Constant.normalMarginEdge,
                            backgroundColor: Constant.transparentColor,
                        }]}
                        onPress={() => {
                            if (repositoryIsFork) {
                                let data = repositoryParentName.split("/");
                                Actions.RepositoryDetail({
                                    repositoryName: data[1], ownerName: data[0]
                                    , title: repositoryParentName
                                });
                            }
                        }}>
                        <Text
                            style={[styles.shadowText, {
                                color: repositoryIsFork ? Constant.actionBlue : Constant.white,
                                fontSize: Constant.minTextSize,
                                backgroundColor: Constant.transparentColor,
                            }]}
                            selectable={true}
                            numberOfLines={2}>
                            {infoText}
                        </Text>
                    </TouchableOpacity>
                    <View style={[styles.flexDirectionRowNotFlex, {
                        marginTop: Constant.normalMarginEdge / 2,
                        paddingVertical: Constant.normalMarginEdge / 2,
                        borderColor: Constant.lineColor, borderTopWidth: StyleSheet.hairlineWidth,
                        backgroundColor: Constant.transparentColor,
                    }]}>
                        <TouchableOpacity
                            style={[styles.flex, styles.centered, {paddingVertical: Constant.normalMarginEdge}]}>
                            <Icon name="star-o" {...bottomIconStyle}
                                  onPress={() => {
                                      Actions.ListPage({
                                          dataType: 'repo_star', showType: 'user',
                                          currentUser: this.props.ownerName,
                                          currentRepository: this.props.repositoryName,
                                          title: this.props.ownerName + "/" + this.props.repositoryName
                                      })
                                  }}>
                                <Text
                                    style={[styles.miLightSmallText, styles.shadowText,]}>{" " + repositoryStar}</Text>
                            </Icon>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flex, styles.centered,
                                {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth}
                                , {paddingVertical: Constant.normalMarginEdge}]}
                            onPress={() => {
                                Actions.ListPage({
                                    dataType: 'repo_fork', showType: 'repository',
                                    currentUser: this.props.ownerName,
                                    currentRepository: this.props.repositoryName,
                                    title: this.props.ownerName + "/" + this.props.repositoryName
                                })
                            }}>
                            <Icon name="code-fork" {...bottomIconStyle} >
                                <Text
                                    style={[styles.miLightSmallText, styles.shadowText,]}>{" " + repositoryFork}</Text>
                            </Icon>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.flex, styles.centered,
                                {borderColor: Constant.lineColor, borderLeftWidth: StyleSheet.hairlineWidth},
                                {borderColor: Constant.lineColor, borderRightWidth: StyleSheet.hairlineWidth}
                                , {paddingVertical: Constant.normalMarginEdge}]}
                            onPress={() => {
                                Actions.ListPage({
                                    dataType: 'repo_watcher', showType: 'user',
                                    currentUser: this.props.ownerName,
                                    currentRepository: this.props.repositoryName,
                                    title: this.props.ownerName + "/" + this.props.repositoryName
                                })
                            }}>
                            <IconC name="eye" {...bottomIconStyle}>
                                <Text
                                    style={[styles.miLightSmallText, styles.shadowText,]}>{" " + repositoryWatch}</Text>
                            </IconC>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flex, styles.centered, {paddingVertical: Constant.normalMarginEdge}]}
                            onPress={() => {
                                Actions.OptionModal({dataList: this.getOptionItem()});
                            }}>
                            <IconC name="issue-opened" {...bottomIconStyle}>
                                <Text
                                    style={[styles.miLightSmallText, styles.shadowText,]}>{" " + repositoryIssue}</Text>
                            </IconC>
                        </TouchableOpacity>
                    </View>
                    <TagGroup
                        tagList={topics}
                    />
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
    repositoryIssueClose: PropTypes.string,
    repositoryIssueAll: PropTypes.string,
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