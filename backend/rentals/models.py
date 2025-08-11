from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField
from django.utils import timezone


class RentalProduct(models.Model):
    RENTAL_UNITS = [
        ('hour', 'Per Hour'),
        ('day', 'Per Day'),
        ('week', 'Per Week'),
        ('month', 'Per Month'),
        ('year', 'Per Year'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='rental_products'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Main + optional additional images (Cloudinary)
    main_image = CloudinaryField('main_image', blank=True, null=True)
    image_2 = CloudinaryField('image_2', blank=True, null=True)
    image_3 = CloudinaryField('image_3', blank=True, null=True)

    # Prices for different durations (nullable; seller can set whichever applies)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_week = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_year = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    price_unit = models.CharField(max_length=10, choices=RENTAL_UNITS, default='day')

    # Location & pickup
    pickup_address = models.TextField(blank=True, null=True)
    pickup_date = models.DateTimeField(blank=True, null=True)

    # Listing lifecycle and admin moderation
    is_approved = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    rejection_reason = models.TextField(blank=True, null=True)

    expiration_date = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def mark_expired_if_needed(self):
        if self.expiration_date and self.expiration_date < timezone.now():
            self.is_active = False
            self.save(update_fields=['is_active'])

    def __str__(self):
        return f"{self.title} — {self.owner.username}"

    class Meta:
        ordering = ('-created_at',)
