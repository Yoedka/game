let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

// Memuat soal dari file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        console.log('Soal berhasil dimuat:', questions);
    } catch (error) {
        console.error('Gagal memuat soal:', error);
    }
}

// Memulai permainan
async function startGame(numQuestions) {
    const username = document.getElementById('username').value.trim();

    if (username === '') {
        alert("Masukkan nama Anda terlebih dahulu!");
        return;
    }

    await loadQuestions();

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
        console.log('Menampilkan soal:', questionData);

        const questionText = questionData.question;
        const choices = questionData.choices;

        document.getElementById('question').innerText = questionText;

        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';
        choices.forEach((choice) => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.classList.add('choice-btn');
            button.onclick = () => handleAnswer(choice, questionData.correctAnswer);
            choicesContainer.appendChild(button);
        });

        document.getElementById('game-title').innerText = `Score: ${score} | Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    } else {
        showLeaderboard();
    }
}

function handleAnswer(choice, correctAnswer) {
    const feedback = document.getElementById('answer-feedback');

    if (choice === correctAnswer) {
        score++;
        feedback.style.display = 'block';
        feedback.innerText = "Jawaban Anda Benar!";
        feedback.style.backgroundColor = '#4CAF50'; // Warna hijau untuk jawaban benar
    } else {
        feedback.style.display = 'block';
        feedback.innerText = `Jawaban Salah! Yang benar adalah: ${correctAnswer}`;
        feedback.style.backgroundColor = '#f44336'; // Warna merah untuk jawaban salah
    }

    // Sembunyikan notifikasi setelah beberapa detik
    setTimeout(() => {
        feedback.style.display = 'none';
        currentQuestionIndex++;
        showNextQuestion();
    }, 2000); // 2 detik
}


// Menampilkan leaderboard
function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const username = document.getElementById('username').value.trim();
    const userScore = { name: username, score: score };

    leaderboard.push(userScore);
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry) => {
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

window.onload = async () => {
    await loadQuestions();
};
