import React, { Component } from 'react'
import {View,Button,TextInput} from 'react-native'

import firebase from 'firebase'

export class Login extends Component {
  constructor(props) {
      super(props);

      this.state  = {
          email: 'faizan.sikander@live.com',
          password: 'abcd@1234'
           
      }

    this.onSignUp = this.onSignUp.bind(this)

  }

  onSignUp() {

    const { email , password  } = this.state;
    firebase.auth().signInWithEmailAndPassword(email , password)
    .then((result)  => {
        console.log('Login - ',result)

    })
    .catch((error) => {
        console.log(error)
    }
    )

  }


    render() {
        return (
            <View>
                 

                <TextInput
                  placeholder="email"
                  value={this.state.email}
                  onChangeText= {(email) => this.setState({email})}                  
                />

                <TextInput
                placeholder="password" 
                secureTextEntry={true}
                value={this.state.password}
                onChangeText= {(password) => this.setState({password})}
                />


                <Button 
                      onPress={() => this.onSignUp()}
                      title="Sign In"
                />


            </View>
        )
    }
}

export default Login
