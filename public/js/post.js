let title = document.querySelector('.title');
let body = document.querySelector('.body');
const EMAIL = document.querySelector('#emailVal').value;
let errMsg = document.querySelector('.errMsg');
let submitPostBtn = document.querySelector('.submitPost');

// console.log(title.value + " hola  " + body.value);

// console.log(EMAIL);

// logic to insert post
const taskThatIShallComplete = async function () {
	const response = await fetch('/log', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			title: "'" + title.value + "'",
			body: "'" + body.value + "'",
			email: "'" + EMAIL + "'"
		})
	});
	const result = await response.json();
	console.log(result);

};

submitPostBtn.addEventListener('click', function (e) {

	e.preventDefault();

	console.log(e);

	if (title.value == "" || body.value == "") {
		
		errMsg.innerText = "*Please fill in missing field(s).";

	} else {

		title.value = checkString(title.value);
		body.value = checkString(body.value);

		console.log("title: " + title.value + "\nbody: " + body.value);

		taskThatIShallComplete();
		
		window.location.reload();

	}

});

// This is used to check if a string has a single quote
// because in SQL a single quote indicates the start and
// end position of a string. If there were to be any other
// single quote, then SQL does not know where to end the 
// string so you need to use double single quotes in order 
// to escape the single quote.
function checkString(str) {
	let strArray = [];

	for(let i = 0; i < str.length; i+=1) {
		strArray[i] = str.charAt(i);

		if (strArray[i] == "'") {
			strArray.splice(i, 1, "''");
		}
	}

	str = strArray.join('');

	return str;
} 