/**
 * Card UI Renderer
 * Generates HTML/SVG card elements for Czech Mariáš / French suit decks
 */

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  leaves: '♠',
  acorns: '♣'
};

const SUIT_CLASSES = {
  hearts: 'red',
  diamonds: 'purple',
  leaves: 'green',
  acorns: 'black'
};

function renderCardHTML(card, options = {}) {
  if (!card) return '';

  const suitSymbol = SUIT_SYMBOLS[card.suit] || '♥';
  const colorClass = SUIT_CLASSES[card.suit] || 'black';
  const isSelected = options.isSelected ? 'selected' : '';

  return `
    <div class="playing-card ${colorClass} ${isSelected}" data-card-id="${card.id}">
      <div class="corner-top">
        <span class="rank">${card.rank}</span>
        <span class="suit-icon">${suitSymbol}</span>
      </div>
      <div class="center-symbol">${suitSymbol}</div>
      <div class="corner-bottom">
        <span class="rank">${card.rank}</span>
        <span class="suit-icon">${suitSymbol}</span>
      </div>
    </div>
  `;
}
