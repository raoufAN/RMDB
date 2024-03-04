let content_box = document.querySelector(".main .content-box");
const ul = document.querySelector(".changable .pagination ul");
let input_search = document.querySelector(".main .input-search"),
  input_box = document.querySelector(".input-box");
let titleH2 = document.querySelector(".main .title");

//handeling input search
input_search.addEventListener("input", () => {
  //console.log(input_search.value);
  if (input_search.value.length >= 3) {
    content_box.innerHTML = "";
    getSearchData(input_search.value);
    ul.style.display = "none";
  } else {
    getAllAnime(1);
    passeDataPagination(1);
    ul.style.display = "flex";
  }
});

async function getSearchData(value) {
  let respnse = await fetch(`https://api.jikan.moe/v4/anime?q=${value}`);
  let result = await respnse.json();
  // console.log(result.data);
  result.data.map((result) => {
    fillTheBox(result);
  });
}

// calling the function with current page Number=1
passeDataPagination(1);

async function getAllAnime(currentPage) {
  titleH2.style.display = "none";
  input_box.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `https://api.jikan.moe/v4/anime?page=${currentPage}`
  );
  let result = await respnse.json();
  //console.log(result);
  result.data.map((result) => {
    //console.log(result);

    fillTheBox(result);
  });
}

getAllAnime(1);

////// part of handel pagination with namber of page

// function to get the array of pagination
const getArrayPagination = (currentPage, totalPages) => {
  let pagination = [];
  pageNo = 1; // page number

  while (pageNo <= totalPages) {
    let isFisrtPage = pageNo <= 1,
      islasttPage = pageNo === totalPages,
      isMidllePage = pageNo >= currentPage - 1 && pageNo <= currentPage + 1;
    // currentPage + 1 = 6 >= pageNo >= currentPage - 1 = 4
    //console.log(pageNo);

    if (isFisrtPage || islasttPage || isMidllePage) {
      pagination.push(pageNo);
      pageNo++;
    } else {
      //console.log(isFisrtPage, isMidllePage, islasttPage);
      pagination.push("...");
      pageNo = pageNo < currentPage ? currentPage - 1 : totalPages;
    }
  }
  //console.log(pagination);
  return pagination;
};

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPagination(currentPage) {
  let respnse = await fetch(`https://api.jikan.moe/v4/anime`);
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.pagination.last_visible_page;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPagination(${currentPage - 1}),getAllAnime(${
    currentPage - 1
  })">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPagination(${pageNumber}),getAllAnime(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPagination(${currentPage + 1}),getAllAnime(${
    currentPage + 1
  })"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

/////// seconde title
// this part is for Latest Updated Episode
async function LatestUpdatedEpisode(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Latest Updated Episode`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?filter=airing&sort=updated_at&page=${currentPage}`
  );
  let result = await respnse.json();
  //console.log(result);
  result.data.map((result) => {
    //console.log(result);
    fillTheBox(result);
  });
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationLatest(currentPage) {
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?filter=airing&sort=updated_at`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.pagination.last_visible_page;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationLatest(${
      currentPage - 1
    }),LatestUpdatedEpisode(${currentPage - 1})">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationLatest(${pageNumber}),LatestUpdatedEpisode(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatest(${
    currentPage + 1
  }),LatestUpdatedEpisode(${currentPage + 1})"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

/////// thired title
// this part is for Top Upcoming Anime
async function TopUpcomingAnime(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Top Upcoming Anime`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?filter=upcoming&page=${currentPage}`
  );
  let result = await respnse.json();
  //console.log(result);
  result.data.map((result) => {
    //console.log(result.synopsis);
    fillTheBox(result);
  });
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationTopUpcoming(currentPage) {
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?filter=upcoming`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.pagination.last_visible_page;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationTopUpcoming(${
      currentPage - 1
    }),TopUpcomingAnime(${currentPage - 1})">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationTopUpcoming(${pageNumber}),TopUpcomingAnime(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationTopUpcoming(${
    currentPage + 1
  }),TopUpcomingAnime(${currentPage + 1})"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

/////// fourth title
// this part is for Top Airing Anime
async function TopAiringAnime(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Top Airing Anime`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?sort=top_airing&page=${currentPage}`
  );
  let result = await respnse.json();
  //console.log(result);
  result.data.map((result) => {
    //console.log(result.synopsis);

    fillTheBox(result);
  });
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationTopAiring(currentPage) {
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?sort=top_airing`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.pagination.last_visible_page;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationTopAiring(${currentPage - 1}),TopAiringAnime(${
    currentPage - 1
  })">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationTopAiring(${pageNumber}),TopAiringAnime(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationTopAiring(${currentPage + 1}),TopAiringAnime(${
    currentPage + 1
  })"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

/////// five title
// this part is for Top Airing Anime
async function populaireAnime(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Most Populaire Anime`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${currentPage}`
  );
  let result = await respnse.json();
  //console.log(result);
  result.data.map((result) => {
    //console.log(result.synopsis);
    fillTheBox(result);
  });
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationPoulaire(currentPage) {
  let respnse = await fetch(
    `https://api.jikan.moe/v4/top/anime?filter=bypopularity`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.pagination.last_visible_page;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationPoulaire(${currentPage - 1}),
    populaireAnime(${currentPage - 1})">
    <span class="icon">&lt;</span>
    </li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationPoulaire(${pageNumber}),populaireAnime(${pageNumber})">
    ${pageNumber}
    </li>`;
  }

  li += `<li class="page  ${currentPage === totalPages ? "hidden" : ""}" 
  onclick="passeDataPaginationPoulaire(${currentPage + 1}),
  populaireAnime(${currentPage + 1})">
  <span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

// calling function for blank open all the box to another page to get deatails for avery anime
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
  console.log("hi");
  window.open(
    `animeBlank.html?title=${title}&source=${source}&season=${season}&genres=${genres}&rating=${rating}&status=${status}&poster=${poster}&year=${year}&episode=${episodes}&story=${story}`,
    "_blank"
  );
}

async function fillTheBox(result) {
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

  content_box.innerHTML += `
        <div class="box" onclick="animeblank('${result.title}',
        '${result.source}','${result.season}','${arraygenres}',
        '${result.score}','${result.status}',
        '${result.images.jpg.image_url}','${result.year}',
        '${result.episodes}','${cleanSommary.replace(/[\t\n'`"]/g, "")}')">
            <div class="image-box">
              <img src="${result.images.jpg.image_url}" alt="" />
            </div>
            <ul class="content-box">
              <li class="title">${result.title
                .split(" ")
                .slice(0, 6)
                .join(" ")}</li>
              <li class="rating">Rate : ${
                result.score
              } <i class="fa-solid fa-star star"></i></li>
              <li class="trailer">
              <a href="${result.trailer.url}" target="_blank">
                <i class="fas fa-film red"></i> Trailer </a> </li>    
            </ul>
        </div>
    `;
}

// top upcoming `https://api.jikan.moe/v4/top/anime?filter=upcoming`;

//most populair https://api.jikan.moe/v4/top/anime?filter=bypopularity
//`https://api.jikan.moe/v4/top/anime?sort=popularity`

// top airing `https://api.jikan.moe/v4/top/anime?sort=top_airing`

// bah chft populairty page 2 `https://api.jikan.moe/v4/top/anime?filter=airing&sort=populaity&page=2`

// latest upadet  https://api.jikan.moe/v4/top/anime?filter=airing&sort=updated_at

// https://api.jikan.moe/v4/top/anime?q={query}

let selector = document.querySelectorAll(".sidebar .select");
let main = document.querySelector(".main");
