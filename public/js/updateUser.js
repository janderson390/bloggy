let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
let usrName = document.querySelector('#uName');
let fName = document.querySelector('#fName');
let lName = document.querySelector('#lName');
let errMsg = document.querySelector('#error');
let updateForm = document.querySelector('.updateForm');
let updateBtn = document.querySelector('#updateBtn');
let hkUserName = document.querySelector('#hkUserName');


const updateUserInfo = async function () {
	const response = await fetch('/updateUser', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userName: "'" + usrName.value + "'",
			firstName: "'" + fName.value + "'",
			lastName: "'" + lName.value + "'"
		})
	});
	const result = await response.json();
	console.log(result);

};

updateBtn.addEventListener('click', function(e) {
    e.preventDefault();

    if (usrName.value == "" || fName.value == "" || lName.value == "") {
        errMsg.innerHTML = "Please fill in all fields.";
        console.log(usrName + " " + fName + " " + lName);
    } else {
        errMsg.innerText = "";
		updateUserInfo();
		window.location.href='/profile';
    }


    // if(format.test(string)){
    //     errMsg.innerText = "No special characters are allowed.";
    // }

    // errMsg.innerText = "passed";


});

