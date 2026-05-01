from django.contrib import admin
from .models import Job, Candidate, Application, Interview


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'location']


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'location', 'created_at']
    search_fields = ['first_name', 'last_name', 'email']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'job', 'stage', 'score', 'created_at']
    list_filter = ['stage']
    search_fields = ['candidate__email', 'candidate__first_name', 'candidate__last_name']
    list_editable = ['stage', 'score']


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['topic', 'application', 'start_time', 'duration_minutes']
    list_filter = ['start_time']
