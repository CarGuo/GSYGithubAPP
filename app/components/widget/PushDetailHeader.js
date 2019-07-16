/**
 * Created by guoshuyu on 2017/11/11.
 */
import React, {
    Component,
} from 'react'
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import TimeText from './TimeText'
import UserImage from './UserImage'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'
import resolveTime from '../../utils/timeUtil'


/**
 * Push详情Header
 */
class PushDetailHeader extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {actionUser, actionUserPic, pushTime, pushDes} = this.props;
        return (
            <View
                style={[{
                    marginTop: Constant.normalMarginEdge,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    paddingHorizontal: Constant.normalMarginEdge,
                    paddingTop: Constant.normalMarginEdge,
                    borderRadius: 4,
                }, styles.shadowCard, {backgroundColor: Constant.primaryColor}]}
                onPress={() => {
                    this.props.onPressItem && this.props.onPressItem();
                }}>
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    <UserImage uri={actionUserPic}
                               loginUser={actionUser}
                               resizeMethod="scale"
                               style={[{
                                   height: Constant.bigIconSize, width: Constant.bigIconSize,
                                   marginTop: 5,
                                   borderRadius: Constant.bigIconSize / 2
                               }]}/>
                    <View style={{flex: 1, marginLeft: Constant.normalMarginEdge}}>
                        <View
                            style={[styles.flexDirectionRowNotFlex, styles.centerH, {marginVertical: Constant.normalMarginEdge / 2}]}>
                            <Icon name={'edit'}
                                  backgroundColor={Constant.transparentColor}
                                  color={Constant.miWhite} size={13}
                                  style={styles.centerH}>
                                <Text style={[styles.miLightSmallText]}>
                                    {"  " + this.props.editCount + "  "}
                                </Text>
                            </Icon>
                            <IconC name={'diff-added'}
                                   backgroundColor={Constant.transparentColor}
                                   color={Constant.miWhite} size={13}
                                   style={styles.centerH}>
                                <Text style={[styles.miLightSmallText]}>
                                    {" " + this.props.addCount + "  "}
                                </Text>
                            </IconC>
                            <Icon name="minus-square-o"
                                  iconStyle={{marginRight: 3}}
                                  backgroundColor={Constant.transparentColor}
                                  color={Constant.miWhite} size={13}
                                  style={styles.centerH}>
                                <Text style={[styles.miLightSmallText]}>
                                    {"   " + this.props.deleteCount}
                                </Text>
                            </Icon>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {
                                marginBottom: Constant.normalMarginEdge,
                                marginTop: Constant.normalMarginEdge / 2
                            }]}>
                            <Text style={[styles.miLightSmallText,]}>{resolveTime(pushTime)}</Text>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {
                                marginBottom: Constant.normalMarginEdge
                            }]}>
                            <Text style={[styles.miLightSmallText,]}
                                  selectable={true}>{pushDes}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const propTypes = {
    actionUser: PropTypes.string,
    actionUserPic: PropTypes.string,
    pushDes: PropTypes.string,
    pushTime: PropTypes.string,
    editCount: PropTypes.string,
    addCount: PropTypes.string,
    deleteCount: PropTypes.string,
};

PushDetailHeader.propTypes = propTypes;

export default PushDetailHeader