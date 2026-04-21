document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const useLocationBtn = document.getElementById("useLocation");

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
  const suggestions = document.getElementById("suggestions");

  places.forEach(place => {
    L.marker([place.lat, place.lng])
      .addTo(map)
      .bindPopup(place.name);

    const div = document.createElement("div");
    div.className = "place";
    div.innerHTML = `
      ${place.name}
      <div class="details">${place.desc}</div>
    `;

    div.addEventListener("click", () => {
      div.classList.toggle("active");
    });

    resultsList.appendChild(div);
  });

  if (suggestions) {
    suggestions.innerHTML = "<h3>Suggestions based on your previous searches</h3>";
  }

  places.forEach(place => {
    if (suggestions) {
      const sug = document.createElement("div");
      sug.className = "place";
      sug.innerText = place.name;
      suggestions.appendChild(sug);
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