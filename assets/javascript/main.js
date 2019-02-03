
// Quote API Categories
var path = "./assets/images/";

var categories = ["inspire", "management", "sports", "life", "funny", "love", "art", "students"];

var yodaImages = ["yoda1.jpeg"];// ****** TASK Create array of photos, find photos to use in case quote api does not provide us with a background

var uid;

// Quote API
function quotes(categoryName) {
    var api = "http://quotes.rest/qod?"
    var type = "category="

    var quotesCategories = api + type + categoryName;
    $.ajax({
        url: quotesCategories,
        method: "GET"
    }).then(function(response) {
        var author = response.contents.quotes[0].author;
        var background = response.contents.quotes[0].background;
        var quote = response.contents.quotes[0].quote;

        if (background == null) {
            // ****** TASK Genereate random photo from list oh photos
        }
        
        yoda(author, quote, background);
    });
}

// Yoda API
function yoda(author, quote, background) {
    try{    
        // var test = "Hello my name is Aris";
        var yodaURL = "https://api.funtranslations.com/translate/yoda.json?text=" + quote;
        $.ajax({
            url: yodaURL,
            method: "GET"
        }).then(function(response) {
            
            var yodaText = response.contents.translated;

            $("#authorName").text(author);
            $("#authorQuote").text(quote);
            $("#yodaQuote").text(yodaText);
            $("#authorImage").css("background-image", "url("+ background +")");
            
            
            console.log("Yoda: " + yodaText);
        });
    }
    catch(error) {
        console.log(error)
    }
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

// Get current User
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        var email = user.email;
        // *********** Below will get user Favorites from Firebase
        uid = user.uid;
        
        $("#userName").text(email);
        database.ref(uid).on("child_added", function(childSnapshot) {

            var getFavoriteAuthor = childSnapshot.val().author;
            var getFavoriteQuote = childSnapshot.val().quote;
            console.log(uid);
            // Create the new row
            var newRow = $("<tr>").append(
                $("<td>").text(getFavoriteAuthor),
                $("<td>").text(getFavoriteQuote),
            );
            
            // Append the new row to the table
            $("#favoriteQuotes > tbody").append(newRow);
            
        });
        $("#loginContainer").hide();        
        $("#registerContainer").hide();
        $("#nofavoritesContainer").hide();
        $("#favoritesContainer").show();
        $("#logoutContainer").show();
        $("#favoriteButton").show();
    } else {
        // User is signed out.
        $("#loginContainer").show();
        $("#registerContainer").show();
        $("#nofavoritesContainer").show();
        $("#favoritesContainer").hide();
        $("#logoutContainer").hide();
        $("#favoriteButton").hide();
    }
});


// Initialize Everything
function InitializeWindow() {
    for (var i=0; i<categories.length; i++) {
        var tableRow =  $("<tr>");
        var tableItem = $("<td>");
        var categoriesButton = $("<button>");
        categoriesButton.addClass("categoriesButton");
        categoriesButton.attr("id", i);
        categoriesButton.text(categories[i]);
        tableRow.append(tableItem);
        tableItem.append(categoriesButton);
        $("#quoteCategories").append(tableItem);

        $("#yodaImage").css("background-image", "url(" + path + "yoda1.jpeg" +")");
    }
}

// Login Form
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

// Register Form
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


// On Click - Search for Category from Button
$(document).on('click','.categoriesButton', function() {
    var categoryName = $(this).text();
    quotes(categoryName);
});


// On Click - Add to Favorite
$(document).on('click','#favoriteButton', function() {
    var authorFavorite = $(authorName).text();
    var quoteFavorite = $(authorQuote).text();
    if (authorFavorite != "" && quoteFavorite != "") {
        database.ref(uid).push({
            author: authorFavorite,
            quote: quoteFavorite,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    }
});

// Login Link
$("#login").on("click", function(event) {
    event.preventDefault();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error);
    });
});

// Register Link
$("#register").on("click", function(event) {
    event.preventDefault();
    var email = $("#emailRegister").val().trim();
    var password = $("#passwordRegister").val().trim();
    console.log(email);
    console.log(register);

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error);
      });
});

// Logout Link
$("#logoutButton").on("click", function(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
        $("#addTrains").hide();
    }).catch(function(error) {
        console.log(error);
    });
}); 

// Everything starts here
window.onload = function() {
    InitializeWindow();
}