from django.db import models

class UploadJob(models.Model):
    file = models.FileField(upload_to='uploads/')
    status = models.CharField(max_length=20, default='pending')
    result_file = models.FileField(upload_to='results/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Job {self.id} - {self.status}"