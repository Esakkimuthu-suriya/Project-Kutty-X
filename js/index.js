setUserName()
// likes

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("bi-heart") || e.target.classList.contains("bi-heart-fill")) {
        const heartIcon = e.target;
        const postIcons = [...document.querySelectorAll(".bi-heart, .bi-heart-fill")];
        const postIndex = postIcons.indexOf(heartIcon);

        const kuttyx_db = getDB();
        const posts = kuttyx_db.posts;
        const currentUser = JSON.parse(localStorage.getItem("current_user"));

        if (!posts[postIndex].likedBy) {
            posts[postIndex].likedBy = [];
        }

        const hasLiked = posts[postIndex].likedBy.includes(currentUser.username);

        if (!hasLiked) {
            // Like it
            posts[postIndex].likes += 1;
            posts[postIndex].likedBy.push(currentUser.username);

            heartIcon.classList.remove("bi-heart");
            heartIcon.classList.add("bi-heart-fill");
            heartIcon.style.color = "red";
        } else {
            // Unlike it
            posts[postIndex].likes -= 1;
            posts[postIndex].likedBy = posts[postIndex].likedBy.filter(u => u !== currentUser.username);

            heartIcon.classList.remove("bi-heart-fill");
            heartIcon.classList.add("bi-heart");
            heartIcon.style.color = "";
        }


        // Update count
        heartIcon.innerHTML = `&nbsp;${posts[postIndex].likes}`;

        // Save updated data
        kuttyx_db.posts = posts;
        localStorage.setItem("kuttyx_db", JSON.stringify(kuttyx_db));
    }

});


let firstPost = null;

document.addEventListener('DOMContentLoaded', () => {
    const kuttyx_db = getDB();
    const posts = kuttyx_db.posts;
    const currentUser = JSON.parse(localStorage.getItem('current_user'));

    const postCardContainer = document.querySelector('.postCardContainer');
    postCardContainer.innerHTML = ''; // Clear before appending

    posts.forEach(post => {
        if (firstPost != post.id) {
            firstPost = post.id
        }
        // check if current user already liked
        const isLiked = post.likedBy && post.likedBy.includes(currentUser.username);

        let htmlContent =
            `
    <div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="shareModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content rounded-3">
      <div class="modal-header">
        <h5 class="modal-title" id="shareModalLabel">Share this post</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex justify-content-center gap-3 fs-4">
          <i class="bi bi-facebook"></i>
          <i class="bi bi-instagram"></i>
          <i class="bi bi-twitter-x"></i>
        </div>
        <div class="mt-3 d-flex">
          <input type="text" id="shareLinkInput" class="form-control" readonly>
          <button class="btn btn-primary ms-2" id="copyShareLink">Copy</button>
        </div>
      </div>
    </div>
  </div>
</div>


            <div class="post" data-post-id="${post.id}">
                <div class="userName">
                    <img class="userImg" src="./img/boy.jpg" alt="userprofile">
                    <h5 id="userName">${post.user.username}</h5>
                    <div class="postLeft">
                        <i class="bi bi-three-dots-vertical" id="threeDots"></i>
                    </div>
                </div>
                <div class="postImg">
                    <img class="userPost" src="${post.image}" alt="logo">
                    <div>
                        <i class="${isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'}" 
                           style="${isLiked ? 'color: red;' : ''}">&nbsp;${post.likes}</i>
                        <i class="bi bi-chat"></i>
                        <i class="bi bi-share shareButton">&nbsp;${post.shares}</i>
                    </div>
                </div>
                <div class="caption">
                    <p>${post.caption}</p>
                </div>
            </div>  
        `;

        postCardContainer.innerHTML += htmlContent;
    });
});




//comments
let selectedPostId = null;


function getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 5) return `${seconds}s ago`;
    return 'just now';
}

function loadComments(postId) {
    if (selectedPostId === postId) return;
    selectedPostId = postId;

    const db = getDB();
    const commentBox = document.querySelector(".commentBox");

    const post = db.posts.find(p => p.id === postId);
    if (!post) return;

    const postComments = post.comments || [];

    commentBox.innerHTML = `
        <div class="commentBoxHeader"><h3>KuttyTalk</h3></div>
    `;

    postComments.forEach(comment => {
        const user = db.users.find(u => u.id === comment.userId);
        commentBox.innerHTML += `
            <div class="comment">
                <div class="commentTop">
                    <div class="commentTopLeft">
                        <img class="commentImg" src="./img/boy.jpg" alt="userprofile">
                        <h5 class="akash">${user?.username || 'Unknown'}</h5>
                    </div>
                    <p class="cap">${getTimeAgo(comment.time)}</p>
                </div>
                <div class="commentBottom">
                    <p class="caps">${comment.text}</p>
                </div>
            </div>
            <style>
                @media(max-width: 660px){
                    .commentTop{
                        display:flex;
                        column-gap:5px;}
                        #heart{
                        font-size:10px;}
                        .akash{
                        width:10%;
                        font-size:11px;
                    }
                    .cap{
                        width:10%;
                        font-size:10px;
                    }
                    .caps{
                        font-size:px;
                    }
                }
            </style>
        `;
    });
}

