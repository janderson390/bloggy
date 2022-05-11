// TOP OF THE PAGE BUTTON
mybutton = document.getElementById("myBtn");

window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
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
let elementValue = document.querySelector("#searchBox").value;

function isSearchEmpty() {
    if (elementValue == null || elementValue == "") {
        return false;
    };
}


// CHECKING CHARACTERS LEFT
let postBody = document.querySelector("textarea.bodyTxtForm");
let charsLeftSpan = document.querySelector("#charsLeftNum");
let submitBtn = document.querySelector(".submitPost");

const maxPostChars = 255;

// Fires everytime the value changes
postBody.addEventListener("input", function(e) {
    // Grab length of postBody
    let postLength = postBody.value.length;

    // Update the charsLeftSpan
    let charsLeft = maxPostChars - postLength;
    charsLeftSpan.innerHTML = charsLeft;

    // Change color of the charsLeftSpan if charsLeft is negative or not
    charsLeftSpan.style.color = (charsLeft <= 0) ? "red" : "black";

    // Check length of postBody text is more than 255
    // If true, disable submit button, else enable it
    submitBtn.disabled = (postBody.value.length > 255);

});