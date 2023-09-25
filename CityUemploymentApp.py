# Import the dependencies.

import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, MetaData


from json import loads, dumps

from flask import Flask, render_template, request, jsonify


#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///cityDataETL/city_db.sqlite")

insp = inspect(engine)
print(insp.get_table_names())

# reflect an existing database into a new model

Base = automap_base()


metadata_obj = MetaData()
metadata_obj.reflect(bind=engine)
CityData = metadata_obj.tables["CityUnemployment"]


#################################################
# Flask Setup
#################################################

app = Flask(__name__,template_folder="templates")


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available options."""
    return (
        f"Available Routes:<br/>"
        f"/USCityUnemploymentMap<br/>"
        f"/TopCityUnemployment<br/>"
        f"/TopCityUnemployment/<city>"
    )


@app.route("/USCityUnemploymentMap")
def unemploymentMap():
    """Return the city-level data (location, population, unemployment) as JSON"""
   
    # Create our session (link) from Python to the DB
    session = Session(engine)


    # Query all city unemployment data from the database + tranfer to DF then to dictionary then return as JSON

    city_data = session.query(CityData).all()

    city_df = pd.DataFrame([(cd.city, cd.latitude, cd.longitude, cd.population, cd.unemploymentRate, cd.unemploymentCount) for cd in city_data], columns=['city', 'latitude','longitude','population','unemploymentRate','unemploymentCount'])

    print(city_df)


    df_to_json = city_df.to_json(orient="records")
    parsed_json = loads(df_to_json)
    result = dumps(parsed_json, indent=4)  

    return result
    
    session.close()



@app.route("/TopCityUnemployment")
def cityUnemployment():
    
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)



