// ---------- 1. THE IMAGE DATA ----------
// Each image is an "object" with a file path, a title, and a category.
// To add a new image later, just add another line here.
const images = [
  // CARS
  { src: "images/cars/porsche-911-turbo-s.jpg", title: "Porsche 911 Turbo S", category: "cars" },
  { src: "images/cars/chevrolet-camaro.jpg", title: "Chevrolet Camaro", category: "cars" },
  { src: "images/cars/bensberg-supersports-classic.jpg", title: "Schloss Bensberg Supersports Classic", category: "cars" },
  { src: "images/cars/dodge-challenger.jpg", title: "Dodge Challenger", category: "cars" },

  // ANIME (files do not exist yet, so these show the mint placeholder.
  // Later, add your art to images/anime/ using these names.)
  { src: "images/anime/anime-1.jpg", title: "Anime Art 1", category: "anime" },
  { src: "images/anime/anime-2.jpg", title: "Anime Art 2", category: "anime" },
  { src: "images/anime/anime-3.jpg", title: "Anime Art 3", category: "anime" },
  { src: "images/anime/anime-4.jpg", title: "Anime Art 4", category: "anime" },

  // FOOD
  { src: "images/food/pizza.jpg", title: "Heavenly Slice Pizza", category: "food" },
  { src: "images/food/burger.jpg", title: "Big Burger with Pepper and Sesame", category: "food" },
  { src: "images/food/vegan-salad-bowl.jpg", title: "Vegan Salad Bowl", category: "food" },
  { src: "images/food/egusi-soup.jpg", title: "Egusi Soup", category: "food" },
];

// ---------- 2. GRAB ELEMENTS ----------
const gallery = document.querySelector("#gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCounter = document.querySelector("#lightbox-counter");
const closeBtn = document.querySelector("#lightbox-close");
const prevBtn = document.querySelector("#lightbox-prev");
const nextBtn = document.querySelector("#lightbox-next");

// ---------- 3. MEMORY ----------
let visibleImages = [...images]; // the images currently shown (changes with the filter)
let currentIndex = 0;            // which visible image is open in the lightbox

// ---------- 4. BUILD THE GALLERY ----------
function renderGallery() {
  gallery.innerHTML = ""; // empty the grid first

  // forEach runs this code once for every image in the list
  visibleImages.forEach((image, index) => {
    // Create the tile
    const item = document.createElement("div");
    item.className = "gallery-item";

    // loading="lazy" means the browser only loads images when you scroll near them
    item.innerHTML = `
      <img src="${image.src}" alt="${image.title}" loading="lazy" />
      <div class="overlay">
        <h3>${image.title}</h3>
        <span class="tag">${image.category}</span>
      </div>
    `;

    // If the image file is missing or fails, show the mint placeholder instead
    const img = item.querySelector("img");
    img.addEventListener("error", () => item.classList.add("broken"));

    // Clicking the tile opens the lightbox at this image
    item.addEventListener("click", () => openLightbox(index));

    gallery.appendChild(item);
  });
}

// ---------- 5. FILTERING ----------
function filterGallery(category) {
  // Fade the grid out...
  gallery.classList.add("fading");

  // ...wait for the fade (250ms), swap the images, then fade back in
  setTimeout(() => {
    visibleImages =
      category === "all"
        ? [...images]
        : images.filter((image) => image.category === category);
    renderGallery();
    gallery.classList.remove("fading");
  }, 250);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Move the "active" highlight to the clicked button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    filterGallery(button.dataset.filter);
  });
});

// ---------- 6. LIGHTBOX ----------
function showImage() {
  const image = visibleImages[currentIndex];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.title;
  lightboxTitle.textContent = image.title;
  // Counter like "3 / 12"
  lightboxCounter.textContent = `${currentIndex + 1} / ${visibleImages.length}`;
}

function openLightbox(index) {
  currentIndex = index;
  showImage();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden"; // stop the page scrolling behind it
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function nextImage() {
  // The % (remainder) makes it wrap from the last image back to the first
  currentIndex = (currentIndex + 1) % visibleImages.length;
  showImage();
}

function prevImage() {
  // Adding the length first avoids a negative number when going back from 0
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  showImage();
}

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);

// Clicking the dark background (but not the image or buttons) also closes it
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard controls, only while the lightbox is open
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") nextImage();
  if (event.key === "ArrowLeft") prevImage();
});

// ---------- 7. START ----------
renderGallery();