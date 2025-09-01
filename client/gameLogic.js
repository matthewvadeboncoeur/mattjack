// gameLogic.js

export async function deal(token, bet) {
    try {
        const response = await fetch('https://mattjack.onrender.com/game/deal', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bet })
        })
        const data = await response.json()
        if (response.ok)
            return data
        else if (response.status === 403) {
            localStorage.removeItem("token")
            window.location.href = "./index.html"
            return
        } else return alert(data.error)
    } catch (err) {
        alert(err)
    }
}

export async function hit(token) {
    try {
        const response = await fetch('https://mattjack.onrender.com/game/hit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (response.ok)
            return data
        else if (response.status === 403) {
            localStorage.removeItem("token")
            window.location.href = "./index.html"
            return
        } else return alert(data.error)
    } catch (err) {
        alert(err)
    }
}

export async function stand(token) {
    try {
        const response = await fetch('https://mattjack.onrender.com/game/stand', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`
            }
        })
        const data = await response.json()
        if (response.ok)
            return data
        else if (response.status === 403) {
            localStorage.removeItem("token")
            window.location.href = "./index.html"
            return
        } else return alert(data.error)
    } catch (err) {
        alert(err)
    }
}

export async function decide(token) {
    try {
        const response = await fetch('https://mattjack.onrender.com/game/decide', {
            headers: {
                'Authorization': `Bearer ${token.accessToken}`
            }
        })
        const data = await response.json()
        if (response.ok)
            return data
        else if (response.status === 403) {
            localStorage.removeItem("token")
            window.location.href = "./index.html"
            return
        } else return alert(data.error)
    } catch (err) {
        alert(err)
    }
}

export async function updateBalance(token, bet) {
    try {
        const response = await fetch('https://mattjack.onrender.com/game/updateBalance', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bet })
        })
        if (!response.ok) {
            const error = await response.json()
            console.log(error)
        } else if (response.status === 403) {
            localStorage.removeItem("token")
            window.location.href = './index.html'
            return
        }
    } catch (err) {
        alert(err)
    }
}

export async function getBalanceFromDb(token) {
    try {
        const response = await fetch('https://mattjack.onrender.com/user/balance', {
            headers: {
                'Authorization': `Bearer ${token.accessToken}`
            }
        })
        const data = await response.json()
        if (response.ok) return data.balance
        else if (response.status === 403) {
        localStorage.removeItem("token")
        window.location.href = './index.html'
        return
    }
        else alert(data.error || 'Could not fetch user balance')
        } catch (err) {
            alert('Server connection error')
        }
}

