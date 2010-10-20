var map
var geocoder
var elevator
var elms = {
  m: [],//markers
  iw: [], //info_windows
  p: [] //polylines
}
var tt

function gsearch( query ) {
  delete_overlays()
  geocoder.geocode( { 'address': query}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location)
      $(results).each(function(ind, result){
        marker = new google.maps.Marker({
            map: map, 
            title: query,
            position: result.geometry.location
        })
        elms.m.push( marker )
        var content = result.formatted_address +'<br> Lat&amp;Lng: ' + result.geometry.location.toString() + '<br>' + 'Elevation: <span class="elevation"></span>'
        var info_window = add_info_window(marker, content)
        elms.iw.push( info_window )
        set_elevation( info_window, result.geometry.location )
      })
      $('input').focus()
    } else {
      alert('No results found. ' + status)
    }
  })
}

function add_info_window( marker, content ){
  content = '<div id="info_window">' + content + '</div>'
  var info_window = new google.maps.InfoWindow({ content: content })
  google.maps.event.addListener(marker, 'click', function() {
    info_window.open(map, marker)
  })
  info_window.open(map, marker)
  return info_window
}

function set_elevation( info_window, location ){
  elevator.getElevationForLocations({'locations': [location]}, function(res,status){
    var $cnt = $(info_window.getContent())
    $('.elevation', $cnt).html( res[0].elevation )
    info_window.setContent($cnt.html())
  })
}

function delete_overlays( ) {
  $(['m','iw', 'p']).each(function(ind, el){
    var objs = eval('elms.' + el)
    if (objs) {
      $(objs).each(function(ind_, el_){
        if (el == 'iw')
          el_.close()
        else
          el_.setMap(null)
      })
      eval('elms.' + el + ' = []') 
    }
  })
}

function get_zoom(){
  var lsize = [1080, 824]
  var wsize = [$(window).width(), $(window).height()]
  if (wsize[0] > lsize[0] && wsize[1] > lsize[1])
    return 8
  else if (wsize[0] > lsize[0]/2 && wsize[1] > lsize[1]/2)
    return 7
  else if (wsize[0] > lsize[0]/4 && wsize[1] > lsize[1]/4)
    return 6
  else
    return 5
}

