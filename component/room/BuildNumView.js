//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableOpacity,
} from 'react-native';
import RoomManager from '../../service/RoomManager';

// create a component
class BuildNumView extends Component {
    static navigationOptions = {
        title: '楼号',
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
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            //第二个页面为第一个页面传值的问题this.props.navigation.state.params.name
            roomtype: this.props.navigation.state.params.roomtype,
            dataSource: dataSource.cloneWithRows([]),
        }
    }
    componentDidMount() {
        // //调用manager根据 房间类型 查出对应房间类型的信息
        RoomManager.getRoomInfoByRoomType(this.state.roomtype, (roominfo) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(roominfo),
            });
        });
    }
    render() {
        const { navigate, goBack, state } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {
                        return (
                            <View>
                                <TouchableOpacity
                                    style={styles.touchableOpactity}
                                    onPress={() => {
                                        //这里被迫返回是房间类型rowData.roomType
                                        console.log('楼号返回');
                                        console.log(rowData);
                                        state.params.callback(rowData);
                                        //跳回到上一个页面
                                        goBack();
                                    }}
                                >
                                    <Text>{rowData.buildingName}</Text>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#d3d3d3', height: 1 }}></View>
                            </View>
                        );
                    }}
                    enableEmptySections={true}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#fff",
    },
    touchableOpactity: {
        height: 50,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    }
});

//make this component available to the app
export default BuildNumView;
