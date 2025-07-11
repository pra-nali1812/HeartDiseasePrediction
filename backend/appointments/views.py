from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentListSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def create_appointment(request):
    """
    Create a new appointment
    """
    try:
        # Convert appointment_time from string to time object
        data = request.data.copy()
        if 'appointment_time' in data and isinstance(data['appointment_time'], str):
            try:
                # Parse time string (e.g., "14:00" to time object)
                time_str = data['appointment_time']
                time_obj = datetime.strptime(time_str, '%H:%M').time()
                data['appointment_time'] = time_obj
            except ValueError:
                return Response(
                    {'error': 'Invalid time format. Use HH:MM format (e.g., 14:00)'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response({
                'message': 'Appointment created successfully!',
                'appointment_id': appointment.id,
                'appointment': AppointmentSerializer(appointment).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Invalid data provided',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': 'Failed to create appointment',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_appointments(request):
    """
    List all appointments (for admin purposes)
    """
    try:
        appointments = Appointment.objects.all()
        serializer = AppointmentListSerializer(appointments, many=True)
        return Response({
            'appointments': serializer.data,
            'count': appointments.count()
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Failed to retrieve appointments',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_appointment(request, appointment_id):
    """
    Get a specific appointment by ID
    """
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Appointment.DoesNotExist:
        return Response({
            'error': 'Appointment not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': 'Failed to retrieve appointment',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_appointment_status(request, appointment_id):
    """
    Update appointment status (for admin purposes)
    """
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
            return Response({
                'error': 'Invalid status. Must be one of: pending, confirmed, cancelled, completed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = new_status
        appointment.save()
        
        return Response({
            'message': f'Appointment status updated to {new_status}',
            'appointment': AppointmentSerializer(appointment).data
        }, status=status.HTTP_200_OK)
    
    except Appointment.DoesNotExist:
        return Response({
            'error': 'Appointment not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': 'Failed to update appointment',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
