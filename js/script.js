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

function renderSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cardCount = containerId === 'katalog-content' ? 4 : 3;

    container.innerHTML = `
        <div class="container mx-auto px-6 py-20">
            <div class="space-y-8">
                <div class="h-8 w-2/3 rounded-full skeleton-card"></div>
                <div class="h-4 w-1/2 rounded-full skeleton-card"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    ${Array.from({ length: cardCount }, () => `
                        <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div class="h-64 rounded-2xl skeleton-card mb-4"></div>
                            <div class="h-4 w-3/4 rounded-full skeleton-card mb-3"></div>
                            <div class="h-3 w-full rounded-full skeleton-card mb-2"></div>
                            <div class="h-3 w-5/6 rounded-full skeleton-card mb-4"></div>
                            <div class="flex justify-between items-center">
                                <div class="h-5 w-20 rounded-full skeleton-card"></div>
                                <div class="h-10 w-10 rounded-xl skeleton-card"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

async function loadSection(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    renderSkeleton(containerId);

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }

        const html = await response.text();
        container.innerHTML = html;

        const firstChild = container.firstElementChild;
        if (firstChild) {
            firstChild.classList.add('section-content');
            requestAnimationFrame(() => {
                firstChild.classList.add('is-visible');
            });
        }
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

    const whatsappNumber = '6285733263758';
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