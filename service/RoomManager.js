import { SQLite } from 'expo';
import {
    AsyncStorage,
} from 'react-native';
//获取Room数据 请求方式为get请求
import  * as API from '../constant/api';
import { API_ROOM } from '../constant/api';

/**
 * 组织架构
 * 学院 
 * 系
 * 班级
 * 教室
 * 宿舍
 * 老师
 * 检查员检查--宿舍/教室--检查项（合格与否/拍照）--
 * 
 */

/**
 * datalist =[{},{}
 * {
            roomID:1,
            roomName:'101',
            roomType:0,
            roomTypeName:'宿舍',
            buildingID:1,
            buildingName:'1号楼',
            className:'16移动应用开发',
            teacherName:'小李',
            state:'',//此字段非业务数据，只是标注当前数据处理状态'add','updata','delete'
        }
 */
class RoomManager {
    constructor() {
        //1,打开数据库（同步操作），获取dataBase对象
        this.db = SQLite.openDatabase('ap9');
        //2,创建数据流表
        this.db.transaction((tx) => {
            const sql = "CREATE TABLE 'main'.'room' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,'roomID' integer,'roomName' text,'roomType' integer,'roomTypeName' text,'buildingID' integer,'buildingName' text,'className' text,'teacherName' text,'state' text);"
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('创建表成功');
            }, (tx, error) => {
                //操作失败
                console.log('创建表失败');
            })
        })
        this._addRoomTable=this._addRoomTable.bind(this);
        this._deleteRoomTable=this._deleteRoomTable.bind(this);
        this._updateRoomTable=this._updateRoomTable.bind(this);
    }
    //添加表变化监听
    addTableChangeLisenter(lisenter) {
        this.lisenter = lisenter;
    }
    //callBack携带一个参数，todos
    //操作成功，todos里面存储所有的todo对象
    //操作失败，todos为null
    getRoomTable(callBack) {
        this.db.transaction((tx) => {
            const sql = "select * from room";
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
    _addRoomTable(todo) {
        this.db.transaction((tx) => {
            const sql = `insert into room(roomID,roomName,roomType,roomTypeName,buildingID,buildingName,className,teacherName,state) values(${todo.roomID},'${todo.roomName}',${todo.roomType},'${todo.roomTypeName}',${todo.buildingID},'${todo.buildingName}','${todo.className}','${todo.teacherName}','${todo.state}')`;
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('添加成功');
                // this.lisenter();
            }, (tx, error) => {
                //操作失败
                console.log('添加失败');
            })
        })
    }
    //更新数据
    _updateRoomTable(room) {
        this.db.transaction((tx) => {
            const sql1 = `update room set roomName=${room.roomName},roomType=${room.roomType},roomTypeName=${room.roomTypeName},buildingID=${room.buildingID},buildingName=${room.buildingName},className=${room.className},teacherName=${room.teacherName0},state=${room.state} where roomID = ${room.roomID}`;
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('更新成功');
                callBack(true);
                this.lisenter();
            }, (tx, error) => {
                //操作失败
                console.log('更新失败');
                callBack(false, sql);
            })
        })
    }

    //删除数据
    _deleteRoomTable(room, callBack) {
        this.db.transaction((tx) => {
            const sql = `delete from room where roomID = ${room.roomID}`;
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('删除成功');
                callBack(true);
                this.lisenter();
            }, (tx, error) => {
                //操作失败
                callBack(false, sql);
            })
        })
    }
    //批量删除 


    //连网拉去数据
    getRoomInfoToSqlite(callback) {
        //获取时间戳
        AsyncStorage.getItem('timespan', (error, timespan) => {
            if (error) {
                console.log('获取时间戳失败');
                return;
            }
            if (timespan == null) {
                timespan = '0';
            }
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'timespan':timespan,
            }
            fetch(API_ROOM, {
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
                    const datalist = jsonData.datalist;
                    //将数据写入数据库
                    for (let i = 0; i < datalist.length; i++) {
                        const room = datalist[i];
                        switch (room.state) {
                            case 'add':
                                let datalistone = datalist[i];
                                //这里不执行
                                this._addRoomTable(datalistone);
                                break;
                            case 'updata':
                                this._updateRoomTable(datalistone);
                                break;
                            case 'delete':
                                this._deleteRoomTable(datalistone);
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
    //通过房间类型 查询楼号 房间类型 查出对应房间类型的信息
    getRoomInfoByRoomType(roomType, callBack) {
        this.db.transaction((tx) => {
            const sql = "select distinct buildingName,buildingID,roomtype from room where roomType=" + roomType + "";
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
    //获取所有房间类别
    getRoomTypes(callBack) {
        this.db.transaction((tx) => {
            const sql = "select distinct roomType,roomTypeName from room";
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log(resultSet);
                console.log('查询表成功');
                callBack(resultSet.rows._array);
            }, (tx, error) => {
                //操作失败
                console.log('查询表失败');
            })
        })
    }
    //获取所有房间
    getRooms(roomType, buildingID, callBack) {
        this.db.transaction((tx) => {
            const sql = "select * from room where roomType=" + roomType + " and buildingID="+buildingID+"";
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
}

export default new RoomManager();