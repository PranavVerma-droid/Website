var firebaseConfig = {
  apiKey: "AIzaSyCA_BPpKq3IhLupHnGYbbwq0U1mLdMbJXY",
  authDomain: "contactusform-f0ec2.firebaseapp.com",
  databaseURL: "https://contactusform-f0ec2-default-rtdb.firebaseio.com",
  projectId: "contactusform-f0ec2",
  storageBucket: "contactusform-f0ec2.appspot.com",
  messagingSenderId: "641931730164",
  appId: "1:641931730164:web:0812ee1bf4659f8381d2a1",
  measurementId: "G-1RVB7HZQWB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set database variable
var database = firebase.database()
var messagesRef = firebase.database().ref('users');

function save() {



  var email = document.getElementById('email').value
  //var password = document.getElementById('password').value
  var username = document.getElementById('username').value
  var review = document.getElementById('review').value
  var improve = document.getElementById('improve').value


  if (username == '') {
    alert('Please Fill both Email & Name Fields!');
    location.reload();
  } else if (email == '') {
    alert('Please Fill All Fields!');
    location.reload();
  } else if (review == '') {
    alert('Please Fill All Fields!');
    location.reload();
  } else if (improve == '') {
    alert('Please Fill All Fields!');
    location.reload();
  } else {
      var newMessageRef = messagesRef.push();
          newMessageRef.set({
            email: email,
            username: username,
            review: review,
            improve: improve
      });


    alert('Saved to the Infinity X Database! Please Check your Email!');

  }




}

/*function get() {
  var username = document.getElementById('username').value
 
  var user_ref = database.ref('users/' + username)
  user_ref.on('value', function(snapshot) {
    var data = snapshot.val()
 
    alert(data.email)
 
  })
 
}*/

/*function update() {
  var email = document.getElementById('email').value
  var username = document.getElementById('username').value
  //var password = document.getElementById('password').value
 
  var updates = {
    email : email,
    username: username
    //password : password
  }
 
  database.ref('users/' + username).update(updates)
 
  alert('updated')
}*/

/*function remove() {
  var email = document.getElementById('email').value
 
  database.ref('users/' + email).remove()
 
  alert('deleted')
}*/