const container = document.querySelector('.postCardContainer');

container.addEventListener('scroll', () => {
    const posts = document.querySelectorAll('.post');

    let closestPost = null;
    let closestDistance = Infinity;

    posts.forEach(post => {
        const rect = post.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const postMiddle = rect.top + rect.height / 2;
        const containerMiddle = containerRect.top + containerRect.height / 2;
        const distance = Math.abs(containerMiddle - postMiddle);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestPost = post;
        }
    });

    if (closestPost) {
        const postId = closestPost.getAttribute('data-post-id');
        if (postId != selectedPostId) {
            loadComments(postId);
            selectedPostId = postId;
        }
    }
});

loadComments(firstPost)

const btn_comment = document.getElementById("btn_share_cmt");
const txt_comment = document.getElementById("txt_comment");

btn_comment.addEventListener("click", () => {
    const value = txt_comment.value.trim();

    if (!value) {
        alert("Please enter the comment.");
        return;
    }

    const db = getDB();
    const post = db.posts.find(p => p.id === selectedPostId);
    if (!post) {
        alert("Post not found.");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    if (!currentUser) {
        alert("User not logged in.");
        return;
    }

    const commentData = {
        id: "cmt" + Date.now(),
        userId: currentUser.id, // store only the userId
        text: value,
        time: new Date().toLocaleString()
    };

    // Make sure comments array exists
    if (!Array.isArray(post.comments)) {
        post.comments = [];
    }

    post.comments.push(commentData);
    saveDB(db); // Save the updated DB

    txt_comment.value = ""; // Clear input
    loadComments(selectedPostId); // Reload comment view
});


// three dots

document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.querySelector(".postCardContainer");

    postContainer.addEventListener("click", (e) => {
        const postEl = e.target.closest(".post");
        if (!postEl) return;

        const postId = postEl.dataset.postId;

        // Delete handler
        if (e.target.classList.contains("deleteOption")) {
            const confirmed = confirm("Are you sure you want to delete this post?");
            if (confirmed) {
                let db = JSON.parse(localStorage.getItem("kuttyx_db"));
                db.posts = db.posts.filter(p => p.id != postId);
                localStorage.setItem("kuttyx_db", JSON.stringify(db));
                postEl.remove();
            }
        }

        // Edit handler
        if (e.target.classList.contains("editOption")) {
            location.href = `post.html?id=${postId}`;
        }
    });
});



// share 

setTimeout(() => {
    document.querySelectorAll(".shareButton").forEach((btn) => {
        btn.addEventListener("click", function () {
            const postEl = this.closest(".post");
            const postId = postEl.getAttribute("data-post-id");
            const postUrl = `${window.location.origin}/index.html?id=${postId}`;

            document.getElementById("shareLinkInput").value = postUrl;

            // Show the modal
            const shareModal = new bootstrap.Modal(document.getElementById("shareModal"));
            shareModal.show();

            // Copy link logic
            document.getElementById("copyShareLink").onclick = () => {
                const input = document.getElementById("shareLinkInput");
                input.select();
                document.execCommand("copy");
            };
        });
    });
}, 500);


