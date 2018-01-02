/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, ActivityIndicator, StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {screenWidth, screenHeight} from "../style"
import ImageViewer from 'react-native-image-zoom-viewer'
import styles from "../style/index";
import * as Constant from "../style/constant";

/**
 * 大图查看
 */
class PhotoPage extends Component {

    constructor(props) {
        super(props);
        this.images = [];
        this.exit = false;
        this.images.push({url: this.props.uri});
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        let loading =
            <View style={[{
                position: 'absolute', top: 100, left: 100, right: 100, bottom: 100,
                flex: 1,
                justifyContent: "center",
                alignItems: "center", backgroundColor: Constant.transparentColor
            }, styles.centered]}>
                <ActivityIndicator
                    color={Constant.white}
                    animating={true}
                    style={[{height: 80}, styles.centered]}
                    size="large"/>
            </View>;
        return (
            <View style={[styles.mainBox, {backgroundColor: Constant.primaryColor}]}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ImageViewer imageUrls={this.images}
                             failImageSource={require("../img/default_img.png")}
                             style={{width: screenWidth, height: screenHeight}}
                             onClick={() => {
                                 if(this.exit)  {
                                     return
                                 }
                                 this.exit = true;
                                 Actions.pop();
                             }}
                             onSaveToCamera={()=>{

                             }}
                             loadingRender={() => {
                                 return loading
                             }}
                />
            </View>
        )
    }
}


export default PhotoPage