from django.urls import path
from .views import LoginView, UserListView, GetCSRFTokenView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('csrf/', GetCSRFTokenView.as_view(), name='csrf'),
]