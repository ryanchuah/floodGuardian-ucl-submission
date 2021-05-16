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

SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))
# jakarta_app = Blueprint('jakarta_app', __name__)

models = {'jakarta': load(f'{SCRIPT_PATH}/../../models/jakarta_gradientboosting.joblib')}


def weather_forecast(latitude, longitude):
    # returns a {date:[datetime.date(),...], precipitationRate: [float,..], relativeHumidity:[int,..]} object

    url = f'https://api.weather.com/v3/wx/forecast/daily/15day?geocode={latitude},{longitude}&format=json&units=e&language=en-US&apiKey={os.getenv("TWC_APIKEY")}'
    response = None
    try:
        response = requests.get(url)
        response.raise_for_status()
        response = response.json()
        result = {'Date': [date.today() + timedelta(days=i) for i in range(15)], 
                    'precipitationRate': [], 'relativeHumidity': [], 'narrative': []}
        result['precipitationRate'] = response['qpf']
        result['narrative'] = response['narrative']
        relative_humidity = response['daypart'][0]['relativeHumidity']
        relative_humidity = [
            elem if elem is not None else 0 for elem in relative_humidity]
        result['relativeHumidity'] = [
            sum(relative_humidity[i:i+2]) for i in range(0, len(relative_humidity), 2)]
        return result
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')



def format_weather(curr_weather, hist_weather):
    def date_encode(df, col, max_val):
        df[col + 'Sin'] = np.sin(2 * np.pi * df[col]/max_val)
        df[col + 'Cos'] = np.cos(2 * np.pi * df[col]/max_val)
        return df

    # combine curr and hist weather into a single weather
    weather = {key: value + curr_weather[key]
               for key, value in hist_weather.items()}
    weather = pd.DataFrame(weather)
    weather.sort_values('Date', inplace=True)
    weather['centred7dayPrecipitationRate'] = weather['precipitationRate'].rolling(
        min_periods=1, window=7, center=True).sum()
    weather['year'] = pd.DatetimeIndex(weather['Date']).year.astype(int)
    weather['month'] = pd.DatetimeIndex(
        weather['Date']).month  # will be dropped
    weather['day'] = pd.DatetimeIndex(weather['Date']).day  # will be dropped
    weather = date_encode(weather, 'month', 12)
    weather = date_encode(weather, 'day', 30)
    weather.drop(['month', 'day'], axis=1, inplace=True)
    weather.reset_index(drop=True)
    return weather.reset_index(drop=True)


def preprocess_weather(weather):
    fts = ['relativeHumidity', 'precipitationRate',
           'centred7dayPrecipitationRate', 'monthSin', 'monthCos', 'daySin', 'dayCos']
    weather = weather[fts].to_numpy()
    return preprocessing.RobustScaler().fit_transform(weather)


def jakarta(latitude, longitude):
    curr_weather = weather_forecast(latitude, longitude)

    # data of past 15 days
    hist_weather = curr_weather.copy()
    hist_weather['Date'] = [
        d - timedelta(days=i*2-1) for i, d in enumerate(curr_weather['Date'], 1)]

    # weather is a sorted (by date) dataframe of the past 15 days and next 15 days
    weather = format_weather(curr_weather, hist_weather)
    weather = preprocess_weather(weather)

    model = models['jakarta']

    # predict the next 15 days of weather
    pred = model.predict(weather[-15:])

    # convert np.int64 to int (needed because np.int64 cannot be JSONified)
    pred = [int(elem) for elem in pred]

    return {
        'date': [(date.today() + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(15)],
        'will_flood': pred,
        'narrative': curr_weather['narrative'],
    }