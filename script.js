// Logika Menu Overlay
function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    menu.classList.toggle('active');
}

// Menutup menu jika link diklik
document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menuOverlay').classList.remove('active');
    });
});
