// Quote API Categories
var path = "./assets/images/";

var categories = ["inspire", "management", "sports", "life", "funny", "love", "art", "students"];

var yodaImages = ["yoda1.jpeg","yoda2.jpeg", "yoda3.jpeg", "yoda4.jpeg", "yoda5.jpeg", "yoda6.jpeg"];

var currentFavorites = [];

var quoteImage = "defaultQuote.jpg";

var yodaRandom = Math.floor(Math.random() * yodaImages.length);

var quote;

var uid;

var email;

// Quote API
function quotes(categoryName) {
    var api = "https://quotes.rest/qod?"
    var type = "category="

    var quotesURL = api + "api_key=5jVamSpsv63QvnA&"+ type + categoryName.toLowerCase();   

    yodaRandom = Math.floor(Math.random() * yodaImages.length);
    $("#yodaImage").css("background-image", "url(" + path + yodaImages[yodaRandom] +")");

    try {
        $.ajax({
            url: quotesURL,
            method: "GET"
        }).then(function(response) {
            var author = response.contents.quotes[0].author;
            var backgroundQuote = response.contents.quotes[0].background;
            var quote = response.contents.quotes[0].quote;

            if (backgroundQuote == null ) {
                backgroundQuote = path + quoteImage;
            }
            

            yoda(author, quote, backgroundQuote);
        });
    }
    catch(error) {
        console.log(error);
    }
}

// Yoda API
function yoda(author, quote, backgroundQuote) {
    var api = "https://api.funtranslations.com/translate/yoda.json?"
    var inputQuote = "text=" + quote;
    var yodaURL = api + "api_key=1foP2YXSqnKYM_RwSYIyvweF&" + inputQuote;
    try{
        $.ajax({
            url: yodaURL,
            method: "GET"
        }).then(function(response) {
            
            var yodaText = response.contents.translated;

            $("#authorName").text(author);
            $("#authorQuote").text(quote);
            $("#yodaQuote").text(yodaText);
            $("#yoda").text("Yoda");
            $("#authorImage").css("background-image", "url(" + backgroundQuote +")");
            
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
        email = user.email;
        // *********** Below will get user Favorites from Firebase
        uid = user.uid;
        
        $("#userName").text(email);
        database.ref(uid).on("child_added", function(childSnapshot) {
            
            var getFavoriteAuthor = childSnapshot.val().author;
            var getFavoriteQuote = childSnapshot.val().quote;
            var getKey = childSnapshot.key;                

            currentFavorites.push(getFavoriteQuote);

            var newRow = $("<tr>").append(
                
                $("<td id='author_" + getKey + "'>").text(getFavoriteAuthor),                
                $("<td id='quote_" + getKey + "'>" ).text(getFavoriteQuote),
                $("<td>").append($("<img class='favoritetoYoda' src='" + path + "yoda.png' width='50px' height='40px' id='yoda_" + getKey + "'></img>")),
                $("<td>").append($("<img class='removeFavorite' src='" + path + "delete.png' width='40px' height='40px' id='delete_" + getKey + "'></img>"))
                
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


// yoda favorite button
$(document).on("click", ".favoritetoYoda", function(event) {
    event.preventDefault();
    
    var key = this.id.split("yoda_")[1];
    
    var getAuthor = $("#author_" + key).text();

    var getFavoriteQuote = $("#quote_" + key).text();
    
    backgroundQuote = path + quoteImage

    yoda(getAuthor, getFavoriteQuote, backgroundQuote);

});

// Delete Favorite
$(document).on('click', '.removeFavorite', function (event) {
    
    event.preventDefault();

    var currentID = this.id.split("delete_")[1];
    // Remove from Firebase
    database.ref(uid).child(currentID).remove();

    // Remove from screen
    $(this).closest('tr').remove();
            

});
  

// // Clear

function clear() {
    localStorage.clear();
    sessionStorage.clear();
    Session.abondon();
    currentFavorites = "";
}

// Initialize Everything
function InitializeWindow() {
    for (var i=0; i<categories.length; i++) {
        // var tableRow =  $("<tr>");
        var tableItem = $("<li>");
        var categoriesButton = $("<button>");
        categoriesButton.css("outline", "0");
        categoriesButton.addClass("categoriesButton");
        categoriesButton.attr("id", i);
        categoriesButton.text(categories[i].toUpperCase());
        // tableRow.append(tableItem);
        tableItem.append(categoriesButton);
        $("#quoteCategories").append(tableItem);
        
        $("#authorImage").css("background-image", "url(" + path + quoteImage +")");
        $("#yodaImage").css("background-image", "url(" + path + yodaImages[yodaRandom] +")");
    }
}

// Login Action
$("#login").on("click", function(event) {
    event.preventDefault();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        $("#errorLogin").show();
        setTimeout(function(){ 
            $("#errorLogin").hide();
        }, 2000);
    });
});

// Login Form
$(function() {
    var button = $('#loginButton');
    var box = $('#loginBox');
    var form = $('#loginForm');
    button.removeAttr('href');
    button.mouseup(function() {
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

// Register Action
$("#register").on("click", function(event) {
    event.preventDefault();
    var email = $("#emailRegister").val().trim();
    var password = $("#passwordRegister").val().trim();

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        $("#errorRegister").show();
        setTimeout(function(){ 
            $("#errorRegister").hide();
        }, 2000);
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


// Logout Action
$("#logoutButton").on("click", function(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
        clear();
    }).catch(function(error) {
        console.log(error);
    });
    window.location.reload();
}); 


// on Click Your Quote
$(document).on('click','#topNavLeft', function() {
    
    $("#containerUserQuote").show();

    $("#containerCategories").hide();
    
});

// on Click Quote of the Day
$(document).on('click','#topNavRight', function() {
    
    $("#containerCategories").show();

    $("#containerUserQuote").hide();
    
});


//On Enter - Translate what is typed into textbox
$("#userQuote").keypress(function(event) {
    var keycode = event.charCode || event.keyCode; // depending on browser - for compatibility
    
    backgroundQuote = path + quoteImage

    if(keycode == '13') {
        

        yoda(email, $("#userQuote").val(), backgroundQuote);      
    }
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
    
    var flag = 1;
        for (var i=0; i < currentFavorites.length; i++) {
            if (currentFavorites[i] == quoteFavorite) {
                flag = 0;
            }
        }
    


    if (authorFavorite != "" && quoteFavorite != "" && flag) {
        database.ref(uid).push({
            author: authorFavorite,
            quote: quoteFavorite,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    }
});





// Everything starts here
window.onload = function() {
    InitializeWindow();
}
     
  
// Validate Register Form
$("#registerForm").validate({
    rules: {
        emailRegister: {
            required: true,
            email: true
        },
        passwordRegister: { 
            required: true,
            minlength: 6,
            maxlength: 16,
        }, 
        cfmPasswordRegister: {
            required: true,
            equalTo: "#passwordRegister",
            minlength: 6,
            maxlength: 16
        }
    },
    messages:{
        emailRegister: {
            required: "Your email is required!"
        },
        passwordRegister: { 
            required: "A password is required!"
        },
        cfmPasswordRegister: {
            required: "Please confirm your password!"
        }
    }
    
});



