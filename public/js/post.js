let title = document.querySelector('.title');
let body = document.querySelector('.body');
let submitPostBtn = document.querySelector('.submitPost');

console.log(title.value + " hola  " + body.value);

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
			body: "'" + body.value + "'"
		})
	});
	const result = await response.json();
	console.log(result);

};

submitPostBtn.addEventListener('click', function (e) {

	e.preventDefault();

	taskThatIShallComplete();

});