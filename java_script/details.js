     async function loadPetDetails() {
            const urlParams = new URLSearchParams(window.location.search);
            const petId = urlParams.get('id');

            if (!petId) {
                alert("Pet ID missing!");
                window.location.href = "pets.html";
                return;
            }

            try {
                const BASE_URL = 'http://127.0.0.1:5000';
                const response = await fetch(`${BASE_URL}/pets/${petId}`);
                if (!response.ok) throw new Error("Pet not found");

                const pet = await response.json();

                document.getElementById("petName").textContent = pet.pet_name;
                document.getElementById("petAge").textContent = pet.age_months;
                document.getElementById("petGender").textContent = pet.gender;
                document.getElementById("petBreed").textContent = pet.breed;
                document.getElementById("petVaccinated").textContent = pet.vaccinated ? "Yes" : "No";
                document.getElementById("petDescription").textContent = pet.description;
                document.getElementById("petPrice").textContent = `₹${pet.price.toLocaleString()}`;

                const mainImg = document.getElementById("mainPetImage");
                const thumbnailsContainer = document.getElementById("thumbnails");
                thumbnailsContainer.innerHTML = ""; // Clear existing thumbnails

                if (pet.image) {
                    const images = Array.isArray(pet.image) ? pet.image : [pet.image];

                    if (images.length > 0) {
                        const formatUrl = (url) => {
                            if (!url) return "https://via.placeholder.com/600x400?text=No+Image";
                            return url.startsWith('http') || url.startsWith('data:') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
                        };

                        // mainImg.src = formatUrl(images[0]);
                        mainImg.loading = "lazy";
                        mainImg.src = formatUrl(images[0]);

                        // Add thumbnails if there are multiple images
                        if (images.length > 1) {
                            images.forEach(imgUrl => {
                                const fullUrl = formatUrl(imgUrl);
                                const thumb = document.createElement("img");
                                thumb.src = fullUrl;
                                thumb.alt = "Pet Thumbnail";
                                thumb.onclick = () => { mainImg.src = fullUrl; };
                                thumb.onerror = () => { thumb.style.display = "none"; };
                                thumbnailsContainer.appendChild(thumb);
                            });
                        }
                    } else {
                        mainImg.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }
                } else {
                    mainImg.src = "https://via.placeholder.com/600x400?text=No+Image";
                }
                mainImg.onerror = () => { mainImg.src = "https://via.placeholder.com/600x400?text=No+Image"; };

                // Update contact seller button
                document.getElementById("contactSellerBtn").href = `whatsapp.html?pet_id=${pet.id}&owner_id=${pet.owner_id}`;

            } catch (error) {
                console.error("Error loading pet details:", error);
                alert("Error loading pet details: " + error.message);
                window.location.href = "pets.html";
            }
        }

        function changeImage(element) {
            document.getElementById("mainPetImage").src = element.src;
        }

        // window.onload = loadPetDetails;
        document.addEventListener("DOMContentLoaded", loadPetDetails);