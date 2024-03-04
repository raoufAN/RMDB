const api_key = "5030260b38044c265f2e8a196a9e7ce8";
const base_img = "https://image.tmdb.org/t/p/w500";
const API =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDMwMjYwYjM4MDQ0YzI2NWYyZThhMTk2YTllN2NlOCIsInN1YiI6IjY1YzA5N2YwOTA3ZjI2MDBlYTcyMjA2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIcSkWr38Ol7-gkDS2uEWZU5PjBW6RBV-_Ih0ZPBxJE";

const options = {
  method: "GET",
  headers: { accept: "application/json", Authorization: `Bearer ${API}` },
};

let content_box = document.querySelector(".main .content-box");
const ul = document.querySelector(".changable .pagination ul"),
  input_box = document.querySelector(".input-box");

let input_search = document.querySelector(".main .input-search");
let titleH2 = document.querySelector(".main .title");

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

//handeling input search
input_search.addEventListener("input", () => {
  //console.log(input_search.value);
  if (input_search.value.length >= 3) {
    content_box.innerHTML = "";
    getSearchData(input_search.value);
    ul.style.display = "none";
  } else {
    getAllMovie(1);
    passeDataPagination(1);
    ul.style.display = "flex";
  }
});

async function getSearchData(value) {
  //console.log(value);
  let respnse = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${value}`
  );
  let data = await respnse.json();
  // console.log(result.data);
  for (const result of data.results) {
    console.log(result);

    let movieID = result.id;
    //console.log(movieID);

    // we use try because need await for async funtion
    try {
      const key = await getVideo(movieID);
      // console.log(key);
      content_box.innerHTML += `
                <div class="box" onclick="openwindowblank('${result.title}',
                '${result.release_date}','${result.popularity}',
                '${result.overview.replace(/[\t\n'`"]/g, "")}}',
                '${base_img}${result.poster_path}')">
                    <div class="image-box">
                      <img src="${base_img}${result.poster_path}" alt="" />
                    </div>
                    <ul class="content-box">
                      <li class="title">${result.title}</li>
                      <li class="rating">Rate : ${result.vote_average} 
                      <i class="fa-solid fa-star star"></i></li>
                      <li class="trailer">
                    <a href="https://www.youtube.com/watch?v=${key}" target="_blank">
                    <i class="fas fa-film red"></i> Trailer </a> 
                  </li> 
                  </ul>
                </div>
            `;
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }
}

// calling the function with current page Number=1
passeDataPagination(1);

async function getAllMovie(currentPage) {
  titleH2.style.display = "none";
  input_box.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `
    https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&page=${currentPage}`
  );
  let data = await respnse.json();
  // console.log(data);

  for (const result of data.results) {
    //console.log(result);

    let movieID = result.id;
    //console.log(movieID);

    // we use try because need await for async funtion
    try {
      const key = await getVideo(movieID);
      // console.log(key);
      fillTheBox(result, key);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }
}

getAllMovie(1);

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPagination(currentPage) {
  let respnse = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
    onclick="passeDataPagination(${currentPage - 1}),getAllMovie(${
    currentPage - 1
  })">
    <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
    ${currentPage === pageNumber ? "active" : ""}"
    onclick="passeDataPagination(${pageNumber}),getAllMovie(${pageNumber})"
    >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPagination(${currentPage + 1}),getAllMovie(${
    currentPage + 1
  })"
  ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

///this second part
/// Now Playing Movie
async function NowPlayingMovie(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Now Playing Movie`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `
    https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=${currentPage}`
  );
  let data = await respnse.json();
  // console.log(data);

  for (const result of data.results) {
    // console.log(result);

    let movieID = result.id;
    //console.log(movieID);

    // we use try because need await for async funtion
    try {
      const key = await getVideo(movieID);
      // console.log(key);
      fillTheBox(result, key);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationLatestNowPlaying(currentPage) {
  let respnse = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=${currentPage}`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
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

///this third part
/// Upcoming Movie
async function UpcomingMovie(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Upcoming Movie`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `
    https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=${currentPage}`
  );
  let data = await respnse.json();
  // console.log(data);

  for (const result of data.results) {
    //console.log(result);

    let movieID = result.id;
    //console.log(movieID);

    // we use try because need await for async funtion
    try {
      const key = await getVideo(movieID);
      // console.log(key);
      fillTheBox(result, key);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationLatestUpcomingMovie(currentPage) {
  let respnse = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=${currentPage}`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
        onclick="passeDataPaginationLatestUpcomingMovie(${
          currentPage - 1
        }),UpcomingMovie(${currentPage - 1})">
        <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
        ${currentPage === pageNumber ? "active" : ""}"
        onclick="passeDataPaginationLatestUpcomingMovie(${pageNumber}),UpcomingMovie(${pageNumber})"
        >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatestUpcomingMovie(${
    currentPage + 1
  }),UpcomingMovie(${currentPage + 1})"
      ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

