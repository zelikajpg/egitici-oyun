// Oyun Durumu
const gameState = {
    currentScreen: 'mainMenu',
    selectedCharacter: null,
    totalStars: 0,
    currentColor: '#FF6B6B',
    currentTemplate: null,
    memoryCards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    currentSound: null,
    currentNumber: 5,
    scores: {
        coloring: 0,
        memory: 0,
        puzzle: 0,
        cipher: 0,
        sounds: 0,
        video: 0,
        story: 0,
        numbers: 0
    }
};

// Google AI Studio - Netlify Function üzerinden çağrılacak
// API Key artık güvenli bir şekilde backend'de saklanıyor!

// Karakterler
const characters = {
    lion: { emoji: '🦁', name: 'Aslan Leo' },
    cat: { emoji: '🐱', name: 'Kedi Minnos' },
    rabbit: { emoji: '🐰', name: 'Tavşan Pamuk' },
    bear: { emoji: '🐻', name: 'Ayı Boncuk' }
};

// Sayfa Yüklendiğinde - Direkt ana menü
window.addEventListener('load', () => {
    // Yükleme ekranı yok, direkt başla
    console.log('Oyun hazır!');
});

// Ekran Geçişleri
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;
    playSound('click');
}

function showMainMenu() {
    showScreen('mainMenu');
}

function showCharacterSelect() {
    showScreen('characterSelect');
}

function showInstructions() {
    showScreen('instructions');
}

function showGameMenu() {
    showScreen('gameMenu');
    updateScoreDisplay();
}

function backToGameMenu() {
    showGameMenu();
}

function backToMainMenu() {
    showMainMenu();
}

