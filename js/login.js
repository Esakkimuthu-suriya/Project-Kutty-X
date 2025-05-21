const form = document.getElementById('loginForm')

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const formData = new FormData(form)
    const loginData = Object.fromEntries(formData)

    if (!loginData.email || !loginData.password) {
        alert("Please fill out all the fields.")
        return
    }

    const kuttyx_db = getDB()

    let users = kuttyx_db.users

    const matchedUser = users.find(user => user.email == loginData.email)

    if (!matchedUser) {
        alert("Invalid user. Please register to continue.")
        return;
    }

    if (matchedUser.password !== loginData.password) {
        alert("Email is correct, but your password is wrong. Try again!")
        return;
    }

    localStorage.setItem("current_user", JSON.stringify(matchedUser))

    alert("Login Successful 🎉")
    location.href = "index.html"
})