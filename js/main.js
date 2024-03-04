/*
const url =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=7&sort_by=popularity.desc";


/* const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';*/

// carousel upcoming movies

let wrapper = document.querySelector(".wrapper"),
  carousel = document.querySelector(".carousel");
cards = document.querySelectorAll(".carousel .card");
arrowBtn = document.querySelectorAll(".wrapper i");

let isDragging = false,
  starX,
  startScrollLeft;

const api_key = "5030260b38044c265f2e8a196a9e7ce8";
const base_img = "https://image.tmdb.org/t/p/w500";
const API =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDMwMjYwYjM4MDQ0YzI2NWYyZThhMTk2YTllN2NlOCIsInN1YiI6IjY1YzA5N2YwOTA3ZjI2MDBlYTcyMjA2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIcSkWr38Ol7-gkDS2uEWZU5PjBW6RBV-_Ih0ZPBxJE";

let title;

async function upcoming() {
  let randomNumber = Math.floor(Math.random() * 10);
  let response = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=${1}`
  );
  let data = await response.json();

  data.results.map((result) => {
    //console.log(result.overview);
    carousel.innerHTML += `
    <div class="card" onclick="openwindowblank('${result.title}','${
      result.release_date
    }','${result.popularity}','${result.overview.replace(
      /[\t\n'`"]/g,
      ""
    )}}','${base_img}${result.poster_path}')">
    <div class="image-box">
              <img src="${base_img}${
      result.poster_path
    }" alt="" class="poster"  draggable="false"/>
              </div>
          </div>
    `;
  });
  const firstCardwidth = carousel.querySelector(".carousel .card").offsetWidth;
  callingCard(firstCardwidth);
}

upcoming();

function openwindowblank(title, release_date, popularity, overview, poster) {
  // console.log(title, release_date, popularity, overview, poster);
  window.open(
    `movieBlank.html?title=${title}&release_date=${release_date}&popularity=${popularity}&overview=${overview}&poster=${poster}`,
    "_blank"
  );
}

//  getting width of first card

const dragstart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // records the initial cursor and scroll position of the carousel
  starX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return;
  // updates scroll position of the carousel based on the cursor movment
  carousel.scrollLeft = startScrollLeft - (e.pageX - starX);
};

const dragStop = (e) => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mousedown", dragstart);
carousel.addEventListener("mouseup", dragStop);

function callingCard(firstCardwidth) {
  arrowBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.id === "left" ? -firstCardwidth : firstCardwidth;
    });
  });
}

// carousel upcoming serie https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=1

let swiper_wrapper = document.querySelector(".swiper-wrapper");

async function upcomingSerie() {
  let response = await fetch(`https://api.tvmaze.com/shows`);
  let data = await response.json();
  // console.log(data);

  let series = data.slice(0, 30);

  series.map((result) => {
    // console.log(result);
    // first decalre summary has the html tags
    let summary = result.summary;
    // deaclarate DOMParser  parser html string to Dom ,allows to create new dom object can be manuplated
    let parser = new DOMParser();
    let parseHTML = parser.parseFromString(summary, "text/html");
    let cleanSommary = parseHTML.body.textContent;
    //let cleanSommar1y = parseHTML.body.innerHTML;

    swiper_wrapper.innerHTML += `
      <div class="swiper-slide" onclick="serieBlankShow('${result.name}','${
      result.genres
    }','${result.premiered}',
    '${result.rating.average}','${result.network.country.name}','${
      result.status
    }', '${cleanSommary.replace(/['`"]/g, "")}','${result.image.original}')">
        <img src="${result.image.original}" alt="" class="poster">
      </div>
      `;
  });
}

// series function for onclick calling
async function serieBlankShow(
  title,
  genres,
  premiered,
  rating,
  country,
  status,
  summary,
  poster
) {
  window.open(
    `serieBlank.html?title=${title}&genres=${genres}&premiered=${premiered}&rating=${rating}&country=${country}&status=${status}&summary=${summary}&poster=${poster}`,
    "_blank"
  );
}

// swipper
//Initialize Swiper -->

if (window.innerWidth > 1000) {
  //console.log("1000 more");

  swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 15,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    loop: true,
  });
}
if (window.innerWidth < 1000) {
  // console.log("1000 less");
  var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  });
}

upcomingSerie();

// Anime section

async function upcomingAnimes() {
  let anime_swipper = document.querySelector(".anime-swipper");
  //console.log(anime_swipper);

  let response = await fetch(`https://api.jikan.moe/v4/top/anime`);
  let results = await response.json();
  //console.log(results.data);

  results.data.map((result) => {
    //console.log(result);

    // let make an array for genres because every anime has length of anime
    let arraygenres = [];
    for (let i = 0; i < result.genres.length; i++) {
      arraygenres.push(result.genres[i].name);
    }

    // correct sory caracters cant pass throw tamplate literals
    let summary = result.synopsis.replace("[Written by MAL Rewrite]", "");
    // deaclarate DOMParser  parser html string to Dom ,allows to create new dom object can be manuplated
    let parser = new DOMParser();
    let parseHTML = parser.parseFromString(summary, "text/html");
    let cleanSommary = parseHTML.body.textContent;
    //console.log(cleanSommary.replace(/[\t\n'`"]/g, ""));

    anime_swipper.innerHTML += `
      <div class="swiper-slide" onclick="animeblank('${result.title}','${
      result.source
    }','${result.season}','${arraygenres}','${result.score}','${
      result.status
    }','${result.images.jpg.image_url}','${result.year}','${
      result.episodes
    }','${cleanSommary.replace(/[\t\n'`"]/g, "")}')">     
          <img src="${result.images.jpg.image_url}" alt="" class="poster"> 
      </div>

      `;
  });
}

function animeblank(
  title,
  source,
  season,
  genres,
  rating,
  status,
  poster,
  year,
  episodes,
  story
) {
  window.open(
    `animeBlank.html?title=${title}&source=${source}&season=${season}&genres=${genres}&rating=${rating}&status=${status}&poster=${poster}&year=${year}&episode=${episodes}&story=${story}`,
    "_blank"
  );
}

// initialize swiper

var swiper = new Swiper(".mySwaper", {
  slidesPerView: 1,
  spaceBetween: 5, //10
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 5,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 5, //20
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 5, //40
    },
    "@1.50": {
      slidesPerView: 4,
      spaceBetween: 5, //50
    },
  },
});

upcomingAnimes();

async function actordetails() {
  let box_actor = document.querySelector(".actors-boxs");
  let response = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${api_key}&page=${1}`
  );
  let data = await response.json();

  data.results.map((result) => {
    console.log(result);

    box_actor.innerHTML += `
    <div class="box">
            <img src="${base_img}${result.profile_path}" alt="" />
            <div class="info">
              <span class="name">Name : ${result.name}</span>
              <span class="popularity">Popularity : ${result.popularity}</span>
            </div>
          </div>`;
  });
}

actordetails();
