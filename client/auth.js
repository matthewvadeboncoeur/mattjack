// auth.js


window.addEventListener("load", function () {
    const authButtons = document.getElementById('auth-buttons')

    const logInButton = document.getElementById('logIn')
    const signUpButton = document.getElementById('signUp')
    
    const logInForm = document.getElementById('logInDiv')
    const signUpForm = document.getElementById('signUpDiv')

    const backLog = document.getElementById('backLog')
    const backSign = document.getElementById('backSign')
    
    const nextSign = document.getElementById('nextSign')
    if (nextSign) nextSign.addEventListener('click', signUp)
    
    const nextLog = document.getElementById('nextLog')
    if (nextLog) nextLog.addEventListener('click', logIn)
    
    if (logInButton) logInButton.addEventListener('click', func1)
    if (signUpButton) signUpButton.addEventListener('click', func2)

    if (backLog) backLog.addEventListener('click', goBack)
    if (backSign) backSign.addEventListener('click', goBack)
    
    function func1() {
        logInForm.classList.remove('hidden')
        signUpForm.classList.add('hidden')
        authButtons.classList.add('hidden')
        logInForm.classList.add('flex')
        backLog.classList.remove('hidden')
        backSign.classList.add('hidden')
    }
    
    function func2() {
        logInForm.classList.add('hidden')
        signUpForm.classList.remove('hidden')
        signUpForm.classList.add('flex')
        authButtons.classList.add('hidden')
        backSign.classList.remove('hidden')
        backLog.classList.add('hidden')
    }

    function goBack() {
        logInForm.classList.add('hidden')
        logInForm.classList.remove('flex')
        signUpForm.classList.add('hidden')
        signUpForm.classList.remove('flex')
        backLog.classList.add('hidden')
        backSign.classList.add('hidden')
        authButtons.classList.remove('hidden')
        document.getElementById('usernameS').value = ''
        document.getElementById('passwordS').value = ''
        document.getElementById('usernameL').value = ''
        document.getElementById('passwordL').value = ''

    }


    function signUp() {
        const username = document.getElementById('usernameS')
        const password = document.getElementById('passwordS')
        if (!username.value || !password.value) return
        fetch('https://mattjack.onrender.com/auth/signup', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
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
            } else {
                alert(data.error)
                username.value = ''
                password.value = ''
            }
        })
    }

    function logIn() {
        const username = document.getElementById('usernameL')
        const password = document.getElementById('passwordL')
        if (!username.value || !password.value) return
        try {
            fetch('https://mattjack.onrender.com/auth/login', {
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
                } else {
                    alert(data.error)
                    username.value = ''
                    password.value = ''
                }
            })
        } catch (err) {
            alert("Server is waking up! Please try again shortly")
        }

    }

});