from django.urls import path
from .views import PatientSearchView

urlpatterns = [
    path('search/', PatientSearchView.as_view(), name='patient-search'),
] 