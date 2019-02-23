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
    customClass: 'arrow triangle small',
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
      console.log("Ah oh", error);
    });
}

//CREATE METHOD TO DISPLAY THE PRICE BASED ON PRICE RANGE FROM API 
app.displayPrice = function (price, id) {
  const $firstDollar = $(`#${id} .dollar1`);
  const $secondDollar = $(`#${id} .dollar2`);
  const $thirdDollar = $(`#${id} .dollar3`);
  const $forthDollar = $(`#${id} .dollar4`);
 
  if (price === "$") {
    $firstDollar.addClass("restaurant__dollar--selected");
  } else if (price === "$$") {
    $firstDollar.addClass("restaurant__dollar--selected");
    $secondDollar.addClass("restaurant__dollar--selected");
  } else if (price === "$$$") {
    $firstDollar.addClass("restaurant__dollar--selected");
    $secondDollar.addClass("restaurant__dollar--selected");
    $thirdDollar.addClass("restaurant__dollar--selected");
  } else if (price === "$$$$") {
    $firstDollar.addClass("restaurant__dollar--selected");
    $secondDollar.addClass("restaurant__dollar--selected");
    $thirdDollar.addClass("restaurant__dollar--selected");
    $forthDollar.addClass("restaurant__dollar--selected");
  } 
}

//CREATE A FUNCTION TO CALCULATE THE DISTANCE RANGE
app.displayDistance = function (distance, id) {
  const distancePercentage = ((distance / 750) * 100).toFixed(2) + "%";
  console.log(distancePercentage);
  console.log(id);
  console.log($(`#${id} .restaurant__distance`));
 
  $(`[data-id="${id}"]`).css(
    "background",
    `linear-gradient(to right, #A8763E ${distancePercentage}, transparent ${distancePercentage}), #ECF0F1`
  );
}

//CREATE METHOD TO RENDER DATA FROM API RESULTS TO DOM
app.renderDOM = function(restaurants) {
  
  restaurants.forEach(function (restaurant) {
    const name = restaurant.name.toLowerCase();
    const image = restaurant.image_url;
    const url = restaurant.url;
    const review = restaurant.review_count; 
    const rating = restaurant.rating;
    const price = restaurant.price;
    const distance = Math.floor(restaurant.distance);
    const location = restaurant.location.address1; 
  

    $(".results").append(
      `<div class="results__restaurant restaurant">
        <div class="restaurant__image-container">
          <img class="restaurant__image" src="${image}" alt="photo of food from ${name}"/>
        </div>
        <div class="restaurant__text-container clearfix" id="${
          restaurant.id
        }>
          <h2 class="restaurant__title title">${name}</h2>
          <p class="paragraph restaurant__address">
            ${location}
          </p>
          <img class="restaurant__rating-image" src="assets/yelp_stars/${rating}.png" alt="yelp rating of ${rating}"> 
          <p class="paragraph restaurant__rating">${review} Yelp reviews</p>
          <p class="paragraph restaurant__price" id="${restaurant.id}">
            <span class="restaurant__dollar dollar1">$</span>
            <span class="restaurant__dollar dollar2">$</span>
            <span class="restaurant__dollar dollar3">$</span>
            <span class="restaurant__dollar dollar4">$</span>
          </p>
          <p class="restaurant__distance" data-id="${restaurant.id}">&nbsp;</p>
          <p class="paragraph restaurant__distance-text">
            ${distance} metres
          </p>
          <a href="${url}" class="restaurant__link" target="_blank"> 
            <img class="restaurant__yelp" src="assets/yelp_logo.png" alt="read more on yelp"/>
          </a>
        </div>
      </div>`
    );

    app.displayPrice(price, restaurant.id);
    app.displayDistance(distance, restaurant.id);
  
  });
}