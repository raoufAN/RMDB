const api_key = "5030260b38044c265f2e8a196a9e7ce8";
const base_img = "https://image.tmdb.org/t/p/w500";
const API =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDMwMjYwYjM4MDQ0YzI2NWYyZThhMTk2YTllN2NlOCIsInN1YiI6IjY1YzA5N2YwOTA3ZjI2MDBlYTcyMjA2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIcSkWr38Ol7-gkDS2uEWZU5PjBW6RBV-_Ih0ZPBxJE";

let content_box = document.querySelector(".main .content-box");
const ul = document.querySelector(".changable .pagination ul");
let input_search = document.querySelector(".main .input-search"),
  input_box = document.querySelector(".input-box");
let titleH2 = document.querySelector(".main .title");

////// part of handel pagination with namber of page

// function to get the array of pagination
const getArrayPagination = (currentPage, totalPages) => {
  let pagination = [];
  pageNo = 0; // page number

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

const getArrayPaginationforPages = (currentPage, totalPages) => {
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

//handeling input search
input_search.addEventListener("input", () => {
  //console.log(input_search.value);
  if (input_search.value.length >= 3) {
    content_box.innerHTML = "";
    getSearchData(input_search.value);
    ul.style.display = "none";
  } else {
    getAllSeries(1);
    passeDataPagination(1);
    ul.style.display = "flex";
  }
});

async function getSearchData(value) {
  let respnse = await fetch(`https://api.tvmaze.com/search/shows?q=${value}`);
  let data = await respnse.json();
  //console.log(data);
  data.map((result) => {
    //console.log(result);
    // geting names for trailer Youtube
    LinkNameSerie = `https://www.youtube.com/results?search_query=${result.show.name.replace(
      / /g,
      "+"
    )}+trailer`;
    content_box.innerHTML += `
    <div class="box" >
          <div class="image-box">
            <img src="${result.show.image.original}" alt="" loading="lazy"/>
          </div>
          <ul class="content-box">
            <li class="title">${result.show.name}</li>
            <li class="rating">Rate : ${result.show.rating.average} <i class="fa-solid fa-star star"></i></li>
            <li class="trailer">
            <a href="${LinkNameSerie}"
               target="_blank"><i class="fas fa-film red"></i> Trailer</li></a>     
          </ul>
      </div>
  
  `;
  });
}

passeDataPagination(0);

async function getAllSeries(currentPage) {
  titleH2.style.display = "none";
  input_box.style.display = "flex";
  content_box.innerHTML = "";
  let response = await fetch(
    `
    https://api.tvmaze.com/shows?status=running&page=${currentPage}`
  );
  let data = await response.json();
  let series = data.slice(0, 50);
  //console.log(data);
  series.map((result) => {
    ///console.log(result.status);
    fillBoxs(result);
  });
}

getAllSeries(0);

// function to fill the box
async function fillBoxs(result) {
  // geting names for trailer Youtube
  // console.log(result.network.country.name);
  LinkNameSerie = `https://www.youtube.com/results?search_query=${result.name.replace(
    / /g,
    "+"
  )}+trailer`;
  // first decalre summary has the html tags
  let summary = result.summary;
  // deaclarate DOMParser  parser html string to Dom ,allows to create new dom object can be manuplated
  let parser = new DOMParser();
  let parseHTML = parser.parseFromString(summary, "text/html");
  let cleanSommary = parseHTML.body.textContent;
  //let cleanSommar1y = parseHTML.body.innerHTML;

  content_box.innerHTML += `
    <div class="box" >
          <div class="image-box" onclick="serieBlankShow('${result.name}',
          '${result.genres}','${result.premiered}',
          '${result.rating.average}','${result.network.country.name}',
          '${result.status}','${cleanSommary.replace(/['`"]/g, "")}',
            '${result.image.original}')">
            <img src="${result.image.original}" alt="" loading="lazy" />
          </div>
          <ul class="content-box">
            <li class="title">${result.name}</li>
            <li class="rating">Rate : ${
              result.rating.average
            } <i class="fa-solid fa-star star"></i></li>
            <li class="trailer">
            <a href="${LinkNameSerie}"
               target="_blank"><i class="fas fa-film red"></i> Trailer</li></a>     
          </ul>
      </div>
  
  `;
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPagination(currentPage) {
  const totalPages = 299;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPagination(${currentPage - 1}),getAllSeries(${
    currentPage - 1
  })">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPagination(${pageNumber}),getAllSeries(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPagination(${currentPage + 1}),getAllSeries(${
    currentPage + 1
  })"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

// second part
async function NowPlayingMovie(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `On The Air`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";

  let response = await fetch(
    `
    https://api.themoviedb.org/3/tv/on_the_air?api_key=${api_key}&page=${currentPage}`
  );
  let data = await response.json();

  //console.log(data);
  data.results.map((result) => {
    fillBoxTMDB(result);
  });
}

