  
    // Check login
    if (!authHelper.getToken()) {
      alert("Please login first to post a pet.");
      window.location.href = "login.html";
    }

    // Tab switching - only toggles visibility, sell.js handles the rest
    function switchTab(tab) {
      if (tab === 'file') {
        document.getElementById('fileTab').style.display = 'block';
        document.getElementById('urlTab').style.display = 'none';
        document.getElementById('fileTabBtn').classList.add('active');
        document.getElementById('urlTabBtn').classList.remove('active');
      } else {
        document.getElementById('fileTab').style.display = 'none';
        document.getElementById('urlTab').style.display = 'block';
        document.getElementById('urlTabBtn').classList.add('active');
        document.getElementById('fileTabBtn').classList.remove('active');
      }
      document.getElementById('imagePreview').innerHTML = '';
    }

    // Breed dropdown update
    function updateBreeds() {
      const petType = document.getElementById("petType").value;
      const breed = document.getElementById("breed");
      breed.innerHTML = '<option value="">Select Breed</option>';
      let breeds = [];
      if (petType === "dog") { breeds = ["Labrador", "German Shepherd", "Golden Retriever", "Pug", "Beagle"]; showVaccinated(); }
      else if (petType === "cat") { breeds = ["Persian", "Siamese", "Maine Coon", "Bengal"]; showVaccinated(); }
      else if (petType === "bird") { breeds = ["Love Bird", "Cockatiel", "Budgerigar"]; hideVaccinated(); }
      else if (petType === "fish") { breeds = ["Goldfish", "Guppy", "Betta"]; hideVaccinated(); }
      breeds.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b; opt.textContent = b;
        breed.appendChild(opt);
      });
    }

    function showVaccinated() {
      document.getElementById("vaccinatedBox").style.display = "block";
      document.getElementById("vaccinated").required = true;
    }
    function hideVaccinated() {
      document.getElementById("vaccinatedBox").style.display = "none";
      document.getElementById("vaccinated").required = false;
      document.getElementById("vaccinated").value = "";
    }
















// sell.js
const BASE_URL = 'http://127.0.0.1:5000';
const sellForm = document.getElementById('sellForm');

// Stores all image URLs
let allImageUrls = [];

const fileInput = document.getElementById('fileInput');
const fileDropArea = document.getElementById('fileDropArea');
const imagePreview = document.getElementById('imagePreview');

// ───────── IMAGE MANAGEMENT ─────────
if (fileDropArea) fileDropArea.onclick = () => fileInput.click();
if (fileInput) fileInput.onchange = () => uploadFiles(Array.from(fileInput.files));

async function uploadFiles(files) {
    if (allImageUrls.length + files.length > 7) return alert("Max 7 images.");
    
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${BASE_URL}/pets/upload-image`, { method: 'POST', body: formData });
            const data = await res.json();
            allImageUrls.push(data.url);
        } catch (e) { alert("Upload failed: " + file.name); }
    }
    renderPreviews();
}

window.addUrl = () => {
    const url = prompt("Enter Image URL:");
    if (url) {
        allImageUrls.push(url);
        renderPreviews();
    }
};

function renderPreviews() {
    imagePreview.innerHTML = allImageUrls.map((url, i) => `
        <div style="position:relative;">
            <img src="${url}" style="width:100%; height:80px; object-fit:cover; border-radius:8px;">
            <button type="button" class="remove-img" onclick="removeImage(${i})">✕</button>
        </div>
    `).join('');
}

window.removeImage = (i) => {
    allImageUrls.splice(i, 1);
    renderPreviews();
};

// ───────── FORM SUBMIT ─────────
if (sellForm) {
    sellForm.onsubmit = async (e) => {
        e.preventDefault();
        const token = authHelper.getToken();
        if (!token) return alert("Please login first.");
        if (allImageUrls.length === 0) return alert("Please add at least one image.");

        const formData = new FormData(sellForm);
        allImageUrls.forEach(url => formData.append('image_urls', url));

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/pets/sell`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to post pet");

            alert("Pet posted successfully! 🎉");
            window.location.href = `../html/success.html?id=${data.pet_id}`;
        } catch (error) {
            console.error("Submit error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };
}

function setLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    if (btn) {
        btn.disabled = isLoading;
        btn.textContent = isLoading ? "Posting Pet..." : "Post Pet 🐾";
    }
}
