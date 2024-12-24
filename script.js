let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let username = ""; // Untuk menyimpan nama pengguna

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

// Memuat leaderboard dari file JSON
async function loadLeaderboard() {
    try {
        const response = await fetch('leaderboard.json');
        return await response.json();
    } catch (error) {
        console.error('Gagal memuat leaderboard:', error);
        return [];
    }
}

// Menyimpan leaderboard ke file JSON
async function saveLeaderboard(leaderboard) {
    try {
        const response = await fetch('leaderboard.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaderboard)
        });
        if (!response.ok) {
            throw new Error('Gagal menyimpan leaderboard');
        }
    } catch (error) {
        console.error('Gagal menyimpan leaderboard:', error);
    }
}

// Memulai permainan
async function startGame(numQuestions) {
    username = document.getElementById('username').value.trim();

    if (username === '') {
        alert("Masukkan nama Anda terlebih dahulu!");
        return;
    }

    // Ambil data leaderboard dari file JSON
    const leaderboard = await loadLeaderboard();
    
    // Periksa apakah nama sudah ada
    const nameExists = leaderboard.some(entry => entry.name.toLowerCase() === username.toLowerCase());

    if (nameExists) {
        alert(`Nama "${username}" sudah digunakan. Silakan pilih nama lain.`);
        return;
    }

    // Lanjutkan permainan
    await loadQuestions();

    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById("namanya").textContent = `Halo ${username} 👋🏻`;
    totalQuestions = numQuestions;
    score = 0;
    currentQuestionIndex = 0;
    showNextQuestion();
}

// Menampilkan soal berikutnya
function showNextQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        const questionData = questions[currentQuestionIndex];
        if (!questionData) {
            endGame();
            return;
        }

        document.getElementById('question').innerText = questionData.question;

        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';
        questionData.choices.forEach((choice) => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.classList.add('choice-btn');
            button.onclick = () => handleAnswer(choice, questionData.correctAnswer);
            choicesContainer.appendChild(button);
        });
        document.getElementById('game-title').innerText = `Score: ${score} | Question ${currentQuestionIndex + 1} of ${totalQuestions}\n\n`;
    } else {
        endGame();
    }
}

function handleAnswer(choice, correctAnswer) {
    const feedback = document.getElementById('answer-feedback');

    if (choice === correctAnswer) {
        score++;
        feedback.style.display = 'block';
        feedback.innerText = "Jawaban Anda Benar!";
        feedback.style.backgroundColor = '#4CAF50';
    } else {
        feedback.style.display = 'block';
        feedback.innerText = `Jawaban Salah! Yang benar adalah: ${correctAnswer}`;
        feedback.style.backgroundColor = '#f44336';
    }

    setTimeout(() => {
        feedback.style.display = 'none';
        currentQuestionIndex++;
        showNextQuestion();
    }, 2000);
}

function endGame() {
    if (username) {
        saveScore(username, score);
    }
    showLeaderboard();
}

async function saveScore(name, score) {
    const leaderboard = await loadLeaderboard();
    const isNameDuplicate = leaderboard.some(entry => entry.name.toLowerCase() === name.toLowerCase());

    if (isNameDuplicate) {
        alert("Nama tersebut sudah ada di leaderboard. Silakan gunakan nama lain.");
        return; // Hentikan proses jika nama duplikat
    }
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    await saveLeaderboard(leaderboard);
}

async function showLeaderboard() {
    await updateLeaderboard();
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('leaderboard-screen').style.display = 'block';
}

async function updateLeaderboard() {
    const leaderboard = await loadLeaderboard();
    const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
    leaderboardTable.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const row = leaderboardTable.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = entry.name;
        row.insertCell(2).textContent = entry.score;
    });
}

function restartGame() {
    document.getElementById('leaderboard-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}

window.onload = async () => {
    await loadQuestions();
};
