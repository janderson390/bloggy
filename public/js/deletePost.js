async function deletePost(id) { 

	const response = await fetch('/removePost', {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
		body: JSON.stringify({
			id: id
		})
	});
	const result = await response.json();
    console.log(result);

    window.location.reload();

}