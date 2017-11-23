import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, ViewPropTypes, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'red',
    },
});

class DrawerFilter extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        sceneStyle: ViewPropTypes.style,
        title: PropTypes.string,
    }

    static contextTypes = {
        drawer: PropTypes.object,
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Drawer Content</Text>
                <TouchableOpacity onPress={()=>Actions.closeDrawer}>
                    <Text>Back</Text>
                </TouchableOpacity>
                <Text>Title: {this.props.title}</Text>
                {this.props.name === 'tab1_1' &&
                <Text onPress={Actions.tab_1_2}>next screen for tab1_1</Text>
                }
                {this.props.name === 'tab2_1' &&
                <Text onPress={Actions.tab_2_2}>next screen for tab2_1</Text>
                }
                <Text onPress={Actions.pop}>Back</Text>
                <Text onPress={Actions.tab_1}>Switch to tab1</Text>
                <Text onPress={Actions.tab_2}>Switch to tab2</Text>
                <Text onPress={Actions.tab_3}>Switch to tab3</Text>
                <Text onPress={Actions.tab_4}>Switch to tab4</Text>
                <Text onPress={() => {
                    Actions.tab_5({data: 'test!'});
                }}>Switch to tab5 with data</Text>
                <Text onPress={Actions.echo}>Push Clone Scene (EchoView)</Text>
            </View>
        );
    }
}

export default DrawerFilter;