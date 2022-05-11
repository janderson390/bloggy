// TOP OF THE PAGE BUTTON
let mybutton = document.getElementById("toTopBtn");

window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 25 || document.documentElement.scrollTop > 25) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


// SEARCHING
let searchBox = document.querySelector("#searchBox");

function isSearchEmpty() {
    if (searchBox.value == null || searchBox.value == "") {
        return false;
    };
}


// CHECKING CHARACTERS LEFT
let postBody = document.querySelector("textarea.bodyTxtForm");
let charsLeft = document.querySelector("#charsLeft");
let submitBtn = document.querySelector(".submitPost");

const maxPostChars = 255;

// Fires everytime the value changes
if (postBody) {
    postBody.addEventListener("input", function(e) {
        // Grab length of postBody
        let postLength = postBody.value.length;
    
        // Update the charsLeft
        let numLeft = maxPostChars - postLength;
        charsLeft.innerHTML = numLeft;
    
        // Change color of the charsLeft if charsLeft is negative or not
        charsLeft.style.color = (numLeft <= 0) ? "red" : "black";
    
        // Check length of postBody text is more than 255
        // If true, disable submit button, else enable it
        submitBtn.disabled = (postBody.value.length > 255);
    
    });
}