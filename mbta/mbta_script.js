var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
      zoom: 13, // The larger the zoom number, the bigger the zoom
      center: me,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
var map;
var myPos_marker;
var T_icon = 'T.jpg'
var infowindow = new google.maps.InfoWindow();

function init()
{
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  getMyLocation();
}

function getMyLocation() {
  if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
    navigator.geolocation.getCurrentPosition(function(position) {
      myLat = position.coords.latitude;
      myLng = position.coords.longitude;
      renderMap();
    });
  }
  else {
    alert("Geolocation is not supported by your web browser.  What a shame!");
  }
}

function renderMap()
{
  me = new google.maps.LatLng(myLat, myLng);

  // Update map and go there...
  map.panTo(me);
  stations = addMarkers();
  addPolyline(stations);
  var closest_station = closestTstop(stations);
  Polyline_me_to(closest_station);

  // Open info window on click of the myPos_marker
  google.maps.event.addListener(myPos_marker, 'click', function() {
    infowindow.setContent(
      "<p>The closest MBTA red line station to you is: <b>"+closest_station.title+ "</b></p>"+
      "<p>It is "+shortest_distance(closest_station.position, me).toFixed(2)+" miles away from you </p>"
    );
    infowindow.open(map, myPos_marker);
  });

  // Open info window on click of MBTA Red Line Station markers
  for (i = 0; i < stations.length; i++) {
    stations[i].index = i; //add index property
    google.maps.event.addListener(stations[i], 'click', function() {
      var infoWindow = new google.maps.InfoWindow();
      var this_station = stations[this.index].title;
      var index = this.index;
      // make a new XMLHttp Request for the real time scheduale of upcoming trains
      // everytime the marker is clicked
      request = new XMLHttpRequest();
      request.open("get", "https://rocky-taiga-26352.herokuapp.com/redline.json", true);
      request.onreadystatechange = function() {
        if (request.status == 200 && request.readyState ==4) {
          data = request.responseText;
          trips = JSON.parse(data);
          var scheduale = "";
          var braintree_scheduale = [];
          var ashmont_scheduale = [];
          var alewife_scheduale = [];
          var content;
          //loop through all the current trips
          for (i = 0; i < trips["TripList"]["Trips"].length; i++){
            //identify trips that are headed for this stop
            for (j = 0; j < trips["TripList"]["Trips"][i]["Predictions"].length; j++) {
                if ( trips["TripList"]["Trips"][i]["Predictions"][j]["Stop"] == this_station) {
                  //record predicted train arrival times according to destinations
                  if ( trips["TripList"]["Trips"][i]["Destination"] == "Braintree"){
                    braintree_scheduale[braintree_scheduale.length] = trips["TripList"]["Trips"][i]["Predictions"][j]["Seconds"];
                  }
                  if ( trips["TripList"]["Trips"][i]["Destination"] == "Ashmont"){
                    ashmont_scheduale[ashmont_scheduale.length]= trips["TripList"]["Trips"][i]["Predictions"][j]["Seconds"];
                  }
                  if ( trips["TripList"]["Trips"][i]["Destination"] == "Alewife"){
                    alewife_scheduale[alewife_scheduale.length] = trips["TripList"]["Trips"][i]["Predictions"][j]["Seconds"];
                  }
                }
            }
          }
          braintree_scheduale = make_pretty(braintree_scheduale);
          ashmont_scheduale = make_pretty(ashmont_scheduale);
          alewife_scheduale= make_pretty(alewife_scheduale);
          scheduale = "<p>To <b>Ashmont </b> in: "+ashmont_scheduale+"</p>"+
                      "<p>To <b>Braintree</b> in: "+braintree_scheduale+"</p>"+
                      "<p>To <b>Alewife</b> in: "+alewife_scheduale+"</p>";
          infoWindow.setContent("<p><h1>"+this_station+" Station</h1></p><p><b>Next Trains Arriving:</b></p>"+scheduale);
          infoWindow.open(map, stations[index]);
      //if the request fails, request the user to re-open the window, prompting
      //a new request
       }else {
         infoWindow.setContent("<p>Station: " + this_station + "</p><p>" + "Sorry, I couldn't find the scheduale of upcoming trains for this station." +
         "</p><p>" + "Please close this infowindow and try again." +"</p>");
         infoWindow.open(map, stations[index]);
       }

    }
    request.send();

   });

  }

}