// Karakter Seçimi
function selectCharacter(characterId) {
    gameState.selectedCharacter = characterId;
    const character = characters[characterId];
    
    // Seçilen karakteri vurgula
    document.querySelectorAll('.character-card').forEach(card => {
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
    });
    
    event.target.closest('.character-card').style.opacity = '1';
    event.target.closest('.character-card').style.transform = 'scale(1.1)';
    
    document.getElementById('playerCharacter').textContent = character.emoji;
    document.getElementById('playerName').textContent = character.name;
    
    playSound('success');
    
    // Sesli karşılama
    const greetings = [
        `Merhaba! Ben ${character.name}. Birlikte çok eğleneceğiz!`,
        `Harika seçim! ${character.name} hazır!`,
        `Hoş geldin! Ben ${character.name}, hadi oyunlara başlayalım!`
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    speak(randomGreeting);
    
    setTimeout(() => {
        showGameMenu();
    }, 1500);
}

// Oyun Başlatma
function startGame(gameType) {
    playSound('click');
    
    const gameNames = {
        'coloring': 'Boyama Atölyesi',
        'memory': 'Hafıza Oyunu',
        'puzzle': 'Şekil Bulma',
        'cipher': 'Şifre Çözme',
        'sounds': 'Ses Tanıma',
        'video': 'Video Yapma',
        'story': 'Hikaye Zamanı',
        'numbers': 'Sayı Öğrenme'
    };
    
    speak(`${gameNames[gameType]} başlıyor!`);
    
    setTimeout(() => {
        switch(gameType) {
            case 'coloring':
                showScreen('coloringGame');
                initColoringGame();
                break;
            case 'memory':
                showScreen('memoryGame');
                initMemoryGame();
                break;
            case 'puzzle':
                showScreen('puzzleGame');
                initPuzzleGame();
                break;
            case 'cipher':
                showScreen('cipherGame');
                initCipherGame();
                break;
            case 'sounds':
                showScreen('soundsGame');
                initSoundsGame();
                break;
            case 'video':
                showScreen('videoGame');
                initVideoGame();
                break;
            case 'story':
                showScreen('storyGame');
                initStoryGame();
                break;
            case 'numbers':
                showScreen('numbersGame');
                initNumbersGame();
                break;
        }
    }, 500);
}

// BOYAMA OYUNU
function initColoringGame() {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas boyutunu ayarla
    const container = canvas.parentElement;
    canvas.width = Math.min(600, container.clientWidth - 40);
    canvas.height = 500;
    
    // Rastgele template seç ve kaydet
    const templates = [drawHouse, drawTree, drawSun, drawCar, drawFlower];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    gameState.currentTemplate = randomTemplate;
    randomTemplate(ctx);
    
    canvas.onmousedown = startDrawing;
    canvas.onmousemove = draw;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseout = stopDrawing;
    
    // Touch events
    canvas.ontouchstart = (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    };
    canvas.ontouchmove = (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    };
    canvas.ontouchend = stopDrawing;
}

let isDrawing = false;

function drawColoringTemplate(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Basit bir ev çiz
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Ev gövdesi
    ctx.strokeRect(150, 250, 300, 200);
    
    // Çatı
    ctx.beginPath();
    ctx.moveTo(140, 250);
    ctx.lineTo(300, 150);
    ctx.lineTo(460, 250);
    ctx.closePath();
    ctx.stroke();
    
    // Kapı
    ctx.strokeRect(250, 350, 100, 100);
    
    // Pencereler
    ctx.strokeRect(180, 300, 60, 60);
    ctx.strokeRect(360, 300, 60, 60);
    
    // Güneş
    ctx.beginPath();
    ctx.arc(500, 100, 40, 0, Math.PI * 2);
    ctx.stroke();
}

function startDrawing(e) {
    isDrawing = true;
}

function stopDrawing() {
    isDrawing = false;
}

function draw(e) {
    if (!isDrawing) return;
    
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX || e.pageX) - rect.left;
    const y = (e.clientY || e.pageY) - rect.top;
    
    ctx.fillStyle = gameState.currentColor;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

function selectColor(color) {
    gameState.currentColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    playSound('click');
}

function clearCanvas() {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas'ı temizle ve aynı template'i tekrar çiz
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Son kullanılan template'i tekrar çiz
    if (gameState.currentTemplate) {
        gameState.currentTemplate(ctx);
    } else {
        drawHouse(ctx);
    }
    
    playSound('click');
}

function newColoringImage() {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Yeni template seç ve kaydet
    const templates = [drawHouse, drawTree, drawSun, drawCar, drawFlower];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    gameState.currentTemplate = randomTemplate;
    randomTemplate(ctx);
    
    playSound('click');
    speak('Yeni resim hazır! Boyamaya başla!');
}

// Ev çizimi
function drawHouse(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Ev gövdesi
    ctx.strokeRect(150, 250, 300, 200);
    
    // Çatı
    ctx.beginPath();
    ctx.moveTo(140, 250);
    ctx.lineTo(300, 150);
    ctx.lineTo(460, 250);
    ctx.closePath();
    ctx.stroke();
    
    // Kapı
    ctx.strokeRect(250, 350, 100, 100);
    
    // Pencereler
    ctx.strokeRect(180, 300, 60, 60);
    ctx.strokeRect(360, 300, 60, 60);
}

// Ağaç çizimi
function drawTree(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Gövde
    ctx.strokeRect(270, 300, 60, 150);
    
    // Yapraklar - 3 daire
    ctx.beginPath();
    ctx.arc(300, 250, 80, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(250, 280, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(350, 280, 60, 0, Math.PI * 2);
    ctx.stroke();
}

// Güneş çizimi
function drawSun(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Güneş
    ctx.beginPath();
    ctx.arc(300, 250, 100, 0, Math.PI * 2);
    ctx.stroke();
    
    // Işınlar
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = 300 + Math.cos(angle) * 110;
        const y1 = 250 + Math.sin(angle) * 110;
        const x2 = 300 + Math.cos(angle) * 150;
        const y2 = 250 + Math.sin(angle) * 150;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

// Araba çizimi
function drawCar(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Gövde
    ctx.strokeRect(150, 300, 300, 100);
    
    // Üst
    ctx.strokeRect(200, 250, 200, 50);
    
    // Tekerlekler
    ctx.beginPath();
    ctx.arc(220, 400, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(380, 400, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    // Pencereler
    ctx.strokeRect(210, 260, 80, 35);
    ctx.strokeRect(310, 260, 80, 35);
}

// Çiçek çizimi
function drawFlower(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Sap
    ctx.beginPath();
    ctx.moveTo(300, 450);
    ctx.lineTo(300, 300);
    ctx.stroke();
    
    // Yapraklar
    ctx.beginPath();
    ctx.arc(280, 350, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(320, 380, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Çiçek merkezi
    ctx.beginPath();
    ctx.arc(300, 250, 40, 0, Math.PI * 2);
    ctx.stroke();
    
    // Yapraklar - 6 tane
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const x = 300 + Math.cos(angle) * 70;
        const y = 250 + Math.sin(angle) * 70;
        
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function finishColoring() {
    gameState.scores.coloring += 10;
    gameState.totalStars += 1;
    updateStarDisplay('coloringStars', gameState.scores.coloring / 10);
    playSound('success');
    showFeedback('coloringGame', 'Harika bir resim! Aferin!', true);
    
    setTimeout(() => {
        backToGameMenu();
    }, 2000);
}

// HAFIZA OYUNU
function initMemoryGame() {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const cards = [...emojis, ...emojis];
    gameState.memoryCards = shuffleArray(cards);
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    
    const grid = document.getElementById('memoryCards');
    grid.innerHTML = '';
    
    gameState.memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
    
    updateMemoryStats();
}

function flipCard(card) {
    if (gameState.flippedCards.length >= 2) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    gameState.flippedCards.push(card);
    playSound('click');
    
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateMemoryStats();
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = gameState.flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            // Partikül efekti simülasyonu
            card1.innerHTML = '✨';
            card2.innerHTML = '✨';
            
            setTimeout(() => {
                card1.style.visibility = 'hidden';
                card2.style.visibility = 'hidden';
            }, 600);
            
            gameState.matchedPairs++;
            gameState.flippedCards = [];
            playSound('success');
            updateMemoryStats();
            
            if (gameState.matchedPairs === 8) {
                setTimeout(() => {
                    gameState.scores.memory += 10;
                    gameState.totalStars += 1;
                    updateStarDisplay('memoryStars', gameState.scores.memory / 10);
                    showFeedback('memoryGame', 'Tebrikler! Hepsini buldun! 🎉', true);
                    
                    // Konfeti efekti için tüm kartları göster
                    document.querySelectorAll('.memory-card').forEach(card => {
                        card.innerHTML = '🎊';
                        card.style.visibility = 'visible';
                    });
                    
                    setTimeout(backToGameMenu, 3000);
                }, 500);
            }
        }, 500);
    } else {
        setTimeout(() => {
            // Yanlış eşleşme animasyonu
            card1.style.transform = 'rotateY(0deg) scale(0.95)';
            card2.style.transform = 'rotateY(0deg) scale(0.95)';
            
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '?';
                card2.textContent = '?';
                card1.style.transform = '';
                card2.style.transform = '';
                gameState.flippedCards = [];
            }, 300);
        }, 1000);
    }
}

function updateMemoryStats() {
    document.getElementById('matchCount').textContent = gameState.matchedPairs;
    document.getElementById('moveCount').textContent = gameState.moves;
}

function resetMemoryGame() {
    initMemoryGame();
    playSound('click');
}

// ŞEKİL BULMA OYUNU
const puzzles = [
    { target: '🔴', options: ['🔴', '🔵', '🔴', '🔴'], correct: 1 },
    { target: '⭐', options: ['⭐', '⭐', '❤️', '⭐'], correct: 2 },
    { target: '🟦', options: ['🟦', '🟦', '🟦', '🟥'], correct: 3 },
    { target: '🐱', options: ['🐱', '🐱', '🐶', '🐱'], correct: 2 }
];

let currentPuzzle = 0;

function initPuzzleGame() {
    currentPuzzle = Math.floor(Math.random() * puzzles.length);
    showPuzzle();
}

function showPuzzle() {
    const puzzle = puzzles[currentPuzzle];
    document.getElementById('puzzleTarget').textContent = puzzle.target;
    
    const optionsDiv = document.getElementById('puzzleOptions');
    optionsDiv.innerHTML = '';
    
    puzzle.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'puzzle-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => checkPuzzleAnswer(index);
        optionsDiv.appendChild(optionDiv);
    });
    
    document.getElementById('puzzleFeedback').textContent = '';
}

function checkPuzzleAnswer(index) {
    const puzzle = puzzles[currentPuzzle];
    
    if (index === puzzle.correct) {
        gameState.scores.puzzle += 10;
        gameState.totalStars += 1;
        updateStarDisplay('puzzleStars', gameState.scores.puzzle / 10);
        playSound('success');
        showFeedback('puzzleGame', 'Doğru! Çok iyi!', true);
        
        setTimeout(() => {
            currentPuzzle = (currentPuzzle + 1) % puzzles.length;
            showPuzzle();
        }, 2000);
    } else {
        showFeedback('puzzleGame', 'Tekrar dene!', false);
        playSound('click');
    }
}

// SES TANIMA OYUNU
const soundAnimals = [
    { name: 'Kedi', emoji: '🐱', sound: 'Miyav miyav!' },
    { name: 'Köpek', emoji: '🐶', sound: 'Hav hav!' },
    { name: 'Koyun', emoji: '🐑', sound: 'Meee meee!' },
    { name: 'İnek', emoji: '🐄', sound: 'Möö möö!' },
    { name: 'Kuş', emoji: '🐦', sound: 'Cik cik!' },
    { name: 'Aslan', emoji: '🦁', sound: 'Roaaaar!' }
];

let currentAnimal = 0;

function initSoundsGame() {
    currentAnimal = Math.floor(Math.random() * soundAnimals.length);
    showSoundOptions();
}

function playCurrentSound() {
    const animal = soundAnimals[currentAnimal];
    speak(animal.sound);
    playSound('click');
}

function showSoundOptions() {
    const optionsDiv = document.getElementById('soundOptions');
    optionsDiv.innerHTML = '';
    
    // Rastgele 4 hayvan seç (biri doğru cevap olacak)
    const options = [soundAnimals[currentAnimal]];
    while (options.length < 4) {
        const randomAnimal = soundAnimals[Math.floor(Math.random() * soundAnimals.length)];
        if (!options.includes(randomAnimal)) {
            options.push(randomAnimal);
        }
    }
    
    shuffleArray(options).forEach(animal => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'sound-option';
        optionDiv.innerHTML = `
            <div class="sound-option-icon">${animal.emoji}</div>
            <div class="sound-option-name">${animal.name}</div>
        `;
        optionDiv.onclick = () => checkSoundAnswer(animal);
        optionsDiv.appendChild(optionDiv);
    });
    
    document.getElementById('soundsFeedback').textContent = '';
}

function checkSoundAnswer(animal) {
    if (animal.name === soundAnimals[currentAnimal].name) {
        gameState.scores.sounds += 10;
        gameState.totalStars += 1;
        updateStarDisplay('soundsStars', gameState.scores.sounds / 10);
        playSound('success');
        showFeedback('soundsGame', 'Bravo! Doğru bildin!', true);
        
        setTimeout(() => {
            currentAnimal = Math.floor(Math.random() * soundAnimals.length);
            showSoundOptions();
        }, 2000);
    } else {
        showFeedback('soundsGame', 'Tekrar dene!', false);
        playSound('click');
    }
}

// HİKAYE OYUNU
function initStoryGame() {
    document.getElementById('storyText').innerHTML = '<p>Hikaye oluşturmak için butona tıkla!</p>';
    document.getElementById('generateStoryBtn').style.display = 'block';
    document.getElementById('readStoryBtn').style.display = 'none';
}

async function generateStory() {
    const character = characters[gameState.selectedCharacter];
    const btn = document.getElementById('generateStoryBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Hikaye Hazırlanıyor...';
    
    document.getElementById('storyText').innerHTML = '<p>Yapay zeka sana özel bir hikaye yazıyor...</p>';
    
    try {
        // Netlify Function'a istek gönder - API key güvenli!
        const response = await fetch('/.netlify/functions/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                characterName: character.name
            })
        });
        
        if (!response.ok) {
            throw new Error('Hikaye oluşturma başarısız');
        }
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('storyImage').textContent = character.emoji;
            document.getElementById('storyText').innerHTML = `<p>${data.story}</p>`;
            document.getElementById('readStoryBtn').style.display = 'block';
            
            gameState.scores.story += 10;
            gameState.totalStars += 1;
            updateStarDisplay('storyStars', gameState.scores.story / 10);
            
            if (data.fallback) {
                console.log('Fallback hikaye kullanıldı');
            }
        } else {
            throw new Error('Hikaye alınamadı');
        }
        
    } catch (error) {
        console.error('Hikaye oluşturma hatası:', error);
        
        // Fallback hikaye
        const sampleStories = [
            `Bir gün ${character.name} ormanda gezinirken küçük bir kuş yavrusu buldu. Kuş düşmüştü ve uçamıyordu. ${character.name} kuşu dikkatle alıp yuvasına götürdü. Anne kuş çok mutlu oldu ve ${character.name}'a teşekkür etti. İşte böyle, küçük yardımlar büyük mutluluklar yaratır!`,
            `${character.name} bir gün çok güzel renkli kalemler buldu. Arkadaşlarıyla paylaşmak istedi. Herkese bir kalem verdi ve birlikte güzel resimler yaptılar. Paylaşmak çok güzeldi! ${character.name} o gün çok mutluydu.`,
            `${character.name} sabah erken kalktı. Güneş henüz doğmamıştı ama ${character.name} çok heyecanlıydı. Pikniğe gideceklerdi! Ailesiyle birlikte hazırlık yaptılar. Sabah erken kalkmak güzel şeyler yaşamak için fırsat verir!`
        ];
        
        const randomStory = sampleStories[Math.floor(Math.random() * sampleStories.length)];
        document.getElementById('storyImage').textContent = character.emoji;
        document.getElementById('storyText').innerHTML = `<p>${randomStory}</p>`;
        document.getElementById('readStoryBtn').style.display = 'block';
        
        gameState.scores.story += 5;
        gameState.totalStars += 1;
        updateStarDisplay('storyStars', gameState.scores.story / 10);
    }
    
    btn.disabled = false;
    btn.textContent = '✨ Yeni Hikaye Oluştur';
    playSound('success');
}

