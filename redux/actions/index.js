import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants/index";
import firebase from "firebase";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        //    alert(firebase.auth().currentUser.uid);
        console.log("Snapshot variable", snapshot);
        if (snapshot.exists) {
          console.log("Now Snapshot Exists", snapshot.data());
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("document does not exist");
        }
      });
  };
}
//---

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;

          return { id, ...data };
        });
        console.log("Show Posts", posts);
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")

      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;

          return id;
        });

        console.log("following", following);
        for (var i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true));
        }
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
      });
  };
}
export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          //    alert(firebase.auth().currentUser.uid);
          console.log("Snapshot variale", snapshot);
          if (snapshot.exists) {
            let user = snapshot.data();
            console.log("User", user);
            user.uid = snapshot.id;
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
          } else {
            console.log("document does not exist");
          }
        });
      if (getPosts) {
        console.log("get posts",getPosts)
        dispatch(fetchUserFollowingPosts(uid));
      }
    }
  };
}

// export function fetchUserFollowingPosts(uid) {
//   return (dispatch, getState) => {
//     firebase
//       .firestore()
//       .collection("posts")
//       .doc(uid)
//       .collection("userPosts")
//       .orderBy("creation", "asc")
//       .get()
//       .then((snapshot) => {
//         /* const uid =snapshot.query.EP.path.segments[1];
//          const uid = snapshot.docs[0].ref.path.split('/')[1];
//          */

//         //console.log("uid segment",uid)
//         //console.log("Snapshot1",snapshot)
//          const user = getState().usersState.users.find(el => el.uid === uid) ;

//         let posts = snapshot.docs.map((doc) => {
//           const data = doc.data();
//           const id = doc.id;

//           return { id, ...data, user };
//         });
//                        console.log('Show Posts1111    ', posts)
//                        if(posts.length>0){
//                         for (let i = 0; i < posts.length; i++) {
//                           dispatch(fetchUserFollowingLikes(uid, posts[i].id));
//                         }
                
//                         dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
                  
//                        }
      
//         console.log("getstate", getState());
//       });
//   };
// }

// export function fetchUserFollowingLikes(uid, postId) {
//   return (dispatch, getState) => {
//     firebase
//       .firestore()
//       .collection("posts")
//       .doc(uid)
//       .collection("userPosts")
//       .doc(postId)
//       .collection("likes")
//       .doc(firebase.auth().currentUser.uid)
//       .onSnapshot((snapshot) => {
//         // const user = getState().usersState.users.find(el => el.uid === uid) ;

//      //   const postId = snapshot.ZE.path.segments[3];

//         console.log("Index JS -----", postId);

//         let currentUserLike = false;

//         if (snapshot.exists) {
//           currentUserLike = true;
//         }

//         dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });

//         console.log("getstate", getState());
//       });
//   };
// }



export function fetchUserFollowingPosts(uid) {
  console.log("fetchUserFollowingPosts")
  return ((dispatch, getState) => {
      firebase.firestore()
          .collection("posts")
          .doc(uid)
          .collection("userPosts")
          .orderBy("creation", "asc")
          .get()
          .then((snapshot) => {
            // const uid =snapshot.query.EP.path.segments[1];
              // const uid = snapshot.docs[0].ref.path.split('/')[1];
              const user = getState().usersState.users.find(el => el.uid === uid);


              let posts = snapshot.docs.map(doc => {
                  const data = doc.data();
                  const id = doc.id;
                  return { id, ...data, user }
              })
              // if(posts.length>0){
                console.log("posts122212",posts)
                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
              // }
           

          })
  })
}

export function fetchUsersFollowingLikes(uid, postId) {
  let cntr = 0;
  console.log('Fetch User Execution Cnt',cntr+1);
  return ((dispatch, getState) => {
      let listener = firebase.firestore()
          .collection("posts")
          .doc(uid)
          .collection("userPosts")
          .doc(postId)
          .collection("likes")
          .doc(firebase.auth().currentUser.uid)
          .onSnapshot((snapshot) => {
              const postId = snapshot.id;

              let currentUserLike = false;
              if (snapshot.exists) {
                  currentUserLike = true;
              }

              dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
          })

  })
}
