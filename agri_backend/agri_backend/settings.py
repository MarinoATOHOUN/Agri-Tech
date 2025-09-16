# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
"""
Configuration Django pour le projet agri_backend.

Généré par 'django-admin startproject' en utilisant Django 5.2.6.

Pour plus d'informations sur ce fichier, voir :
https://docs.djangoproject.com/en/5.2/topics/settings/

Pour la liste complète des paramètres et leurs valeurs, voir :
https://docs.djangoproject.com/en/5.2/ref/settings/
"""

from pathlib import Path
from decouple import config

# Répertoire de base du projet
BASE_DIR = Path(__file__).resolve().parent.parent

# Paramètres de sécurité
# ATTENTION : Gardez la clé secrète utilisée en production secrète !
SECRET_KEY = config('SECRET_KEY', default='django-insecure--hdp5_%o4n78eu$ojs1_6$(1&aaf5(2#*qk3nux@t73i5%(gvv')

# ATTENTION : Ne laissez pas DEBUG activé en production !
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Définition des applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # Django REST Framework
    'rest_framework.authtoken', # Pour l'authentification par token
    'corsheaders',     # CORS headers pour permettre les requêtes depuis le frontend
    'agri_app',        # Notre application principale
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS doit être en premier
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'agri_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'agri_backend.wsgi.application'

# Configuration de la base de données
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Validation des mots de passe
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Configuration de Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

# Configuration CORS pour permettre les requêtes depuis le frontend React
# Le frontend Vite tourne sur le port 5173 par défaut.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # URL par défaut de React
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True

# Internationalisation
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = 'fr-fr'

TIME_ZONE = 'Africa/Porto-Novo'  # Fuseau horaire pour l'Afrique de l'Ouest

USE_I18N = True

USE_TZ = True

# Fichiers statiques (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Fichiers média (uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Type de champ de clé primaire par défaut
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuration pour l'authentification personnalisée
AUTH_USER_MODEL = 'agri_app.Utilisateur'
