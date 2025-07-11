from django.db import models
from django.conf import settings

# Create your models here.

class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    sex = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    # Add other fields as needed

class Prediction(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    result = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

class Report(models.Model):
    patient_name = models.CharField(max_length=100)
    report = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    shared_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.patient_name} - {self.created_at}"
