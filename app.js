import {fetchMovieAvailability,fetchMovieList} from "./api.js";

// Selectors
const mainElement = document.querySelector("main");

// Task : Convert HTML String to HTML DOM ELEMENT
const convertToHtmlDom = (htmlInStringFormat) => {
    const element = document.createElement("div");
    element.innerHTML = htmlInStringFormat;
    return element.firstElementChild;
}


// Create Loader
const loader = convertToHtmlDom(`<div class="loader">Loading .........</div>`);

const renderMovieTheatre = (event) => {
    event.preventDefault();
    console.log(event.target.innerText);

    const movieName = event.target.innerText ? event.target.innerText : event.target.parentElement.innerText;

    fetchMovieAvailability(movieName).then((result) => {
        console.log(result);

        // make h3 element of booker div visible
        const bookerElementHeader = document.querySelector("#booker h3");
        bookerElementHeader.classList.toggle("v-none");

    })
}


const renderMoviesList = async () => {

    mainElement.appendChild(loader); // adding loader before making api call
    const moviesList = await fetchMovieList();
  
    const movieHolderElement = convertToHtmlDom(`<div class="movie-holder"></div>`)

    moviesList.forEach(movie => {
        const movieElement = convertToHtmlDom(`<a class="movie-link" href="/${movie.name}">
        <div class="movie" data-id=${movie.name}>
        <div class="movie-img-wrapper" style="background-image: url(${movie.imgUrl});">
        </div>
        <h4>${movie.name}</h4>
        </div>
        </a>`);

        movieElement.addEventListener("click", renderMovieTheatre);

        movieHolderElement.appendChild(movieElement);

    });

    loader.remove();
    mainElement.appendChild(movieHolderElement);
}


renderMoviesList();