function readStory() {
    const storyText = document.getElementById('storyText').textContent;
    speak(storyText);
}

// SAYI ÖĞRENME OYUNU
function initNumbersGame() {
    showNewNumber();
}

function showNewNumber() {
    gameState.currentNumber = Math.floor(Math.random() * 10) + 1;
    
    // Sayıyı GÖSTERMEYİN - sadece soru işareti
    document.getElementById('currentNumber').textContent = '?';
    document.getElementById('currentNumber').style.fontSize = '10em';
    
    // Nesneleri göster
    const objectsDiv = document.getElementById('numberObjects');
    objectsDiv.innerHTML = '';
    
    const emojis = ['🎈', '⭐', '🎁', '🍎', '🌸'];
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    for (let i = 0; i < gameState.currentNumber; i++) {
        const span = document.createElement('span');
        span.textContent = selectedEmoji;
        objectsDiv.appendChild(span);
    }
    
    // Şık oluştur
    const optionsDiv = document.getElementById('numberOptions');
    optionsDiv.innerHTML = '';
    
    const options = new Set([gameState.currentNumber]);
    while (options.size < 5) {
        options.add(Math.floor(Math.random() * 10) + 1);
    }
    
    shuffleArray([...options]).forEach(num => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'number-option';
        optionDiv.textContent = num;
        optionDiv.onclick = () => checkNumberAnswer(num);
        optionsDiv.appendChild(optionDiv);
    });
    
    document.getElementById('numbersFeedback').textContent = '';
    
    // Sesli yönlendirme - ama sayıyı söylemeyin!
    speak(`Kaç tane nesne var? Doğru sayıyı seç!`);
}

