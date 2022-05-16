let showBtn = document.querySelector('#showPostForm');
let formDiv = document.querySelector('.postsForm');
let exitPostBtn = document.querySelector('.exitPostBtn');
const BUFFER = 25;


showBtn.addEventListener('click', function (e) {
    e.preventDefault();

    formDiv.style.display = 'initial';
    showBtn.style.display = 'none';

});

exitPostBtn.addEventListener('click', function () {
    formDiv.style.display = 'none';
    showBtn.style.display = 'initial';
})

