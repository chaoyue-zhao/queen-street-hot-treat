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

    // CALL THE FUNCTION TO SEE IF CHECKBOX (OPEN OR NOT) IS CHECKED
    app.checkIfOpen();
    
    // CALL THE FUNCTION TO GET USER'S INPUT
    app.gatherUserInput();
  })
};

// FUNCTION TO CHECK IF CHECKBOX IS CHECKED 
app.checkIfOpen = function() {
  if($("#open_now").is(":checked")) {
    app.open = true;
  } else {
    app.open = false;
  }
} 

//CREATE METHOD TO GATHER USER INPUT
app.gatherUserInput = () => {
  //GATHER WHAT THE USER SELECT INSIDE THE FORM
  app.$radius = $("#radius").val();
  app.$price = $("#price").val();
  app.$limit = $("#limit").val();
  app.$sort = $("#sort_by").val();
  app.$categories = $("#categories").val();

  //CALL THE METHOD TO GET DATA FROM API AND PASS THE USER'S SELECTIONS AS PARAMETERS
  app.getDataFromApi(app.$radius, app.$limit, app.$price, app.$sort, app.$categories, app.open);
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
      console.log("Server fucked up", error);
    });
}

//CREATE METHOD TO RENDER DATA FROM API RESULTS TO DOM

app.renderDOM = function(restaurants) {
  restaurants.map(function (restaurant) {
    $(".results").append(
      `${restaurant.name}`
    )
  });
}