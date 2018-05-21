// get grocery items from databse, and sorts them in shlpping list, pantry, expiring soon, or expired

function renderPage() {
  $.get("/api/getgroceries").then(function (data) {
    for (var i = 0; i < data.length; i++) {
      //put in shopping list
      if (!data[i].ownedItem) {
        $("#groceriesToGet").append(`<span id= "${data[i].id}"> ${data[i].foodProduct} <button class="addToPantry" data-id=${data[i].id}> Add To Pantry </button>
      <button class="deleteItem" data-id=${data[i].id}>Delete </button> </span> <br>`);
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

// get username and displays it
$.get("/api/user_data").then(function (data) {
  $(".member-name").text(data.email);
});

// this will update an item to be in the pantry and update DOM
$(document).on('click', '.addToPantry', function () {
  $("#updateModal").modal();
  $("#itemId").val($(this).data("id"));
  $(".hide2").css("display", "none");
})

//takes input from update modal, updated grocery item
// renders page once again with item in new category
$("#updateButton").on("click", function (event) {
  event.preventDefault();
  hideId = $("#itemId").val();
  $(".hideMe2").empty();
  $.ajax("/api/updategroceries2", {
    type: "PUT",
    data: {
      id: $("#itemId").val(),
      updatedExpiration: $("#updateExpiration").val(),
      updatedNotification: $("#updateNotification").val()
    }
  }).then(function () {
    $('#updateModal').modal('hide');
    renderPage();
  })
})

// deletes item and then renders page
$(document).on('click', '.deleteItem', function () {
  $.ajax("/api/delete_item", {
    type: "POST",
    data: { id: $(this).data("id") }
  }).then(
    function () {
      $(".hideMe2").empty();
      renderPage()
    })
});


//changes modal based on shopping list or pantry entry
$("#owned").change(function (event) {
  console.log($(this).val())
  if ($(this).val() === "true") {
    $(".hide").css("display", "inline-block");
  } else {
    $(".hide").css("display", "none");
  }

});




