//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
} from 'react-native';

// create a component
class SwitchItem extends Component {

    render() {
        const { checkResult } = this.props;
        //定义一个组件显示文字
        const textComponent = (
            <TouchableOpacity style={styles.textWrap} >
                <Text style={[styles.text, checkResult && styles.complete]}>{this.props.checkName}</Text>
            </TouchableOpacity>
        );
        return (
            <View style={styles.container}>
                {textComponent}
                <Switch
                    value={this.props.checkResult=='true'||this.props.checkResult?true:false}
                    onValueChange={this.props.onComplete}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    textWrap: {
        flex: 1,
        marginHorizontal: 10
    },
    text: {
        fontSize: 24,
        color: "#4d4d4d"
    }
});

//make this component available to the app
export default SwitchItem;
