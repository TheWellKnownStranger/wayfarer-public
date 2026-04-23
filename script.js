document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const useLocationBtn = document.getElementById("useLocation");
  const themeToggle = document.getElementById("themeToggle");
  const mainLogo = document.getElementById("mainLogo");

  function updateLogo() {
    if (!mainLogo) return;
    if (document.body.classList.contains("dark")) {
      mainLogo.src = "https://images4.imagebam.com/15/7f/48/ME1BEF30_o.png";
    } else {
      mainLogo.src = "https://images4.imagebam.com/c1/b3/2d/ME1BEF0C_o.png";
    }
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  updateLogo();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }

      updateLogo();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const location = document.getElementById("locationInput").value;
      const distance = document.getElementById("distance").value;

      localStorage.setItem("location", location);
      localStorage.setItem("distance", distance);

      window.location.href = "results.html";
    });
  }

  if (useLocationBtn) {
    useLocationBtn.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(pos => {
        localStorage.setItem("lat", pos.coords.latitude);
        localStorage.setItem("lng", pos.coords.longitude);
        alert("Location captured!");
      });
    });
  }

  if (document.getElementById("map")) {
    initMap();
  }

  startFadeGallery();
});

/* Fade Gallery */
function startFadeGallery() {
  const images = document.querySelectorAll(".fade-img");
  if (!images.length) return;

  let index = 0;

  setInterval(() => {
    images[index].classList.remove("active");
    index = (index + 1) % images.length;
    images[index].classList.add("active");
  }, 4000);
}

function initMap() {
  const lat = localStorage.getItem("lat") || 52.52;
  const lng = localStorage.getItem("lng") || 13.405;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  const places = [
    { name: "Museum", lat: lat * 1.001, lng: lng * 1.001, desc: "A cultural place full of history." },
    { name: "Park", lat: lat * 0.999, lng: lng * 1.002, desc: "A relaxing green space." },
    { name: "Historic Site", lat: lat * 1.002, lng: lng * 0.998, desc: "A place of historical importance." }
  ];

  const resultsList = document.getElementById("resultsList");
  const savedList = document.getElementById("savedList");
  const suggestions = document.getElementById("suggestions");

  if (savedList) {
    savedList.innerHTML = "<h3>Saved Searches</h3><div class='grid'></div>";
  }

  places.forEach(place => {
    L.marker([place.lat, place.lng])
      .addTo(map)
      .bindPopup(place.name);

    const div = document.createElement("div");
    div.className = "place";
    div.innerHTML = `
      ${place.name}
      <button class="add-btn">+</button>
      <div class="details">${place.desc}</div>
    `;

    div.querySelector(".add-btn").addEventListener("click", (e) => {
      e.stopPropagation();

      const saved = document.createElement("div");
      saved.className = "place";
      saved.innerHTML = `
        ${place.name}
        <button class="remove-btn">-</button>
        <div class="details">${place.desc}</div>
      `;

      saved.addEventListener("click", () => {
        saved.classList.toggle("active");
      });

      saved.querySelector(".remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        saved.remove();
      });

      savedList.querySelector(".grid").appendChild(saved);
    });

    div.addEventListener("click", () => {
      div.classList.toggle("active");
    });

    resultsList.appendChild(div);
  });

  if (suggestions) {
    suggestions.innerHTML = "<h3>Suggestions based on your previous searches</h3><div class='grid'></div>";
  }

  places.forEach(place => {
    if (suggestions) {
      const sug = document.createElement("div");
      sug.className = "place";
      sug.innerHTML = `
        ${place.name}
        <div class="details">${place.desc}</div>
      `;

      sug.addEventListener("click", () => {
        sug.classList.toggle("active");
      });

      suggestions.querySelector(".grid").appendChild(sug);
    }
  });
}

/* Sidebar */
function openSidebar(id) {
  const el = document.getElementById(id);
  el.style.display = "block";
  setTimeout(() => {
    el.classList.add("active");
  }, 10);
}

function closeSidebar(id) {
  const el = document.getElementById(id);
  el.classList.remove("active");
  setTimeout(() => {
    el.style.display = "none";
  }, 300);
}