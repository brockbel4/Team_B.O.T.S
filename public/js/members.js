// get grocery items from databse, and sorts them in shlpping list, pantry, expiring soon, or expired

function renderPage() {
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
}

renderPage();


// This file just does a GET request to figure out which user is logged in
// and updates the HTML on the page
$.get("/api/user_data").then(function (data) {
  $(".member-name").text(data.email);
});

// this will update an item to be in the pantry and update DOM
$(document).on('click', '.addToPantry', function () {
  $("#updateModal").modal();
  $("#itemId").val($(this).data("id"));
  $(".hide2").css("display", "none");
})

$("#updateButton").on("click", function (event) {
  // event.preventDefault();
  // console.log( $("#updateExpiration").val(), $("#updateNotification").val() );
  $.ajax("/api/updategroceries2", {
    type: "PUT",
    data: {
      id: $("#itemId").val(),
      updatedExpiration: $("#updateExpiration").val(),
      updatedNotification: $("#updateNotification").val()
    }
  }).then(function () {

  })
})


$(document).on('click', '.deleteItem', function () {
  $.ajax("/api/delete_item", {
    type: "POST",
    data: { id: $(this).data("id") }
  }).then(
    function () {
      location.reload();
    })
});



$("#owned").change(function (event) {
  console.log($(this).val())
  if ($(this).val() === "true") {
    $(".hide").css("display", "inline-block");
  } else {
    $(".hide").css("display", "none");
  }

});




