import React , {Component} from 'react';

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


