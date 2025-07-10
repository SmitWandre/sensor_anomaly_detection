from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import UploadJob
from .serializers import UploadJobSerializer
from .tasks import process_upload

class UploadJobViewSet(viewsets.ModelViewSet):
    queryset = UploadJob.objects.all().order_by('-created_at')
    serializer_class = UploadJobSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save()
        process_upload.delay(job.id)
        return Response(self.get_serializer(job).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        job = self.get_object()
        if job.status != 'completed':
            return Response({'status': job.status})
        return Response({'result_file': job.result_file.url})