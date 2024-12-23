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
        // Ambil data soal saat ini
        const questionData = questions[currentQuestionIndex];

        // Update teks pertanyaan
        document.getElementById('question').innerText = questionData.question;

        // Update pilihan jawaban
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = ''; // Hapus pilihan sebelumnya
        questionData.choices.forEach((choice) => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.classList.add('choice-btn');
            button.onclick = () => handleAnswer(choice, questionData.correctAnswer);
            choicesContainer.appendChild(button);
        });

        // Update judul permainan
        document.getElementById('game-title').innerText = `Score: ${score} | Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    } else {
        // Semua soal selesai, tampilkan leaderboard
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

    // Tampilkan notifikasi dan lanjutkan ke pertanyaan berikutnya
    setTimeout(() => {
        feedback.style.display = 'none';
        currentQuestionIndex++;
        showNextQuestion();
    }, 2000); // 2 detik
}


function showLeaderboard() {
    const username = localStorage.getItem('username');
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Tambahkan skor pengguna ke leaderboard
    leaderboardData.push({ username, score });
    leaderboardData.sort((a, b) => b.score - a.score); // Urutkan dari skor tertinggi
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

    // Tampilkan leaderboard
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = '<h2>Leaderboard</h2>';
    leaderboardData.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.innerText = `${index + 1}. ${entry.username} - ${entry.score}`;
        leaderboardContainer.appendChild(entryDiv);
    });

    // Sembunyikan layar permainan, tampilkan layar leaderboard
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
