# predictor/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Patient, Prediction, Report
from .serializers import PatientSerializer, PredictionSerializer, ReportSerializer
from .utils import get_prediction_from_csv, predict_heart_disease, get_closest_prediction_from_csv
import json
from django.http import JsonResponse
import pandas as pd
import os
from django.conf import settings
from rest_framework.decorators import api_view
from . import report_utils

@csrf_exempt
def predict_view(request):
    print("=== PREDICT VIEW CALLED ===")
    if request.method == 'POST':
        data = json.loads(request.body)
        patient, _ = Patient.objects.get_or_create(
            name=data['name'],
            age=data['age'],
            sex=data['sex'],
        )
        features = data['features']
        # Use CSV for prediction
        result, matched = get_prediction_from_csv(features, return_match=True)
        response = {
            'prediction': result,
            'patient_id': patient.id,
            'patient_name': patient.name,
            'csv_match': matched
        }

        if not matched:
            # Use closest match
            closest_result, closest_row, distance = get_closest_prediction_from_csv(features)
            response['prediction'] = closest_result
            response['closest_match'] = closest_row
            response['distance'] = distance
            response['message'] = f'No exact match found. Closest match result: {"Yes" if closest_result else "No"} (distance: {distance:.2f})'

        prediction = Prediction.objects.create(patient=patient, result=response['prediction'])
        response['prediction_id'] = prediction.id

        # --- Detailed report logic ---
        # Map features list to dict for report_utils
        feature_names = ['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal']
        features_dict = dict(zip(feature_names, features))
        # Convert sex, fbs, exang, restecg, cp, slope, ca, thal to int if needed
        for k in ['sex','cp','fbs','restecg','thalach','exang','slope','ca','thal']:
            if k in features_dict:
                try:
                    features_dict[k] = int(features_dict[k])
                except Exception:
                    pass
        risk_analysis = report_utils.analyze_risk_factors(features_dict)
        risk_factors = risk_analysis['risk_factors']
        normal_parameters = risk_analysis['normal_parameters']
        findings = report_utils.generate_findings(risk_factors, response['prediction'])
        findings['normal_parameters'] = normal_parameters
        recommendations = report_utils.generate_recommendations(risk_factors, response['prediction'])
        response['detailed_report'] = {
            'findings': findings,
            'recommendations': recommendations
        }
        # --- End detailed report logic ---

        return JsonResponse(response)
    elif request.method == 'GET':
        return JsonResponse({'message': 'Use POST to submit patient data for prediction. GET is not supported for predictions.'}, status=405)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)

@csrf_exempt
def csv_report_view(request):
    if request.method == 'GET':
        name = request.GET.get('name')
        if not name:
            return JsonResponse({'error': 'Missing name parameter'}, status=400)
        csv_path = os.path.join(settings.BASE_DIR, 'static', 'heart.csv')
        df = pd.read_csv(csv_path)
        # Assuming the CSV has a 'name' column
        matches = df[df['name'].str.lower() == name.lower()]
        if matches.empty:
            return JsonResponse({'error': 'No report found for this name'}, status=404)
        # Convert DataFrame to dict
        report = matches.to_dict(orient='records')
        return JsonResponse({'report': report})
    return JsonResponse({'error': 'Only GET allowed'}, status=405)

@method_decorator(csrf_exempt, name='dispatch')
class PatientReportView(APIView):
    def get(self, request, patient_id):
        predictions = Prediction.objects.filter(patient_id=patient_id)
        return Response(PredictionSerializer(predictions, many=True).data)

@csrf_exempt
def share_report(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        if request.user and hasattr(request.user, 'id') and request.user.is_authenticated:
            data['shared_by'] = request.user.id
        from .serializers import ReportSerializer
        serializer = ReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'status': 'Report shared successfully'})
        return JsonResponse(serializer.errors, status=400)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)

@api_view(['GET'])
def doctor_reports(request):
    reports = Report.objects.all().order_by('-created_at')
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)
