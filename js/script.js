tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#FF6B6B',   // Merah muda ceria
                secondary: '#4ECDC4', // Tosca modern
                accent: '#FFE66D',    // Kuning pop
                dark: '#292F36'
            },
            fontFamily: {
                heading: ['Fredoka', 'sans-serif'],
                body: ['Poppins', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    }
}

async function loadSection(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="container mx-auto py-20 text-center text-red-600">Gagal memuat ${filePath}. Pastikan server berjalan dan file tersedia.</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSection('home-content', 'home-section.html');
    loadSection('category-content', 'kategori-section.html');
    loadSection('katalog-content', 'katalog-section.html');
    loadSection('testimoni-content', 'testimoni-section.html');
});