from django.urls import path
from .views import predict_view, csv_report_view
from . import views

urlpatterns = [
    path('predict/', predict_view, name='predict'),
    path('csv-report/', csv_report_view, name='csv-report'),
    path('share_report/', views.share_report, name='share_report'),
    path('doctor_reports/', views.doctor_reports, name='doctor_reports'),
] 