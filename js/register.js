const form = document.getElementById("registerForm")

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const formData = new FormData(form)
    const registerData = Object.fromEntries(formData)

    if (!registerData.email || !registerData.password || !registerData.username) {
        alert("Please fill out all the fields.")
        return
    }

    const kuttyx_db = getDB()
    let users = kuttyx_db.users

    const matchedUser = users.find(user => user.email == registerData.email)

    if (matchedUser) {
        alert("User already registered. Please login to continue.")
        return;
    }

    const userId = "user_"+Date.now()

    registerData['id'] = userId

    kuttyx_db.users.push(registerData)

    saveDB(kuttyx_db)

    localStorage.setItem("current_user", JSON.stringify(registerData))

    alert("User Registered and Login Successful 🎉")
    location.href = "/index.html"
    console.log(registerData)
})