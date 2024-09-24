const images = [
    'img/bat.png', 'img/dracolord.png', 'img/estark.png', 'img/golem.png', 
    'img/healslime.png', 'img/metal_king_slime.png', 'img/quimera.png', 'img/slime.png'
  ];

  let shuffledCards = [];
    let firstCard = null;
    let secondCard = null;
    let currentPlayer = 1;
    let player1Pairs = [];
    let player2Pairs = [];
    let player1Name = "";
    let player2Name = "";
    let gameStatusEl = document.getElementById('gameStatus');
    let player1BoardEl = document.getElementById('player1Board');
    let player2BoardEl = document.getElementById('player2Board');

    document.getElementById('startGameBtn').addEventListener('click', startGame);

    function startGame() {
      player1Name = document.getElementById('player1').value;
      player2Name = document.getElementById('player2').value;

      if (!player1Name || !player2Name) return;

      player1Pairs = [];
      player2Pairs = [];
      currentPlayer = 1;

      shuffledCards = [...images, ...images].sort(() => 0.5 - Math.random());

      gameStatusEl.innerText = `${player1Name}'s turno`;
      player1BoardEl.innerHTML = `<strong>${player1Name}</strong><br>Parejas: 0`;
      player2BoardEl.innerHTML = `<strong>${player2Name}</strong><br>Parejas: 0`;

      renderBoard();

      const modalElement = document.getElementById('playersModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    function renderBoard() {
      const gameBoard = document.getElementById('gameBoard');
      gameBoard.innerHTML = '';

      shuffledCards.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'hidden');
        card.setAttribute('data-image', imgSrc);
        card.setAttribute('data-index', index);
        card.addEventListener('click', handleCardClick);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const img = document.createElement('img');
        img.src = imgSrc;
        cardBack.appendChild(img);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        gameBoard.appendChild(card);
      });
    }

    function handleCardClick(e) {
      const clickedCard = e.target.closest('.card');

      if (clickedCard.classList.contains('matched') || clickedCard === firstCard) return;

      revealCard(clickedCard);

      if (!firstCard) {
        firstCard = clickedCard;
      } else {
        secondCard = clickedCard;
        checkMatch();
      }
    }

    function revealCard(card) {
      card.classList.add('revealed');
    }

    function hideCard(card) {
      card.classList.remove('revealed');
    }

    function checkMatch() {
      const isMatch = firstCard.getAttribute('data-image') === secondCard.getAttribute('data-image');

      if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        addPairToPlayer(firstCard.getAttribute('data-image'));
        resetCards();
        checkWin();
      } else {
        firstCard.classList.add('mismatch');
        secondCard.classList.add('mismatch');
        setTimeout(() => {
          firstCard.classList.remove('mismatch');
          secondCard.classList.remove('mismatch');
          hideCard(firstCard);
          hideCard(secondCard);
          resetCards();
          switchTurn();
        }, 1000);
      }
    }

    function resetCards() {
      firstCard = null;
      secondCard = null;
    }

    function switchTurn() {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      gameStatusEl.innerText = `${currentPlayer === 1 ? player1Name : player2Name}'s turno`;
    }

    function addPairToPlayer(image) {
      if (currentPlayer === 1) {
        player1Pairs.push(image);
        player1BoardEl.innerHTML = `<strong>${player1Name}</strong><br>Parejas: ${player1Pairs.length}`;
      } else {
        player2Pairs.push(image);
        player2BoardEl.innerHTML = `<strong>${player2Name}</strong><br>Parejas: ${player2Pairs.length}`;
      }
    }

    function checkWin() {
      if (player1Pairs.length + player2Pairs.length === images.length) {
        const winner =
          player1Pairs.length > player2Pairs.length
            ? player1Name
            : player2Pairs.length > player1Pairs.length
            ? player2Name
            : "Empate";
        gameStatusEl.innerHTML = `¡El juego ha terminado! Ganador: <span class="winner">${winner}</span>`;
      }
    }