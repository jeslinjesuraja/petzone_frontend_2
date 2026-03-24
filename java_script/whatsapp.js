     const BASE_URL = 'http://127.0.0.1:5000';

        async function initChat() {
            const urlParams = new URLSearchParams(window.location.search);
            const petId = urlParams.get('pet_id');

            if (!petId) {
                alert("Pet details missing!");
                window.location.href = "pets.html";
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/pets/${petId}`);
                if (!res.ok) throw new Error("Pet not found");
                const pet = await res.json(); //converts the response to a JavaScript object.

                
                document.getElementById("petName").textContent = pet.pet_name;
                document.getElementById("displayPrice").textContent = pet.price.toLocaleString();

                const avatar = document.getElementById("petAvatar");
                if (pet.image && pet.image.length > 0) {
                    avatar.src = pet.image[0];
                }
                avatar.onerror = () => { avatar.src = '../assets/dog.jpg'; };

                
                const sellerPhone = pet.seller_phone;

                document.getElementById("waContactBtn").href = `https://wa.me/${sellerPhone}?text=Hi, I'm interested in adopting ${pet.pet_name} from PetZone!`;

                
                document.getElementById("confirmOrderBtn").onclick = () => {
                    window.location.href = `payment.html?pet_id=${pet.id}`;
                };

            } catch (err) {
                console.error(err);
                alert("Error loading inquiry data.");
            }
        }

        window.onload = initChat;