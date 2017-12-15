import React, {Component} from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import * as Constant from '../../style/constant'
import styles from '../../style'
import I18n from '../../style/i18n'

class SearchFilterSelectList extends Component {
    state: { dataSource: any };

    constructor(props: any) {
        super(props);

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => (r1 !== r2),
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.state = {
            dataSource: this.ds.cloneWithRowsAndSections(this.props.selectMap),
            selectIndex: this.props.selectIndex
        };

        this._renderRow = this._renderRow.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
    }

    _renderRow(data, sectionID, rowID) {
        return (
            <TouchableOpacity
                style={[{
                    height: 50,
                    flex: 1,
                    paddingHorizontal: Constant.normalMarginEdge,
                    marginTop: Constant.normalMarginEdge,
                    backgroundColor: (data.select) ? Constant.miWhite : Constant.transparentColor,
                    borderRadius: 4,
                    flexDirection: 'row',
                }, styles.centered]}
                onPress={() => {
                    let selectMap = this.props.selectMap;
                    let dataList = selectMap[sectionID];
                    dataList.forEach((data) => {
                        data.select = false;
                    });
                    dataList[rowID].select = true;
                    this.setState({
                        dataSource: this.ds.cloneWithRowsAndSections(selectMap),
                    });
                    this.props.onSelect && this.props.onSelect(sectionID, data.value);
                }}
            >
                <Text style={[(data.select)
                    ? styles.normalText : styles.subSmallText, {textAlign: 'center'}]}>{I18n(data.name)}</Text>
            </TouchableOpacity>
        );
    }

    _renderSectionHeader(data, sectionID) {
        return (
            <View style={{
                marginTop: Constant.normalMarginEdge,
                paddingLeft: Constant.normalMarginEdge,
                flex: 1,
                height: 40,
                backgroundColor: Constant.primaryLightColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.smallTextWhite}>{I18n(sectionID)}</Text>
            </View>
        )
    }

    render() {
        return (
            <ListView
                style={this.props.listStyle}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                renderSectionHeader={this._renderSectionHeader}
            />
        );
    }
}


const propTypes = {
    selectMap: PropTypes.any,
    selectIndex: PropTypes.any,
    listStyle: PropTypes.any,
    onSelect: PropTypes.func,
};

SearchFilterSelectList.propTypes = propTypes;

SearchFilterSelectList.defaultProps = {
    selectMap: {},
    selectIndex: {},
    listStyle: {},
};

export default SearchFilterSelectList;