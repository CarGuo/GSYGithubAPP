import React, {Component} from 'react';
import {
    View, Text, TouchableHighlight, StyleSheet
} from 'react-native';
import styles, {screenWidth} from "../../style"
import * as Constant from "../../style/constant"
import ModalDropdown from 'react-native-modal-dropdown';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons'

/**
 * 底部弹出框Item
 */
class BottomPopmenuItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            icon: 'md-arrow-dropdown'
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={[styles.flexDirectionRowNotFlex, styles.centerH, {
                backgroundColor: Constant.white,
                paddingHorizontal: 5
            }]}>
                <Icon name="tag"
                      borderRadius={0}
                      style={{borderRadius: 0, padding: 0, marginRight: 3, marginTop: 2}}
                      backgroundColor={Constant.white}
                      color={Constant.primaryColor} size={13}/>
                <ModalDropdown
                    options={this.props.options}
                    onSelect={(rowID, rowData) => {
                        this.props.onSelect && this.props.onSelect(rowID, rowData);
                        return true
                    }}
                    adjustFrame={this.props.adjustFrame}
                    defaultIndex={this.props.defaultIndex}
                    defaultValue={this.props.defaultValue}
                    style={[{
                        backgroundColor: Constant.transparentColor,
                    }, this.props.styles]}
                    textStyle={{
                        fontSize: 13,
                        width: 45,
                        color: Constant.mainTextColor,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }}
                    dropdownStyle={[{
                        width: screenWidth / 2,
                        borderColor: Constant.primaryColor,
                        borderWidth: 1,
                        borderRadius: 2,
                    }, this.props.dropdownStyle]}
                    renderRow={this.renderRow.bind(this)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                />
            </View>
        );
    }

    renderRow(rowData, rowID, highlighted) {
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View
                    style={[{
                        flexDirection: 'row',
                        flex: 1,
                        paddingHorizontal: Constant.normalMarginEdge,
                        height: this.props.itemHeight,
                    }, {backgroundColor: Constant.white}, styles.centerH]}>
                    <Text style={[styles.middleText, {
                        marginHorizontal: 4,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }, highlighted && {color: Constant.selectedColor}, styles.centered]}>
                        {rowData.name}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        let key = `spr_${rowID}`;
        return (
            <View style={{height: StyleSheet.hairlineWidth, backgroundColor: Constant.lineColor,}}
                  key={key}/>
        );
    }
}

BottomPopmenuItem.propTypes = {
    itemHeight: PropTypes.number,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,
    dropdownStyle: PropTypes.any,
    textStyle: PropTypes.any,
    adjustFrame: PropTypes.any,
    onSelect: PropTypes.func,
};


export default BottomPopmenuItem