function addMarkers()
{
  myPos_marker= new google.maps.Marker({
    position: me,
  });
  myPos_marker.setMap(map);

  //make a googlemaps Marker for each red line staiton
  var stations = [

   alewife_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.395428,-71.142483),
      title: "Alewife",
      icon: T_icon,
   }),

    davis_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.39674, -71.121815),
      title: "Davis",
      icon: T_icon,
    }),

    porterSq_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.3884, -71.11914899999999),
      title: "Porter Square",
      icon: T_icon,
    }),

    harvardSq_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.373362, -71.118956),
      title: "Harvard Square",
      icon: T_icon,
    }),

    centralSq_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.365486, -71.103802),
      title: "Central Square",
      icon: T_icon,
    }),

    kendall_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.36249079, -71.08617653),
      title: "Kendall/MIT",
      icon: T_icon,
    }),

    charlesMGH_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.361166, -71.070628),
      title: "Charles/MGH",
      icon: T_icon,
    }),

    parkSt_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.35639457, -71.0624242),
      title: "Park Street",
      icon: T_icon,
    }),

    downtownCr_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.355518,-71.060225),
      title: "Downtown Crossing",
      icon: T_icon,
    }),

    southStation_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.352271, -71.05524200000001),
      title: "South Station",
      icon: T_icon,
    }),

    broadway_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.342622, -71.056967),
      title: "Broadway",
      icon: T_icon,
    }),

    andrew_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.330154, -71.057655),
      title: "Andrew",
      icon: T_icon,
    }),

    jfk_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.320685, -71.052391),
      title: "JFK/UMass",
      icon: T_icon,
    }),

    northQuincy_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.275275, -71.029583),
      title: "North Quincy",
      icon: T_icon,
    }),

    wollaston_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.2665139, -71.0203369),
      title: "Wollaston",
      icon: T_icon,
    }),

    quincyCtr_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.251809, -71.005409),
      title: "Quincy Center",
      icon: T_icon,
    }),

    quincyAdams_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.233391, -71.007153),
      title: "Quincy Adams",
      icon: T_icon,
    }),

    braintree_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.2078543, -71.0011385),
      title: "Braintree",
      icon: T_icon,
    }),

    savinHill_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.31129, -71.053331),
      title: "Savin Hill",
      icon: T_icon,
    }),

    fieldsCo_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.300093, -71.061667),
      title: "Fields Corner",
      icon: T_icon,
    }),

    shawmut_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.29312583,-71.06573796000001),
      title: "Shawmut",
      icon: T_icon,
    }),

    ashmont_marker = new google.maps.Marker({
      position: new google.maps.LatLng(42.284652, -71.06448899999999),
      title: "Ashmont",
      icon: T_icon,
    })];

  //put the markers on the map
  for (i = 0; i < stations.length; i++) {
    stations[i].setMap(map);
  }
  return stations;

}

function addPolyline(stations)
{
  var coordinates1 = [];
  var coordinates2= [];

  for (i = 0; i < 18; i++ ){
    coordinates1[i] = stations[i].position;
  }

  //the red line forks at JFK station
  coordinates2[0] = stations[12].position;

  for ( i = 1; i < 5; i ++) {
    //the next 5 stations in the list of stations goes to the next path
    coordinates2[i] = stations[i+17].position;
  }

  var path1 = new google.maps.Polyline({
    path: coordinates1,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  })
  path1.setMap(map);

  var path2 = new google.maps.Polyline({
    path: coordinates2,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  })
  path2.setMap(map);
}

function Polyline_me_to(closest_station){

  var coordinates = [closest_station.position, me]
  var path = new google.maps.Polyline({
    path: coordinates,
    geodesic: true,
    strokeColor: '#FFFF00',
    strokeOpacity: 1.0,
    strokeWeight: 2
  })
  path.setMap(map);

}

//adapted from a post on stackOverflow
toRad = function(num) {
   return num * Math.PI / 180;
}
//uses haversine formula, inplemenation from stackOverflow
function shortest_distance(LatLng1, LatLng2) {

  var lat2 = LatLng2.lat();
  var lon2 = LatLng2.lng();
  var lat1 = LatLng1.lat();
  var lon1 = LatLng1.lng();

  var R = 6371; // radius of the eath in km
  //has a problem with the .toRad() method below.?
  var x1 = lat2-lat1;
  var dLat = toRad(x1);
  var x2 = lon2-lon1;
  var dLon = toRad(x2);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var distance = (R * c)*0.62137119; //km to mi
  return distance;

}
function closestTstop(stations) {

  var closest;
  var shortest_dis = 1000000;

  for (i = 0; i < stations.length; i++) {

    var distance = shortest_distance(stations[i].position, me);
    if (distance < shortest_dis) {
      shortest_dis = distance;
      closest = stations[i];
    }
  }
  return closest;

}

function make_pretty(scheduale) {

  scheduale.sort(function(a, b){return a-b});
  for ( count = 0; count < scheduale.length; count++) {
    var time = scheduale[count];
    var minutes = Math.floor(time/ 60);
    var seconds = time - minutes * 60;
    if ( minutes >= 1){
      scheduale[count]  = " "+minutes+" mins "+seconds+" seconds";
    } else {
      scheduale[count]  = " "+time+" seconds";
    }
  }
  scheduale = scheduale.join();
  return scheduale;

}
