import os
import tempfile

import pytest
from unittest import TestCase
import sys
import pathlib
import json
from unittest.mock import Mock, patch
from requests.models import Response

SCRIPT_PATH = pathlib.Path(__file__).parent.absolute()
sys.path.append(str(os.path.join(SCRIPT_PATH, '../')))

from server import app
from routes.forecasts.united_kingdom import united_kingdom
from routes.forecasts.jakarta import jakarta

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_revgeocode(client):
    response = client.get("/api/location/revgeocode?latitude=-6.20924990562099&longitude=106.84529974890152")
    response_dict = json.loads(response.data.decode('utf-8'))
    expected = {"location": "Setiabudi, Jakarta"}
    assert expected == response_dict

@patch('routes.forecasts.united_kingdom.requests.get')
def test_united_kingdom_no_flood(mock_get):
    expected = {"date": ["2021-05-11", "2021-05-12", "2021-05-13", "2021-05-14", "2021-05-15"], "will_flood": [0, 0, 0, 0, 0], "narrative": ["", "", "", "", ""]}
    with open(f'{SCRIPT_PATH}/FGP_data_mock.json', 'r') as fi_mock_data:
        mock_res = Response()
        mock_res.status_code = 200
        mock_res._content = json.dumps(json.load(fi_mock_data)).encode('utf-8')
        mock_get.return_value = mock_res

        res_forecast = united_kingdom(51.5347, -0.1246)
        
        # pop "date" key because date will change according to time test is run
        expected.pop("date", None)
        res_forecast.pop("date", None)

        assert expected == res_forecast
            

@patch('routes.forecasts.united_kingdom.requests.get')
def test_united_kingdom_flood(mock_get):
    expected = {'date': ['2021-05-12', '2021-05-13', '2021-05-14', '2021-05-15', '2021-05-16'], 'will_flood': [0, 0, 0, 0, 0], 'narrative': ['Low likelihood, minor potential impact:\nMinor coastal impacts possible from Monday to Wednesday.', 'Low likelihood, minor potential impact:\nMinor coastal impacts possible from Monday to Wednesday.', 'Low likelihood, minor potential impact:\nMinor coastal impacts possible from Monday to Wednesday.', '', '']}
    with open(f'{SCRIPT_PATH}/FGP_data_mock.json', 'r') as fi_mock_data:
        mock_res = Response()
        mock_res.status_code = 200
        mock_res._content = json.dumps(json.load(fi_mock_data)).encode('utf-8')
        mock_get.return_value = mock_res

        res_forecast = united_kingdom(53.8597, -0.4024)
        
        # pop "date" key because date will change according to time test is run
        expected.pop("date", None)
        res_forecast.pop("date", None)

        assert expected == res_forecast
        
@patch('routes.forecasts.jakarta.requests.get')
def test_jakarta_forecast(mock_get):
    expected = {'date': ['2021-05-12', '2021-05-13', '2021-05-14', '2021-05-15', '2021-05-16', '2021-05-17', '2021-05-18', '2021-05-19', '2021-05-20', '2021-05-21', '2021-05-22', '2021-05-23', '2021-05-24', '2021-05-25', '2021-05-26'], 'will_flood': [0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0], 'narrative': ['Mix of sun and clouds. Highs in the low 90s and lows in the upper 70s.', 'Mix of sun and clouds. Highs in the low 90s and lows in the upper 70s.', 'Thunderstorms developing in the afternoon. Highs in the low 90s and lows in the upper 70s.', 'Thunderstorms developing in the afternoon. Highs in the low 90s and lows in the upper 70s.', 'Thunderstorms developing in the afternoon. Highs in the low 90s and lows in the upper 70s.', 'Thunderstorms developing in the afternoon. Highs in the low 90s and lows in the upper 70s.', 'Partly cloudy with a stray thunderstorm. Highs in the low 90s and lows in the upper 70s.', 'Showers and thunderstorms late. Highs in the low 90s and lows in the upper 70s.', 'Afternoon showers and thunderstorms. Highs in the low 90s and lows in the upper 70s.', 'Scattered thunderstorms possible. Highs in the low 90s and lows in the upper 70s.', 'Thunderstorms. Highs in the low 90s and lows in the upper 70s.', 'Afternoon showers and thunderstorms. Highs in the low 90s and lows in the upper 70s.', 'Afternoon showers and thunderstorms. Highs in the low 90s and lows in the upper 70s.', 'Thunderstorms developing in the afternoon. Highs in the low 90s and lows in the upper 70s.', 'Scattered thunderstorms possible. Highs in the low 90s and lows in the upper 70s.']}
    with app.app_context():
        with open(f'{SCRIPT_PATH}/TWC_data_mock.json', 'r') as fi_mock_data:
            mock_res = Response()
            mock_res.status_code = 200
            mock_res._content = json.dumps(json.load(fi_mock_data)).encode('utf-8')
            mock_get.return_value = mock_res

            res_forecast = jakarta(-6.1805, 106.8284)
           
            # pop "date" key because date will change according to time test is run
            expected.pop("date", None)
            res_forecast.pop("date", None)

            assert expected == res_forecast