function checkNumberAnswer(num) {
    if (num === gameState.currentNumber) {
        gameState.scores.numbers += 10;
        gameState.totalStars += 1;
        updateStarDisplay('numbersStars', gameState.scores.numbers / 10);
        playSound('success');
        showFeedback('numbersGame', 'Çok iyi! Doğru saydın!', true);
        
        setTimeout(() => {
            showNewNumber();
        }, 2000);
    } else {
        showFeedback('numbersGame', 'Tekrar say bakalım!', false);
        playSound('click');
    }
}

// YARDIMCI FONKSİYONLAR
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function updateStarDisplay(elementId, stars) {
    document.getElementById(elementId).textContent = stars;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById('totalStars').textContent = gameState.totalStars;
}

function showFeedback(gameId, message, isCorrect) {
    const feedbackDiv = document.querySelector(`#${gameId} .game-feedback`);
    if (feedbackDiv) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = 'game-feedback ' + (isCorrect ? 'correct' : 'incorrect');
    }
}

// SES FONKSİYONLARI
function playSound(type) {
    // Basit ses efektleri (isteğe bağlı)
    const audio = document.getElementById(type === 'success' ? 'successSound' : 'clickSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Ses çalınamadı'));
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
    }
}

// API Key artık backend'de - güvenli! 🔒

