let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let username = '';

fetch('questions.json')  // Ambil soal dari file JSON
    .then(response => response.json())
    .then(data => {
        questions = data;  // Simpan soal ke variabel global
    })
    .catch(error => console.error('Error fetching questions:', error));

function startGame(questionCount) {
    // Ambil nama pemain dari input
    username = document.getElementById('username').value || 'Pemain';
    
    // Pilih soal secara acak sesuai jumlah yang dipilih
    selectedQuestions = getRandomQuestions(questionCount);
    
    // Sembunyikan layar welcome dan tampilkan game screen
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    // Set skor awal
    score = 0;
    
    // Tampilkan soal pertama
    displayQuestion();
}

function getRandomQuestions(count) {
    // Pilih pertanyaan secara acak
    let selected = [];
    let indices = [];
    
    while (selected.length < count) {
        let randomIndex = Math.floor(Math.random() * questions.length);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
            selected.push(questions[randomIndex]);
        }
    }
    return selected;
}

function displayQuestion() {
    // Menampilkan soal dan pilihan jawaban
    let currentQuestion = selectedQuestions[currentQuestionIndex];
    
    document.getElementById('question').innerText = currentQuestion.question;
    let choicesHtml = '';
    
    currentQuestion.choices.forEach(choice => {
        choicesHtml += `<button class="choice-btn" onclick="checkAnswer('${choice}')">${choice}</button>`;
    });

    document.getElementById('choices').innerHTML = choicesHtml;
    document.getElementById('game-title').innerText = `Pemain: ${username} | Skor: ${score}`;
}

function checkAnswer(selectedChoice) {
    let currentQuestion = selectedQuestions[currentQuestionIndex];
    
    if (selectedChoice === currentQuestion.correctAnswer) {
        score++;
        alert('Jawaban Benar!');
    } else {
        alert('Jawaban Salah!');
    }

    // Setelah menjawab, pindah ke soal berikutnya
    currentQuestionIndex++;

    if (currentQuestionIndex < selectedQuestions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}

function nextQuestion() {
    displayQuestion();
}

function endGame() {
    alert(`Permainan selesai! Skor akhir: ${score}`);
    
    // Simpan skor di leaderboard lokal
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ username: username, score: score });
    leaderboard.sort((a, b) => b.score - a.score);  // Urutkan leaderboard berdasarkan skor tertinggi
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    showLeaderboard();
}

function showLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';  // Clear previous leaderboard
    
    leaderboard.forEach(entry => {
        let li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}
