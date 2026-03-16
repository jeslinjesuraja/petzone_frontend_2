    async function loadMyPets() {
            if (!authHelper.getToken()) {
                alert("Please login first.");
                window.location.href = "login.html";
                return;
            }

            try {
                const BASE_URL = 'http://127.0.0.1:5000';
                const response = await authHelper.authenticatedFetch(`${BASE_URL}/pets/my-pets`);
                const pets = await response.json();

                const container = document.getElementById("petsContainer");
                container.innerHTML = "";

                if (pets.length === 0) {
                    container.innerHTML = "<p>You haven't posted any pets yet.</p>";
                    return;
                }

                pets.forEach(pet => {
                    const card = document.createElement("div");
                    card.className = "pet-card";

                    // Handle image array or string
                    let imageUrl = '../assets/dog.jpg';
                    if (pet.image && pet.image.length > 0) {
                        const img = Array.isArray(pet.image) ? pet.image[0] : pet.image;
                        if (img) {
                            // If it's already a full URL or Base64, use it as is
                            if (img.startsWith('http') || img.startsWith('data:')) {
                                imageUrl = img;
                            } else {
                                // Otherwise prepend BASE_URL
                                imageUrl = `${BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
                            }
                        }
                    }

                    card.innerHTML = `
                <div class="image-container">
                    <a href="details.html?id=${pet.id}">
                        <img src="${imageUrl}" alt="${pet.pet_name}" onerror="this.src='../assets/dog.jpg'">
                    </a>
                </div>
                <div class="pet-info">
                    <h3>${pet.pet_name}</h3>
                    <p class="detail">Age: <span>${pet.age_months} Months</span></p>
                    <p class="detail">Price: <span>₹${pet.price.toLocaleString()}</span></p>
                    
                    <div class="status-row">
                        <span class="status available">Available</span>
                    </div>

                    <div class="actions">
                        <a href="edit.html?id=${pet.id}" class="btn edit">Edit</a>
                        <button onclick="deletePet(${pet.id})" class="btn delete">Delete</button>
                    </div>
                </div>
            `;
                    container.appendChild(card);
                });
            } catch (error) {
                console.error("Error loading pets:", error);
                alert("Error loading your pets: " + error.message);
            }
        }

        async function deletePet(petId) {
            if (!confirm("Are you sure you want to delete this pet?")) return;

            try {
                const BASE_URL = 'http://127.0.0.1:5000';
                const response = await authHelper.authenticatedFetch(`${BASE_URL}/pets/${petId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    alert("Pet deleted successfully!");
                    loadMyPets();
                } else {
                    const data = await response.json();
                    alert("Failed to delete pet: " + (data.detail || "Unknown error"));
                }
            } catch (error) {
                console.error("Error deleting pet:", error);
                alert("Error deleting pet: " + error.message);
            }
        }

        window.onload = loadMyPets;