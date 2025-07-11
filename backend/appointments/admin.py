from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 
        'email', 
        'appointment_date', 
        'appointment_time', 
        'status', 
        'created_at'
    ]
    list_filter = ['status', 'appointment_date', 'gender', 'created_at']
    search_fields = ['full_name', 'email', 'phone_number', 'emergency_contact']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone_number', 'date_of_birth', 'gender')
        }),
        ('Address', {
            'fields': ('address',)
        }),
        ('Appointment Details', {
            'fields': ('appointment_date', 'appointment_time', 'reason')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact', 'emergency_phone')
        }),
        ('Medical Information', {
            'fields': ('medical_history', 'current_medications', 'allergies'),
            'classes': ('collapse',)
        }),
        ('Insurance Information', {
            'fields': ('insurance_provider', 'insurance_number'),
            'classes': ('collapse',)
        }),
        ('Status & Metadata', {
            'fields': ('status', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Add custom property to queryset"""
        qs = super().get_queryset(request)
        return qs
    
    def is_past_due_display(self, obj):
        """Display if appointment is past due"""
        return obj.is_past_due
    is_past_due_display.boolean = True
    is_past_due_display.short_description = 'Past Due'
