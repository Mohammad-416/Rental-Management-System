FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run migrations and start server
CMD ["sh", "-c", "python init_backend.py && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]