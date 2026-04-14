document.getElementById("msgForm").addEventListener("submit", async function (e) {
      e.preventDefault(); // stop normal submit

      const data = {
        buyer_name: document.querySelector('[name="username"]').value.trim(),
        buyer_email: document.querySelector('[name="email"]').value.trim(),
        buyer_phone: document.querySelector('[name="phone"]').value.trim(),
        message: document.querySelector('[name="message"]').value.trim(),
        pet_id: parseInt(document.getElementById("petId").value)
      };

      console.log("Sending:", data);

      try {
        const res = await fetch("https://petzone-backend-3.onrender.com/messages/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          window.location.href = "../html/sent.html";
        } else {
          const err = await res.json();
          console.log("Error:", err);
          alert("Message not sent ");
        }

      } catch (err) {
        alert("Server error ");
        console.log(err);
      }
    });