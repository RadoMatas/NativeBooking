/**
 * Faraon / Prší Online Client Application
 */

const socket = io();

// DOM Elements
const viewLanding = document.getElementById('viewLanding');
const viewRoomLobby = document.getElementById('viewRoomLobby');
const viewGameTable = document.getElementById('viewGameTable');

const inputPlayerName = document.getElementById('inputPlayerName');
const inputRoomCode = document.getElementById('inputRoomCode');

const btnCreateRoom = document.getElementById('btnCreateRoom');
const btnJoinRoom = document.getElementById('btnJoinRoom');
const btnAddAI = document.getElementById('btnAddAI');
const btnStartGame = document.getElementById('btnStartGame');
const btnDrawCard = document.getElementById('btnDrawCard');
const btnShareLink = document.getElementById('btnShareLink');
const btnRules = document.getElementById('btnRules');
const btnCloseRules = document.getElementById('btnCloseRules');
const btnPlayAgain = document.getElementById('btnPlayAgain');

const displayRoomCode = document.getElementById('displayRoomCode');
const lobbyPlayerList = document.getElementById('lobbyPlayerList');
const opponentsArea = document.getElementById('opponentsArea');
const topDiscardCardWrapper = document.getElementById('topDiscardCardWrapper');
const drawCountBadge = document.getElementById('drawCountBadge');
const drawPile = document.getElementById('drawPile');
const activeSuitBadge = document.getElementById('activeSuitBadge');
const statusBanner = document.getElementById('statusBanner');
const playerHand = document.getElementById('playerHand');
const myPlayerName = document.getElementById('myPlayerName');

const modalSuitPicker = document.getElementById('modalSuitPicker');
const modalGameOver = document.getElementById('modalGameOver');
const modalRules = document.getElementById('modalRules');

const winTitle = document.getElementById('winTitle');
const winSubtext = document.getElementById('winSubtext');

let currentGameState = null;
let pendingCardIdToPlay = null;

// Sound Effects via Web Audio API (No missing audio file issues!)
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'card') {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio restriction errors
  }
}

// Check for Room query param in URL (e.g., ?room=FARAON-1234)
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    inputRoomCode.value = roomParam.toUpperCase();
  }
});

// Toast Notifications
function showToast(message, isError = false) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ---------------------------------------------------
// Socket Event Listeners
// ---------------------------------------------------

btnCreateRoom.addEventListener('click', () => {
  const playerName = inputPlayerName.value.trim() || 'Hráč 1';
  socket.emit('create_room', { playerName });
});

btnJoinRoom.addEventListener('click', () => {
  const playerName = inputPlayerName.value.trim() || 'Hráč';
  const roomId = inputRoomCode.value.trim();
  if (!roomId) {
    return showToast('Zadej kód místnosti!', true);
  }
  socket.emit('join_room', { roomId, playerName });
});

btnAddAI.addEventListener('click', () => {
  socket.emit('add_ai_bot');
});

btnStartGame.addEventListener('click', () => {
  socket.emit('start_game');
});

btnDrawCard.addEventListener('click', () => {
  socket.emit('draw_card');
});

drawPile.addEventListener('click', () => {
  socket.emit('draw_card');
});

btnPlayAgain.addEventListener('click', () => {
  modalGameOver.classList.add('hidden');
  socket.emit('restart_game');
});