// function to pass data and fill the pagination
async function passeDataPaginationLatestNowPlaying(currentPage) {
  let response = await fetch(
    `
    https://api.themoviedb.org/3/tv/on_the_air?api_key=${api_key}`
  );
  let data = await response.json();
  const totalPages = data.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPaginationforPages(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationLatestNowPlaying(${
      currentPage - 1
    }),NowPlayingMovie(${currentPage - 1})">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationLatestNowPlaying(${pageNumber}),NowPlayingMovie(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatestNowPlaying(${
    currentPage + 1
  }),NowPlayingMovie(${currentPage + 1})"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

// mazal UpcomingMovie(10);

// forth part
async function TopRatedseries(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Top Rated series`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let response = await fetch(
    `
    https://api.themoviedb.org/3/tv/top_rated?api_key=${api_key}&page=${currentPage}`
  );
  let data = await response.json();

  //console.log(data);
  data.results.map((result) => {
    fillBoxTMDB(result);
  });
}

// function to pass data and fill the pagination
async function passeDataPaginationLatestTopRated(currentPage) {
  let response = await fetch(
    `
    https://api.themoviedb.org/3/tv/top_rated?api_key=${api_key}`
  );
  let data = await response.json();
  const totalPages = data.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPaginationforPages(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationLatestTopRated(${
      currentPage - 1
    }),TopRatedseries(${currentPage - 1})">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationLatestTopRated(${pageNumber}),TopRatedseries(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatestTopRated(${
    currentPage + 1
  }),TopRatedseries(${currentPage + 1})"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

// five part
async function MostPopularseries(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Most Popular Series`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let response = await fetch(
    `
    https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${currentPage}`
  );
  let data = await response.json();

  //console.log(data);
  data.results.map((result) => {
    fillBoxTMDB(result);
  });
}

// function to pass data and fill the pagination
async function passeDataPaginationLatestMostPopular(currentPage) {
  let response = await fetch(
    `
    https://api.themoviedb.org/3/tv/popular?api_key=${api_key}`
  );
  let data = await response.json();
  const totalPages = data.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPaginationforPages(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPaginationLatestMostPopular(${
      currentPage - 1
    }),MostPopularseries(${currentPage - 1})">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPaginationLatestMostPopular(${pageNumber}),MostPopularseries(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatestMostPopular(${
    currentPage + 1
  }),MostPopularseries(${currentPage + 1})"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

// function to fill the box
async function fillBoxTMDB(result) {
  //console.log(result);
  // geting names for trailer Youtube
  LinkNameSerie = `https://www.youtube.com/results?search_query=${result.name.replace(
    / /g,
    "+"
  )}+trailer`;

  content_box.innerHTML += `
  <div class="box" >
        <div class="image-box" >
          <img src="${base_img}${result.poster_path}"
           alt="" loading="lazy"/>
        </div>
        <ul class="content-box">
          <li class="title">${result.name}</li>
          <li class="rating">Rate : ${result.vote_average} <i class="fa-solid fa-star star"></i></li>
          <li class="trailer">
          <a href="${LinkNameSerie}"
             target="_blank"><i class="fas fa-film red"></i> Trailer</li></a>     
        </ul>
    </div>

`;
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
/*
  data.map((result) => {
    nameSerie = result.name.replace(/ /g, "+");

    //console.log(`https://www.youtube.com/results?search_query=${nameSerie}+trailer`);
  });*/

//https://api.tvmaze.com/search/shows?q=${name}

// api for all serie https://api.tvmaze.com/shows?page=5 page=300

//this for search https://api.tvmaze.com/search/people?q=query
//https://api.themoviedb.org/3/tv/on_the_air
//https://api.themoviedb.org/3/tv/top_rated

// to search in https://www.youtube.com/results?search_query=${result.name}+trailer`
/*
  for (const result of data.results) {
    //console.log(result);
    const current_date = new Date("2024-03-09");
    const date_show = new Date(result.first_air_date);

    if (current_date < date_show) {
      console.log(result.name);
    } 
  }*/
