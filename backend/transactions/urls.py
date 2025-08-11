from django.urls import path
from . import views

urlpatterns = [
    path('customer/transactions/', views.CustomerTransactionListCreateAPIView.as_view(), name='customer-transactions'),
    path('seller/transactions/', views.SellerTransactionListAPIView.as_view(), name='seller-transactions'),

    path('wishlist/', views.WishlistListCreateAPIView.as_view(), name='wishlist-list-create'),
    path('wishlist/<int:pk>/', views.WishlistDeleteAPIView.as_view(), name='wishlist-delete'),
]
