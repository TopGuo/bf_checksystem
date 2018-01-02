import { SQLite } from 'expo';
import {
    AsyncStorage,
} from 'react-native';
//获取检查项目

import { API_CHECKITEM } from '../constant/api';


class CheckItemManager {
    /**
     * {
            checkID:1,
            checkName:'地面卫生',checkID,checkName,roomType,sectionID,sectionName,state,checkResult
            roomType:0,
            sectionID:0,
            sectionName:'常规检查项',
            state:'',//此字段非业务数据，只是标注当前数据处理状态'add','updata','delete'
            checkResult:true,//每一项是否合格
        }
     */
    constructor() {
        //1,打开数据库（同步操作），获取dataBase对象
        this.db = SQLite.openDatabase('ap9');
        //2,创建数据流表
        this.db.transaction((tx) => {
            const sql = "CREATE TABLE 'main'.'checkitem' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,'checkID' integer,'checkName' text,'roomType' integer,'sectionID' integer,'sectionName' text,'state' text,'checkResult' text);"
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('创建表成功');
            }, (tx, error) => {
                //操作失败
                console.log('创建表失败');
            })
        })
        this._addCheckItemTable = this._addCheckItemTable.bind(this);
        this._deleteCheckItemTable = this._deleteCheckItemTable.bind(this);
        this._updataCheckItemTable = this._updataCheckItemTable.bind(this);
    }听
    addTableChangeLisenter(lisenter) {
        this.lisenter = lisenter;
    }
    //callBack携带一个参数，todos
    //操作成功，todos里面存储所有的todo对象
    //操作失败，todos为null
    getCheckItemTable(callBack) {
        this.db.transaction((tx) => {
            const sql = "select distinct checkID,checkName,roomType,sectionID,sectionName,state,checkResult from checkitem";//distinct
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('查询表成功');
                callBack(resultSet.rows._array);
            }, (tx, error) => {
                //操作失败
                console.log('查询表失败');
            })
        })
    }

    //添加数据
    _addCheckItemTable(todo) {
        this.db.transaction((tx) => {
            const sql = `insert into checkitem(checkID,checkName,roomType,sectionID,sectionName,state,checkResult) values('${todo.checkID}','${todo.checkName}','${todo.roomType}','${todo.sectionID}','${todo.sectionName}','${todo.state}','true')`;
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('添加成功');
                //this.lisenter();
            }, (tx, error) => {
                //操作失败
                console.log('添加失败');
            })
        })
    }

    _updataCheckItemTable(checkItem) {
        this.db.transaction((tx) => {
            const sql = `update checkitem set checkName='${checkItem.checkName}',roomType=${checkItem.roomType},sectionID=${checkItem.secsectionID},sectionName='${checkItem.sectionName}',checkResult='${true}' where checkID=${checkItem.checkID}`;

            tx.executeSql(sql, null, (tx, result) => {
                console.log('更新checkitem成功');
            }, (tx, error) => {
                console.log('更新checkitem失败' + error);
            })
        })
    }

    //删除数据
    _deleteCheckItemTable(id, callBack) {
        this.db.transaction((tx) => {
            const sql = `delete from checkitem where id = ${id}`;
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('删除成功');
                callBack(true);
                //this.lisenter();
            }, (tx, error) => {
                //操作失败
                callBack(false, sql);
            })
        })
    }
    //网络拉去出数据
    getCheckItemInfoToSqlite(callback) {
        AsyncStorage.getItem('timespan', (error, timespan) => {
            if (error) {
                console.log('获取时间戳失败');
                return;
            }
            if (timespan == null) {
                timespan = 0;

            }

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'timespan': timespan,
            }
            fetch(API_CHECKITEM, {
                method: 'GET',
                headers: headers,
            })
                .then((response) => response.json())
                .then((jsonData) => {
                    if (jsonData.success == false) {
                        callback(false, '系统错误');
                        return;
                    } else {
                        //保存时间戳
                        AsyncStorage.setItem('timespan', jsonData.timespan, (error) => {
                            if (error) {
                                console.log('保存时间戳错误');
                                return;
                            }
                            else {
                                console.log('存储时间戳成功！');
                            }
                        });
                    }
                    //返回成功
                    callback(true);
                    const datalist = jsonData.datalist;
                    //console.log(datalist);
                    //将数据写入数据库
                    for (let i = 0; i < datalist.length; i++) {
                        const room = datalist[i];
                        switch (room.state) {
                            case 'add':
                                let datalistone = datalist[i];
                                this._addCheckItemTable(datalistone);
                                break;
                            case 'updata':
                                this._updataCheckItemTable(datalistone);
                                break;
                            case 'delete':
                                this._deleteCheckItemTable(datalistone);
                                break;

                            default:
                                console.log('room.state 有问题');
                                break;
                        }
                    }

                })
                .catch((errro) => {
                    console.log(errro)
                })

        });

    }

    //通过 房间类型和楼号 查询检查项目
    getCheckItemInfoByRoomtype(roomType, callBack) {
        this.db.transaction((tx) => {
            const sql = "select distinct checkID,checkName,roomType,sectionID,sectionName,state,checkResult from checkitem where roomType=" + roomType + "";
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                callBack(resultSet.rows._array);
            }, (tx, error) => {
                //操作失败
                console.log('查询表失败');
            })
        })
    }
}

export default new CheckItemManager();