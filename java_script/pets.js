// pets.js
const petContainer = document.getElementById('petContainer');
const searchInput = document.getElementById('petSearch');
const noResults = document.getElementById('noResults');

let allPets = [];
const BASE_URL = 'http://127.0.0.1:5000';
let currentFilter = 'all';

async function fetchPets() {
    try {
        const response = await fetch(`${BASE_URL}/pets/`);
        if (!response.ok) throw new Error('Failed to fetch pets');

        allPets = await response.json();
        renderPets(allPets);
        setupFilters();
    } catch (error) {
        console.error('Error fetching pets:', error);
        noResults.textContent = "Error loading pets. Please try again later. 🐾";
        noResults.style.display = "block";
    }
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const filteredPets = allPets.filter(pet => {
        const matchesSearch = pet.pet_name.toLowerCase().includes(query) ||
                            pet.pet_type.toLowerCase().includes(query) ||
                            (pet.breed && pet.breed.toLowerCase().includes(query));
        
        const matchesCategory = currentFilter === 'all' || pet.pet_type.toLowerCase() === currentFilter;
        return matchesSearch && matchesCategory;
    });
    renderPets(filteredPets);
}

function renderPets(pets) {
    if (!petContainer) return;
    petContainer.querySelectorAll('.card').forEach(card => card.remove());

    if (pets.length === 0) {
        if (noResults) noResults.style.display = "block";
        return;
    }

    if (noResults) noResults.style.display = "none";

    pets.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'card fade-in';

        // Use pet image or a generic placeholder if missing
        const imageUrl = (pet.image && pet.image[0]) || 'https://via.placeholder.com/200?text=No+Image';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${pet.pet_name}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="margin:0;">${pet.pet_name}</h3>
                    <span style="font-size: 0.7rem; background: #f0f4f8; padding: 2px 8px; border-radius: 10px; color: #64748b; font-weight:700; text-transform: uppercase;">${pet.pet_type}</span>
                </div>
                <p style="margin-top:10px;">Breed: ${pet.breed || '-'}</p>
                <p>Age: ${pet.age_months} months</p>
                <p style="font-weight:700; color: #1f2937; font-size: 1.1rem; margin-top:10px;">₹${pet.price.toLocaleString()}</p>
                <a href="../html/details.html?id=${pet.id}">
                    <button>View Details</button>
                </a>
            </div>
        `;
        petContainer.appendChild(card);
    });
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
fetchPets();
