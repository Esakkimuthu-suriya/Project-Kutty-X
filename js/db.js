function initDB() {
    const db = {
        users: [],
        posts: [],
        notifications: [],
        messages: [],
    }
    
    if (!localStorage.getItem('kuttyx_db')) {
        localStorage.setItem('kuttyx_db', JSON.stringify(db))       
    }
}
initDB()

function getDB() {
    return JSON.parse(localStorage.getItem('kuttyx_db'))
}

function saveDB(kuttyx_db) {
    localStorage.setItem('kuttyx_db', JSON.stringify(kuttyx_db))
}

function setUserName() {
    // To load username
    let userName = document.getElementById("userName")
    let currentUser = JSON.parse(localStorage.getItem('current_user'))
    userName.textContent = currentUser.username[0].toUpperCase() + currentUser.username.slice(1)
}