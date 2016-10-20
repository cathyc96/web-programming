README for Tufts Comp 20 Assignment 2
Catherine Cowell
October 20, 2019

1) I think that most of the aspects of this project have been implemented
 correctly. Since I make a new XML HTTP request each time the user clicks
 on an infowindow, there is some lag time in getting the scheduale, but I
 considered this to be a better solution than only loading the scheduale once
 from the JSON API because the scheduale would be slightly outdated by the time
 the user clicks on a marker. However, with this method I had to put all the
 AJAX stuff and parse the data in my function to render the markers, which makes
 the function very convoluted.

2) I received help in office hours with TA David Bernstein and with Ming. I also
 used a modified version of the haversineDistance function found on
 http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
 to implement the Haversine formula.
 
3) I spend approximately 20 hours working on this assignment.
