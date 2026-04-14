const BASE_URL = 'https://petzone-backend-3.onrender.com';
    let currentMethod = 'card';

    function selectMethod(method) {
      currentMethod = method;
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.method-content').forEach(c => c.style.display = 'none');
      
      const targetElement = document.querySelector(`.payment-method[onclick*="${method}"]`);
      targetElement.classList.add('active');
      targetElement.querySelector('input').checked = true;
      document.getElementById(`${method}Content`).style.display = 'block';
    }

    function formatCardNumber(input) {
      let v = input.value.replace(/\D/g, '').substring(0, 16);
      let parts = v.match(/.{1,4}/g) || [];
      input.value = parts.join(' ');
    }

    function formatExpiry(input) {
      let v = input.value.replace(/\D/g, '').substring(0, 4);
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      input.value = v;
    }

    async function initPayment() {
      const urlParams = new URLSearchParams(window.location.search);
      const petId = urlParams.get('pet_id');

      if (!petId) {
        alert("Pet verification failed. Redirecting...");
        window.location.href = "pets.html";
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/pets/${petId}`);
        if (!res.ok) throw new Error("Pet details unavailable");
        const pet = await res.json();

        document.getElementById("summaryPetName").textContent = pet.pet_name;
        document.getElementById("summaryPetType").textContent = `${pet.pet_type} • ${pet.breed}`;
        document.getElementById("summaryPrice").textContent = `₹${pet.price.toLocaleString()}`;

        const total = pet.price + 250;
        document.getElementById("summaryTotal").textContent = `₹${total.toLocaleString()}`;

        document.getElementById("payBtn").onclick = async () => {
          if (!validateInputs()) return;

          const btn = document.getElementById("payBtn");
          btn.textContent = "🔒 Verifying Transaction...";
          btn.disabled = true;

          try {
            const txnId = 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase();
            
            // Store in backend
            const paymentData = {
                pet_id: parseInt(petId),
                amount: total,
                payment_method: currentMethod,
                transaction_id: txnId
            };

            const response = await fetch(`${BASE_URL}/payments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) throw new Error("Backend storage failed");

            document.getElementById("transactionId").textContent = `ID: ${txnId} • ${new Date().toLocaleDateString()}`;
            document.getElementById("successModal").style.display = "flex";
          } catch (err) {
            console.error(err);
            alert("Payment processed, but receipt generation failed. Please contact support.");
            btn.textContent = "Complete Payment 🐾";
            btn.disabled = false;
          }
        };

      } catch (err) {
        console.error(err);
        alert("Connectivity error. Please try again.");
      }
    }

    function validateInputs() {
        if (currentMethod === 'card') {
            const card = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiry = document.getElementById('cardExpiry').value;
            const cvv = document.getElementById('cardCvv').value;
            const name = document.getElementById('cardName').value;

            if (card.length < 16) { alert("Enter a valid card number"); return false; }
            if (expiry.length < 5) { alert("Enter valid expiry (MM/YY)"); return false; }
            if (cvv.length < 3) { alert("Enter valid CVV"); return false; }
            if (name.trim().length < 3) { alert("Enter cardholder name"); return false; }
        } else {
            const upi = document.getElementById('upiId').value;
            if (!upi.includes('@')) { alert("Enter a valid UPI ID"); return false; }
        }
        return true;
    }

    window.onload = initPayment;