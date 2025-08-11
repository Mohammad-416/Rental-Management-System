from django.urls import path
from .views import RentalProductListCreateAPIView

urlpatterns = [
    path('products/', RentalProductListCreateAPIView.as_view(), name='rentalproduct-list-create'),
]
