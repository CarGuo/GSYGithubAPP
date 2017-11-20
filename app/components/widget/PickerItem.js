import React, {Component} from 'react';
import {
    View, Text, TouchableHighlight, Image
} from 'react-native';
import styles from "../../style"
import * as Constant from "../../style/constant"
import * as Config from '../../config/'
import ModalDropdown from 'react-native-modal-dropdown';


class PickerItem extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            <ModalDropdown
                style={this.props.style}
                textStyle={this.props.textStyle}
                dropdownStyle={[...this.props.dropdownStyle]}
                options={this.props.options}
                onSelect={(rowID, rowData) => {
                    this.onSelect && this.onSelect(rowID, rowData);
                    return true
                }}
                defaultIndex={this.props.defaultIndex}
                defaultValue={this.props.defaultValue}
                renderRow={this.renderRow.bind(this)}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
            />
        );
    }

    renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View
                    style={[{
                        flexDirection: 'row',
                        flex: 1,
                        paddingHorizontal: Constant.normalMarginEdge,
                        height: 40,
                        alignItems: 'center',
                    }, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
                    <Text style={[{
                        marginHorizontal: 4,
                        fontSize: 16,
                        color: 'navy',
                        textAlignVertical: 'center',
                    }, highlighted && {color: 'mediumaquamarine'}]}>
                        {`${rowData.name}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID === this.props.options.length - 1) return;
        let key = `spr_${rowID}`;
        return (
            <View style={{height: 1, backgroundColor: 'cornflowerblue',}}
                  key={key}/>
        );
    }
}


export default PickerItem