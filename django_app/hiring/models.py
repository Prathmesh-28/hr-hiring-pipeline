import uuid
from django.db import models


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.location}"


class Candidate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    current_company = models.CharField(max_length=200, blank=True)
    current_title = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Application(models.Model):
    STAGE_CHOICES = [
        ('APPLIED', 'Applied'),
        ('SCREENING', 'Screening'),
        ('INTERVIEW', 'Interview'),
        ('OFFER', 'Offer'),
        ('HIRED', 'Hired'),
        ('REJECTED', 'Rejected'),
    ]

    SOURCE_CHOICES = [
        ('Website', 'Website'),
        ('LinkedIn', 'LinkedIn'),
        ('Referral', 'Referral'),
        ('Other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='APPLIED')
    score = models.FloatField(null=True, blank=True)
    resume = models.FileField(upload_to='resumes/')
    answers = models.TextField(blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='Website')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.candidate.full_name} → {self.job.title} ({self.stage})"


class Interview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    topic = models.CharField(max_length=300)
    start_time = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    zoom_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.topic} at {self.start_time:%Y-%m-%d %H:%M}"
