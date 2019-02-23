//DEFINE PROJECT APP OBJECT
const app = {};

app.apiKey = "dtc2mjHS_wI_L9lXunSWrdSxvdQDreedErclvbJMvbUDoh2BCH4cif1qnQLjCZUfaYEsZgGWxcIH1z5bjb6QWQiZkoP0puCB5zB9J12Txrnhx3hYg1VYuyHs1GttXHYx";
app.proxyUrl = "https://cors-anywhere.herokuapp.com/";
app.apiUrl = "https://api.yelp.com/v3/businesses/search?location=483queenstw";

//CACHE DA SELECTORS
app.$form = $(".form");

//DEFINE DOCUMENT READY// ADD INIT FUNCTION
$(document).ready(() => {
  app.init();
  $('.pretty-alt').prettyDropdown({
    customClass: "arrow triangle small",
    classic: true,
    width: "100%",
    height: 50
  });
});

//DEFINE INIT
app.init = () => {
  app.handleFormSubmit();
};

//ADD EVENT LISTENER - ON FORM SUBMIT - RUN RENDER FUNCTION
app.handleFormSubmit = () => {
  
  $(".form").on("submit",function (e){
    // THE MOST IMPORTANT LINE OF CODE FOR THIS APP - ALWAYS PREVENT DEFAULT FORM BEHAVIOUR
    e.preventDefault();
    
    // CALL THE FUNCTION TO GET USER'S INPUT
    app.gatherUserInput();

    // CALL THE FUNCTION TO SCROLL TO RESULTS SECTION
    app.scrollTo("#main");
  })
};

//CREATE METHOD TO GATHER USER INPUT
app.gatherUserInput = () => {
  //GATHER WHAT THE USER SELECT INSIDE THE FORM
  app.$radius = $("#radius").val();
  app.$price = $("#price").val();
  app.$limit = $("#limit").val();
  app.$sort = $("#sort_by").val();
  app.$categories = $("#categories").val();
  app.$open = $("#open_now").val();

  //CALL THE METHOD TO GET DATA FROM API AND PASS THE USER'S SELECTIONS AS PARAMETERS
  app.getDataFromApi(app.$radius, app.$limit, app.$price, app.$sort, app.$categories, app.$open);
}

//CREATE METHOD TO GATHER DATA FROM FUSION API USING AJAX PULL WITH USER INPUTS
app.getDataFromApi = (radius, limit, price, sort, category, open) => {
  $.ajax({
    // PASSING IN THE PROXY SERVER URL
    url: app.proxyUrl + app.apiUrl,
    method: "GET",
    headers: {
      Authorization: `Bearer ${app.apiKey}`
    },
    data: {
      radius: radius,
      limit: limit,
      price: price,
      sort_by: sort,
      categories: category,
      open_now: open
    }
  })
    .then(result => {
      //EMPTY THE STATE SO WE GET A CLEAN START EVERY TIME
      $(".results").empty(); 
      app.renderDOM(result.businesses);
    })
    .fail(error => { 
      console.log("AH oh", error);
    });
}

//CREATE METHOD TO RENDER DATA FROM API RESULTS TO DOM

app.renderDOM = function(restaurants) {

  restaurants.forEach(function (restaurant) {
    const name = restaurant.name.toLowerCase();
    const image = restaurant.image_url;
    const url = restaurant.url;
    const review = restaurant.review_count; 
    const rating = restaurant.rating;

    let price;
    if (restaurant.price === "$") {
      price = "Under $10";
    } else if (restaurant.price === "$$") {
      price = "$11-$30";
    } else if (restaurant.price === "$$$") {
      price = "$31-$60";
    } else if (restaurant.price === "$$$$") {
      price = "above $61";
    }
    
    const location = restaurant. location. address1; 
    const phone = restaurant.display_phone; 
    const distance = Math.floor(restaurant.distance);

    $(".results").append(
      `<div class="results__restaurant restaurant">
        <div class="restaurant__image-container">
          <img class="restaurant__image" src="${image}" alt="photo of food from ${name}"/>
        </div>
        <div class="restaurant__text-container">
          <h2 class="restaurant__title title">${name}</h2>
          <img class="restaurant__rating-image" src="assets/yelp_stars/${rating}.png" alt="yelp rating of ${rating}"> 
          <p class="paragraph restaurant__rating">Based on ${review} reviews</p>
          <p class="paragraph restaurant__price">
            <i class="fas fa-dollar-sign restaurant__icon" aria-label="price:"></i>
            ${price}
          </p>
          <p class="paragraph restaurant__address">
            <i class="fas fa-map-marker-alt restaurant__icon" aria-label="address:"></i>
            ${location}
          </p>
          <p class="paragraph restaurant__phone">
            <i class="fas fa-phone restaurant__icon" aria-label="phone number:"></i>
            ${phone}
          </p>
          <p class="paragraph restaurant__distance">
            <img src="assets/distance.png" class="restaurant__icon--distance" alt="distance icon by Becris from the Noun Project" aria-label="icon"/>
            ${distance} metres
          </p>
          <a href="${url}" class="restaurant__link" target="_blank"> 
            <img class="restaurant__yelp" src="assets/yelp_logo.png" alt="read more on yelp"/>
          </a>
        </div>
      </div>`
    );
  });
}

// SCROLL TO RESULTS ON BUTTON CLICK - http://html-tuts.com/scroll-to-section-jquery/
app.scrollTo = (id) => {
  if ($(id).length) {
    var getOffset = $(id).offset().top;
    var targetDistance = 0;
    $('html,body').delay(1000).animate({
      scrollTop: getOffset - targetDistance
    }, 500);
  }
}