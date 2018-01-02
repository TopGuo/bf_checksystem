//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
    Switch,
    Button,
    Dimensions,
} from 'react-native';
import SwitchItem from './SwitchItem';

import CheckItemManager from '../../service/CheckItemManager';
import CheckResultManager from '../../service/CheckResultManager';

// create a component
class CheckDetailView extends Component {
    static navigationOptions = {
        title: '检查详情',
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
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            lastdata: this.props.navigation.state.params.lastdata,
            dataSource: dataSource.cloneWithRows([]),
            trueSwitchIsOn: true,
            selectItem: [],
        };
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
    }
    componentDidMount() {
        //填充数据
        CheckItemManager.getCheckItemInfoByRoomtype(this.props.navigation.state.params.lastdata.roomType, (result) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
            });
            this.result=result;
        });

    }
    //切换switch状态
    handleToggleComplete(checkID, checkResult) {
        let array = this.result.slice(0);
        let item = [];
        for (let i = 0; i < array.length; i++) {
            if (checkID === array[i].checkID) {
                array[i] = { ...array[i], checkResult: !array[i].checkResult };
            }
        }
        this.result = array;
        //筛选不合格的
        for (let i = 0; i < array.length; i++) {
            if (array[i].checkResult !== "true") {
                item.push(array[i]);
            }
        }
        //改变数据源 重新渲染数据
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.result),
            selectItem: item,
        });

    }
    render() {
        let { lastdata } = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <View style={styles.top1}>
                        <View style={styles.top2}>
                            <Text style={styles.topText}>检查类型：{lastdata.roomTypeName}</Text>
                        </View>
                        <View style={styles.top2}>
                            <Text style={styles.topText}>房间号：{lastdata.roomName}</Text>
                        </View>
                    </View>
                    <View style={styles.top1}>
                        <View style={styles.top2}>
                            <Text style={styles.topText}>辅导员：{lastdata.teacherName}</Text>
                        </View>
                        <View style={styles.top2}>
                            <Text style={styles.topText}>所属班级：{lastdata.className}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.checkDetail}><Text style={{fontSize:18,marginLeft: 180,color:"#fff",justifyContent:'center'}}>检查详情</Text></View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {
                        console.log("==========="+rowData);
                        return (
                            <SwitchItem
                                onComplete={() => { this.handleToggleComplete(rowData.checkID, rowData.checkResult) }}
                                {...rowData}
                            />

                        );
                    }}
                    enableEmptySections={true}
                />

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        //给checkResultManager发送保存
                        const subdata = {
                            room: this.state.lastdata,
                            checkItems: this.state.selectItem,
                            susubmit: false,
                            data: new Date().toLocaleDateString(),
                        };

                        CheckResultManager.proAddData(subdata, (result) => {
                            if (result) {
                                this.props.navigation.goBack();
                            }
                        });
                    }
                    }>

                    <Text style={styles.btntext}>保存</Text>
                </TouchableOpacity>

            </View>
        );
    }
}


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listview: {
        flex: 1,
        flexDirection: 'row',
        marginBottom:5,
    },
    touchableOpactity: {
        marginTop: 5,
        backgroundColor: "#3791ec",
        height: 30,
        flexDirection: "row",
    },
    btn: {
        backgroundColor: "#1aa7eb",
        borderRadius:15,
        paddingBottom: 10,
        paddingTop: 10,
        marginHorizontal: 10,
        marginBottom:20,


    },
    btntext: {
        color: "#f5f6f7",
        fontSize: 18,
        marginLeft: 180,

    },
    top: {
        flexDirection: 'column', height: 100, backgroundColor: "#dcdcdc",
    },
    top1: {
        height: 50,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
    },
    top2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topText: {
        color: "#27ccc0",
        fontSize: 18,
    },
    checkDetail: {
        height: 50,
        backgroundColor: "#1aa7eb",
        width: Dimensions.get('window').width,
        justifyContent:'center'
    }
});

//make this component available to the app
export default CheckDetailView;
