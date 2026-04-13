from pathlib import Path
import os
from decouple import config

# from dotenv import load_dotenv

# # =========================
# # LOAD ENV VARIABLES
# # =========================
# load_dotenv()

# # =========================
# # BASE PATHS
# # =========================
# BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

# DATA_DIR = os.path.join(BASE_DIR, "data_sets")
# LOG_DIR = os.path.join(BASE_DIR, "logs")

# # Database URL
# DATABASE_URL = os.getenv("DATABASE_URL")

# # =========================
# # DATA PATHS
# # =========================
# TRAIN_DATA_PATH = os.getenv(
#     "TRAIN_DATA_PATH",
#     os.path.join(DATA_DIR, "UNSW_NB15_training-set.csv")
# )

# TEST_DATA_PATH = os.getenv(
#     "TEST_DATA_PATH",
#     os.path.join(DATA_DIR, "UNSW_NB15_testing-set.csv")
# )

# # =========================
# # MODEL ARTIFACTS
# # =========================
# MODEL_DIR = os.path.join(BASE_DIR, "app/models/artifacts")

# MODEL_PATH = os.getenv(
#     "MODEL_PATH",
#     os.path.join(MODEL_DIR, "isolation_forest.pkl")
# )

# SCALER_PATH = os.getenv(
#     "SCALER_PATH",
#     os.path.join(MODEL_DIR, "scaler.pkl")
# )

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.postgres',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Installed Apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework.authtoken',
    "django_filters",
    'corsheaders',
    # Created Apps
    "core.apps.CoreConfig",
    "accounts.apps.AccountsConfig",
    "advisory.apps.AdvisoryConfig",
    "ML",
    "feeding.apps.FeedingConfig",
    "farm.apps.FarmConfig",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}

# ensure secure cookies in prod
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', cast=bool)
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', cast=bool)
CSRF_COOKIE_SAMESITE = 'Lax'  # or 'Strict' if that fits UX
SESSION_COOKIE_SAMESITE = 'Lax'

# Optional: configure JWT lifespan
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  
    'ROTATE_REFRESH_TOKENS': True,                    
    'BLACKLIST_AFTER_ROTATION': True,           
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # CORS headers middleware
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', cast=bool)
# Allow credentials
CORS_ALLOW_CREDENTIALS = config('CORS_ALLOW_CREDENTIALS', cast=bool)

ROOT_URLCONF = 'config.urls'
AUTH_USER_MODEL = 'accounts.User'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases


SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS').split(',')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}

# Password validation
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

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = "Africa/Nairobi"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
