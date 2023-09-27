# city-level-employment

## Name: City-Level Unemployment Map: Interactive Visualizations of Employment Statistics for Top US Cities ## Goal/Plan/

## Proposal: The aim of my project is to clearly represent recent employment statistics for individual large US cities. I plan to provide a dashboard/page through which users can visualize city-level data from the federal Bureau of Labor Statistics (BLS) around key unemployment metrics. I will display city-specific data on an interactive map of the US with multiple visualization options for users.

## Key Files/Folders
### All data processing / ETL work contained within cityDataETL folder, including resulting .sqlite file as well as CityUnemploymentAPI.py which generates a Flask API allowing the interactive map HTML/JS to request JSON data from the SQLite DB
### index.html is the primary file to open which loads the interactive map, the static/ folder contains the JS that processes that city data into circle markers and builds the Leaflet map
### Presentation slides at https://docs.google.com/presentation/d/19ylOF8QJrODDtIiYlDgG2apOl-lNXWuOns6J5lKl5nI/edit#slide=id.p and also included in repo as PDF ("Presentation_City-Level_Unemployment_Map")

## Analysis/Takeaways/Value
### This map enables users to easily go beyond average national unemployment data and view how that data varies at the city level for the 100 largest US cities (by population), including potential correlation in unemployment statistics within sub-regions of the country
#### The first map overlay/view seems to indicate some correlation between city size/population and higher unemployment rates, as well as generally lower unemployment rates in the Southwest, especially Florida, and in the Northwest / Mountain West
#### The second map overlay/view makes it much more clear to see that the highest unemployment rates are quite concentrated within a few smaller regions of the country, specifically Detroit, MI then California / Las Vegas, then the Northeast

### Sources:
#### SimpleMaps used for database of US cities with populations and lat+long coordinates: https://simplemaps.com/data/us-cities
#### help with SQLite database creation via Python/Pandas pulled from https://www.fullstackpython.com/blog/export-pandas-dataframes-sqlite-sqlalchemy.html
#### help with Flask+Python+HTML+JS for creating web applications pulled from https://www.geeksforgeeks.org/pass-javascript-variables-to-python-in-flask/
#### reverse geocoding for looking up state names from lat/long coordinates via https://geocode.maps.co/ API

