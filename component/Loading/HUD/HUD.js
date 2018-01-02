/**
 * Created by zhou on 16/5/28.
 * npm install react-native-root-siblings --save
 */
import React, {Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    Easing
} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

import RootSiblings from 'react-native-root-siblings';

let loadingView = null;
let timer = null;
let rotationAnim = new Animated.Value(0);

function _initializeRotationAnimation() {
    rotationAnim.setValue(0);

    Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
    }).start(() => {
        if (loadingView) {
            _initializeRotationAnimation();
        }
    });
}

/**
 * 弹出HUDLoading 挡住下面的控件交互
 */
export function showHUDLoading() {
    const hud = (
        <View style={styles.maskView}>
            <View style={[styles.iconContainer, styles.shadowStyle]}>
                <Animated.Image
                    style={styles.iconStyle}
                    source={require('./loading.png')}/>
            </View>
        </View>
    );

    if (timer) {
        clearTimeout(timer);
    }

    if (loadingView) {
        loadingView.update(hud);
    }
    else {
        loadingView = new RootSiblings(hud);
    }

    _initializeRotationAnimation();
}

/**
 * 隐藏HUD
 */
export function hidenHUDLoading() {
    if (loadingView) {
        loadingView.destroy();
        loadingView = null;
    }
}

export function showHUDMessage(message) {
    if (typeof message !== 'string') {
        return;
    }

    const hud = (
        <View style={styles.maskView}>
            <View style={[styles.textContainer, styles.shadowStyle]}>
                <Text style={styles.textStyle}>{message}</Text>
            </View>
        </View>
    );

    if (timer) {
        clearTimeout(timer);
    }

    if (loadingView) {
        loadingView.update(hud);
    }
    else {
        loadingView = new RootSiblings(hud);
    }

    timer = setTimeout(() => hidenHUDLoading(), 2500);
}


const styles = StyleSheet.create({
    maskView: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 0.1 * WINDOW_WIDTH,
        backgroundColor: 'rgba(20,20,20,0.9)',
        borderRadius: 6
    },
    shadowStyle: {
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.7,
        shadowRadius: 6
    },
    textStyle: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.5,
        lineHeight: 18
    },
    iconContainer: {
        padding: 15,
        backgroundColor: 'rgba(20,20,20,0.9)',
        borderRadius: 6
    },
    iconStyle: {
        width: 48,
        height: 48,
        tintColor: '#fff',
        transform: [{
            rotate: rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            })
        }]
    }
});