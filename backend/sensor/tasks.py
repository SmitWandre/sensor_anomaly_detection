import pandas as pd
from celery import shared_task
from sklearn.cluster import KMeans
from django.core.files.base import ContentFile
from .models import UploadJob

@shared_task
def process_upload(job_id):
    """
    1) Read the uploaded CSV
    2) Resample hourly and forward-fill
    3) Build a DataFrame of raw hourly features
    4) Run KMeans (2 clusters) if >=2 samples, else assign cluster 0
    5) Reset index into a real timestamp column and save CSV without extra index
    6) Mark job as completed
    """
    job = UploadJob.objects.get(id=job_id)

    df = (
        pd.read_csv(job.file.path, parse_dates=['timestamp'])
          .sort_values('timestamp')
          .set_index('timestamp')
          .resample('h')
          .mean()
          .ffill()
    )

    feats = pd.DataFrame({
        'temp_mean': df['temperature'],
        'hum_mean':  df['humidity'],
    })

    if len(feats) < 2:
        feats['cluster'] = 0
    else:
        km = KMeans(n_clusters=2, random_state=0)
        feats['cluster'] = km.fit_predict(feats)

    feats = feats.reset_index()
    csv_bytes = feats.to_csv(index=False).encode('utf-8')

    job.result_file.save('results.csv', ContentFile(csv_bytes))

    job.status = 'completed'
    job.save()
