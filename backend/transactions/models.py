from django.db import models
from django.conf import settings
from rentals.models import RentalProduct
from django.utils import timezone


class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('picked_up', 'Picked Up'),
        ('returned', 'Returned'),
        ('cancelled', 'Cancelled'),
    ]

    product = models.ForeignKey(RentalProduct, on_delete=models.CASCADE, related_name='transactions')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions_as_owner')
    renter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions_as_renter')

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    def mark_as_returned(self):
        self.status = 'returned'
        self.save(update_fields=['status'])

    def __str__(self):
        return f"{self.product.title} rented by {self.renter.username} from {self.owner.username}"


class Wishlist(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlists')
    product = models.ForeignKey(RentalProduct, on_delete=models.CASCADE, related_name='wishlisted_by')
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('customer', 'product')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.customer.username} wishlisted {self.product.title}"
