# transactions/views.py
from rest_framework import generics
from .models import Transaction, Wishlist
from .serializers import TransactionSerializer, WishlistSerializer
from rest_framework.permissions import IsAuthenticated


# ------------------- Transactions -------------------
class CustomerTransactionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(renter=self.request.user)

    def perform_create(self, serializer):
        serializer.save(renter=self.request.user)


class SellerTransactionListAPIView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(owner=self.request.user)


# ------------------- Wishlists -------------------
class WishlistListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class WishlistDeleteAPIView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(customer=self.request.user)
