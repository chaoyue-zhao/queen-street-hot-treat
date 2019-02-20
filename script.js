//DEFINE PROJECT MYAPP OBJECT
const app = {};

app.apiKey = "dtc2mjHS_wI_L9lXunSWrdSxvdQDreedErclvbJMvbUDoh2BCH4cif1qnQLjCZUfaYEsZgGWxcIH1z5bjb6QWQiZkoP0puCB5zB9J12Txrnhx3hYg1VYuyHs1GttXHYx";
app.proxyUrl = "http://proxy.hackeryou.com/";
app.apiUrl = "https://api.yelp.com/v3/businesses/search?location=483queenstw";

//DEFINE DOCUMENT READY// ADD INIT FUNCTION
$(document).ready(() => {
  app.init();
});

//DEFINE INIT
app.init = () => {
  app.getDataFromApi();
};

//ADD EVENT LISTENER - ON FORM SUBMIT - RUN RENDER FUNCTION


//CREATE METHOD TO GATHER USER INPUT

//CREATE METHOD TO GATHER DATA FROM FUSION API USING AJAX PULL WITH USER INPUT
app.getDataFromApi = () => {
  $.ajax({
    url: app.proxyUrl,
    method: "GET",
    dataType: "json",
    data: {
      reqUrl: app.apiUrl,
      params: {
        radius: 100,
        limit: 5
      },
      proxyHeaders: {
        Authorization: `bearer ${app.apiKey}`,
      }
    }
  }).then((result) => {
    console.log(result);
  }).fail(() => {
    console.log('Server fcked up');
  })
}

//CREATE METHOD TO RENDER DATA FROM API RESULTS TO DOM