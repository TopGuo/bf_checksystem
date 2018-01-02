
import {
    AsyncStorage,
} from 'react-native';
//导入api常量配置
import  * as API from '../constant/api';
//验证用户正确返回true
class LoginManager {
    checkLogin(userinfo, callback) {
        const user = JSON.stringify(userinfo);
        fetch(API.API_LOGIN, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: user,
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((jsonData) => {
                if (jsonData.success) {
                    const userinfo={
                        uid:jsonData.id,
                        token:jsonData.token,
                    };
                    const userinfoJson=JSON.stringify(userinfo);
                    AsyncStorage.setItem('userinfo',userinfoJson,(error)=>{
                        if(error){
                            console.log('存储失败');
                        }else{
                            console.log('存储成功');
                        }
                    });
                }
                callback(jsonData.success);
            })
            .catch((errro) => {
                console.log(errro);
            })
    }
}

export default new LoginManager();