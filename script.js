let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

/**
 * Fungsi untuk memulai permainan
 * @param {number} questionCount - Jumlah soal yang dipilih
 */
function startGame(questionCount) {
    const username = document.getElementById("username").value.trim();

    if (username === "") {
        alert("Harap masukkan nama Anda!");
        return;
    }

    // Menyimpan nama pengguna dan jumlah soal
    document.getElementById("game-title").textContent = `Selamat datang, ${username}!`;
    totalQuestions = questionCount;

    // Memuat soal dari JSON
    fetchQuestions().then(() => {
        if (questions.length === 0) {
            alert("Soal tidak ditemukan. Harap periksa file questions.json.");
            return;
        }
        // Mulai permainan
        document.getElementById("welcome-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "flex";
        showQuestion();
    });
}

/**
 * Fungsi untuk memuat soal dari file JSON
 */
async function fetchQuestions() {
    try {
        const response = await fetch("questions.json");
        if (!response.ok) throw new Error("Gagal memuat soal.");
        const data = await response.json();
        questions = data.sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat memuat soal.");
    }
}

/**
 * Fungsi untuk menampilkan soal saat ini
 */
function showQuestion() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("answer-feedback");

    // Reset tampilan
    feedbackElement.style.display = "none";
    choicesElement.innerHTML = "";

    // Tampilkan soal
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    // Tampilkan pilihan
    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.className = "choice-btn";
        button.onclick = () => checkAnswer(index);
        choicesElement.appendChild(button);
    });
}

/**
 * Fungsi untuk memeriksa jawaban
 * @param {number} selectedIndex - Indeks jawaban yang dipilih
 */
function checkAnswer(selectedIndex) {
    const feedbackElement = document.getElementById("answer-feedback");
    const currentQuestion = questions[currentQuestionIndex];

    // Cek jawaban
    if (selectedIndex === currentQuestion.correct) {
        score++;
        feedbackElement.textContent = "Benar! 😊";
        feedbackElement.style.backgroundColor = "#4CAF50";
    } else {
        feedbackElement.textContent = `Salah! Jawaban yang benar: ${currentQuestion.choices[currentQuestion.correct]}`;
        feedbackElement.style.backgroundColor = "#FF6F61";
    }

    feedbackElement.style.display = "block";

    // Lanjutkan ke soal berikutnya setelah 2 detik
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 2000);
}

/**
 * Fungsi untuk mengakhiri permainan
 */
function endGame() {
    document.getElementById("game-screen").style.display = "none";
    alert(`Permainan selesai! Skor Anda: ${score}/${totalQuestions}`);
    // Reset permainan
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("welcome-screen").style.display = "flex";
}
