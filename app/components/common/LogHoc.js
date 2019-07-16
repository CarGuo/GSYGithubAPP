import React, {
    Component, useReducer, useRef, useImperativeHandle, forwardRef
} from 'react';

import {
    Text,
    Image,
    View,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

export function logHoc(WrappedComponent) {

    return class extends Component {

        componentWillMount() {
            this.start = Date.now();
            this.displayName = this.getDisplayName(this);
        }

        componentDidMount() {
            this.end = Date.now();
            if (__DEV__) {
                console.log(this.props)
                console.log(`logHoc ${this.displayName} 渲染时间：${this.end - this.start} ms`);
            }
        }

        componentWillUnmount() {
            if (__DEV__) {
                console.log(`logHoc 退出${this.displayName}`);
            }
        }

        getDisplayName(WrappedComponent) {
            return WrappedComponent.displayName || WrappedComponent.props.name || 'Component';
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
}


/**
 *
 * React Hooks 实现 reducer Demo
 *
 **/

const initialState = {count: 0};

function reducer(state, action) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            // A reducer must always return a valid state.
            // Alternatively you can throw an error if an invalid action is dispatched.
            return state;
    }
}

export function DemoCounter({initialCount}) {
    const [state, dispatch] = useReducer(reducer, {count: initialCount});
    return (
        <View>
            <Text>Count: {state.count}</Text>
            <TouchableOpacity onPress={() => dispatch({type: 'reset'})}>
                <Text>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch({type: 'increment'})}>
                <Text>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch({type: 'decrement'})}>
                <Text>-</Text>
            </TouchableOpacity>
        </View>
    )
}





