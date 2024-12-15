let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let answeredQuestions = new Set();
let questions = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    })
    .catch(error => {
        console.error('Error loading questions:', error);
    });

function startGame() {
    userName = document.getElementById('user-name').value;
    if (userName.trim() === "") {
        alert("Nama tidak boleh kosong!");
        return;
    }
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    loadQuestion();
    loadLeaderboard();
}

function loadQuestion() {
    if (answeredQuestions.size === questions.length) {
        endGame();
        return;
    }

    const currentQuestion = questions.filter((_, index) => !answeredQuestions.has(index))[0];
    document.getElementById("question").textContent = currentQuestion.question;
    const choicesList = document.getElementById("choices");
    choicesList.innerHTML = "";

    currentQuestion.choices.forEach(choice => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.onclick = () => checkAnswer(choice, currentQuestion.correctAnswer);
        choicesList.appendChild(li);
    });
}

function checkAnswer(selectedAnswer, correctAnswer) {
    document.getElementById("loading-spinner").style.display = "block";
    setTimeout(() => {
        document.getElementById("loading-spinner").style.display = "none";

        if (selectedAnswer === correctAnswer) {
            score += 10;
            document.getElementById("score").textContent = `Score: ${score}`;
            answeredQuestions.add(questions.indexOf(currentQuestion));
            showModal("Jawaban benar!", "Lanjutkan ke soal berikutnya?", "next-question");
        } else {
            showModal("Jawaban salah!", "Ulangi pertanyaan atau lanjutkan ke soal berikutnya?", "retry-question");
        }
    }, 1000);
}

function showModal(message, buttonText, buttonAction) {
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    document.getElementById("next-question-btn").style.display = buttonAction === "next-question" ? "inline-block" : "none";
    document.getElementById("retry-btn").style.display = buttonAction === "retry-question" ? "inline-block" : "none";
    document.getElementById("modal").style.display = "block";
}

function nextQuestion() {
    document.getElementById("modal").style.display = "none";
    loadQuestion();
}

function retryQuestion() {
    document.getElementById("modal").style.display = "none";
    loadQuestion();
}

function loadLeaderboard() {
    if (leaderboard.length === 0) {
        document.getElementById("leaderboard").style.display = 'none';
        return;
    }

    document.getElementById("leaderboard").style.display = 'block';
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    leaderboard.forEach(entry => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.textContent = entry.name;
        const tdScore = document.createElement('td');
        tdScore.textContent = entry.score;
        tr.appendChild(tdName);
        tr.appendChild(tdScore);
        leaderboardList.appendChild(tr);
    });
}

function endGame() {
    leaderboard.push({ name: userName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 5) leaderboard.pop();
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    alert(`Permainan selesai, Skor akhir: ${score}`);
    window.location.reload();
}
  
