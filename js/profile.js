document.addEventListener("DOMContentLoaded", () => {
    const db = JSON.parse(localStorage.getItem("kuttyx_db"));
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    const container = document.getElementById("profilePostsContainer");
  
    const userPosts = db.posts.filter(post => post.user.id === currentUser.id);
  
    userPosts.forEach(post => {
      const postCard = document.createElement("div");  
      postCard.classList.add('singlePost')
      postCard.innerHTML = `
        <div class="profile-post-card position-relative overflow-hidden rounded shadow-sm">
          <img src="${post.image}" class="img-fluid" alt="Post image">
          <div class="hover-overlay">
              <i class="bi bi-heart-fill me-1"></i> ${post.likes}
              &nbsp;&nbsp;
              <i class="bi bi-chat-fill ms-2"></i> ${post.comments?.length || 0}
          </div>
        </div>
      `;
  
      container.appendChild(postCard);
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  // Load user data
  const userData = JSON.parse(localStorage.getItem("current_user")) || { username: "Akash" };
  document.querySelectorAll(".akash").forEach(el => el.textContent = userData.username);

  // Handle Save Button
  document.getElementById("saveUsername").addEventListener("click", () => {
    const newUsername = document.getElementById("editUsername").value.trim();
    if (newUsername) {
      // Update DOM
      document.querySelectorAll(".akash").forEach(el => el.textContent = newUsername);

      // Update localStorage
      userData.username = newUsername;
      localStorage.setItem("current_user", JSON.stringify(userData));

      // Close modal
      const modalEl = document.getElementById("editProfileModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    }
  });
});




//bio

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("current_user"));
    const db = JSON.parse(localStorage.getItem("kuttyx_db"));

    // Show bio and username
    document.getElementById("usernameDisplay").textContent = capitalize(user.username);
    document.getElementById("userName").textContent = capitalize(user.username);
    document.getElementById("userBio").textContent = user.bio || "No bio added yet.";

    // Save button
    document.getElementById("saveUsername").addEventListener("click", () => {
        const newUsername = document.getElementById("editUsername").value.trim();
        const newBio = document.getElementById("editBio").value.trim();

        if (newUsername) user.username = newUsername;
        user.bio = newBio;

        // Update current_user
        localStorage.setItem("current_user", JSON.stringify(user));

        // Update in kuttyx_db
        const index = db.users.findIndex(u => u.id === user.id);
        if (index !== -1) db.users[index] = user;
        localStorage.setItem("kuttyx_db", JSON.stringify(db));

        // Update DOM
        document.getElementById("usernameDisplay").textContent = capitalize(user.username);
        document.getElementById("userName").textContent = capitalize(user.username);
        document.getElementById("userBio").textContent = user.bio || "No bio added yet.";

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById("editProfileModal")).hide();
    });
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


const editBio = document.getElementById('editBio');
const userBio = document.getElementById('userBio');
const editUsername = document.getElementById('editUsername');
const usernameDisplay = document.getElementById('usernameDisplay');

const currentUser = JSON.parse(localStorage.getItem('current_user')) || {
  username: 'Akash',
  bio: 'This is my awesome bio! ✨'
};

// When modal opens, fill the inputs with existing data
const editProfileModal = document.getElementById('editProfileModal');
editProfileModal.addEventListener('show.bs.modal', () => {
  editUsername.value = currentUser.username || '';
  editBio.value = currentUser.bio || '';
});

// Save button click - update localStorage and UI
document.getElementById('saveUsername').addEventListener('click', () => {
  const newUsername = editUsername.value.trim();
  const newBio = editBio.value.trim();

  if (newUsername) {
    currentUser.username = newUsername;
    usernameDisplay.textContent = newUsername;
    document.getElementById('userName').textContent = newUsername;
  }

  currentUser.bio = newBio;
  userBio.textContent = newBio;

  // Save updated user to localStorage
  localStorage.setItem('current_user', JSON.stringify(currentUser));

  // Close the modal manually (Bootstrap 5)
  const modal = bootstrap.Modal.getInstance(editProfileModal);
  modal.hide();
});
