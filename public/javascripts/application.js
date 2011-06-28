var map
var geocoder
var elevator
var elms = {
  m: [],//markers
  iw: [], //info_windows
  p: [] //polylines
}
var tt

/*timer*/
  function update_time(){
    d = timer.getTime()
    d = d + 1
    timer.setTime(d)
    $('#timer').html(d)
    t = setTimeout('timer = update_time()', 1000)
    return timer
  }

  function init_time(){
    $('#timer').html(timer.getTime())
    setTimeout('timer = update_time()', 1000)
    return true
  }

  function f(t){
    if(t < 10)
      return '0' + t
    else 
      return t
  }
/* timer end */

function gsearch( query ) {
  delete_overlays()
  geocoder.geocode( { 'address': query}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var new_bounds = results[0].geometry.bounds //for the centering
      $(results).each(function(ind, result){
        if (ind > 0)
          new_bounds = new_bounds.extend(result.geometry.location)
        marker = new google.maps.Marker({
            map: map, 
            title: result.formatted_address,
            position: result.geometry.location
        })
        elms.m.push( marker )
        var content = result.formatted_address +'<br> Lat&amp;Lng: ' + result.geometry.location.toString() + '<br>' + 'Elevation: <span class="elevation"></span>'
        var info_window = add_info_window(marker, content)
        elms.iw.push( info_window )
        set_elevation( info_window, result.geometry.location )
      })
      map.fitBounds(new_bounds)
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

function get_url_params(){
  var paramsRaw = (document.location.href.split("?", 2)[1] || "").split("#")[0].split("&") || []
  var urlParams = {}
  for(var i = 0; i< paramsRaw.length; i++){
	  var single = paramsRaw[i].split("=")
	  if(single[0])
		  urlParams[single[0]] = unescape(single[1])
  }
  return urlParams
}

function url_search(){
  var href = document.location.href.replace(/%20/g, ' ')
  var idents = (href.split("?", 2)[0]).split('/')
  var emptyInd = idents.indexOf('')
  while (emptyInd >= 0){//remove empty strings
    idents.splice(emptyInd, 1)
    emptyInd = idents.indexOf('')
  }
  var from = Math.max(idents.indexOf('nuleisk.local'), idents.indexOf('nuleisk.lt'))
  from = Math.max(from, idents.indexOf('www.nuleisk.lt')) + 1
  var search_str = idents.slice(from, idents.length).join(', ')
  if (search_str.length > 0){
    $('#search_input').attr('value', search_str)
    gsearch( search_str )
  }
  return true
}

/* OLD FUNCTIONS */
/* maps */
var iconMarkers = [];
function initIcons(){
	var icon = [];
	icon[0] = new GIcon();
	icon[0].image = "/Templates/Nuleisk/Images/kk.gif";
	icon[0].iconSize = new GSize(30,30);
	icon[0].iconAnchor = new GPoint(30,30);
	icon[0].infoWindowAnchor = new GPoint(30,30);
	icon[1] = new GIcon();
	icon[1].image = "/Templates/Nuleisk/Images/samogithia.gif";
	icon[1].iconSize = new GSize(36,30);
	icon[1].iconAnchor = new GPoint(36,30);
	icon[1].infoWindowAnchor = new GPoint(36,30);
	var samogitiaPoint = new GLatLng(55.81362907119958,22.1704101562);
	var samogitiaMarker = new GMarker(samogitiaPoint,{'icon': icon[1], 'title': 'Å½emaitija (Lietuva)'});
	iconMarkers[iconMarkers.length] = samogitiaMarker;
	map.addOverlay(samogitiaMarker);
	icon[2] = new GIcon();
	icon[2].image = "/Templates/Nuleisk/Images/handshake.gif";
	icon[2].iconSize = new GSize(40,56);
	icon[2].iconAnchor = new GPoint(40,28);
	icon[2].infoWindowAnchor = new GPoint(40,28);
	var litlatest = [
[56.4173198278558, 22.04784393310547], [56.26242247585759, 24.11722183227539], [55.95842604865924, 26.034507751464844],
[57.9371578561392, 25.61016082763672], [57.61934734315021, 26.938905715942383]
	];
	for (var i=0; i<litlatest.length; i++){
		var litlatestPoint = new GLatLng(litlatest[i][0], litlatest[i][1]);
		var litlatestMarker = new GMarker(litlatestPoint,{'icon': icon[2], 'title': 'Pabaltijo Å¡alys'});
   	iconMarkers[iconMarkers.length] = litlatestMarker;
		map.addOverlay(litlatestMarker);
	}
	GEvent.addListener(map, 'maptypechanged', function(){ 
	  for (var i=0; i<iconMarkers.length; i++){ 
	    map.removeOverlay(iconMarkers[i])
	  } 
	  iconMarkers = [];
	});
  return true;
}

function setCenter(lat, lon, zoom){
	map.setCenter(new GLatLng(lat,lon),zoom);
}

function clearmap( mk ){
	//map.clearOverlays() ;
	if (currentOverlay != null){
		map.removeOverlay(currentOverlay);
		currentOverlay = null;
	}
	document.getElementById('getMarkerUrl').style.display = "none";
	lastclick = "" ;
}


function initRightMenu(){ //init right menu
  $('#map').contextMenu({menu: 'map-right-menu'}, function(action, el, pos){
//    var fn = eval(action);
//    fn(el, pos);
alert(action);
  });
}

function setFunctionality(){//set function
  var fn = eval('setPosition');
  GEvent.removeListeners("click");
	GEvent.addListener(map, "click", function(overlay, point, overlayPoint) {
		if (overlay){
		}else if (point){
			setPosition( point ) ;
		}
	});
}

function setPosition( point ){ //1. set position
	if ( lastclick != point ){
		lastclick = point ;
		var zoomlvl = map.getZoom();
		clearmap( );
		fc( point, zoomlvl) ;
	}
}


function fc( point, zoomlvl ){
	var html = "";
	map.setCenter( point, zoomlvl) ;
	document.getElementById('getMarkerUrl').style.display = "block";
	html += "Platuma: "+point.y+"<br> Ilguma "+point.x;
	x = point.x;
	y = point.y;
	var marker = new GMarker(point, {draggable: true});
	map.addOverlay(marker);
	currentOverlay = marker;
	GEvent.addListener(marker, "dragstart", function() {
			map.closeInfoWindow();
		});
	GEvent.addListener(marker, "dragend", function() {
			html = "Platuma: "+marker.getLatLng().lat()+"<br> Ilguma "+marker.getLatLng().lng();
			marker.openInfoWindowHtml(html);
		});
	GEvent.addListener(marker, "click", function(){
			marker.openInfoWindowHtml(html);
		});
}

function getMapType(){
	var currentMapType = map.getCurrentMapType().getName();
	if (currentMapType == 'Å½emÄ—lapis')
		return 'G_NORMAL_MAP';
	if (currentMapType == 'Palydovas')
		return 'G_SATELLITE_MAP';
	if (currentMapType == 'Hibridas')
		return 'G_HYBRID_MAP';
	if (currentMapType == 'Reljefinis')
		return 'G_PHYSICAL_MAP';
	return 'G_NORMAL_MAP';
  
//G_MOON_ELEVATION_MAP
//G_MOON_VISIBLE_MAP
//G_SATELLITE_3D_MAP
}

function getPointUrl(){
	if (currentOverlay == null)
		return true;
	var url = "?center="+map.getCenter().lat()+","+map.getCenter().lng()+"&zoom="+map.getZoom()+"&maptype="+getMapType()+"&markers="+currentOverlay.getLatLng().lat()+","+currentOverlay.getLatLng().lng()+"&html=";
	window.location = siteUrl +url;
}

function searchInMap(address){
	geocoder.getLocations(address, function (result){ 
		if (result.Status.code == G_GEO_SUCCESS) {
			var p = result.Placemark[0].Point.coordinates;
			lat = p[1];
			lon = p[0];
			setCenter(lat, lon, map.getZoom());
		}
	});
}

function setCity(city){
	if (city != ""){
		map.setZoom(12);
	}else{
		map.setZoom(7);
	}
	city = city + " Lietuva";
	searchInMap(city);
}

function createMarker(point, html){
	var marker = new GMarker(point);
	GEvent.addListener(marker, "click", function(){
			marker.openInfoWindowHtml(html);
		});
	return marker;
}

function scrollOn(){
	map.disableScrollWheelZoom();
	return true;
}

function scrollOff(){
	map.enableScrollWheelZoom();
	return true;
}


/* maps end */

/* distance */
function calcDist(points) {
  var er = 6366.707;
  //ave. radius = 6371.315 (someone said more accurate is 6366.707)
  //equatorial radius = 6378.388
  //nautical mile = 1.15078
  var radlat1 = Math.PI * (Math.abs(points[0][0]))/180;
  var radlat2 = Math.PI * (Math.abs(points[1][0]))/180;
  var radlong1 = Math.PI * (Math.abs(points[0][1]))/180;
  var radlong2 = Math.PI * (Math.abs(points[1][1]))/180;
  //spherical coordinates x=r*cos(ag)sin(at), y=r*sin(ag)*sin(at), z=r*cos(at)
  //zero ag is up so reverse lat
  if (points[0][0] > 0) {radlat1 = Math.PI/2-radlat1} //N
  if (points[0][0] < 0) {radlat1 = Math.PI/2+radlat1} //S
  if (points[0][1] < 0) {radlong1 = Math.PI*2-radlong1}  //W

  if (points[1][0] > 0) {radlat2=Math.PI/2-radlat2}
  if (points[1][0] < 0) {radlat2=Math.PI/2+radlat2}
  if (points[1][1] < 0) {radlong2=Math.PI*2-radlong2}

  var x1 = er * Math.cos(radlong1)*Math.sin(radlat1);
  var y1 = er * Math.sin(radlong1)*Math.sin(radlat1);
  var z1 = er * Math.cos(radlat1);

  var x2 = er * Math.cos(radlong2)*Math.sin(radlat2);
  var y2 = er * Math.sin(radlong2)*Math.sin(radlat2);
  var z2 = er * Math.cos(radlat2);

  var d = Math.sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2) );
  var theta = Math.acos( (er * er + er * er - d * d) / (2 * er * er) );
  var distance = theta * er;
  return {
    km: distance,
    mil: distance/1.609344,
    nautical: distance/1.852
  }
}
/* distance end */
