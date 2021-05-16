from flask import Flask, request, Response, Blueprint

import json
import os
import requests
from requests.exceptions import HTTPError
from .forecasts.jakarta import jakarta
from .forecasts.united_kingdom import united_kingdom

forecast_app = Blueprint('forecast_app', __name__)


@forecast_app.route("/")
def forecast():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    url = f'https://revgeocode.search.hereapi.com/v1/revgeocode?at={latitude}%2C{longitude}&lang=en-US&apiKey={os.getenv("HERE_APIKEY")}'

    try:
        response = requests.get(url)
        response.raise_for_status()
        items = response.json()['items']
        if items:
            address = items[0]['address']
            countryCode = address['countryCode']
            state = address['state']
            county = address['county']
            if countryCode == 'IDN' and state == 'JABODETABEK':
                return jakarta(latitude, longitude)
            elif countryCode == 'GBR':
                return united_kingdom(latitude, longitude)

        return Response({}, status=204)

    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
        return Response("Reverse geocode failed: " + http_err, status=500)