///this fourth part
/// Top Rated movie
async function TopRatedmovie(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Top Rated Movie`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `
      https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&page=${currentPage}`
  );
  let data = await respnse.json();
  // console.log(data);

  for (const result of data.results) {
    // console.log(result);

    let movieID = result.id;
    //console.log(movieID);

    // we use try because need await for async funtion
    try {
      const key = await getVideo(movieID);
      // console.log(key);
      fillTheBox(result, key);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationLatestTopRated(currentPage) {
  let respnse = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&page=${currentPage}`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
          onclick="passeDataPaginationLatestTopRated(${
            currentPage - 1
          }),TopRatedmovie(${currentPage - 1})">
          <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
          ${currentPage === pageNumber ? "active" : ""}"
          onclick="passeDataPaginationLatestTopRated(${pageNumber}),TopRatedmovie(${pageNumber})"
          >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatestTopRated(${
    currentPage + 1
  }),TopRatedmovie(${currentPage + 1})"
        ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

///this five part
/// Most Popular Movie
async function MostPopularMovie(currentPage) {
  titleH2.style.display = "block";
  titleH2.innerHTML = `Most Popular Movie`;
  input_box.style.display = "none";
  ul.style.display = "flex";
  content_box.innerHTML = "";
  let respnse = await fetch(
    `
    https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${currentPage}`
  );
  let data = await respnse.json();
  // console.log(data);

  for (const result of data.results) {
    // console.log(result);

    let movieID = result.id;
    //console.log(movieID);

    // we use try because need await for async funtion
    try {
      const key = await getVideo(movieID);
      // console.log(key);
      fillTheBox(result, key);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  }
}

// getArrayPagination(1, 1057);
// function to pass data and fill the pagination
async function passeDataPaginationLatestMostPopular(currentPage) {
  let respnse = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${currentPage}`
  );
  let result = await respnse.json();
  // get total of page from api pagintion
  const totalPages = result.total_pages;
  // calling getArrayPagination to get array of pagination
  let pageNumbers = getArrayPagination(currentPage, totalPages);
  //console.log(pageNumbers);

  ul.innerHTML = "";
  let li = "";
  li += `<li class="page   ${currentPage <= 1 ? "hidden" : ""}" 
            onclick="passeDataPaginationLatestMostPopular(${
              currentPage - 1
            }),MostPopularMovie(${currentPage - 1})">
            <span class="icon">&lt;</span></li>`;
  // loping for getting  value of pagination
  for (let pageNumber of pageNumbers) {
    li += `<li class="page
            ${currentPage === pageNumber ? "active" : ""}"
            onclick="passeDataPaginationLatestMostPopular(${pageNumber}),MostPopularMovie(${pageNumber})"
            >${pageNumber}</li>`;
  }
  li += `<li class="page   ${
    currentPage === totalPages ? "hidden" : ""
  }" onclick="passeDataPaginationLatestMostPopular(${
    currentPage + 1
  }),MostPopularMovie(${currentPage + 1})"
          ><span class="icon">&gt;</span></li>`;

  ul.innerHTML = li;
}

// function to fill the box
async function fillTheBox(result, key) {
  content_box.innerHTML += `
  <div class="box" >
      <div class="image-box" onclick="openwindowblank('${result.title}','${
    result.release_date
  }','${result.popularity}',
      '${result.overview.replace(/[\t\n'`"]/g, "")}}',
      '${base_img}${result.poster_path}')">
        <img src="${base_img}${result.poster_path}" alt="" />
      </div>
      <ul class="content-box">
        <li class="title">${result.title}</li>
        <li class="rating">Rate : ${result.vote_average} 
        <i class="fa-solid fa-star star"></i></li>
        <li class="trailer">
      <a href="https://www.youtube.com/watch?v=${key}" target="_blank">
      <i class="fas fa-film red"></i> Trailer </a> 
    </li> 
    </ul>
  </div>
`;
}

// this function for geting video key
//https://www.youtube.com/watch?v=key
async function getVideo(movie_id) {
  let keyId;
  let respnse = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${api_key}`
  );
  let data = await respnse.json();
  //console.log(data.results);
  data.results.map((respnse) => {
    if (respnse.type === "Trailer") {
      keyId = data.results[0].key;
    }
    // console.log(keyId);
  });

  return keyId;
}

// this function for blank open
function openwindowblank(title, release_date, popularity, overview, poster) {
  // console.log(title, release_date, popularity, overview, poster);
  window.open(
    `movieBlank.html?title=${title}&release_date=${release_date}&popularity=${popularity}&overview=${overview}&poster=${poster}`,
    "_blank"
  );
}
