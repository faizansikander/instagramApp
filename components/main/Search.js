import React, { useState } from 'react'
import {Text,View,TextInput,FlatList ,StyleSheet,TouchableOpacity} from 'react-native'


import firebase from 'firebase'

require('firebase/firestore')


export default function Search(props) {
    const [users,setUsers] = useState([])

    const fetchUsers = (search) => {

        firebase.firestore()
        .collection('users')
        .where('name','>=',search)
        .get()
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id,...data}
            });
            console.log('Search For User Function - ',users);
            setUsers(users);
        })

    }




    return (
        <View>
            <TextInput placeholder="Type Here" onChangeText={(search) => fetchUsers(search)}  />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate("Profile",{uid: item.id})}>
                    <View style={styles.Text}>
                    <Text>{item.name}</Text>
                    </View>
                    </TouchableOpacity>
                )

                }
            />
            
        </View>
    )
}


const styles = StyleSheet.create({
    Text: {
         
        marginLeft: 40
    }
     
})