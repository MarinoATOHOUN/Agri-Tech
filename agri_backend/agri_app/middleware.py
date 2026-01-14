import geocoder
from ipware import get_client_ip
from django.utils import timezone
from .models import UserLocation

class LocationTrackingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code exécuté avant la vue
        if request.user.is_authenticated:
            self.track_location(request)

        response = self.get_response(request)
        return response

    def track_location(self, request):
        try:
            client_ip, is_routable = get_client_ip(request)
            
            if client_ip:
                # Si on est en local, on peut simuler une IP pour tester
                if client_ip == '127.0.0.1':
                    # IP de test (Paris)
                    # client_ip = '8.8.8.8' 
                    pass

                # Obtenir la localisation via geocoder (utilise IP-API par défaut)
                g = geocoder.ip(client_ip)
                
                if g.ok:
                    lat = g.lat
                    lng = g.lng
                    city = g.city
                    country = g.country
                    
                    # Vérifier la dernière localisation de l'utilisateur
                    last_location = UserLocation.objects.filter(
                        utilisateur=request.user
                    ).first() # Ordonné par -timestamp par défaut dans Meta
                    
                    should_save = True
                    
                    if last_location:
                        # Comparer avec la localisation actuelle
                        # On considère que c'est la même si ville et pays sont identiques
                        # Ou si les coordonnées sont très proches (optionnel)
                        if (last_location.city == city and 
                            last_location.country == country and
                            last_location.ip_address == client_ip):
                            should_save = False
                    
                    if should_save:
                        UserLocation.objects.create(
                            utilisateur=request.user,
                            ip_address=client_ip,
                            latitude=lat,
                            longitude=lng,
                            city=city,
                            country=country
                        )
        except Exception as e:
            # Ne pas bloquer la requête si le tracking échoue
            print(f"Erreur tracking localisation: {e}")
