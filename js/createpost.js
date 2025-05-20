setUserName()

const fileInput = document.getElementById("fileInput");
const createPostBox = document.querySelector(".createPostBox");
let captionBox = document.getElementById("captionBox");
let shareButton = document.getElementById("shareButton");


// Edit Post

const search = window.location.search
const urlParam = new URLSearchParams(search)
let postId;

if (urlParam.size > 0) {
  shareButton.innerText = "Update";
  console.log(urlParam.get('id'))

  postId = urlParam.get('id')

  const db = JSON.parse(localStorage.getItem("kuttyx_db"));
  const editPost = db.posts.find(p => p.id == postId);


  const existingImg = createPostBox.querySelector("img");
  if (existingImg) {
    existingImg.remove();
  }

  const img = document.createElement("img");
  img.src = editPost.image;
  img.alt = "Selected Image";
  img.style.maxWidth = "100%";
  img.style.marginTop = "10px";
  img.style.borderRadius = "10px";

  createPostBox.appendChild(img);

  captionBox.value = editPost.caption
}


fileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const existingImg = createPostBox.querySelector("img");
      if (existingImg) {
        existingImg.remove();
      }

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Selected Image";
      img.style.maxWidth = "100%";
      img.style.marginTop = "10px";
      img.style.borderRadius = "10px";

      createPostBox.appendChild(img);
    };

    reader.readAsDataURL(file);
  } else {
    alert("Please select a valid image file.");
  }
});

shareButton.addEventListener("click", () => {
  if (urlParam.size === 0) {
    let file = fileInput.files[0];

    if (file) {
      let reader = new FileReader();

      reader.onload = function (e) {
        let imageBase64 = e.target.result;

        const kuttyx_db = getDB()

        let postData = {
          id: "post_" + Date.now(),
          caption: captionBox.value,
          image: imageBase64,
          likes: 0,
          comments: [],
          shares: 0,
          createdAt: new Date(),
          user: JSON.parse(localStorage.getItem("current_user"))
        }

        kuttyx_db.posts.push(postData)

        saveDB(kuttyx_db)

        alert("Post Created Successful 🎉")
        location.href = "/index.html"
      };

      reader.readAsDataURL(file);
    } else {
      alert("No image selected.");
    }

  }
  else {
    let updatedCaption = captionBox.value;
    let updatedImage = createPostBox.querySelector("img").src;

    const db = JSON.parse(localStorage.getItem("kuttyx_db"));
    const postIndex = db.posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
      db.posts[postIndex].caption = updatedCaption;
      db.posts[postIndex].image = updatedImage;

      localStorage.setItem("kuttyx_db", JSON.stringify(db));

      alert("Post updated successfully 🎉");
      location.href = "/index.html";
    }
  }
});