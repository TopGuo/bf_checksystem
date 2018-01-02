//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';

// create a component
//isSelect 

//onEvent
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectAll: false,
            submit: false,
            delete: false,
            cancle: false,
        }
    }
    render() {
        let allSelectSource = null;
        let submitSource = null;
        let deleteSource = null;
        let cacleSource = null;
        if (this.state.selectAll) {
            allSelectSource = require('../../assets/icons/allselectsure.png');
        } else {
            allSelectSource = require('../../assets/icons/allselect.png');
        }
        if (this.state.submit) {
            submitSource = require('../../assets/icons/sumitsure.png');
        } else {
            submitSource = require('../../assets/icons/submit.png');
        }
        if (this.state.delete) {
            deleteSource = require('../../assets/icons/deletesure.png');
        } else {
            deleteSource = require('../../assets/icons/delete.png');
        }
        if (this.state.cancle) {
            cacleSource = require('../../assets/icons/allselectsure.png');
        } else {
            cacleSource = require('../../assets/icons/allselect.png');
        }
        //定义几个图片
        let allselect = (
            <Image source={allSelectSource} />
        );
        let sub = (
            <Image source={submitSource} />
        );
        let del = (
            <Image source={deleteSource} />
        );
        let cancel = (
            <Image source={cacleSource} />
        );
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.filter} onPress={() => {this.props.onEvent('all'); this.setState({ selectAll: !this.state.selectAll }); }}>
                    <Text>全选</Text>
                    {allselect}
                </TouchableOpacity>
                <TouchableOpacity style={styles.filter} onPress={() => {this.props.onEvent('sub'); this.setState({ submit: !this.state.submit }); }}>
                    <Text>提交</Text>
                    {sub}
                </TouchableOpacity>
                <TouchableOpacity style={styles.filter} onPress={() => {this.props.onEvent('del'); this.setState({ delete: !this.state.delete }); }}>
                    <Text>删除</Text>
                    {del}
                </TouchableOpacity>
                <TouchableOpacity style={styles.filter} onPress={() => { this.props.onEvent('exit'); this.setState({ cancle: !this.state.cancle }); }}>
                    <Text>取消</Text>
                    <Image source={require('../../assets/icons/allselect.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        marginHorizontal: 50,
        alignItems: "flex-end",
    },
    filter: {
        flexDirection: "row",
        flex: 1,
        height: 50,

    },
});

//make this component available to the app
export default Footer;
