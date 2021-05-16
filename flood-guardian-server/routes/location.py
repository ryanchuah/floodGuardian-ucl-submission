from flask import Flask, request, Response, Blueprint

import json
import os
import requests
from requests.exceptions import HTTPError

location_app = Blueprint('location_app', __name__)


@location_app.route("/revgeocode")
def revgeocode():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    url = f'https://revgeocode.search.hereapi.com/v1/revgeocode?at={latitude}%2C{longitude}&lang=en-US&apiKey={os.getenv("HERE_APIKEY")}'

    try:
        response = requests.get(url)
        response.raise_for_status()
        address = response.json()['items'][0]['address']
        address_hierachy = ['district', 'city',
                            'county', 'state', 'countryName']

        for i in range(len(address_hierachy)-1):
            if address_hierachy[i] in address and address_hierachy[i+1] in address:
                return {'location': f'{address[address_hierachy[i]]}, {address[address_hierachy[i+1]]}'}

    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
