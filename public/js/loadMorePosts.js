let postWrapper = document.querySelectorAll('.innerRecentPosts > .postWrapper');
let yourPostWrapper = document.querySelectorAll('.innerOldPosts > .postWrapper');
let recentPostsLoadBtn = document.querySelector('.recentPostLoadBtn');
let yourPostsLoadBtn = document.querySelector('.yourPostLoadBtn');
let limiter = 5;

hidePostsFrom(postWrapper, recentPostsLoadBtn, limiter);

hidePostsFrom(yourPostWrapper, yourPostsLoadBtn, limiter);


recentPostsLoadBtn.addEventListener('click', function (e) {
    e.preventDefault();

    showPostsFrom(postWrapper, recentPostsLoadBtn, limiter);

})


yourPostsLoadBtn.addEventListener('click', function (e) {
    e.preventDefault();

    showPostsFrom(yourPostWrapper, yourPostsLoadBtn, limiter);
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
        limiter = 5;
        return;
    }

    limiter = limit;

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