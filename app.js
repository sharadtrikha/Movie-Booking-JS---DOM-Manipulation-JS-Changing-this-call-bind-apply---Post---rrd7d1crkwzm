import {fetchMovieAvailability,fetchMovieList} from "./api.js";

// Selectors
const mainElement = document.querySelector("main");
const bookerElement = document.querySelector("#booker");
const bookerGridElement = document.querySelector("#booker-grid-holder");
const bookTicketBtn = document.querySelector("#book-ticket-btn");

bookTicketBtn.addEventListener("click", onBookTicketClickHandler);

// Store Selected Seats
let selectedSeats = [];

// Task : Convert HTML String to HTML DOM ELEMENT
const convertToHtmlDom = (htmlInStringFormat) => {
    const element = document.createElement("div");
    element.innerHTML = htmlInStringFormat;
    return element.firstElementChild;
}


// Create Loader
const loader = convertToHtmlDom(`<div class="loader">Loading .........</div>`);

const onSeatClick = (event) => {
    event.target.classList.toggle("selected-seat");

    // logic : if element is having class selected-seat, then, it needs to be push
    // onto selectedSeats Array and if it is not having, then, remove that seat from 
    // selectedSeats array

    if(event.target.classList.contains("selected-seat")) {
        selectedSeats.push(event.target.innerText);
    } else {
        selectedSeats = selectedSeats.filter(seat => seat !== event.target.innerText);
    }

    // Add or Remove Book Ticket button from UI
    if(selectedSeats.length > 0) {
        bookTicketBtn.classList.remove("v-none");
    } else {
        bookTicketBtn.classList.add("v-none");
    }

}


const renderTheatreLayout = (listOfUnavailableSeats = [],seatNoOffset=1) => {

    // make a grid of 4*3
    const grid = convertToHtmlDom(`<div class="booking-grid"></div>`);

    // insert Grid elements basically theatre seats
    let theatreSeats = "";

    for(let i = 0; i < 12; i++) {
        theatreSeats = theatreSeats + 
        `<div id="booking-grid-${i+seatNoOffset}" class="grid-cell ${listOfUnavailableSeats.includes(i+seatNoOffset) ? "unavailable-seat": "available-seat"}">${i+seatNoOffset}</div>`
    }

    grid.innerHTML = theatreSeats;
    bookerGridElement.appendChild(grid);

    document.querySelectorAll(".grid-cell").forEach(cell => cell.addEventListener("click", onSeatClick));

}

const renderSuccessMessage = (mobileNumber, email) => {
    const successMsg = convertToHtmlDom(`<div id="Success">
        <h4>Booking Details</h4>
        <div>Seats: ${selectedSeats.join(",")}</div>
        <div>Phone number: ${mobileNumber}</div>
        <div>Email: ${email}</div>
    </div>`);

    bookerElement.appendChild(successMsg);

}

const onPurchaseBtnClickHandler = (event) => {
    event.preventDefault();
    const mobileNumber = document.querySelector("#mobile").value;
    const email = document.querySelector("#email_movie").value;
    bookerElement.innerHTML = "";
    renderSuccessMessage(mobileNumber,email);
}

function renderConfirmPurchaseForm() {
    const form = convertToHtmlDom(`
    <div id="confirm-purchase">
        <h3>Confirm your booking for seat numbers:${selectedSeats.join(",")}</h3>
        <form id="customer-detail-form">
        <div>
            <label for="email_movie">Email: </label>
            <input type="email" id="email_movie" required />
            </div>
            <div>
            <label for="mobile">Phone Number : </label>
            <input type="tel" id="mobile" required />
            </div>
            <button id="movie_submit_btn" type="submit">Purchase</button>
        </form>
    </div>
    `);

    bookerElement.appendChild(form);

    document.querySelector("form").addEventListener("submit", onPurchaseBtnClickHandler);
}

function onBookTicketClickHandler () {
    bookerElement.innerHTML = "";
    renderConfirmPurchaseForm();
}

const renderMovieTheatre = (event) => {
    event.preventDefault();
    console.log(event.target.innerText);

    const movieName = event.target.innerText ? event.target.innerText : event.target.parentElement.innerText;

    bookerElement.appendChild(loader);
    fetchMovieAvailability(movieName).then((listOfUnavailableSeats) => {
        console.log(listOfUnavailableSeats);

        loader.remove();

        // make h3 element of booker div visible
        const bookerElementHeader = document.querySelector("#booker h3");
        bookerElementHeader.classList.toggle("v-none");
        
        // render Theatre layout view
        renderTheatreLayout(listOfUnavailableSeats);
        renderTheatreLayout(listOfUnavailableSeats, 13);




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