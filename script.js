//DEFINE PROJECT APP OBJECT
const app = {};

app.apiKey = "dtc2mjHS_wI_L9lXunSWrdSxvdQDreedErclvbJMvbUDoh2BCH4cif1qnQLjCZUfaYEsZgGWxcIH1z5bjb6QWQiZkoP0puCB5zB9J12Txrnhx3hYg1VYuyHs1GttXHYx";
app.proxyUrl = "http://proxy.hackeryou.com/";
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

  $(".form").on("submit",function (){
    app.gatherUserInput();
  })
};

//CREATE METHOD TO GATHER USER INPUT
app.gatherUserInput = () => {
  app.$radius = $("#radius").val();
  app.$price = $("#price").val();
  app.$limit = $("#limit").val();
  // app.$open = $("#open_now")
  app.$sort = $("#sort_by").val();
  console.log(app.$sort);
  app.$categories = $("#categories").val();

  app.getDataFromApi(app.$radius, app.$limit, app.$price, app.$sort, app.$categories);

}

//CREATE METHOD TO GATHER DATA FROM FUSION API USING AJAX PULL WITH USER INPUT
app.getDataFromApi = (radius,limit,price,sort,category) => {
  $.ajax({
    url: app.proxyUrl,
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: app.apiUrl,
      params: {
        radius: radius,
        limit: limit,
        price: price,
        sort_by: sort,
        categories: category
      },
      proxyHeaders: {
        Authorization: `Bearer ${app.apiKey}`
      }
    }
  }).then((result) => {
     app.renderDOM(result.businesses);
  }).fail((error) => {
    
    console.log('Server fucked up', error);
  })
}

//CREATE METHOD TO RENDER DATA FROM API RESULTS TO DOM

app.renderDOM = function(restaurants) {
  restaurants.map(function (restaurant) {
    $(".results").append(
      `${restaurant.name}`
    )
  });
}