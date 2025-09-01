// script.js
import { deal, hit, stand, decide, updateBalance, getBalanceFromDb } from './gameLogic.js'

window.addEventListener("load", async function () {
    const auth = localStorage.getItem('auth')
    if (!auth) {
        window.location.href = 'index.html'
        return
    }
    const token = JSON.parse(localStorage.getItem('auth'))

    async function checkBankrupt(token) {
        if (await getBalanceFromDb(token) < 1) {
            alert('No more money :(')
            alert('Here is $2000 more !!!!')
            await updateBalance(token, 2000)
            document.getElementById('balance').innerText = `Balance $${Math.round(await getBalanceFromDb(token))}`
        }
    }

    document.getElementById('balance').innerText = `Balance $${Math.round(await getBalanceFromDb(token))}`


    let curBet = 0


    document.getElementById('clearBet').addEventListener('click', clearCurBet)
    function clearCurBet() {
        curBet = 0
        document.getElementById('currentBet').innerText = `Current Bet: $0`
    }
    

    const twothousandButton = document.getElementById('2000')
    const fivehundredButton = document.getElementById('500')
    const onehundredButton = document.getElementById('100')
    const twentyfiveButton = document.getElementById('25')
    const oneButton = document.getElementById('1')
    
    async function updateBet(value) {
        const curBalance = await getBalanceFromDb(token)
        if (curBet + value <= curBalance) {
            curBet = curBet + value
            document.getElementById('currentBet').innerText = `Current Bet: $${curBet}`
        }
    }

    twothousandButton.addEventListener('click', () => updateBet(2000))
    fivehundredButton.addEventListener('click', () => updateBet(500))
    onehundredButton.addEventListener('click', () => updateBet(100))
    twentyfiveButton.addEventListener('click', () => updateBet(25))
    oneButton.addEventListener('click', () => updateBet(1))
    
    const placeBetButton = document.getElementById('placeBet')
    placeBetButton.addEventListener('click', startGame)

    async function showBalance() {
        const newBalance = await getBalanceFromDb(token)
        const rounded = Math.round(newBalance)
        document.getElementById('balance').innerText = `Balance $${rounded}`

    }

    function showPlayerCards(gameState) {
        const hand = gameState.playerHand
        const dealerHand = gameState.dealerHand
        const firstCardValue = hand[0].value
        const firstCardSuit = hand[0].suit 
        const secondCardValue = hand[1].value
        const secondCardSuit = hand[1].suit
        const firstCardLink = `./assets/cards/${firstCardValue}_of_${firstCardSuit}.svg`
        const secondCardLink = `./assets/cards/${secondCardValue}_of_${secondCardSuit}.svg`
        const playerDiv = document.getElementById('playerDiv')
        const firstCard = document.createElement('img')
        firstCard.src = firstCardLink
        const secondCard = document.createElement('img')
        secondCard.src = secondCardLink
        playerDiv.appendChild(firstCard)
        playerDiv.appendChild(secondCard)
        const dealerShowValue = dealerHand[0].value
        const dealerShowSuit = dealerHand[0].suit
        const dealerShowCardLink = `./assets/cards/${dealerShowValue}_of_${dealerShowSuit}.svg`
        const dealerShowCard = document.createElement('img')
        dealerShowCard.src = dealerShowCardLink
        dealerDiv.appendChild(dealerShowCard)
        const back = document.createElement('img')
        back.src = './assets/cards/cardBack.png'
        dealerDiv.appendChild(back)
        const text = document.createElement('p')
        text.id = 'total'
        text.innerText = countPlayerValue(gameState)
        playerDiv.appendChild(text)

        if (checkBlackJack(gameState.playerHand)) {
            const dealerDiv = document.getElementById('dealerDiv')
            dealerDiv.innerHTML = ''
            for (let i = 0; i < 2; i++) {
                showNewDealerCard(gameState.dealerHand[i])
            }
            decideWinner(1)
        }
    }

    function hideBetUI() {
        document.getElementById('bets').classList.add('hidden')
    }

    function hideGameUI() {
        document.getElementById('newDiv').remove()
    }

    function showNewPlayerCard(cardObj) {
        const playerDiv = document.getElementById('playerDiv')
        const newCard = document.createElement('img')
        const newCardValue = cardObj.value
        const newCardSuit = cardObj.suit
        const newCardLink = `./assets/cards/${newCardValue}_of_${newCardSuit}.svg`
        newCard.src = newCardLink
        playerDiv.appendChild(newCard)
    }

    function showNewDealerCard(cardObj) {
        const dealerDiv = document.getElementById('dealerDiv')
        const newCard = document.createElement('img')
        const newCardValue = cardObj.value
        const newCardSuit = cardObj.suit
        const newCardLink = `./assets/cards/${newCardValue}_of_${newCardSuit}.svg`
        newCard.src = newCardLink
        dealerDiv.appendChild(newCard)
    }

    function countPlayerValue(handObj) {
        const playerHand = handObj.playerHand;
        let total = 0;
        let aces = 0;
        for (let card of playerHand) {
            if (["jack", "queen", "king"].includes(card.value))
                total += 10;
            else if (card.value === "ace") {
                total += 11;
                aces += 1;
            } else
                total += parseInt(card.value, 10);
        }
        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }
        return total;
    }

    function bust(dealerHand) {
        document.getElementById('newDiv').classList.add('hidden')
        const dealerDiv = document.getElementById('dealerDiv')
        dealerDiv.innerHTML = ''
        for (let i = 0; i < dealerHand.length; i++) {
            showNewDealerCard(dealerHand[i])
        }
        setTimeout(() => { restart() }, 3200)
    }

    function deleteAndAddTotal(gameState) {
        document.getElementById('total').remove()
        const playerDiv = document.getElementById('playerDiv')
        const text = document.createElement('p')
        text.id = 'total'
        text.innerText = countPlayerValue(gameState)
        playerDiv.appendChild(text)

    }

    async function playerHit() {
        const newHandObj = await hit(token)
        const newHand = newHandObj.playerHand
        const newCard = newHand[newHand.length - 1]
        showNewPlayerCard(newCard)
        deleteAndAddTotal(newHandObj)
        const playerTotal = countPlayerValue(newHandObj)
        if (playerTotal == 21) playerStand()
        if (playerTotal > 21) bust(newHandObj.dealerHand)
    }

    function showDealerTotal(total) {
        const dealerDiv = document.getElementById('dealerDiv')
        const text = document.createElement('p')
        text.id = 'total'
        text.innerText = total
        dealerDiv.appendChild(text)
    }

    async function playerStand() {
        const newDealerHandObj = await stand(token)
        const dealerHand = newDealerHandObj.dealerHand
        const dealerDiv = document.getElementById('dealerDiv')
        dealerDiv.innerHTML = ''
        for (let i = 0; i < dealerHand.length; i++) {
            showNewDealerCard(dealerHand[i])
        }
        showDealerTotal(newDealerHandObj.dealerValue)
        decideWinner()
    }

    async function decideWinner(hasBj) {
        const decision = await decide(token)
        const playerTotal = countPlayerValue(decision)
        const dealerTotal = decision.dealerTotal
        if (playerTotal == dealerTotal) await updateBalance(token, curBet)
        else if (hasBj) await updateBalance(token, curBet + 1.5 * curBet)
        else if (dealerTotal > 21 || playerTotal > dealerTotal) await updateBalance(token, 2 * curBet)
        await showBalance()
        document.getElementById('newDiv').classList.add('hidden')
        setTimeout(() => { restart() }, 3200)
    }

    function clearCards() {
        document.getElementById('playerDiv').innerHTML = ''
        document.getElementById('dealerDiv').innerHTML = ''

    }

    function restart() {
        curBet = 0
        document.getElementById('currentBet').innerText = `Current Bet: $${curBet}`
        clearCards()
        document.getElementById('newDiv').classList.remove('hidden')
        hideGameUI()
        document.getElementById('bets').classList.remove('hidden');
        checkBankrupt(token)
    }

    function createGameUI() {
        const gameContainer = document.getElementById('gameContainer')
        const newDiv = document.createElement('div')
        newDiv.id = 'newDiv'
        gameContainer.appendChild(newDiv)
        newDiv.classList.add('logic')
        const standButton = document.createElement('button')
        const hitButton = document.createElement('button')
        standButton.textContent = 'Stand'
        hitButton.textContent = 'Hit'
        standButton.classList.add('red')
        hitButton.classList.add('green')
        newDiv.appendChild(standButton)
        newDiv.appendChild(hitButton)
        hitButton.addEventListener('click', playerHit)
        standButton.addEventListener('click', playerStand)
    }

    function checkBlackJack(hand) {
        let hasAce = false;
        let hasTenValue = false;
        for (let card of hand) {
            if (card.value === "ace") {
                hasAce = true;
            } else if (
                card.value === "10" || 
                card.value === "jack" || 
                card.value === "queen" || 
                card.value === "king"
            ) {
                hasTenValue = true;
            }
        }
        return hasAce && hasTenValue;
    }



    async function startGame() {
        if (!curBet) return
        const gameState = await deal(token, curBet)
        await showBalance()
        hideBetUI()
        showPlayerCards(gameState)
        createGameUI()
    }

});