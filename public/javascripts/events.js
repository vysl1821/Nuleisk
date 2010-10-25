var url_params

$(document).ready(function() {
  var zoom = get_zoom()
  if (zoom < 7)
    $('.menu').hide()
  var map_opts = {
    zoom: zoom,
    navigationControl: true,
    mapTypeControl: true,
    scaleControl: true,
    center: new google.maps.LatLng(55.169438, 23.881275),
    scrollwheel: true,
    noClear: true,
    disableDoubleClickZoom: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP //ROADMAP SATELLITE HYBRID TERRAIN
  }
  map = new google.maps.Map( $( '#map' ).get(0), map_opts)
  geocoder = new google.maps.Geocoder()
  elevator = new google.maps.ElevationService()

  $('#search').click(function(){
    gsearch( $('#search_input').val() )
  })

  $('#search_input').keyup(function(e){
    if (e.keyCode == 13) 
      gsearch( $('#search_input').val() )
  })

  $('input').focus()
  init_time()
  init_poly()//

  url_params = get_url_params()

})

