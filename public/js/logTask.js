let currentPostId = null;

const logTask = async function(id) {
	console.log(id);
	const response = await fetch('/log', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			postsID: id,
			userID: -1,
			title: "'This is a title'",
			body: "'blah blah blah'"
		})
	});
	const result = await response.json();
	console.log(result);
	currentPostId = id;
};