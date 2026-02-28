function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    menu.classList.toggle('active');
}

// Menutup menu otomatis saat link diklik
document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menuOverlay').classList.remove('active');
    });
});
