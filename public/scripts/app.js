$(document).ready(function () {
  let map = null;
  let markers = {};
  let currentMapId = null;
  let currentMapName = null;
  let deletedCoord = [];

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 45.95634662125372, lng: -66.63999655179681 },
    zoom: 2,
  });

  // converts to google lat/lang
  const getLatLng = function (lat, lng) {
    const newMap = new google.maps.LatLng(lat, lng);
    return newMap;
  };

  const initMap = () => {
    map.addListener('click', (event) => {
      createNewMarker(event.latLng);
      // deleteMarkers(markers);
    });
  };

  initMap();

  // Listens for map & Loads Map clicked on in the list
  $('.map-list-item').click(function (e) {
    e.preventDefault();

    let url = $(this).text();
    $('#current-map').text(url);
    currentMapName = url;
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 45.95634662125372, lng: -66.63999655179681 },
      zoom: 1,
    });

    getMarkersFromDb(url);
    initMap();
    // deleteMarkers();
  });

  $('#update-map').click(function (e) {
    e.preventDefault();
    const title = $('#update-title').val();
    const description = $('#update-description').val();
    $('#no-bullet-list-users-maps').append(`<a href=''>${title}</a>`);
    $.ajax({
      method: 'POST',
      url: '/map_update',
      data: { currentMapId, title, description },
    })
      .then(() => {})
      .catch((err) => {
        console.log('err', err);
      });
  });

  $('#add_favs').click(function (e) {
    e.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/add_fav',
      data: { currentMapId },
    })
      .then(() => {
        $('.no-bullet-list-fav').append(`<a href=''>${currentMapName}</a> `);
      })
      .catch((err) => {
        console.log('err', err);
      });
  });

  // ~~~~~~~~~~~~~~ Creates NEW marker ~~~~~~~~~~~~~~~~~~

  function createMarker(title, location) {
    let marker = new google.maps.Marker({
      position: location,
      animation: google.maps.Animation.DROP,
      title: title,
    });
    //Attaches delete listener (MUST STAY HERE)
    marker.addListener('dblclick', function () {
      console.log('MARKER LISTENER', markers, title, markers[title].title);
      markers[title].setMap(null);
      deleteMarkers(markers[title].title);
      deleteMarkerFromDb(markers[title].title);
    });
    markers[title] = marker;
    markers[title].setMap(map);
  }

  // Creates Marker if NOT already in map
  function createNewMarker(location) {
    const coordTitle = $('.coord-title-input').val();
    if (!markers[coordTitle]) {
      $('.coord-title-heading')
        .text('Whats the name of the place')
        .css('color', 'black')
        .css('font-size', '1em');
      createMarker(coordTitle, location);
      addMarkerToDb(coordTitle, location);
    } else {
      $('.coord-title-heading')
        .text('Please enter A valid name for your marker!')
        .css('color', 'white')
        .css('font-size', '2em');
    }
  }

  // POST Marker to database
  const addMarkerToDb = (coordTitle, location) => {
    $.ajax({
      method: 'POST',
      url: '/coords_post',
      data: {
        title: coordTitle,
        map_id: currentMapId,
        latitude: location.lat(),
        longitude: location.lng(),
      },
    }).catch((err) => {
      console.log('err', err);
    });
  };

  // DELETE Marker from database

  const deleteMarkerFromDb = function (coordId) {
    $.ajax({
      data: { coordId },
      method: 'DELETE',
      url: '/coords_post',
    })
      .then(() => {
        deletedCoord.push(coordId);
        // getMarkersFromDb(currentMapName);
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  };

  // GET Markers from database and render to map
  const getMarkersFromDb = function (url) {
    $.ajax({
      method: 'GET',
      url: url,
    }).then((data) => {
      markers = {};
      if (data.coords.length) {
        currentMapId = data.coords[0].map_id;
        console.log('MAP ID --->', currentMapId);
        data.coords.forEach((coord) => {
          const markerLatLng = getLatLng(coord.latitude, coord.longitude);
          createMarker(coord.title, markerLatLng);
        });
      } else {
        currentMapId = data.map_id;
      }
    });
    // .then(() => {
    //   initMap();
    //   deleteMarkers();
    // });
  };

  //Renders all markers in markers object
  const deleteMarkers = function () {
    console.log('COORD ARRAY', deletedCoord);
    console.log('MARKERS', markers);

    for (const marker in markers) {
      if (!deletedCoord.includes(markers[marker].title)) {
        const index = deletedCoord.indexOf(markers[marker].title);
        deletedCoord.splice(index, 1);
        // markers[marker].setMap(map);
      }
    }
  };
});