// ŞİFRELEME OYUNU
function initCipherGame() {
    newCipherChallenge();
    speak('Şifre çözme oyununa hoş geldin! Gizli mesajı bul!');
}

const cipherKeys = {
    shapes: {
        'A': '🔺', 'B': '⭐', 'C': '🟦', 'D': '🔴',
        'E': '💚', 'F': '🌙', 'G': '☀️', 'H': '🌟'
    },
    colors: {
        'K': '🔴', 'E': '🟡', 'D': '🟦', 'İ': '🟢',
        'A': '🟣', 'T': '🟠', 'B': '⚪', 'L': '🟤'
    },
    animals: {
        'K': '🐱', 'Ö': '🐶', 'P': '🐰', 'E': '🐘',
        'K': '🐯', 'A': '🦁', 'R': '🐻', 'T': '🐼'
    }
};

const cipherWords = [
    { key: 'shapes', word: 'BABA', meaning: 'BABA' },
    { key: 'shapes', word: 'DEDE', meaning: 'DEDE' },
    { key: 'shapes', word: 'ABECE', meaning: 'ABECE' },
    { key: 'colors', word: 'KEDI', meaning: 'KEDI' },
    { key: 'colors', word: 'KALE', meaning: 'KALE' },
    { key: 'colors', word: 'BEBE', meaning: 'BEBE' }
];

