// Map Style "Vitamin C" by Adam Krogh
// https://snazzymaps.com/style/40/vitamin-c
export default [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#ffffff'}]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}, {lightness: -20}]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}, {lightness: -17}]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{color: '#bbbdc0'}, {visibility: 'on'}, {weight: 0.9}]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{visibility: 'on'}, {color: '#bbbdc0'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{visibility: 'simplified'}]
    },
    {elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}, {lightness: -10}]
    },
    {},
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{color: '#bbbdc0'}, {weight: 0.7}]
    }
  ] as google.maps.MapTypeStyle[];