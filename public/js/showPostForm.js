let showBtn = document.querySelector('#showPostForm');
let formDiv = document.querySelector('.postsForm');

showBtn.addEventListener('click', function(e) {
    e.preventDefault();

    formDiv.style.display = 'block';
    showBtn.style.display = 'none';

});