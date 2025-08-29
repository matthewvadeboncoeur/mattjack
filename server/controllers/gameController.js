// gameController.js

const User = require('../models/User')

const gameSessions = {}

// {username : {deck, playerHand, dealerHand, bet}}

function createDeck() {
    const suits = ['diamonds', 'spades', 'clubs', 'hearts']
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']
    // const values = ['king', 'ace']
    let deck = []
    // 4 deck DECK
    for (let i = 0; i < 4; i++) {
        for (let suit of suits) {
            for (let value of values) {
                    deck.push({ value, suit})
                }
        }
    }
    return deck.sort(() => Math.random() - 0.5)
}

const deal = async (req, res) => {
    try {
        const { username } = req.user
        const { bet } = req.body
        const user = await User.findOne({ username })
        if (!user) return res.status(404).json({ error: 'User not found' })
        if (bet > user.balance) return res.status(400).json({ error: 'Insufficient balance' })
        user.balance -= bet
        await user.save()
        const deck = createDeck()
        const playerHand = [deck.pop(), deck.pop()]
        const dealerHand = [deck.pop(), deck.pop()]
        gameSessions[username] = {deck, playerHand, dealerHand, bet}
        console.log(gameSessions[username])
        res.json({
            playerHand,
            dealerHand,
            balance: user.balance
        })
    } catch (err) {
        res.status(500).json({ error: 'Server error!' })
    }
}

const hit = async (req, res) => {
    const { username } = req.user
    const session = gameSessions[username]
    if (!session) return res.status(400).json({ error : 'No active game' })
    session.playerHand.push(session.deck.pop())
    res.json({ playerHand: session.playerHand, dealerHand: session.dealerHand })
}

const stand = async (req, res) => {
    const { username } = req.user
    const session = gameSessions[username]
    if (!session) return res.status(400).json({ error : 'No active game' })
    let dealerValue = calculateHandValue(session.dealerHand)
    while (dealerValue < 17) {
        session.dealerHand.push(session.deck.pop())
        dealerValue = calculateHandValue(session.dealerHand)
    }
    console.log(calculateHandValue(session.dealerHand))
    res.json({ dealerHand: session.dealerHand, dealerValue: calculateHandValue(session.dealerHand) })
}

function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;
    for (let card of hand) {
        if (["jack", "queen", "king"].includes(card.value)) {
            total += 10;
        } else if (card.value === "ace") {
            total += 11;
            aces += 1;
        } else {
            total += parseInt(card.value, 10);
        }
    }
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }
    return total;
}

const decide = async (req, res) => {
    const { username } = req.user
    const session = gameSessions[username]
    if (!session) return res.status(400).json({ error : 'No active game' })
    const dealerTotal = calculateHandValue(session.dealerHand)
    res.json({ playerHand: session.playerHand, dealerTotal})
}

const updateBalance = async (req, res) => {
    const { username } = req.user
    const { bet } = req.body
    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.balance += Math.round(bet)
    await user.save()
    res.sendStatus(200)
}





module.exports = { deal, hit, stand, decide, updateBalance }