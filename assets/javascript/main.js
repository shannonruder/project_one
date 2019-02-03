
// Quote API
var categories = ["inspire", "management", "sports", "life", "funny", "love", "art", "students"];
var api = "http://quotes.rest/qod?"
var type = "category="
var selection = categories[0]; // selection will be from above categories. currently set it to inspire in order to test out

var quotesCategories = api + type + selection;
$.ajax({
    url: quotesCategories,
    method: "GET"
}).then(function(response) {
    var author = response.contents.quotes[0].author;
    var background = response.contents.quotes[0].background;
    var quote = response.contents.quotes[0].quote;
    console.log(background);
    console.log(author + ": " + quote);
    yoda(quote);
});



// Yoda API
function yoda(quote) {
// var test = "Hello my name is Aris";
var yodaURL = "https://api.funtranslations.com/translate/yoda.json?text=" + quote;
$.ajax({
    url: yodaURL,
    method: "GET"
}).then(function(response) {
    
    var yodaText = response.contents.translated;
    console.log("Yoda: " + yodaText);
});
}


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDGsAlCfAQE1OF6vmxsh2i5B-PYrhvGiVA",
    authDomain: "project-yoda-d3e6f.firebaseapp.com",
    databaseURL: "https://project-yoda-d3e6f.firebaseio.com",
    projectId: "project-yoda-d3e6f",
    storageBucket: "project-yoda-d3e6f.appspot.com",
    messagingSenderId: "56017250700"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
    
    
// Login
$("#login").on("click", function(event) {
    event.preventDefault();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error);
    });
});

// Register
$("#register").on("click", function(event) {
    event.preventDefault();
    var email = $("#emailRegister").val().trim();
    var password = $("#passwordRegister").val().trim();
    console.log(email);
    console.log(register);

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error);
      });
      debugger
});


// Logout
$("#logoutButton").on("click", function(event) {
    firebase.auth().signOut().then(function() {
        $("#addTrains").hide();
    }).catch(function(error) {
        console.log(error);
    });
}); 


// Get current User
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        var email = user.email;
        // var uid = user.uid;
        // database.ref("/").on("value", function(snapshot) {
        //     var getUID =  snapshot.child("admin/uid").val();
        //     if (uid == getUID) {
        //         console.log("Admin logged in");
        //         $("#addTrains").show();
        //         $("#admin").show();
        //         $("td#admin").show();
        //     } else {
        //         console.log("Not admin");
        //         $("#addTrains").hide();
        //         $("#admin").hide();
        //         $("td#admin").hide();
        //     }
        // });
        
        $("#userName").text(email);
        $("#loginContainer").hide();
        $("#registerContainer").hide();
        $("#logoutContainer").show();
    } else {
        // User is signed out.
        $("#loginContainer").show();
        $("#registerContainer").show();
        $("#logoutContainer").hide();
    }
});








// Login
$(function() {
    var button = $('#loginButton');
    var box = $('#loginBox');
    var form = $('#loginForm');
    button.removeAttr('href');
    button.mouseup(function(login) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() { 
        return false;
    });
    $(this).mouseup(function(login) {
        if(!($(login.target).parent('#loginButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });
});

// Register
$(function() {
    var button = $('#registerButton');
    var box = $('#registerBox');
    var form = $('#registerForm');
    button.removeAttr('href');
    button.mouseup(function(login) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() { 
        return false;
    });
    $(this).mouseup(function(login) {
        if(!($(login.target).parent('#registerButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });
});

