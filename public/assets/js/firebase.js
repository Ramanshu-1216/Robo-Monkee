document.addEventListener("DOMContentLoaded", function(event) {
    init();
    // console.log("Checking");
    // console.log(document.URL.split('?')[1]);
    if(document.URL.includes("videoPage"))
        setVideoUrl(document.URL.split('?')[1]);
    if(document.URL.includes("profile"))
        checkUserSignedIn();
    else{
        sessionStorage.clear();
    }

});
var db, database, signedInUser;
function init(){
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyBaz9A8WysjSUwVBw4jwCkrVI2aqIrGA-8",
        authDomain: "robomonkee-7e6c2.firebaseapp.com",
        projectId: "robomonkee-7e6c2",
        storageBucket: "robomonkee-7e6c2.appspot.com",
        messagingSenderId: "332126505239",
        appId: "1:332126505239:web:874feac15c7e23a3350f52",
        measurementId: "G-J06KJEBXNX"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    db = firebase.firestore();
    database = firebase.database();

}

function storeToFirebase(rootDoc, rootCollection){
    var fullName = null, email= null, message= null, parentsName= null, parentsContact= null, city= null;
    if(rootDoc === 'contactUs'){
        fullName = document.getElementById('name').value;
        email = document.getElementById('email').value;
        message = document.getElementById('message').value;
    }else if(rootDoc === 'newsletter'){
        email = document.getElementById('newsletterEmail').value;
    }else if(rootDoc === 'review'){
        message = document.getElementById('review').value;
        name = document.getElementById('name').value;
        city = document.getElementById('city').value;
        email = name = document.getElementById('email').value;
    }else if(rootDoc === 'iWantBot'){
        email = document.getElementById('emailBuy').value;
    }else if(rootDoc === 'getCallBack'){
        name = document.getElementById('inputEmail4').value;
        parentsName = document.getElementById('inputPassword4').value;
        parentsContact = document.getElementById('inputAddress').value;
        email = document.getElementById('inputAddress2').value;
    }
    // Add a new document in collection "cities"
    console.log(rootDoc, rootCollection);
    data = {};
    fullName && (data.name = fullName);
    email && (data.email = email);
    message && (data.message = message);
    parentsName && (data.parentsName = parentsName);
    parentsContact && (data.parentsContact = parentsContact);
    city && (data.city = city);
    data.createdAt =  firebase.firestore.FieldValue.serverTimestamp();;
    db.collection("emailFunctions").doc(rootDoc).collection(rootCollection).doc(email).set({data})
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
function signUp() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            alert("You have been logged in successgully!");
            window.location = "../cart.html";
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            console.log(error);
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}
var isBuying;
function checkUser(st) {
    isBuying = st;
    signOutButton = document.getElementById("signOutButton");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          console.log(user.displayName);
          signOutButton.style.display = "block";
          // ...
        } else {
          // User is signed out
          // ...iss
          signOutButton.style.display = "none";
          if(isBuying){
            alert("Please log in and then continue!");
            window.location = "../login.html";
        }
        
        }
      });
}
function signInUsingEmailAndPassword(){
    email = document.getElementById("loginEmailId").value;
    password = document.getElementById("loginPassword").value;
    wildCard = false;
    if(!isNaN(email)){
        email+='@robomonkee.com';
        wildCard = true;
    }
    var userRef = firebase.database().ref('users/' + email.split('@')[0]);
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if(!data['verified'] && !wildCard){
            alert("You're not yet verified! If there is any problem please contact us.");
            return;
        }else {
            // console.log(`${email} and ${password}`);
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                // console.log(`${JSON.stringify(user)} logged in`);
                sessionStorage.id = email;
                sessionStorage.isSignedIn = true;
                alert("You have been logged in successfully!");
                window.location = "./profile/examples/dashboard.html";
                return;
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(`${errorCode} => ${errorMessage}`);
            });
        }
    });

}
function signInRealTimeDB() {
    email = document.getElementById("loginEmailId").value;
    password = document.getElementById("loginPassword").value;

    var userRef = firebase.database().ref('users/' + email);
        userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        if(data == null){
            alert("Wrong credentials. Please try again.");
            return;
        }
        if(password === data){
            alert("You have been logged in successfully!");
            // console.log(sessionStorage.getItem('isSignedIn'))
            sessionStorage.id = email;
            sessionStorage.isSignedIn = true;
            window.location = "./profile/examples/dashboard.html";
            return;
        }
    });
}
function signOut() {
    sessionStorage.clear();
    alert("Signed out successfully!");

    // firebase.auth().signOut().then(() => {
    //     // Sign-out successful.
    //     alert("Signed out successfully!");
    //     isBuying = false;
    //     // window.location = "../index.html";
    //   }).catch((error) => {
    //     // An error happened.
    //     console.log(error);
    //   });
}

function setVideoUrl(url){
    console.log(url);
    var courseRef = db.collection("Course").doc(url);
    var docData;
    courseRef.get().then((doc) => {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            docData = doc.data();
            videoPlayer = document.getElementById('mainVideoPlayer').src = docData.src;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function checkUserSignedIn(){
    // if(sessionStorage.getItem('id')===null){
    //     alert("You are not signed in!");
    //     console.log("Not signed in");
    //     window.location = '../../login.html';
    // }else {
    //     console.log("Signed in");
    // }
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
            console.log("signed in");
          // ...
        } else {
          // User is signed out
          // ...
          alert("You are not signed in!");
          console.log("Not signed in");
          window.location = '../../login.html';
        }
      });
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //         signedInUser = user;
    //         // console.log(JSON.stringify(user));
    //         console.log("Signed in");
    //         if(document.URL.includes("user"))
    //             setUserInfo();
    //     } else {
    //         alert("You are not signed in!")
    //         console.log("Not signed in");
    //         window.location = '../../login.html'
    //     }
    //   });
}

function register(e){
    e.preventDefault();
    let inputs = document.getElementById('registrationForm').getElementsByTagName('input');
    // console.log(inputs);
    let user = {};
    for(var i=0; i<inputs.length; ++i){
        if(inputs[i].value == ""){
            alert("Check inputs properly!");
            return ;
        }
        user[inputs[i].id] = inputs[i].value;
    }
    console.log(JSON.stringify(user));
    user['verified'] = false;
    email = user['registrationEmail'];
    console.log(email);
    password = user['registrationPassword'];
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        // var user = userCredential.user;
        firebase.database().ref('users/' + email.split('@')[0]).set(user).then(
            () => alert("Registered Successfully")
        );  
        console.log(JSON.stringify(user));
        
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        alert(errorMessage);
        // ..
    });

}

function setUserInfo(){
    var userRef = firebase.database().ref('users/' + signedInUser.email.split('@')[0]);
        userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        profile = document.getElementById('userProfile').getElementsByTagName('h5');
        // console.log(profile)
        profile[0].innerText = data['registrationName'];
        profile[1].innerText = data['registrationEmail'];
        profile[2].innerText = data['registrationPhone'];
        profile[3].innerText = data['registrationAddress'];
    });
}