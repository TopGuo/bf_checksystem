//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';

import RoomTypeView from '../room/RoomTypeView';
import RoomNameView from '../room/RoomNameView';
import BuildNumView from '../room/BuildNumView';
// create a component
class AddCheckRecordView extends Component {
    static navigationOptions = {
        title: '添加',
        headerStyle: ({
            backgroundColor: "#0EABE8",
            elevation: 0,
        }),
        headerTitleStyle: ({
            alignSelf: 'center'
        }),
        headerTintColor: '#fff',
    }
    constructor(props) {
        super(props);
        this.state = {
            roomtype: '请选择>',
            buildnum: '请选择>',
            roomname: '请选择>',
            buildingid: '',
            lastdata: '',
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.touchableOpactity}
                    onPress={() => {
                        this.props.navigation.navigate('RoomTypeView', {
                            callback: (data) => {
                                this.setState({
                                    roomtype: data,
                                });
                            }
                        });
                    }}
                >
                    <Text style={styles.leftText}>房间类型</Text><Text style={styles.rightText}>{this.state.roomtype == 1 ? '宿舍' : this.state.roomtype == 2 ? '教室' : '请选择>'}</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:'#d3d3d3',height:1}}></View>
                <TouchableOpacity
                    style={styles.touchableOpactity}
                    onPress={() => {
                        if (this.state.roomtype==='请选择') {
                            ToastAndroid.show('请先选择房间类型！',ToastAndroid.SHORT);
                            return;
                        }
                        this.props.navigation.navigate('BuildNumView', {
                            callback: (data) => {
                                this.setState({
                                    buildnum: data.buildingName,
                                    buildingid: data.buildingID,
                                    roomtype: data.roomType,
                                });
                            },
                            roomtype: this.state.roomtype,

                        });
                    }}
                >
                    <Text style={styles.leftText}>楼号</Text><Text style={styles.rightText}>{this.state.buildnum}</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:'#d3d3d3',height:1}}></View>
                <TouchableOpacity
                    style={styles.touchableOpactity}
                    onPress={() => {
                        if (this.state.buildnum==='请选择') {
                            ToastAndroid.show('请先选楼号！',ToastAndroid.SHORT);
                            return;
                        }
                        this.props.navigation.navigate('RoomNameView', {
                            callback: (data) => {
                                this.setState({
                                    roomname: data.roomName,
                                    //最后一次赋值data 最新
                                    lastdata: data,
                                });
                            },
                            roomtype: this.state.roomtype,
                            buildingid: this.state.buildingid,
                        });
                    }}
                >
                    <Text style={styles.leftText}>房间号</Text><Text style={styles.rightText}>{this.state.roomname}</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:'#d3d3d3',height:1}}></View>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        // if (this.state.roomtype==='请选择') {
                        //     ToastAndroid.show('请先选择房间类型！',ToastAndroid.SHORT);
                        //     return;
                        // }
                        this.props.navigation.navigate('CheckDetailView', {
                            lastdata: this.state.lastdata,
                        },
                        );
                    }
                    }
                >
                    <Text style={styles.btntext}>开始检查</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#fff",
    },
    touchableOpactity: {
        height:50,
        flexDirection: "row",
        alignItems:'center',
        justifyContent:'space-between',
        marginHorizontal:10,
    },
    btn: {
        backgroundColor: "#1aa7eb",
        borderRadius: 15,
        marginHorizontal: 10,
        marginTop:50,
        paddingTop: 10,
        paddingBottom: 10,

    },
    btntext: {
        color: "#f5f6f7",
        fontSize: 18,
        marginLeft: 180,

    },
    leftText:{
        fontSize:18,
    },
    rightText:{
        fontSize:16,
    }
});

//make this component available to the app
export default AddCheckRecordView;
