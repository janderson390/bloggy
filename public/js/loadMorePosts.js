let postWrapper = document.querySelectorAll('.innerRecentPosts > .postWrapper');
let yourPostWrapper = document.querySelectorAll('.innerOldPosts > .postWrapper');
let recentPostsLoadBtn = document.querySelector('.recentPostLoadBtn');
let yourPostsLoadBtn = document.querySelector('.yourPostLoadBtn');
let postLimit = 5;
let yourPostLimit = 5;

hidePostsFrom(postWrapper, recentPostsLoadBtn, postLimit);

hidePostsFrom(yourPostWrapper, yourPostsLoadBtn, yourPostLimit);

recentPostsLoadBtn.addEventListener('click', function (e) {
    e.preventDefault();

    showPostsFrom(postWrapper, recentPostsLoadBtn, postLimit);

    postLimit += 5;

})


yourPostsLoadBtn.addEventListener('click', function (e) {
    e.preventDefault();

    showPostsFrom(yourPostWrapper, yourPostsLoadBtn, yourPostLimit);

    yourPostLimit += 5;
})


function showPostsFrom(name, btnName, limit) {

    if (limit < name.length) {
        limit += 5;
    }

    if (limit > name.length) {
        limit = name.length;
    }

    for (let i = 0; i < limit; i += 1) {

        name[i].style.display = "";

    }

    if (limit == name.length) {
        btnName.style.display = "none";
        limit = 5;
        return;
    }

}

function hidePostsFrom(name, btnName, limit) {

    if (name.length <= limit) {
        btnName.style.display = "none";
    }

    for (let i = 0; i < name.length; i += 1) {
        if (i >= limit) {
            name[i].style.display = "none";
        }
    }

}