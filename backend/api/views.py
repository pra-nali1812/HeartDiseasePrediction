from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from predictor.models import Patient
from predictor.serializers import PatientSerializer

# Create your views here.

class PatientSearchView(APIView):
    def get(self, request):
        name = request.query_params.get('name', '')
        patients = Patient.objects.filter(name__icontains=name)
        return Response(PatientSerializer(patients, many=True).data)
