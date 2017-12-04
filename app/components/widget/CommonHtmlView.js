import React, {Component} from 'react';
import HTMLView from 'react-native-htmlview';

class CommonHtmlView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <HTMLView
                {...this.props}
            />
        )
    }
}


export default CommonHtmlView