// auth.js


window.addEventListener("load", function () {
    const authButtons = document.getElementById('auth-buttons')

    const logInButton = document.getElementById('logIn')
    const signUpButton = document.getElementById('signUp')
    
    const logInForm = document.getElementById('logInDiv')
    const signUpForm = document.getElementById('signUpDiv')
    
    const nextSign = document.getElementById('nextSign')
    if (nextSign) nextSign.addEventListener('click', signUp)
    
    const nextLog = document.getElementById('nextLog')
    if (nextLog) nextLog.addEventListener('click', logIn)
    
    if (logInButton) logInButton.addEventListener('click', func1)
    if (signUpButton) signUpButton.addEventListener('click', func2)
    
    function func1() {
        logInForm.classList.remove('hidden')
        signUpForm.classList.add('hidden')
        authButtons.classList.add('hidden')
        logInForm.classList.add('flex')
    }
    
    function func2() {
        logInForm.classList.add('hidden')
        signUpForm.classList.remove('hidden')
        signUpForm.classList.add('flex')
        authButtons.classList.add('hidden')
    }


    function signUp() {
        const username = document.getElementById('usernameS')
        const password = document.getElementById('passwordS')
        if (!username || !password) return;
        fetch('http://localhost:3000/auth/signup', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
                balance: 2000
            })
        })
        .then(async (response) => {
            const data = await response.json()
            if (response.ok) {
                localStorage.setItem('auth', JSON.stringify({
                    accessToken: data.accessToken,
                    username: username.value
                }))
                window.location.href = 'game.html'
            } else
                alert(data.error)
        })
    }

    function logIn() {

    }

});