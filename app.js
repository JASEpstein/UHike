// *************************************************
//Semantic UI Animation Scripts

$('.ui.dropdown')
    .dropdown();

$('.ui.rating')
    .rating();

$('.ui.accordion')
  .accordion();


// ****************************************
// Global variables
var userCity;
const geoLocated = false;
var userLatitude;
var userLongitude;
var trailLatitude;
var trailLongitude;
var trailsFunctionAlreadyRun = false;

function getTrails() {
    // getUserIPLocation();
    var hikingProjectAPIKey = "200549915-38be137df30d5780f9f0fb77ff254499";

    var maxDistance = "30" // Max distance in miles, default = 30, max = 200
    //Proxy URL to jump over CORS Header error
    const proxyURL = "https://peaceful-island-88132.herokuapp.com/"
    var queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + userLatitude + "&lon=" + userLongitude + "&maxDistance=" + maxDistance + "&key=" + hikingProjectAPIKey;
    $.ajax({
        url: proxyURL + queryURL,
        method: "GET"
    }).then(function (response) {
        var numberOfTrails = 6;
        for (i = 0; i < numberOfTrails; i++) {
            createNewCard(response);
        }
        
        $('.ui.rating')
            .rating();
    });
    trailsFunctionAlreadyRun = true;
}

function convertDifficultyLevelsToColors(response){
    const difficultyAsText = response.trails[i].difficulty;
    switch (difficultyAsText){
        case 'green':
            return 
    }
}

// Add Hike Elements
function createNewCard(response) {
    // let newCard = $("<div class='red raised card slide-item item"+[i]+"' data-lat='" + response.trails[i].latitude + "' data-long='" + response.trails[i].longitude + "'><div class='blurring dimmable image'><div class='ui dimmer'><div class='content'><div class='center'><div class='ui inverted button'>Get Directions</div></div></div></div><div class='backgroundimg image' style='background-image: url(" + response.trails[i].imgMedium + ")'></div></div><div class='content'><h3>" + response.trails[i].name + "</h3><div class='meta'><span class='description'>" + response.trails[i].summary + "</span></div></div><div class='extra content'>Rating: <div class='ui star rating' data-rating='" + Math.round(response.trails[i].stars) + "'></div></div></div>");

    const newTrailElement = $(`
        <div class="title" data-lat=${response.trails[i].latitude} data-long=${response.trails[i].longitude}>
            <i class="map marker alternate icon"></i>
            <span style="font-weight: 400">Trail #${i+1} - </span>${response.trails[i].name}
            </div>
        <div class="content">
            <div class="ui items">
                <div class="item">
                <div class="image">
                    <img class="hike-img" src="${response.trails[i].imgMedium}">
                </div>
                <div class="content">
                    <a class="header">${response.trails[i].name}</a>
                    <div class="meta">
                    <span>Description</span>
                    </div>
                    <div class="description">
                    <p>${response.trails[i].summary}</p>
                    </div>
                    <div class="extra">
                    Additional Details
                    </div>
                </div>
            </div>
        </div>
    </div>`)
    
    $(".hike-section").append(newTrailElement);
    
   

}

// **************************************************
// On click of "Find a Hike Near Me: Search" button
$("#find-hike-button").click(function () {
    $(".search-results").removeClass("hidden");
    $(".hike-section").show();
    $('#selection-box').hide();
    (trailsFunctionAlreadyRun ? null : getTrails());
});

// **************************************************
// On click of "Get Directions" button
$(document).on('click', '.button.trail-button', function() {
    trailLatitude = $(this).data('lat');
    trailLongitude = $(this).data('lng');
    var directionsURL = "https://www.google.com/maps/dir/"+userLatitude+","+userLongitude+"/"+trailLatitude+",+"+trailLongitude;
    window.open(directionsURL,"_blank");
});

// **************************************************
// On click of Back button
$(document).on('click', '.back-button', function() {
    $('.search-results').addClass('hidden');
    $('#selection-box').show();
});

// **************************************************
// Setup map on page load
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            //Clingman's Dome
            lat: 35.5628,
            lng: -83.4985
        },
        zoom: 14,
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
    });
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            userLatitude = pos.lat;
            userLongitude = pos.lng;
            map.setCenter(pos);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'You are here'
            });
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    //Geolocate Button Event Listener
    google.maps.event.addDomListener(document.getElementById('geolocate-button'), 'click', function(){
        map.panTo({lat: userLatitude, lng: userLongitude});
    })
}

// **************************************************
// Display error if location services fails
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        () => {'Error: Your browser doesn\'t support geolocation.', loadManualInput()});
    infoWindow.open(map);
}


