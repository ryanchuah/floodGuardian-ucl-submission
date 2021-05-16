from flask import Flask, request, Response, Blueprint, jsonify

import json
import os
import requests
from requests.exceptions import HTTPError
from joblib import load
from datetime import datetime, timedelta, date
import pandas as pd
import numpy as np
import sklearn
from sklearn import preprocessing
import random
import requests_cache
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

requests_cache.install_cache('cache_UK', backend='sqlite', expire_after=7200)
SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))

IMPACT = {1: 'Minimal', 2: 'Minor', 3: 'Significant', 4: 'Severe'}
LIKELIHOOD = {1: 'Very low', 2: 'Low', 3: 'Medium', 4: 'High'}

WILL_FLOOD_SEVERITY = {
    0: set([(1, 1), (1, 2), (1, 3), (1, 4), (2, 1), (2, 2)]),
    1: set([(2, 3), (2, 4), (3, 1), (3, 2), (4, 1)]),
    2: set([(3, 3), (3, 4), (4, 2), (4, 3)]),
    3: set([(4, 4)])
}


def united_kingdom(latitude, longitude):
    print(latitude, longitude)

    url = 'https://api.ffc-environment-agency.fgs.metoffice.gov.uk/api/public/statements'
    narrative = {1: [], 2: [], 3: [], 4: [], 5: []}
    will_flood = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    try:
        response = requests.get(url)
        response.raise_for_status()

        response = response.json()
        filtered_risk_areas = []
        location = Point(float(latitude), float(longitude))

        for statement in response['statements']:
            for area in statement['risk_areas']:
                in_risk_area = False
                for block in area['risk_area_blocks']:
                    for poly in block['polys']:
                        risk_areas_have_been_set = False
                        bounding_coords = []

                        for coordinates in poly['coordinates']:
                            if len(coordinates) > 2:
                                for c in coordinates:
                                    bounding_coords.append(
                                        (float(c[1]), float(c[0])))
                                
                                bounding_poly = Polygon(bounding_coords)
                                if bounding_poly.contains(location):
                                    filtered_risk_areas.append(area)
                                    break
                                bounding_coords = []

                                risk_areas_have_been_set = True
                            else:
                                bounding_coords.append(
                                        (float(coordinates[1]), float(coordinates[0])))
                        if not risk_areas_have_been_set: 
                            bounding_poly = Polygon(bounding_coords)
                            if bounding_poly.contains(location):
                                filtered_risk_areas.append(area)
                                break
                            bounding_coords = []


        for area in filtered_risk_areas:
            for block in area['risk_area_blocks']:
                risk_type = next(iter(block['risk_levels']))
                impact = []
                likelihood = []

                for risk_type in block['risk_levels']:
                    impact.append(block['risk_levels'][risk_type][0])
                    likelihood.append(block['risk_levels'][risk_type][1])
                impact = max(impact)
                likelihood = max(likelihood)

                for day in block['days']:
                    narrative[day].append(
                        (likelihood, f"{LIKELIHOOD[likelihood]} likelihood, {IMPACT[impact].lower()} potential impact:\n{block['additional_information']}"))
                    for severity, value in WILL_FLOOD_SEVERITY.items():
                        if (impact, likelihood) in value:
                            will_flood[day] = max(will_flood[day], severity)
                            break

        for day in narrative:
            narrative[day] = [narr[1]
                              for narr in sorted(narrative[day], reverse=True, key=lambda x: x[0])]
            narrative[day] = ' '.join(list(dict.fromkeys(narrative[day])))

        return {
            'date': [(date.today() + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(5)],
            'will_flood': [will_flood[day] for day in will_flood],
            'narrative': [narrative[day] for day in narrative],
        }
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
