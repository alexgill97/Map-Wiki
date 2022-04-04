$("document").ready(function() {

$("#show_maps").on("click", () => {
  $.ajax({
    url: `/maps_list`,
    type:"POST",
    data: { map: 1}
  })
}).then(res => {

})


})
