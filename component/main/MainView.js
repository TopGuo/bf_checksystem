//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,
    Dimensions,
    ListView,
    Image,
    ToastAndroid,
} from 'react-native';
import PubSub from 'pubsub-js';

import CheckResultManager from '../../service/CheckResultManager';
import AddCheckRecordView from './AddCheckRecordView';
import MainItem from './MainItem';
import Footer from '../Footer/Footer';
import HeaderTopView from '../Header/HeaderTopView';


// create a component
//1 宿舍卫生
//2 教室卫生
class MainView extends Component {

    static navigationOptions = {
        title: '检查列表',
        headerStyle: ({
            backgroundColor: "#0EABE8",
            elevation: 0,
        }),
        headerTitleStyle: ({
            alignSelf: 'center'
        }),
        headerTintColor: '#fff',
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    PubSub.publish('Add');
                }}
            >
                <Image style={{ width: 30, height: 30, marginRight: 10 }}
                    source={require('../../assets/icons/add.png')} />
            </TouchableOpacity>
        ),
        headerLeft: (
            <TouchableOpacity
                onPress={() => {
                    PubSub.publish('Edit');
                }}>
                <Text style={{ fontSize: 18, color: '#fff' }}>编辑</Text>
            </TouchableOpacity>
        ),


    }
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            roomTypeId: 1,
            edit: false,
            selectSub: [],
        }
        this.handleEvent = this.handleEvent.bind(this);
        this._getCheckResults = this._getCheckResults.bind(this);

    }
    componentDidMount() {
        PubSub.subscribe('Add', () => {
            this.props.navigation.navigate('AddCheckRecordView');
        });
        PubSub.subscribe('Edit', () => {
            this.setState({
                edit: !this.state.edit,
            });
        });
        this._getCheckResults(this.state.roomTypeId);
        //添加数据监听
        CheckResultManager.addListener(() => {
            this._getCheckResults(this.state.roomTypeId);
        });
    }

    render() {
        //判断底部是否显示
        const footer = <Footer
            onEvent={this.handleEvent}
            isSelect={this.state.isSelect}
        />
        return (
            <View style={styles.container}>
                <HeaderTopView
                    onEvent={(key) => {
                        this.setState({ roomTypeId: key});
                        this._getCheckResults(this.state.roomTypeId);

                    }}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {
                        return (
                            <MainItem
                                {...rowData}
                                edit={this.state.edit}
                                isSelect={rowData.isSelect}
                                selectItem={(id) => {
                                    this._editSelectItem(id);

                                }}
                                tapItem={(id) => {
                                    //直接点击 进入详细页面
                                    this._tapItem(id);
                                }}
                            />
                        );
                    }}
                    enableEmptySections={true}
                />
                {this.state.edit ? footer : null}

            </View>
        );
    }
    //不点编辑
    _tapItem(id) {
        this.result.map((value, key) => {
            if (value.id === id) {
                if (value.submit==='true') {
                    ToastAndroid.show('已经提交，不能做出修改',ToastAndroid.SHORT);
                    return;
                }
                console.log('=============valuevalue=======================');
                console.log(value);
                console.log('====================================');
                this.props.navigation.navigate('CheckDetail', {
                    lastdata: value.room,
                });
                return;
            }
        });
    }
    //点击编辑
    _editSelectItem(id) {
        //深复制
        this.result = JSON.parse(JSON.stringify(this.result));
        //遍历
        this.result.map((value, index) => {
            if (value.id == id) {
                value.isSelect = !value.isSelect
            }
            return value;
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.result),
        })
        //点击编辑后可以进行修改
    }
    //处理检查结果数据
    _getCheckResults(roomTypeId) {
        CheckResultManager.getCheckResults(this.state.roomTypeId, (result, error) => {
            if (result == null) {
                console.log(error);
                return;
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
            });
            //赋值改变 下面需要改变它
            this.result = result;
        });
    }
    //处理删除
    _delete() {
        const selectCheckResultIDs = [];
        this.result = JSON.parse(JSON.stringify(this.result));
        this.result.map((value, index) => {
            if (value.isSelect) {
                selectCheckResultIDs.push(value.id);
            }
            return value;
        });
        CheckResultManager.deleteCheckResult(selectCheckResultIDs, (result, error) => {
            if (result) {
                console.log('====================================');
                console.log('删除ok');
                console.log('====================================');
            } else {
                console.log('====================================');
                console.log('删除失败' + error);
                console.log('====================================');
            }
        });
    };
    //处理提交
    _submit() {
        //复杂问题简单化
        const selectCheckResultIDs = [];
        this.result = JSON.parse(JSON.stringify(this.result));
        this.result.map((value, index) => {
            if (value.isSelect) {
                selectCheckResultIDs.push(value.id);
            }
            return value;
        });
        alert('假数据，点击提交');
        // //点击提交
        // CheckResultManager.postCheckResults(selectCheckResultIDs, (result, error) => {
        //     if (result === true) {
        //         console.log('====================================');
        //         console.log('提交成功');
        //         console.log('====================================');
        //     }
        //     else {
        //         console.log('====================================');
        //         console.log('提交失败' + error);
        //         console.log('====================================');
        //     }
        // });
    }
    //处理全选
    _all() {
        //深复制
        this.result = JSON.parse(JSON.stringify(this.result));
        //遍历
        this.result.map((value, index) => {
            //处理全选和取消全选
            if (!value.isSelect) {
                value.isSelect = true;
            }
            return value;
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.result),
        })
    }
    //处理事件
    handleEvent(event) {
        switch (event) {
            case 'exit':
                this.setState({ edit: false, });
                break;
            case 'del':
                this._delete();
                break;
            case 'sub':
                this._submit();//提交
                break;
            case 'all':
                this._all();
                break;
            default:
                console.log('====================================');
                console.log('没有对应的event' + event);
                console.log('====================================');
                break;
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    top: {
        height: 60,
        width: Dimensions.get('window').width,
        flexDirection: 'row',

    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    left: {
        fontSize: 15,
        color: '#00a0e9',
    },
    right: {
        fontSize: 15,
        color: '#2c2c2c',
    },
});

//make this component available to the app
export default MainView;
