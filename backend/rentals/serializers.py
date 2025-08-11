from rest_framework import serializers
from .models import RentalProduct


class RentalProductSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    main_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = RentalProduct
        fields = [
            'id', 'owner', 'title', 'description',
            'main_image', 'image_2', 'image_3',
            'price_per_hour', 'price_per_day', 'price_per_week',
            'price_per_month', 'price_per_year', 'price_unit',
            'pickup_address', 'pickup_date',
            'expiration_date',
            'is_approved', 'is_rejected', 'rejection_reason',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['is_approved', 'is_rejected', 'rejection_reason', 'is_active', 'owner', 'created_at', 'updated_at']

    def validate(self, data):
        # Creation or update: ensure sellers only create (view-level permission also enforces)
        request = self.context.get('request')
        if request and request.method in ('POST',):
            user = request.user
            if not user or getattr(user, 'is_customer', True):
                raise serializers.ValidationError("Only sellers (is_customer=False) may create rental products.")
        return data
