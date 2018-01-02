//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
} from 'react-native';
import RoomManager from '../../service/RoomManager';
// create a component
class RoomNameView extends Component {
    static navigationOptions = {
        title: '房间号',
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
            roomtype: this.props.navigation.state.params.roomtype,
            buildingid: this.props.navigation.state.params.buildingid,
            dataSource: dataSource.cloneWithRows([]),
        }
    }
    componentDidMount() {
        //调用方法那到房间号
        RoomManager.getRooms(this.state.roomtype, this.state.buildingid, (result) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
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
                                        state.params.callback(rowData);
                                        goBack();
                                    }}
                                >
                                    <Text>{rowData.roomName}</Text>
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
export default RoomNameView;
