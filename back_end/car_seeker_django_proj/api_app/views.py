from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from car_seeker_django_proj.settings import env

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
            return Response(data, status=status.HTTP_200_OK)
        
        except requests.exceptions.RequestException as e:
            error_message = f"Error fetching data from Auto.dev API: {str(e)}"
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
            response.raise_for_status()  
            
            data = response.json()
            return Response(data, status=status.HTTP_200_OK)
        
        except requests.exceptions.HTTPError as http_err:
            error_message = f"HTTP error occurred: {str(http_err)}"
            return Response({'error': error_message}, status=http_err.response.status_code)
        except requests.exceptions.RequestException as e:
            error_message = f"Error fetching data from Auto.dev API: {str(e)}"
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
      