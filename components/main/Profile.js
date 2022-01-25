import React, { useState, useEffect } from "react";
import { Text, View, Image, FlatList, StyleSheet, Button } from "react-native";
import firebase from "firebase";

import { connect } from "react-redux";
require("firebase/firestore");

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    console.log(
      "use Effect",
      props.route.params.uid,
      "Current User",
      currentUser
    );

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      console.log("testing");

      setUser(currentUser);
      setUserPosts(posts);

      //console.log('User Matched', user.name);
    } else {
      console.log("Else Condition");

      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          //    alert(firebase.auth().currentUser.uid);
          console.log("Snapshot variale", snapshot);
          if (snapshot.exists) {
            setUser(snapshot.data());
            console.log(props.route.params.uid);
          } else {
            console.log("document does not exist");
          }
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };


  const onLogout = () => {
      firebase.auth().signOut();
  }

  if (user === null) {
    console.log("user is null       ");
    return (
      <Button
        title="logout"
        onPress={() => {
          firebase.auth().signOut(r);
        }}
      />
    );

    // <View />
  }

  //console.log({ currentUser, posts });

  console.log("Pass User", props.route.params.uid);
  console.log("Current User", firebase.auth().currentUser.uid);
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user?.name}</Text>
        <Text>{user?.email}</Text>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : (
          <Button title="Logout" onPress={() => onLogout()} />
        )}
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
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
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
