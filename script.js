// Toggle Side Menu
function toggleMenu() {
    const menu = document.getElementById('fullMenu');
    menu.classList.toggle('active');
}

// Language Switcher Logic
const translations = {
    id: { news: "Berita Terbaru", bday: "Ulang Tahun Member" },
    en: { news: "Latest News", bday: "Member Birthday" },
    jp: { news: "最新ニュース", bday: "メンバーの誕生日" }
};

document.getElementById('langSelect').addEventListener('change', (e) => {
    const lang = e.target.value;
    document.querySelector('.news-card h3').innerHTML = `<i class="fas fa-newspaper"></i> ${translations[lang].news}`;
    document.querySelector('.bday-card h3').innerHTML = `<i class="fas fa-birthday-cake"></i> ${translations[lang].bday}`;
});

// Simulasi Data News
const newsData = ["Single Baru Rilis!", "Konser Musim Panas Diumumkan", "Audit Generasi Baru Dimulai"];
const newsList = document.getElementById('newsList');

newsList.innerHTML = newsData.map(n => `<li>${n}</li>`).join('');

