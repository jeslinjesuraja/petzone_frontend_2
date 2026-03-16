      let currentPetId = null;

        async function loadPetData() {
            const urlParams = new URLSearchParams(window.location.search);
            currentPetId = urlParams.get('id');

            if (!currentPetId) {
                alert("Pet ID missing!");
                window.location.href = "mypets.html";
                return;
            }

            try {
                const BASE_URL = 'http://127.0.0.1:5000';
                const response = await fetch(`${BASE_URL}/pets/${currentPetId}`);
                const pet = await response.json();

                document.getElementById("petName").value = pet.pet_name;
                document.getElementById("petType").value = pet.pet_type;
                updateBreeds(); // Populate breeds list
                document.getElementById("petAge").value = pet.age_months;
                document.getElementById("vaccinated").value = pet.vaccinated ? "Yes" : "No";
                document.getElementById("gender").value = pet.gender;
                document.getElementById("breed").value = pet.breed;
                document.getElementById("price").value = pet.price;
                document.getElementById("description").value = pet.description;

            } catch (error) {
                console.error("Error loading pet data:", error);
            }
        }

        function updateBreeds() {
            const petType = document.getElementById("petType").value;
            const breed = document.getElementById("breed");
            breed.innerHTML = '<option value="">Select Breed</option>';

            let breeds = [];
            if (petType === "dog") breeds = ["Labrador", "German Shepherd", "Golden Retriever", "Pug", "Beagle"];
            else if (petType === "cat") breeds = ["Persian", "Siamese", "Maine Coon", "Bengal"];
            else if (petType === "bird") breeds = ["Love Bird", "Cockatiel", "Budgerigar"];
            else if (petType === "fish") breeds = ["Goldfish", "Guppy", "Betta"];

            breeds.forEach(b => {
                const opt = document.createElement("option");
                opt.value = b;
                opt.textContent = b;
                breed.appendChild(opt);
            });
        }

        document.getElementById("editPetForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Convert numbers and boolean for cleaner API interaction
            if (data.age_months) data.age_months = parseInt(data.age_months);
            if (data.price) data.price = parseInt(data.price);
            
            const BASE_URL = 'http://127.0.0.1:5000';
            const token = authHelper.getToken();

            if (!token) {
                alert("Please login first.");
                window.location.href = "login.html";
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/pets/${currentPetId}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert("Pet updated successfully!");
                    window.location.href = "mypets.html";
                } else {
                    const errorData = await response.json();
                    alert("Failed to update pet: " + (errorData.detail || "Unknown error"));
                }
            } catch (error) {
                console.error("Error updating pet:", error);
                alert("Error updating pet: " + error.message);
            }
        });

        window.onload = loadPetData;