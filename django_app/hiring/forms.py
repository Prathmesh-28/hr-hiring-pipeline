from django import forms
from .models import Application, Candidate, Interview


class ApplicationForm(forms.Form):
    first_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Email'}))
    phone = forms.CharField(max_length=30, required=False, widget=forms.TextInput(attrs={'placeholder': 'Phone (optional)'}))
    job_id = forms.UUIDField(widget=forms.Select())
    current_company = forms.CharField(max_length=200, required=False, widget=forms.TextInput(attrs={'placeholder': 'Current Company (optional)'}))
    current_title = forms.CharField(max_length=200, required=False, widget=forms.TextInput(attrs={'placeholder': 'Current Title (optional)'}))
    location = forms.CharField(max_length=200, required=False, widget=forms.TextInput(attrs={'placeholder': 'Location (optional)'}))
    resume = forms.FileField(widget=forms.FileInput(attrs={'accept': '.pdf,.doc,.docx'}))
    answers = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 5, 'placeholder': 'Tell us about your experience, availability, or why you are a great fit.'}),
    )


class InterviewForm(forms.ModelForm):
    start_time = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        input_formats=['%Y-%m-%dT%H:%M'],
    )

    class Meta:
        model = Interview
        fields = ['topic', 'start_time', 'duration_minutes']
        widgets = {
            'topic': forms.TextInput(attrs={'placeholder': 'Interview topic'}),
            'duration_minutes': forms.NumberInput(attrs={'min': 15}),
        }
