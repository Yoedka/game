let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

// Memuat soal dari file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        console.log('Soal berhasil dimuat:', questions); // Debugging
    } catch (error) {
        console.error('Gagal memuat soal:', error);
    }
}

// Memulai permainan
function startGame(numQuestions) {
    const username = document.getElementById('username').value.trim();

    if (username === '') {
        alert("Masukkan nama Anda terlebih dahulu!");
        return;
    }

    // Menyembunyikan layar selamat datang dan menampilkan layar permainan
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    totalQuestions = numQuestions;
    score = 0;
    currentQuestionIndex = 0;
    showNextQuestion();
}

// Menampilkan soal berikutnya
function showNextQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        const questionData = questions[currentQuestionIndex];
        console.log('Menampilkan soal:', questionData); // Debugging

        const questionText = questionData.question;
        const choices = questionData.choices;

        // Menampilkan soal dan pilihan
        document.getElementById('question').innerText = questionText;

        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = ''; // Reset pilihan
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.classList.add('choice-btn');
            button.onclick = () => handleAnswer(choice, questionData.correctAnswer);
            choicesContainer.appendChild(button);
        });

        // Update judul permainan
        document.getElementById('game-title').innerText = `Score: ${score} | Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    } else {
        showLeaderboard();
    }
}

// Menangani jawaban yang dipilih
function handleAnswer(choice, correctAnswer) {
    if (choice === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    showNextQuestion();
}

// Menampilkan leaderboard
function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const username = document.getElementById('username').value.trim();
    const userScore = { name: username, score: score };

    leaderboard.push(userScore);
    leaderboard.sort((a, b) => b.score - a.score);

    // Simpan leaderboard ke localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('leaderboard-screen').style.display = 'block';
}

// Restart permainan
function restartGame() {
    document.getElementById('leaderboard-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}

// Memuat soal saat halaman dimuat
window.onload = async () => {
    await loadQuestions(); // Pastikan soal dimuat sebelum permainan dimulai
};
