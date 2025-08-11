from rest_framework import serializers
from .models import Transaction, Wishlist


class TransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title', read_only=True)
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    renter_name = serializers.CharField(source='renter.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'product', 'product_name', 'owner', 'owner_name',
            'renter', 'renter_name', 'start_date', 'end_date',
            'status', 'status_display', 'created_at'
        ]
        read_only_fields = ['product_name', 'owner_name', 'renter_name', 'status_display', 'created_at']


class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'customer', 'product', 'product_name', 'start_date', 'end_date', 'added_at']
        read_only_fields = ['product_name', 'added_at', 'customer']
