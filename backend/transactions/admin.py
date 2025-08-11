from django.contrib import admin
from .models import Transaction, Wishlist


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('product', 'owner', 'renter', 'start_date', 'end_date', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('product__title', 'owner__username', 'renter__username')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('product', 'customer', 'start_date', 'end_date', 'added_at')
    search_fields = ('product__title', 'customer__username')
