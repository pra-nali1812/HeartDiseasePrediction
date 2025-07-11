from rest_framework import serializers
from .models import Patient, Prediction, Report

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PredictionSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Prediction
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    shared_by_username = serializers.SerializerMethodField()
    class Meta:
        model = Report
        fields = '__all__'
    def get_shared_by_username(self, obj):
        return obj.shared_by.username if obj.shared_by else None 