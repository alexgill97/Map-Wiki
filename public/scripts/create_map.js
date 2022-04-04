google.maps.event.addListener(map, 'click', function (event) {
  const description = $('.map-description-input').text();
  console.log('description', description);
  placeMarker(map, event.latLng);
});
