const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let balance = 1500;
let gameOver = false;

// Elements
const playerCardsDiv = document.querySelector('.column:nth-child(1) .cards');
const dealerCardsDiv = document.querySelector('.column:nth-child(2) .cards');
const playerTotalP = document.querySelector('.column:nth-child(1) p');
const dealerTotalP = document.querySelector('.column:nth-child(2) p');
const resultDiv = document.querySelector('.result');
const balanceDiv = document.querySelector('.balance');
const hitBtn = document.querySelector('.hit');
const standBtn = document.querySelector('.stand');

// Create a new deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
}

// Shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Draw a card
function drawCard() {
    return deck.pop();
}

// Calculate hand total
function calculateTotal(hand) {
    let total = 0;
    let aces = 0;
    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) total += 10;
        else if (card.value === 'A') {
            total += 11;
            aces++;
        } else total += parseInt(card.value);
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

// Update the displayed cards
function updateDisplay() {
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    playerHand.forEach(c => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = `${c.value}${c.suit}`;
        playerCardsDiv.appendChild(cardEl);
    });

    dealerHand.forEach(c => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = `${c.value}${c.suit}`;
        dealerCardsDiv.appendChild(cardEl);
    });

    playerTotalP.textContent = `Total: ${calculateTotal(playerHand)}`;
    dealerTotalP.textContent = `Total: ${calculateTotal(dealerHand)}`;
}

// Start a new round
function newRound() {
    createDeck();
    shuffleDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    gameOver = false;
    resultDiv.textContent = '';
    resultDiv.className = 'result';
    updateDisplay();
}

// Determine winner
function determineWinner() {
    const playerTotal = calculateTotal(playerHand);
    const dealerTotal = calculateTotal(dealerHand);

    if (playerTotal > 21) {
        resultDiv.textContent = 'You lose!';
        resultDiv.classList.add('lose');
        balance -= 100;
    } else if (dealerTotal > 21) {
        resultDiv.textContent = 'You win!';
        resultDiv.classList.add('win');
        balance += 100;
    } else if (playerTotal > dealerTotal) {
        resultDiv.textContent = 'You win!';
        resultDiv.classList.add('win');
        balance += 100;
    } else if (playerTotal < dealerTotal) {
        resultDiv.textContent = 'You lose!';
        resultDiv.classList.add('lose');
        balance -= 100;
    } else {
        resultDiv.textContent = 'Push!';
        resultDiv.style.color = '#00CFFF';
    }

    balanceDiv.textContent = `$${balance}`;
    gameOver = true;
}

// Dealer's turn
function dealerPlay() {
    while (calculateTotal(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }
    updateDisplay();
    determineWinner();
}

// Button handlers
hitBtn.addEventListener('click', () => {
    if (gameOver) return;
    playerHand.push(drawCard());
    updateDisplay();

    if (calculateTotal(playerHand) > 21) {
        determineWinner();
    }
});

standBtn.addEventListener('click', () => {
    if (gameOver) return;
    dealerPlay();
});

// Start the first game
newRound();