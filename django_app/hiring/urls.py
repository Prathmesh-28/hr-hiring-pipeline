from django.urls import path
from . import views

urlpatterns = [
    # Career portal
    path('', views.career_home, name='career_home'),
    path('apply/', views.apply, name='apply'),

    # HR dashboard
    path('hr/login/', views.hr_login, name='hr_login'),
    path('hr/logout/', views.hr_logout, name='hr_logout'),
    path('hr/dashboard/', views.dashboard, name='dashboard'),

    # REST API
    path('api/jobs/', views.api_jobs, name='api_jobs'),
    path('api/candidates/', views.api_candidates, name='api_candidates'),
]
