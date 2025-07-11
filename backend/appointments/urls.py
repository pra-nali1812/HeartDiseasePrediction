from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_appointment, name='create_appointment'),
    path('list/', views.list_appointments, name='list_appointments'),
    path('<int:appointment_id>/', views.get_appointment, name='get_appointment'),
    path('<int:appointment_id>/status/', views.update_appointment_status, name='update_appointment_status'),
] 