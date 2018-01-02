import React,{Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';



import LoginView from './component/login/LoginView';
import MainView from './component/main/MainView';
import AddCheckRecordView from './component/main/AddCheckRecordView';

import BuildNumView from './component/room/BuildNumView';
import RoomNameView from './component/room/RoomNameView';
import RoomTypeView from './component/room/RoomTypeView';

import CheckDetailView from './component/checkdetail/CheckDetailView';

//import {StackNavigator} from './component/shimo/src/react-navigation';
//import Root from './component/shimo/screens/Root';

// const Stack=StackNavigator({
//   './component/login/LoginView':{
//     getScreen:()=>require(LoginView).default
//   }
// });

//  class App extends Component {
//   render() {
//     return (
//       <Root
//         onNavigationStateChange={null}
//       />
//     );
//   }
// }


const App = StackNavigator({
  LoginView: { screen: LoginView },
  MainView:{screen:MainView},
  AddCheckRecordView:{screen:AddCheckRecordView},
  RoomTypeView:{screen:RoomTypeView},
  RoomNameView:{screen:RoomNameView},
  CheckDetailView:{screen:CheckDetailView},
  BuildNumView:{screen:BuildNumView}

});
export default App;