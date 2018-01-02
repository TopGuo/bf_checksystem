//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

import {images} from '../../constant/img';
//定义事件接口
//edit
//isSelect
//选中事件
//selectItem(checkResultID)
//点击事件
//tapItem(checkResultID)
// create a component
class MainItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let source = null;
        let source1 = null;
        if (this.props.room.roomType === 1) {
            source1 = images.bed;
        } else {
            source1 = images.teachroom;//require('../../assets/icons/teachroom.png');
        }
        //this.state.isSelect
        if (this.props.isSelect) {
            source = images.select;//require('../../assets/icons/select.png')
        } else {
            source = images.unselect;//require('../../assets/icons/unselect.png')
        }
        let image = (
            <Image
                source={source}
            />
        );
        let imageDrom = (
            <Image source={source1} />
        );
        //字体颜色控制
        let sub=this.props.submit==='true'?'00bfff':'ffa500';
        let result=this.props.result==='true'?'00bfff':'ffa500';
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    if (this.props.edit == true) {
                        this.props.selectItem(this.props.id);
                    } else {
                        this.props.tapItem(this.props.id);
                    }
                }}
            >
                <View style={styles.left}>{this.props.edit ? image : null}</View>
                <View style={styles.left1}>
                    {imageDrom}
                    <View style={{marginLeft:10,}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.bigText}>{this.props.room.buildingName}</Text>
                            <Text style={styles.bigText}>{this.props.room.roomName}</Text>
                            <Text style={styles.bigText}>{this.props.room.roomTypeName}</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.smText}>检查日期</Text>
                            <Text style={styles.smText}>{this.props.date}</Text>
                        </View>
                    </View>

                </View>
                <View style={styles.right1}>
                    <Text style={{color:"#"+result+""}}>{this.props.result == 'true' ? '合格' : '不合格'}</Text>
                </View>
                <View style={styles.right}>
                    <Text style={{color:"#"+sub+""}}>{this.props.submit == 'true' ? '提交' : '未提交'}</Text>
                </View>
            </TouchableOpacity>

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
        alignItems: "flex-start",
        height: 50,

    },
    left: {
        flex: 1,
    },
    left1: {
        flex: 4,
        flexDirection: "row",
    },
    right: {
        flex: 2,
    },
    right1: {
        flex: 1,
    },
    bigText:{
        fontSize:18,
    },
    smText:{
        fontSize:14,
        color:"#d3d3d3"
    }
});

//make this component available to the app
export default MainItem;
