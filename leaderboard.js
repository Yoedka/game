// Memuat leaderboard dari API
async function loadLeaderboard() {
    try {
        const response = await fetch('https://676afcc1bc36a202bb83d30a.mockapi.io/api/v1/users');
        if (!response.ok) throw new Error('Gagal memuat leaderboard');
        return await response.json();
    } catch (error) {
        console.error('Gagal memuat leaderboard:', error);
        return [];
    }
}

// Memperbarui tampilan leaderboard
async function updateLeaderboard() {
    const leaderboard = await loadLeaderboard();
    const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
    leaderboardTable.innerHTML = '';

    leaderboard
        .sort((a, b) => b.score - a.score) // Urutkan berdasarkan skor tertinggi
        .forEach((entry, index) => {
            const row = leaderboardTable.insertRow();
            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = entry.name;
            row.insertCell(2).textContent = entry.score;
        });
}

// Memuat leaderboard saat halaman dimuat
window.onload = updateLeaderboard;
