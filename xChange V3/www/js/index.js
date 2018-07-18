/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      // var parentElement = document.getElementById(id);
      // var listeningElement = parentElement.querySelector('.listening');
      // var receivedElement = parentElement.querySelector('.received');

      // listeningElement.setAttribute('style', 'display:none;');
      // receivedElement.setAttribute('style', 'display:block;');

      // console.log('Received Event: ' + id);
    }
  };




//scripts by diego 27/06/18

//disable auto styling based on the device.
ons.disableAutoStyling();


//fake login
var xlogin = function() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username === '' && password === '') {
    // ons.notification.alert("going");
    document.querySelector("#navigator").pushPage("menu_login.html");

  } else {
    ons.notification.alert('Incorrect username or password.');
  }
};



//put the label value as title in the pages
document.addEventListener('prechange', function(event) {
  document.querySelector('#menu_login .center').innerHTML = event.tabItem.getAttribute('label');
});


//message button on messages.html
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'messages') {
    page.querySelector('#msg1').onclick = function() {
      document.querySelector('#navigator').pushPage('views/settings2.html',
      {
        data: {
          title: 'Message from '
        }
      }
      );
      console.log(document.querySelector('#navigator').data());
    };
  }

  var showAlert = function() {
    ons.notification.alert('xChange!');
  };

  page.querySelector("#login").onclick = function(){
    document.querySelector("#navigator").pushPage('views/login.html')
  } 
  page.querySelector("#register").onclick = function(){
    document.querySelector("#navigator").pushPage('views/register.html')
  } 
});


// ---------------------------------------------------------------

 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyCHDgcVjF5nZGDuB7xM88v8CIT9uWmAiY0",
  authDomain: "xchange-e7223.firebaseapp.com",
  databaseURL: "https://xchange-e7223.firebaseio.com",
  projectId: "xchange-e7223",
  storageBucket: "xchange-e7223.appspot.com",
  messagingSenderId: "581413958183"
};
firebase.initializeApp(config);

//conect to the users database
let userRef = firebase.database().ref('/Users');

//test if the database is working
/*
userRef.on("child_added", function(data){
  console.log(data);
  console.log(data.key);
  console.log(data.val());

});
*/




//image upload to database



document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'register') {



      var auth = firebase.auth();
    function handleFileSelect(evt) {
var storageRef = firebase.storage().ref();
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];

      var metadata = {
        'contentType': file.type
      };

      // Push to child path.
      // [START oncomplete]
      storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        snapshot.ref.getDownloadURL().then(function(url) {
          console.log('File available at', url);

          // [START_EXCLUDE]
          $('#profilepic').attr("src", url);
          // [END_EXCLUDE]
        });
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
      // [END oncomplete]


    }




    document.getElementById('file').addEventListener('change', handleFileSelect, false);
    document.getElementById('file').disabled = true;

    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('Anonymous user signed-in.', user);
        document.getElementById('file').disabled = false;
      } else {
        console.log('There was no anonymous session. Creating a new anonymous user.');
          // Sign the user in anonymously since accessing Storage requires the user to be authorized.
          auth.signInAnonymously().catch(function(error) {
            if (error.code === 'auth/operation-not-allowed') {
              window.alert('Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
                'sign-in on your Firebase project.');
            }
          });
        }
      });
    //end file upload




  } //end if page register


//put the images in the storage in the homepage

if (page.id === 'home') {




  var storage = firebase.storage();
  var storageRef = storage.ref();

  var imagesRef  = storageRef.child("images/1_B.jpg");

  imagesRef.getDownloadURL().then(function(url){
    console.log(url);
    $(".thumbnail img").attr("src", url);
  });







}
});

//put data on firebase table
function register(){

  let user = $("#user").val();
  let email = $("#email").val();
  let password = $("#pss").val();
  let cnf_pss = $("#cnf_pss").val();
  let url = $("#profilepic").attr("src");
      //push the data without cryptography
      userRef.push({
        username: user,
        email: email,
        password: password,
        profilepic: url

      });
      console.log(user + email + password + cnf_pss + url)
    }//end register






//facebook login - https://firebase.google.com/docs/auth/web/facebook-login
function fblogin(){


  var provider = new firebase.auth.FacebookAuthProvider();



  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;

  // The signed-in user info.
  var user = result.user;
// console.log(user);

//put the name, email and photo on firebase
userRef.push({
  name: user.displayName,
  email: user.email,
  photo: user.photoURL
});

//put the profile pic from the fabook stored in firebase to the page
$(".fbPic").attr("src", user.photoURL);

//name from firebase to the page
$(".user").text("Welcome " + user.displayName)



}).catch(function(error) {

  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...


  console.log("error mail: " + email);
// console.log("error user: " + user);
console.log("error code: "+  errorCode);
console.log("error message: "+ errorMessage);


});

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // ...
  }
  let userRef = firebase.database().ref('/Users');

  // The signed-in user info.
  var user = result.user;

}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

}
