
import os
import django
from django.contrib.auth import get_user_model

# Configurer l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agri_backend.settings')
django.setup()

User = get_user_model()

# Informations du superuser
USERNAME = "Rino"
EMAIL = "mahouliatohoun502@gmail.com"
PASSWORD = "rinogeek" # ATTENTION: Mot de passe visible ici, à changer après usage

def create_superuser():
    if not User.objects.filter(username=USERNAME).exists():
        print(f"Création du superuser {USERNAME}...")
        User.objects.create_superuser(username=USERNAME, email=EMAIL, password=PASSWORD)
        print("Superuser créé avec succès !")
    else:
        print(f"Le superuser {USERNAME} existe déjà.")

if __name__ == "__main__":
    create_superuser()
