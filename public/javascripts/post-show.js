mapboxgl.accessToken = 'pk.eyJ1IjoicmVkYmFsbG9vbjI0IiwiYSI6ImNrYWNuc3JpMTBvNmIyc284Mm1lcm05NjMifQ.T4-9EOCckP0cNa8UDUNiEQ';
        
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: post.coordinates,
    zoom: 5
});

// create a HTML element for our post location/marker
const el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
.addTo(map);