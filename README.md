goeuro-angular-test
===================

Small AngularJs test for any frontend applicant to GoEuro.

## Test 

The goal of this small test is to simulate the behaviour of the search form on the GoEuro's frontpage.

- Gather data from http://www.goeuro.com/GoEuroAPI/rest/api/v2/position/suggest/de/{{ locationName }}
- Sort results from the closest location to the furthest according the user's geo location
- Put that in a ui-bootstrap dropdown (like the ones we have on the frontpage but in really basic)
- Add 2 calendars. By default, set the first one set to today + 14 days, the second one always to firt calendar date + 7 days
- Show a very simple validation page when clicking on the form submit button


## Technologies

- AngularJs 1.2.x
- UI-bootsrap 0.10.0
- Bootstrap CSS 3

## Running the test

The code is totally empty feature-wise, it's just the output of Yeoman's "yo anglar"
To run the code, from the console, do:
- grunt build
- grunt serve


## Notes

- Take this test seriously and prove that you can do a simple software in professional manner, thinking about all the implications
- No need to do something very stylish but a bit of good taste doesn't hurt

