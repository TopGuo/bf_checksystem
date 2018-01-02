import { SQLite } from 'expo';
import {
    AsyncStorage,
} from 'react-native';
//获取检查项目
import  {API_CHECKRECORD} from '../constant/api';

/**
 * 请求结果对象说明
{
    room:{
        roomID:1,
    },
    checkItems:[
        {
            checkID:1,
            checkState:true,
            checkImage:'base64格式的图片',//可选字段
        },
        ...
    ],
    result:true,//最终的结果
    date:'时间字符串，格式为YYYY-MM-DD'
}

{"room":{
    "id":4,
    "roomID":33,
    "roomName":"102",
    "roomType":1,
    "roomTypeName":"宿舍",
    "buildingID":0,
    "buildingName":"1号楼",
    "className":"1班",
    "teacherName":"1",
    "state":"add"
},
"checkItems":[{id,checkID,checkName,roomType,sectionID,sectionName,state,checkResult
    "id":4,
    "checkID":22,
    "checkName":"桌面",
    "roomType":1,
    "sectionID":1,
    "sectionName":"卫生情况",
    "state":"add",
    "checkResult":false
},{
    "id":5,
    "checkID":23,
    "checkName":"阳台",
    "roomType":1,
    "sectionID":1,
    "sectionName":"卫生情况",
    "state":"add",
    "checkResult":false
}],
    "susubmit":false,
    "result":true,
    "data":1498278325887
}
 */
class CheckResultManager {

    constructor() {
        //1,打开数据库（同步操作），获取dataBase对象
        this.db = SQLite.openDatabase('ap9');
        //2,创建数据流表
        this.db.transaction((tx) => {
            const sql = "CREATE TABLE 'main'.'checkRestult' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,'room' text,'checkItems' text,'result' text,'submit' text,'date' text);";
            //const sql = "CREATE TABLE 'main'.'checkRestult' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,'roomID' integer,'checkID' integer,'checkState' integer,'result' integer,'date' text,);"
            tx.executeSql(sql, null, (tx, resultSet) => {
                //操作成功
                console.log('创建表成功');
            }, (tx, error) => {
                //操作失败
                console.log('创建表失败');
            })
        });
        this.addCheckResult = this.addCheckResult.bind(this);
    }

    //处理添加过来的数据
    proAddData(data, callback) {
        let result = true;
        //拼接对象
        if (data.checkItems.length >= 3) {
            result = false;
        }
        const subdata = {
            room: data.room,
            checkItems: data.checkItems,
            susubmit: data.susubmit,
            result: result,
            data: data.data,
        };
        this.addCheckResult(subdata);
        callback(true);
    }

    //添加检查结果
    addCheckResult(checkResult) {
        this.db.transaction((tx) => {
            const roomJSON = JSON.stringify(checkResult.room);
            const checkItems = JSON.stringify(checkResult.checkItems);
            const sql = `insert into checkRestult(room,checkItems,result,submit,date) values('${roomJSON}','${checkItems}','${checkResult.result}','${checkResult.susubmit}','${checkResult.data}')`;
            tx.executeSql(sql, null, (tx, result) => {
                if (this.listener) {
                    this.listener();
                }
                console.log('添加成功');
            }, (tx, error) => {
                console.log('添加失败');
            })
        })
    }

    //根据roomType获取相应检查结果
    getCheckResults(roomType, resultCallBack) {
        this.db.transaction((tx) => {
            const sql = `select * from checkRestult`;
            tx.executeSql(sql, null, (tx, result) => {
                let checkResults = result.rows._array;
                checkResults = checkResults.map((checkResult) => {
                    const roomJSON = checkResult.room;
                    const checkItemsJSON = checkResult.checkItems;
                    checkResult.room = JSON.parse(roomJSON);
                    checkResult.checkItems = JSON.parse(checkItemsJSON);
                    return checkResult;
                });

                const returnCheckResults = [];
                for (let i = 0; i < checkResults.length; i++) {
                    const checkResult = checkResults[i];
                    if (checkResult.room.roomType == roomType) {
                        returnCheckResults.push(checkResult);
                    }
                }
                resultCallBack(returnCheckResults);
            }, (tx, error) => {
                resultCallBack(null, sql);
            })
        })
    }
    //删除
    deleteCheckResult(checkResultIDs, resultCallBack) {
        this.db.transaction((tx) => {
            const ids = checkResultIDs.join(',');
            const sql = `delete from checkRestult where id in (${ids})`;
            tx.executeSql(sql, null, (tx, result) => {
                if (this.listener) {
                    this.listener();
                }
                resultCallBack(result);
            }, (tx, error) => {
                console.log('====================================');
                console.log('删除失败');
                console.log('====================================');
                resultCallBack(false, sql);
            })
        })
    }

    //添加监听者，监听数据变化事件
    addListener(listener) {
        console.log('====================================');
        console.log('监听');
        console.log('====================================');
        this.listener = listener;
    }

    //提交检查结果--将本地数据提交到服务器数据库
    postCheckResults(checkResultIDs, resultCallBack) {
        console.log('==============提交checkResultIDs======================');
        console.log(checkResultIDs);
        console.log('====================================');
        this.db.transaction((tx) => {
            const ids = checkResultIDs.join(',');
            const sql = `select * from checkRestult where id in (${ids})`;

            tx.executeSql(sql, null, (tx, result) => {
                let checkResults = result.rows._array;
                //userinfo 是登陆时保存在本地stroge里持久化储存的token信息
                //给远程服务器提交数据的时候，需要验证toekn
                AsyncStorage.getItem('userinfo', (error, userinfo) => {
                    if (error) {
                        console.log('获取userinfo失败');
                        return;
                    }

                    const user = JSON.parse(userinfo);
                    //对checkResult内部进行编码
                    checkResults = checkResults.map((value) => {
                        const roomString = value.room;
                        const checkItemString = value.checkItems;
                        value.room = JSON.parse(roomString);
                        value.checkItems = JSON.parse(checkItemString);
                        return value;
                    });
                    const jsonData = JSON.stringify(checkResults);
                    const strData=JSON.stringify(JSON.parse(jsonData));
                    const headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'uid': user.uid,
                        'token': user.token,
                    }
                    fetch(API_CHECKRECORD, {
                        method: 'POST',
                        headers: headers,
                        body: strData,
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            if (responseJson.success == false) {
                                resultCallBack(false, responseJson.msg);
                                return;
                            }
                            resultCallBack(true);
                            this._changeCheckResultSubmitState(checkResultIDs, true);
                        })
                        .catch((error) => {
                            console.error(error);
                            resultCallBack(false, error);
                        });
                });
                resultCallBack(true);
            }, (tx, error) => {
                resultCallBack(false, sql);
            })
        })
    }

    _changeCheckResultSubmitState(checkResultIDs, submitState) {
        this.db.transaction((tx) => {
            const ids = checkResultIDs.join(',');
            const sql = `update checkRestult set submit='true' where id in (${ids})`;
            tx.executeSql(sql, null, (tx, result) => {
                console.log('====================================');
                console.log('6666');
                console.log('====================================');
                if (this.listener) {
                    this.listener();
                }
            }, (tx, error) => {
                console.log('====================================');
                console.log('777' + error);
                console.log('====================================');
            })
        })
    }


}

export default new CheckResultManager();