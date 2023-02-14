/* eslint-disable no-undef */

window.addEventListener('load', () => {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  mapboxgl.accessToken = document.getElementById('token').dataset.token;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kookah/cle48cb5s001a01qg7pqql564', // light
    scrollZoom: false
    // style: 'mapbox://styles/kookah/cle485wf2001601qm8ubnpeqx', // dark
    // center: [-118.1134, 34.111],
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(location => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Popup({ offset: 40 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}, ${location.description}</p>`)
      .addTo(map);
    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(location.coordinates)
      .addTo(map);

    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 200,
      right: 200
    }
  });
});
