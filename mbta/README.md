# README

Catherine Cowell  

October 20, 2019  

 This web page shows displays Boston MBTA's Red Line train stations. A marker that appears
 at the user's current location will display the closest Red Line Stop to the user
 and it's distance away. If the user clicks on one of the stops on the map an
 informational window will appear displaying the upcoming inbound and outbound
 trains to that station.


 I think that most of the aspects of this project have been implemented
 correctly. Since I make a new XML HTTP request each time the user clicks
 on an infowindow, there is some lag time in getting the scheduale, but I
 considered this to be a better solution than only loading the scheduale once
 from the JSON API because the scheduale would be slightly outdated by the time
 the user clicks on a marker. However, with this method I had to put all the
 AJAX stuff and parse the data in my function to render the markers, which makes
 the function very convoluted.
