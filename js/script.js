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

function initOrderModal() {
    const orderModal = document.getElementById('order-modal');
    if (!orderModal) return;

    const productNameEl = document.getElementById('order-product-name');
    const productPriceEl = document.getElementById('order-product-price');
    const productDescriptionEl = document.getElementById('order-product-description');
    const productImageEl = document.getElementById('order-product-image');
    const quantityInput = document.getElementById('order-quantity');
    const sendWhatsappButton = document.getElementById('order-send-whatsapp');
    const closeButton = document.getElementById('order-close-btn');

    const whatsappNumber = '62857233263735';
    let currentProduct = {
        name: '',
        price: '',
        description: '',
    };

    function openModal(product) {
        currentProduct = product;
        productNameEl.textContent = product.name;
        productPriceEl.textContent = product.price;
        productDescriptionEl.textContent = product.description;
        productImageEl.src = product.image;
        productImageEl.alt = product.name;
        quantityInput.value = 1;
        orderModal.classList.remove('hidden');
        orderModal.classList.add('flex');
    }

    function closeModal() {
        orderModal.classList.remove('flex');
        orderModal.classList.add('hidden');
    }

    document.querySelectorAll('[data-order-button="true"]').forEach(button => {
        button.addEventListener('click', () => {
            openModal({
                name: button.dataset.productName,
                price: button.dataset.productPrice,
                description: button.dataset.productDescription,
                image: button.dataset.productImage,
            });
        });
    });

    closeButton.addEventListener('click', closeModal);
    orderModal.addEventListener('click', event => {
        if (event.target === orderModal) {
            closeModal();
        }
    });

    sendWhatsappButton.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value, 10);
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
            quantityInput.value = 1;
        }

        const message = `Halo DuniaBalon, saya mau pesan ${currentProduct.name} sebanyak ${quantity}.
Harga satuan: ${currentProduct.price}.
Tolong konfirmasi ketersediaan dan total harganya.`;
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadSection('home-content', 'home-section.html'),
        loadSection('category-content', 'kategori-section.html'),
        loadSection('katalog-content', 'katalog-section.html'),
        loadSection('testimoni-content', 'testimoni-section.html'),
    ]);
    initOrderModal();
});