#!/bin/sh

# Wait for MinIO to be ready
sleep 5

# Configure MinIO client
mc alias set myminio http://minio:9000 ${MINIO_ACCESS_KEY:-superadmin} ${MINIO_SECRET_KEY:-superadmin}

# Create bucket if it doesn't exist
mc mb myminio/${MINIO_BUCKET:-medicontrol} --ignore-existing

# Set public read-only policy for the entire bucket
mc anonymous set download myminio/${MINIO_BUCKET:-medicontrol}

echo "MinIO bucket '${MINIO_BUCKET:-medicontrol}' initialized successfully with public download policy"
