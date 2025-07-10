from rest_framework import serializers
from .models import UploadJob

class UploadJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadJob
        fields = ['id', 'file', 'status', 'result_file', 'created_at']