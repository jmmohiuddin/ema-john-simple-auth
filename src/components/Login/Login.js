import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import React,{ useState} from 'react';
import { UserContext } from "../../App";
import { useContext } from 'react';
import { useHistory, useLocation } from "react-router";
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    }
  
function Login() {
  const [newUser,setNewUser]=useState(false);
  const [user,setUser]=useState({
    isSignIn: false ,
    newUser: false,
    name: '',
    email: '',
    photo: '',
    password: '',
  });
  const history =useHistory();
  const location =useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const [loggedInUser,setLoggedInUser]=useContext(UserContext);
  console.log(loggedInUser);
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(res=>{
      const{displayName,photoURL,email} = res.user;
      const signInedUser={
        isSignIn:true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInedUser);
      console.log(res);
    }).catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res=> {
    const signedOutUser={
    isSignIn:false,
    name:'',
    email:'',
    photo: '',
    error:'',
    success:false
    }
    setUser(signedOutUser);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  const handleBlur=(e)=>{
    let isFieldValid=true;
    if (e.target.name==='email') {
      isFieldValid=/\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name==='password') {
      const isPasswordValid=e.target.value.length>6;
      const passwordHasNumber=/\d{1}/.test(e.target.value);
      isFieldValid=isPasswordValid&&passwordHasNumber;
    }
  if(isFieldValid){
    const newUserInfo={...user};
    newUserInfo[e.target.name]=e.target.value;
    setUser(newUserInfo);
  }
  }
  const handleSubmit=(e)=>{
    if(newUser&&user.email&&user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo={...user};
        newUserInfo.error='';
        newUserInfo.success=true;
        setUser(newUserInfo);
        updateUserName(user.name);
        history.replace(from);
      })
      .catch(error => {
        let newUserInfo={...user};
        newUserInfo.error=error.message;
        newUserInfo.success=false;
        setUser(newUserInfo);
      });
  }

  if (!newUser&&user.email&&user.password) {
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    setLoggedInUser(newUserInfo)
    history.replace(from);
    console.log('userInfo',res.user);

  })
  .catch((error) => {
    let newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
  });
    
  }

    e.preventDefault();//NOTE amra jani kono form submite korle default vabei se puro page ta ke reload kore ta thekanor jonno event.preventDefault use kore
}
const updateUserName=name => {
  var user = firebase.auth().currentUser;
  user.updateProfile({
    displayName: name,
  }).then(function() {
    console.log('user name updated successfully');
  }).catch(function(error) {
    console.log(error);
  });
}
const handleFbSignIn=() => {
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var user = result.user;
    console.log('fb user after',user);
    var accessToken = credential.accessToken;
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
}
  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignIn?<button onClick={handleSignOut}>sign out</button>:<button onClick={handleSignIn}>sign in</button>
      }
      <br/>
      <button onClick={handleFbSignIn}>Sign in using Facebook </button>
      {
        user.isSignIned=true&&<div>
          <p>welcome:{user.name}</p>
          <p>{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own authentication</h1>
      <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} id=""/>
      <label htmlFor="newUser">New User sign up</label>
      <form onSubmit={handleSubmit}>
      {newUser&&<input type="text" onBlur={handleBlur} placeholder="Your name" required name="name"/>}
      <br/>
      <input type="text" onBlur={handleBlur} placeholder="Your email address" required name="email"/>
      <br/>
      <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Your password" required/>
      <br/>
      <input type="submit" value={newUser?'sign up':'sign in'}/>
      
      </form>
      <p style={{color:'red'}}>{user.error}</p>
       {user.success && <p style={{color:'green'}}>User {newUser?'created':'login'} successfully</p>}
    </div>
  );
}
//NOTE serch auth vs authotication
//NOTE serch google analytics
//NOTE serch ab testing
//NOTE serch know about firebase sdk 
//NOTE serch know about requirement setting password or name
//NOTE serch form validation 
//NOTE serch know about regx editor 
//NOTE serch
//NOTE serch
export default Login;
