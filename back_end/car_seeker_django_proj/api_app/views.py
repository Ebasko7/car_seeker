from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
import requests
#.ENV IS STORING THE API KEY FOR AUTO.DEV 
from car_seeker_django_proj.settings import env

#THE LANDING PAGE VIEW RECEIVES THE API KEY FROM THE ENV FILE AND SENDS THE PARAMS DICT TO THE ENDPOINT TO RETURN A LIST OF SUPER CARS
#IF THE REQUEST IS SUCCESSFUL THE RESULTS AND A 200_OK MESSAGE IS RETURNED, ELSE A 500 ERROR
class AutoDevLandingView(APIView):
    def get(self, request):
        api_key = env.get("API_KEY")
        endpoint = 'https://auto.dev/api/listings'
        
        params = {
            'apikey': api_key,
            'category': 'supercar'
        }

        try:
            response = requests.get(endpoint, params=params)
            data = response.json()
            return Response(data, status=HTTP_200_OK)
        
        except requests.exceptions.RequestException as e:
            error_message = f"Error fetching data from Auto.dev API: {str(e)}"
            return Response({'error': error_message}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
# THE MARKET VIEW ALSO UTILIZES THE APIKEY, BUT BUILDS A PARAM DICT FROM THE USER DEFINED PARAMS IN THE URL. THIS DICT IS PASSED VIA THE HTTP BODY
# AUTO.DEV API RETURNS A LIST OF CARS THAT MATCH THE QUERY PARAMETERS
class AutoDevMarketView(APIView):
    def get(self, request):
        api_key = env.get("API_KEY")
        endpoint = 'https://auto.dev/api/listings'
        
        make = request.query_params.get('make').title()
        model = request.query_params.get('model').title()
        year = request.query_params.get('year_min')
        price = request.query_params.get('price_max')
        page = request.query_params.get('page')
        
        params = {
            'apikey': api_key,
            'make': make,
            'model': model,
            'year_min': year,
            'price_max': price,
            'page': page,
        }

        try:
            response = requests.get(endpoint, params=params)
            
            #CHECKS FOR A 2XX RESPONSE, OTHERWISE WILL RAISE ERROR
            response.raise_for_status()  
            data = response.json()
            return Response(data, status=HTTP_200_OK)
        
        #HANDLES ERRORS RAISED BY RAISE FOR STATUS
        except requests.exceptions.HTTPError as http_err:
            error_message = f"HTTP error occurred: {str(http_err)}"
            return Response({'error': error_message}, status=http_err.response.status_code)
        
        #HANDLES ALL OTHER ERRORS
        except requests.exceptions.RequestException as e:
            error_message = f"Error fetching data from Auto.dev API: {str(e)}"
            return Response({'error': error_message}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
      