from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id',
            'full_name',
            'email',
            'phone_number',
            'date_of_birth',
            'gender',
            'address',
            'appointment_date',
            'appointment_time',
            'reason',
            'emergency_contact',
            'emergency_phone',
            'medical_history',
            'current_medications',
            'allergies',
            'insurance_provider',
            'insurance_number',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def validate_appointment_date(self, value):
        """Validate that appointment date is not in the past"""
        from django.utils import timezone
        today = timezone.now().date()
        if value < today:
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value
    
    def validate_phone_number(self, value):
        """Basic phone number validation"""
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        # Remove all non-digit characters for validation
        digits_only = ''.join(filter(str.isdigit, value))
        if len(digits_only) < 10:
            raise serializers.ValidationError("Phone number must have at least 10 digits.")
        return value
    
    def validate_emergency_phone(self, value):
        """Basic emergency phone number validation"""
        if not value:
            raise serializers.ValidationError("Emergency phone number is required.")
        # Remove all non-digit characters for validation
        digits_only = ''.join(filter(str.isdigit, value))
        if len(digits_only) < 10:
            raise serializers.ValidationError("Emergency phone number must have at least 10 digits.")
        return value

class AppointmentListSerializer(serializers.ModelSerializer):
    """Serializer for listing appointments (with limited fields)"""
    class Meta:
        model = Appointment
        fields = [
            'id',
            'full_name',
            'email',
            'appointment_date',
            'appointment_time',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at'] 