document.addEventListener('DOMContentLoaded', () => {
    const kuttyx_db = getDB();
    const posts = kuttyx_db.posts;
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const postCardContainer = document.querySelector('.postCardContainer');
    postCardContainer.innerHTML = ''; // Clear before appending

    const urlParams = new URLSearchParams(window.location.search);
    const sharedPostId = urlParams.get('id');

    // If a specific post ID is shared in the URL
    let postsToRender = sharedPostId
        ? posts.filter(post => post.id === sharedPostId)
        : posts;

    postsToRender.forEach(post => {
        const isLiked = post.likedBy && post.likedBy.includes(currentUser.username);

        let htmlContent = `
        <!-- Share Modal (You might want to move this out of the loop ideally) -->
        <div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="shareModalLabel" aria-hidden="true"  style="color:white;">
          <div class="modal-dialog">
            <div class="modal-content rounded-3" style="background-color:black;"  style="color:white;">
              <div class="modal-header">
                <h5 class="modal-title" id="shareModalLabel"  style="color:white;">Share this post</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color:#fff;"></button>
              </div>
              <div class="modal-body">
                <div class="d-flex justify-content-center gap-3 fs-4">
                  <i class="bi bi-facebook"  style="color:white;"></i>
                  <i class="bi bi-instagram"  style="color:white;"></i>
                  <i class="bi bi-twitter-x"  style="color:white;"></i>
                </div>
                <div class="mt-3 d-flex">
                  <input type="text" id="shareLinkInput" class="form-control" readonly value="${window.location.origin + window.location.pathname}?id=${post.id}">
                  <button class="btn btn-primary ms-2" id="copyShareLink">Copy</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="post" data-post-id="${post.id}">
            <div class="userName">
                <div style="display:flex; align-items:center; column-gap: 10px">
                    <img class="userImg" src="./img/boy.jpg" alt="userprofile">
                    <h5 class="name" id="userName">${post.user.username}</h5>
                    <mci-button border-radius="20px" text="BuddyUp" status="info" hover-effect="scale" text-color="white" style="scale: 0.84" variant="outline"></mci-button>
                </div>
                <!--<i class="bi bi-three-dots-vertical" id="threeDots"></i>-->
                <div class="dropdown postDropdown">
                    <i class="bi bi-three-dots-vertical" role="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li><a class="dropdown-item editOption" href="#">Edit</a></li>
                        <li><a class="dropdown-item deleteOption" href="#">Delete</a></li>
                    </ul>
                </div>

            </div>
            <div class="postImg">
                <img class="userPost" src="${post.image}" alt="logo">
                <div>
                    <i class="${isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'}" 
                       style="${isLiked ? 'color: red;' : ''}">&nbsp;${post.likes}</i>
                    <i class="bi bi-chat"></i>
                    <i class="bi bi-share shareButton" data-bs-toggle="modal" data-bs-target="#shareModal">&nbsp;${post.shares}</i>
                </div>
            </div>
            <div class="caption">
                <p>${post.caption}</p>
            </div>
        </div>
        <style>
        .userName{
            display:flex;
            justify-content:space-between;
        }
        .name{

        }
        .bi bi-three-dots-vertical{

        }
        `;

        postCardContainer.innerHTML += htmlContent;
    });
});


//comment

`<!-- COMMENT DRAWER (Appears on small screens when chat icon is clicked) -->
<div id="commentDrawer" class="comment-drawer">
  <div class="comment-header">
    <h5>Comments</h5>
    <button id="closeDrawerBtn">&times;</button>
  </div>
  <div id="commentBody" class="comment-body">
    <!-- Your comments will be injected here -->
  </div>
</div>
<style>
.comment-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  height: 100%;
  background-color: #1e1e1e;
  color: white;
  transition: right 0.3s ease-in-out;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.comment-drawer.show {
  right: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-body {
  margin-top: 1rem;
}

/* Only visible on ≤425px */
@media (max-width: 425px) {
  .comment-drawer {
    display: block;
  }
}
  .commentTop {
  display: flex;
  justify-content: space-between;
  column-gap: 5px;
  font-size: 12px;
}

.akash {
  font-size: 13px;
}

.cap {
  font-size: 11px;
}

.caps {
  font-size: 13px;
}

</style>

`
document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.querySelector(".postCardContainer");
    const drawer = document.getElementById("commentDrawer");
    const drawerBody = document.getElementById("commentBody");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");

    postContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("bi-chat")) {
            const postEl = e.target.closest(".post");
            const postId = postEl.dataset.postId;

            const db = JSON.parse(localStorage.getItem("kuttyx_db"));
            const post = db.posts.find(p => p.id == postId);

            drawerBody.innerHTML = "";

            if (!post.comments || post.comments.length === 0) {
                drawerBody.innerHTML = "<p>No comments yet.</p>";
            } else {
                post.comments.forEach(comment => {
                    const div = document.createElement("div");
                    div.className = "comment mb-3 p-2 rounded bg-dark text-white border";
                    div.innerHTML = `
              <div class="commentTop d-flex justify-content-between align-items-center mb-1">
                <div class="commentTopLeft d-flex align-items-center gap-2">
                  <img class="commentImg" src="./img/boy.jpg" width="30" height="30" style="border-radius:50%">
                  <h5 class="akash mb-0">${comment.user || 'Unknown'}</h5>
                </div>
                <p class="cap mb-0" style="font-size: 12px;">${getTimeAgo(comment.time)}</p>
              </div>
              <div class="commentBottom">
                <p class="caps mb-0">${comment.text}</p>
              </div>`;
                    drawerBody.appendChild(div);
                });

                drawerBody.innerHTML += `<div class="commentTypeBox">
                    <div class="commentType">
                        <textarea name="" id="txt_comment"></textarea>
                    </div>
                    <div class="commentButton">
                        <div class="commentBottomLeft">
                            <i class="bi bi-emoji-smile"></i>
                        </div>
                        <div class="commentBottomRight">
                            <button id="btn_share_cmt">Share</button>
                        </div>
                    </div>
                </div>`
            }

            if (window.innerWidth <= 425) {
                drawer.classList.add("show");
            }
        }
    });

    closeDrawerBtn.addEventListener("click", () => {
        drawer.classList.remove("show");
    });
});