let currentCipher = null;

function newCipherChallenge() {
    // Rastgele bir kelime seç
    currentCipher = cipherWords[Math.floor(Math.random() * cipherWords.length)];
    const key = cipherKeys[currentCipher.key];
    
    // Şifre anahtarını göster
    const keyDisplay = document.getElementById('cipherKey');
    keyDisplay.innerHTML = '';
    
    Object.entries(key).forEach(([letter, symbol]) => {
        const pair = document.createElement('div');
        pair.className = 'cipher-pair';
        pair.innerHTML = `${symbol} = ${letter}`;
        keyDisplay.appendChild(pair);
    });
    
    // Şifreli mesajı göster
    const messageDiv = document.getElementById('cipherMessage');
    let encryptedMessage = '';
    for (let char of currentCipher.word) {
        encryptedMessage += key[char] || char;
        encryptedMessage += ' ';
    }
    messageDiv.textContent = encryptedMessage;
    
    // Seçenekleri oluştur
    const choicesDiv = document.getElementById('cipherChoices');
    choicesDiv.innerHTML = '';
    
    // Doğru cevap + 3 yanlış cevap
    const wrongAnswers = ['MAMA', 'ANNE', 'KOKU', 'BALI', 'TATA', 'LALE'];
    const choices = [currentCipher.meaning];
    
    while (choices.length < 4) {
        const wrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        if (!choices.includes(wrong)) {
            choices.push(wrong);
        }
    }
    
    // Karıştır
    shuffleArray(choices);
    
    choices.forEach(choice => {
        const btn = document.createElement('div');
        btn.className = 'cipher-choice';
        btn.textContent = choice;
        btn.onclick = () => checkCipherAnswer(choice);
        choicesDiv.appendChild(btn);
    });
    
    document.getElementById('cipherFeedback').textContent = '';
}

