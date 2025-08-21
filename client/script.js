// script.js

window.addEventListener("load", function () {
    const token = localStorage.getItem('auth');
    if (!token) {
        window.location.href = 'index.html'
        return
    }
    const parsedToken = JSON.parse(token)
    console.log(parsedToken.accessToken)
    console.log(parsedToken.username)



});