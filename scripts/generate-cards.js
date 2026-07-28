const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, '..', 'public', 'cards');

// Create cards directory if it doesn't exist
if (!fs.existsSync(cardsDir)) {
  fs.mkdirSync(cardsDir, { recursive: true });
}

// Tech modern color schemes
const colorSchemes = [
  { bg: '#0071e3', accent: '#00d4ff', gradient: 'from-blue-600 to-cyan-500' },
  { bg: '#1e40af', accent: '#06b6d4', gradient: 'from-blue-800 to-cyan-600' },
  { bg: '#1e3a8a', accent: '#0ea5e9', gradient: 'from-blue-900 to-sky-500' },
  { bg: '#0c4a6e', accent: '#00d4ff', gradient: 'from-slate-800 to-cyan-500' },
  { bg: '#164e63', accent: '#06b6d4', gradient: 'from-slate-900 to-cyan-600' },
  { bg: '#0f2438', accent: '#0ea5e9', gradient: 'from-gray-900 to-sky-500' },
];

// SVG template with tech modern design
function generateCardSVG(cardId, week, number, colorScheme) {
  const colors = colorSchemes[number % colorSchemes.length];

  return `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="grad-${cardId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.8" />
    </linearGradient>
    <filter id="glow-${cardId}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" fill="url(#grad-${cardId})"/>

  <!-- Grid Pattern -->
  <g opacity="0.1" stroke="white" stroke-width="1">
    <line x1="0" y1="150" x2="600" y2="150"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="0" y1="450" x2="600" y2="450"/>
    <line x1="150" y1="0" x2="150" y2="600"/>
    <line x1="300" y1="0" x2="300" y2="600"/>
    <line x1="450" y1="0" x2="450" y2="600"/>
  </g>

  <!-- Geometric Shapes -->
  <circle cx="150" cy="150" r="60" fill="${colors.accent}" opacity="0.3" filter="url(#glow-${cardId})"/>
  <circle cx="450" cy="450" r="80" fill="${colors.accent}" opacity="0.2" filter="url(#glow-${cardId})"/>

  <!-- Tech Lines -->
  <path d="M 100 300 Q 300 200 500 300" stroke="${colors.accent}" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
  <path d="M 100 350 Q 300 400 500 350" stroke="${colors.accent}" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/>

  <!-- Node Points -->
  <circle cx="100" cy="300" r="6" fill="${colors.accent}"/>
  <circle cx="300" cy="200" r="5" fill="${colors.accent}" opacity="0.7"/>
  <circle cx="500" cy="300" r="6" fill="${colors.accent}"/>

  <!-- Corner Elements -->
  <rect x="20" y="20" width="40" height="40" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
  <rect x="540" y="540" width="40" height="40" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
</svg>`;
}

// Generate all 30 cards
const cardsData = [
  // Week 1
  { id: '1-1', week: 1, number: 1 },
  { id: '1-2', week: 1, number: 2 },
  { id: '1-3', week: 1, number: 3 },
  { id: '1-4', week: 1, number: 4 },
  { id: '1-5', week: 1, number: 5 },
  { id: '1-6', week: 1, number: 6 },
  { id: '1-7', week: 1, number: 7 },
  // Week 2
  { id: '2-1', week: 2, number: 1 },
  { id: '2-2', week: 2, number: 2 },
  { id: '2-3', week: 2, number: 3 },
  { id: '2-4', week: 2, number: 4 },
  { id: '2-5', week: 2, number: 5 },
  { id: '2-6', week: 2, number: 6 },
  { id: '2-7', week: 2, number: 7 },
  // Week 3
  { id: '3-1', week: 3, number: 1 },
  { id: '3-2', week: 3, number: 2 },
  { id: '3-3', week: 3, number: 3 },
  { id: '3-4', week: 3, number: 4 },
  { id: '3-5', week: 3, number: 5 },
  { id: '3-6', week: 3, number: 6 },
  { id: '3-7', week: 3, number: 7 },
  { id: '3-8', week: 3, number: 8 },
  // Week 4
  { id: '4-1', week: 4, number: 1 },
  { id: '4-2', week: 4, number: 2 },
  { id: '4-3', week: 4, number: 3 },
  { id: '4-4', week: 4, number: 4 },
  { id: '4-5', week: 4, number: 5 },
  { id: '4-6', week: 4, number: 6 },
  { id: '4-7', week: 4, number: 7 },
  { id: '4-8', week: 4, number: 8 },
];

// Generate SVG for each card
cardsData.forEach(card => {
  const svg = generateCardSVG(card.id, card.week, card.number, colorSchemes[card.number % colorSchemes.length]);
  const fileName = path.join(cardsDir, `${card.id}.svg`);
  fs.writeFileSync(fileName, svg);
  console.log(`Generated: ${card.id}.svg`);
});

console.log(`\n✅ Generated ${cardsData.length} card images without text overlay`);