function checkCipherAnswer(answer) {
    const feedbackDiv = document.getElementById('cipherFeedback');
    
    if (answer === currentCipher.meaning) {
        gameState.scores.cipher += 10;
        gameState.totalStars += 1;
        updateScoreDisplay();
        feedbackDiv.textContent = '🎉 Doğru! Şifreyi çözdün!';
        feedbackDiv.className = 'game-feedback correct';
        speak('Tebrikler! Şifreyi çözdün!');
        playSound('success');
        
        setTimeout(() => {
            newCipherChallenge();
        }, 2000);
    } else {
        feedbackDiv.textContent = '❌ Yanlış! Tekrar dene!';
        feedbackDiv.className = 'game-feedback incorrect';
        speak('Yanlış! Tekrar dene!');
    }
}

// VİDEO OLUŞTURMA OYUNU
let selectedTheme = 'adventure';
let videoScenes = [];
let currentVideoScene = 0;

function initVideoGame() {
    selectedTheme = 'adventure';
    videoScenes = [];
    currentVideoScene = 0;
    document.getElementById('videoFrame').innerHTML = `
        <div class="video-placeholder">🎬</div>
        <div class="video-text">Bir tema seç ve AI ile video oluştur!</div>
    `;
    document.getElementById('playVideoBtn').style.display = 'none';
    speak('Video yapma oyununa hoş geldin! Bir tema seç ve kendi videonı oluştur!');
}

function selectVideoTheme(theme) {
    selectedTheme = theme;
    
    // Tüm tema butonlarını temizle
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Seçilen temayı vurgula
    event.target.classList.add('selected');
    
    const themeNames = {
        'adventure': 'Macera',
        'space': 'Uzay',
        'ocean': 'Okyanus',
        'forest': 'Orman'
    };
    
    speak(`${themeNames[theme]} teması seçildi!`);
    playSound('click');
}