btnShareLink.addEventListener('click', () => {
  if (currentGameState && currentGameState.roomId) {
    const shareUrl = `${window.location.origin}/?room=${currentGameState.roomId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('🔗 Odkaz zkopírován do schránky!');
    }).catch(() => {
      showToast(`Místnost: ${currentGameState.roomId}`);
    });
  }
});

btnRules.addEventListener('click', () => modalRules.classList.remove('hidden'));
btnCloseRules.addEventListener('click', () => modalRules.classList.add('hidden'));

// Suit Picker Click
document.querySelectorAll('.suit-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const suit = e.currentTarget.dataset.suit;
    if (pendingCardIdToPlay) {
      socket.emit('play_card', { cardId: pendingCardIdToPlay, chosenSuit: suit });
      pendingCardIdToPlay = null;
      modalSuitPicker.classList.add('hidden');
    }
  });
});

// Socket Events
socket.on('room_created', ({ roomId }) => {
  displayRoomCode.innerText = roomId;
  switchView(viewRoomLobby);
  btnShareLink.classList.remove('hidden');
  showToast(`Místnost ${roomId} vytvořena!`);
});

socket.on('room_joined', ({ roomId }) => {
  displayRoomCode.innerText = roomId;
  switchView(viewRoomLobby);
  btnShareLink.classList.remove('hidden');
  showToast(`Připojeno k místnosti ${roomId}!`);
});

socket.on('error_msg', (msg) => {
  showToast(msg, true);
});

socket.on('game_state', (state) => {
  currentGameState = state;
  renderState(state);
});

// View Switcher
function switchView(targetView) {
  [viewLanding, viewRoomLobby, viewGameTable].forEach(v => v.classList.add('hidden'));
  targetView.classList.remove('hidden');
}

// Main Render Function
function renderState(state) {
  if (state.status === 'waiting') {
    switchView(viewRoomLobby);
    renderLobby(state);
  } else if (state.status === 'playing' || state.status === 'finished') {
    switchView(viewGameTable);
    renderTable(state);

    if (state.status === 'finished' && state.winner) {
      winTitle.innerText = state.winner === socket.id ? '🎉 Vítězství!' : 'Konec Hry';
      winSubtext.innerText = `${state.winner} vyhrál hru!`;
      modalGameOver.classList.remove('hidden');
      playSound('win');
    }
  }
}

// Render Lobby
function renderLobby(state) {
  lobbyPlayerList.innerHTML = state.players.map(p => `
    <div class="lobby-player-item">
      <div class="avatar">${p.isAI ? '🤖' : '👤'}</div>
      <div class="name">${p.name} ${p.id === socket.id ? '(Vy)' : ''}</div>
    </div>
  `).join('');
}

// Render Table
function renderTable(state) {
  const myPlayer = state.players.find(p => p.id === socket.id);
  const isMyTurn = state.currentTurnPlayerId === socket.id;

  // Turn status
  myPlayerName.innerText = isMyTurn ? 'Jsi na řadě!' : `Na řadě je: ${state.players[state.currentTurnIndex]?.name || ''}`;

  // Opponents Area
  const opponents = state.players.filter(p => p.id !== socket.id);
  opponentsArea.innerHTML = opponents.map(op => `
    <div class="opponent-seat ${op.isCurrentTurn ? 'active-turn' : ''}">
      <span class="avatar">${op.isAI ? '🤖' : '👤'}</span>
      <span class="name">${op.name}</span>
      <span class="card-count-badge">🂠 ${op.cardCount}</span>
    </div>
  `).join('');

  // Draw & Discard Piles
  drawCountBadge.innerText = state.drawPileCount;

  if (state.topDiscardCard) {
    topDiscardCardWrapper.innerHTML = renderCardHTML(state.topDiscardCard);
  }

  // Active Suit Badge
  if (state.activeSuitMeta) {
    activeSuitBadge.innerText = `${state.activeSuitMeta.symbol} ${state.activeSuitMeta.name}`;
    activeSuitBadge.style.color = state.activeSuitMeta.color;
  }

  // Special Status Banner
  if (state.pendingDrawCount > 0) {
    statusBanner.classList.remove('hidden');
    statusBanner.innerText = `⚠️ Trestná Sedma! Další hráč bere +${state.pendingDrawCount} karty!`;
  } else if (state.pendingAceSkip) {
    statusBanner.classList.remove('hidden');
    statusBanner.innerText = `⚠️ Eso! Další hráč stoji (přeskakuje tah).`;
  } else {
    statusBanner.classList.add('hidden');
  }

  // Render Player Hand
  if (myPlayer && myPlayer.hand) {
    playerHand.innerHTML = myPlayer.hand.map(card => renderCardHTML(card)).join('');

    // Attach click listeners to cards
    document.querySelectorAll('#playerHand .playing-card').forEach(cardEl => {
      cardEl.addEventListener('click', (e) => {
        if (!isMyTurn) {
          return showToast('Počkej, nejsi na řadě!', true);
        }

        const cardId = cardEl.dataset.cardId;
        const cardObj = myPlayer.hand.find(c => c.id === cardId);

        if (!cardObj) return;

        // If card is Ober (Queen), open Suit Picker modal first
        if (cardObj.rank === 'Q') {
          pendingCardIdToPlay = cardId;
          modalSuitPicker.classList.remove('hidden');
        } else {
          socket.emit('play_card', { cardId });
          playSound('card');
        }
      });
    });
  }
}
