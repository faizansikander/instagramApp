import React, { useState, useEffect } from "react";
import { Text, View, Image, FlatList, StyleSheet, Button } from "react-native";
import firebase from "firebase";

import { connect } from "react-redux";
require("firebase/firestore");

function Feed(props) {
  const [posts, setPosts] = useState([]);
  //console.log("Store------",props.store)
  useEffect(() => {
    let posts = [];
    if (
       props.usersFollowingLoaded ==
      props.following.length && 
      props.following.length !== 0) {

      props.feed.sort(function (x, y) {
        return x?.creation - y?.creation;
      });

      setPosts(props.feed);

    }
  }, [props.usersFollowingLoaded,props.feed ]);
  
  //console.log({ currentUser, posts });
  console.log("users posts", posts)

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>

        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item?.user?.name}</Text>
              <Image style={styles.image} source={{ uri: item?.downloadURL }} />

              <Text onPress={() => props.navigation.navigate('Comment',
                { postId: item?.id, uid: item.user?.uid })
              }
              >View Comments...</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },

  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },

  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
  store: store,

});

export default connect(mapStateToProps, null)(Feed);