async function generateVideo() {
    const btn = document.getElementById('generateVideoBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Video Oluşturuluyor...';
    
    const character = characters[gameState.selectedCharacter];
    const frameDiv = document.getElementById('videoFrame');
    
    frameDiv.innerHTML = `
        <div class="video-placeholder">⏳</div>
        <div class="video-text">AI senin için video oluşturuyor...</div>
    `;
    
    try {
        // Netlify Function'a istek gönder
        const response = await fetch('/.netlify/functions/generate-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                characterName: character.name,
                theme: selectedTheme
            })
        });
        
        if (!response.ok) {
            throw new Error('Video oluşturma başarısız');
        }
        
        const data = await response.json();
        
        if (data.success) {
            videoScenes = data.scenes;
            currentVideoScene = 0;
            
            gameState.scores.video += 10;
            gameState.totalStars += 1;
            updateScoreDisplay();
            
            // İlk sahneyi göster
            showVideoScene(0);
            
            document.getElementById('playVideoBtn').style.display = 'block';
            document.getElementById('videoFeedback').textContent = '🎉 Video hazır! Oynat butonuna tıkla!';
            document.getElementById('videoFeedback').className = 'game-feedback correct';
        }
        
    } catch (error) {
        console.error('Video oluşturma hatası:', error);
        
        // Fallback - basit sahne oluştur
        createFallbackVideo();
    }
    
    btn.disabled = false;
    btn.textContent = '✨ AI ile Video Oluştur';
}

function createFallbackVideo() {
    const character = characters[gameState.selectedCharacter];
    
    const themeScenes = {
        adventure: [
            { emoji: '🏕️', text: `${character.name} ormanda yürüyüşe çıktı!` },
            { emoji: '🗺️', text: 'Bir hazine haritası buldu!' },
            { emoji: '💎', text: 'Hazinenin yerini keşfetti!' },
            { emoji: '🏆', text: 'Macera başarıyla tamamlandı!' }
        ],
        space: [
            { emoji: '🚀', text: `${character.name} uzaya yolculuğa çıktı!` },
            { emoji: '🌙', text: 'Aya indi ve keşfe başladı!' },
            { emoji: '👽', text: 'Yeni arkadaşlar buldu!' },
            { emoji: '🌟', text: 'Yıldızları gördü!' }
        ],
        ocean: [
            { emoji: '🌊', text: `${character.name} denize daldı!` },
            { emoji: '🐠', text: 'Renkli balıklar gördü!' },
            { emoji: '🐙', text: 'Bir ahtapotla tanıştı!' },
            { emoji: '🏖️', text: 'Sahile döndü!' }
        ],
        forest: [
            { emoji: '🌳', text: `${character.name} ormana girdi!` },
            { emoji: '🦌', text: 'Bir geyik gördü!' },
            { emoji: '🦜', text: 'Kuşlar şarkı söylüyordu!' },
            { emoji: '🏡', text: 'Eve döndü!' }
        ]
    };
    
    videoScenes = themeScenes[selectedTheme];
    currentVideoScene = 0;
    
    showVideoScene(0);
    
    document.getElementById('playVideoBtn').style.display = 'block';
    document.getElementById('videoFeedback').textContent = '🎉 Video hazır! Oynat butonuna tıkla!';
    document.getElementById('videoFeedback').className = 'game-feedback correct';
    
    gameState.scores.video += 10;
    gameState.totalStars += 1;
    updateScoreDisplay();
}

function showVideoScene(index) {
    if (index >= videoScenes.length) {
        index = 0;
    }
    
    const scene = videoScenes[index];
    const character = characters[gameState.selectedCharacter];
    const frameDiv = document.getElementById('videoFrame');
    
    frameDiv.innerHTML = `
        <div class="video-scene">
            <div class="scene-character">${character.emoji}</div>
            <div class="scene-character">${scene.emoji}</div>
            <div class="scene-text">${scene.text}</div>
        </div>
    `;
    
    currentVideoScene = index;
}

function playVideo() {
    if (videoScenes.length === 0) return;
    
    const btn = document.getElementById('playVideoBtn');
    btn.disabled = true;
    
    speak('Video oynatılıyor!');
    
    let sceneIndex = 0;
    
    const interval = setInterval(() => {
        showVideoScene(sceneIndex);
        
        // Sahne metnini oku
        speak(videoScenes[sceneIndex].text);
        
        sceneIndex++;
        
        if (sceneIndex >= videoScenes.length) {
            clearInterval(interval);
            btn.disabled = false;
            speak('Video bitti! Tekrar izlemek ister misin?');
        }
    }, 3000); // Her sahne 3 saniye
}

