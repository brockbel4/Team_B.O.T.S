// get grocery items from databse, and sorts them in shlpping list or pantry
$.get("/api/getgroceries").then(function (data) {
  for (var i = 0; i < data.length; i++) {
    //put in shopping list
    if (!data[i].ownedItem) {
      $("#groceriesToGet").append(`${data[i].foodProduct} <button class="addToPantry" data-id=${data[i].id}> Add To Pantry </button>
      <button class="deleteItem" data-id=${data[i].id}>Delete </button> <br>`);
    }
    else {
      var today = moment().format();
      //put in expired list
      if (today >= data[i].expirationDate) {
        $("#groceriesExpired").append(`${data[i].foodProduct}<button class="deleteItem" data-id=${data[i].id}>Delete </button> <br>`);
      }
      // put in expiring soon list 
      else if (today >= data[i].expirationNotification) {
        $("#groceriesExpiringSoon").append(`${data[i].foodProduct} <button class="deleteItem" data-id=${data[i].id}>Delete </button><br>`);
      }
      // put in pantry list
      else {
        $("#groceriesOwned").append(`${data[i].foodProduct}<button class="deleteItem" data-id=${data[i].id}>Delete </button> <br>`);
      }
    }
  }
});


// This file just does a GET request to figure out which user is logged in
// and updates the HTML on the page
$.get("/api/user_data").then(function (data) {
  $(".member-name").text(data.email);
});

// this will update an item to be in the pantry and update DOM
$(document).on('click', '.addToPantry', function () {
  $.ajax("/api/updategroceries", {
    type: "PUT",
    data: { id: $(this).data("id") }
  }).then(
    function () {
      $.get("/api/getgroceries").then(function (data) {
        $("#groceriesToGet").empty();
        $("#groceriesOwned").empty();
        for (var i = 0; i < data.length; i++) {
          //put in shopping list
          if (!data[i].ownedItem) {
            $("#groceriesToGet").append(`${data[i].foodProduct} <button class="addToPantry" data-id=${data[i].id}> Add To Pantry </button>
            <button class="deleteItem" data-id=${data[i].id}>Delete </button> <br>`);
          }
          else {
            var today = moment().format();
            //put in expired list
            if (today >= data[i].expirationDate) {
              $("#groceriesExpired").append(`${data[i].foodProduct} <button class="deleteItem" data-id=${data[i].id}>Delete </button> <br>`);
            }
            // put in expiring soon list 
            else if (today >= data[i].expirationNotification) {
              $("#groceriesExpiringSoon").append(`${data[i].foodProduct} <button class="deleteItem" data-id=${data[i].id}>Delete </button><br>`);
            }
            // put in pantry list
            else {
              $("#groceriesOwned").append(`${data[i].foodProduct}<button class="deleteItem" data-id=${data[i].id}>Delete </button> <br>`);
            }
          }
        }
      });
    });
});

$(document).on('click', '.deleteItem', function () {
  $.ajax("/api/delete_item", {
    type: "POST",
    data: { id: $(this).data("id") }
  }).then(
    function(){
    location.reload();
    })
});





