import React, {
    Component,
} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style/index"
import * as Constant from "../../style/constant"


class TagGroup extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        if (!this.props.tagList || this.props.tagList.length === 0) {
            return <View/>
        }
        return (
            <View style={[styles.flexDirectionRow, {flexWrap: "wrap"}, this.props.groupStyle]}>
                {
                    this.props.tagList.map((data) => {
                        return (
                            <TouchableOpacity
                                key={"_" + data}
                                style={[styles.centered, {
                                    borderRadius: 4,
                                    height: 24,
                                    overflow: 'hidden',
                                    padding: Constant.normalMarginEdge,
                                    borderWidth: 1,
                                    borderColor: Constant.primaryColor,
                                    backgroundColor: Constant.white,
                                    marginVertical: Constant.normalMarginEdge / 2,
                                    marginRight: Constant.normalMarginEdge,
                                }]}>
                                <Text numberOfLines={1}
                                      style={[styles.centered, styles.smallText]}>
                                    {data}
                                </Text>
                            </TouchableOpacity>
                        )

                    })
                }
            </View>
        );
    }


}

TagGroup.propTypes = {
    groupStyle: PropTypes.any,
    tagList: PropTypes.array,
};

export default TagGroup;