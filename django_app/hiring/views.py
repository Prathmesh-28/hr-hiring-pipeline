from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Job, Candidate, Application, Interview
from .forms import ApplicationForm, InterviewForm


# ── Career Portal ──────────────────────────────────────────────

def career_home(request):
    jobs = Job.objects.filter(is_active=True)
    return render(request, 'careers/home.html', {'jobs': jobs})


def apply(request):
    jobs = Job.objects.filter(is_active=True)

    if request.method == 'POST':
        form = ApplicationForm(request.POST, request.FILES)
        if form.is_valid():
            data = form.cleaned_data
            job = get_object_or_404(Job, pk=data['job_id'])

            candidate, _ = Candidate.objects.get_or_create(
                email=data['email'],
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'phone': data.get('phone', ''),
                    'current_company': data.get('current_company', ''),
                    'current_title': data.get('current_title', ''),
                    'location': data.get('location', ''),
                },
            )

            Application.objects.create(
                candidate=candidate,
                job=job,
                resume=data['resume'],
                answers=data.get('answers', ''),
            )

            return render(request, 'careers/apply.html', {
                'jobs': jobs,
                'success': True,
            })
        else:
            return render(request, 'careers/apply.html', {
                'jobs': jobs,
                'form': form,
                'error': 'Please fix the errors below.',
            })

    return render(request, 'careers/apply.html', {'jobs': jobs, 'form': ApplicationForm()})


# ── HR Dashboard ────────────────────────────────────────────────

def hr_login(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    error = None
    if request.method == 'POST':
        user = authenticate(request, username=request.POST['email'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        error = 'Invalid email or password.'

    return render(request, 'dashboard/login.html', {'error': error})


def hr_logout(request):
    logout(request)
    return redirect('hr_login')


@login_required
def dashboard(request):
    applications = (
        Application.objects
        .select_related('candidate', 'job')
        .prefetch_related('interviews')
        .order_by('-created_at')
    )

    selected_id = request.GET.get('schedule')
    selected = None
    interview_form = InterviewForm()

    if selected_id:
        selected = get_object_or_404(Application, pk=selected_id)

    if request.method == 'POST' and selected_id:
        interview_form = InterviewForm(request.POST)
        if interview_form.is_valid():
            interview = interview_form.save(commit=False)
            interview.application = get_object_or_404(Application, pk=selected_id)
            interview.save()
            interview.application.stage = 'INTERVIEW'
            interview.application.save()
            messages.success(request, f'Interview scheduled for {interview.application.candidate.full_name}.')
            return redirect('dashboard')

    stage_colors = {
        'APPLIED': '#2563eb',
        'SCREENING': '#7c3aed',
        'INTERVIEW': '#d97706',
        'OFFER': '#059669',
        'HIRED': '#16a34a',
        'REJECTED': '#dc2626',
    }

    return render(request, 'dashboard/pipeline.html', {
        'applications': applications,
        'selected': selected,
        'interview_form': interview_form,
        'stage_colors': stage_colors,
    })


# ── REST API ────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def api_jobs(request):
    jobs = Job.objects.filter(is_active=True).values('id', 'title', 'location')
    return Response(list(jobs))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_candidates(request):
    apps = Application.objects.select_related('candidate', 'job').all()
    data = [
        {
            'id': str(a.id),
            'stage': a.stage,
            'score': a.score,
            'candidate': {
                'firstName': a.candidate.first_name,
                'lastName': a.candidate.last_name,
                'email': a.candidate.email,
                'location': a.candidate.location,
            },
            'job': a.job.title,
        }
        for a in apps
    ]
    return Response(data)
