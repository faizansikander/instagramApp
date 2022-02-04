
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


//import {View,Text} from 'react-native';

import firebase from "firebase"

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpE9NIRlBCRw2Cc6xWHR65U-uhLFWCUaM",
  authDomain: "instagram-dev-abe87.firebaseapp.com",
  projectId: "instagram-dev-abe87",
  storageBucket: "instagram-dev-abe87.appspot.com",
  messagingSenderId: "1095811219957",
  appId: "1:1095811219957:web:3ea322b87b691d0d8d20bc",
  measurementId: "G-XE87PWRQ67"
};


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main'
import LoginScreen from './components/auth/Login'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';

const Stack = createStackNavigator();



export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      loaded: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('Not equal to user',!user);

      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }

    }
    )

  }



  render() {

    const { loggedIn, loaded } = this.state;
    //console.log('Loaded Variable -',loaded);
    if (!loaded) {

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading....</Text>
        </View>
      )
    }



    if (!loggedIn) {
      return (

        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>

      );

    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} /*options={{ headerShown: false }}*/ />
            <Stack.Screen name="Add" component={AddScreen}  navigation={this.props.navigation}  />
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}    />
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}    /> 

            
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>





    )





  }
}

export default App




