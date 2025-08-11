from rest_framework import generics, permissions, authentication, parsers
from django.db.models import Q
from .models import RentalProduct
from .serializers import RentalProductSerializer

# custom permission
class IsSellerOrReadOnly(permissions.BasePermission):
    """
    - SAFE_METHODS are allowed for authenticated users (list/detail).
    - For write (POST/PUT/PATCH/DELETE) only allow if user.is_authenticated and user.is_customer == False.
    """
    def has_permission(self, request, view):
        # read for authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # write: only allow non-customer users (sellers)
        return request.user and request.user.is_authenticated and getattr(request.user, 'is_customer', True) is False


class RentalProductListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = RentalProductSerializer
    authentication_classes = [authentication.SessionAuthentication, authentication.BasicAuthentication]
    permission_classes = [IsSellerOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        user = self.request.user
        base = RentalProduct.objects.filter(is_active=True)

        # If seller: show approved products plus their own products (so they can see pending/unapproved)
        if user and user.is_authenticated and not getattr(user, 'is_customer', True):
            return base.filter(Q(is_approved=True) | Q(owner=user))

        # If customer (authenticated), show only approved + active
        return base.filter(is_approved=True)

    def perform_create(self, serializer):
        # owner set automatically to request.user (validate() already ensured seller)
        serializer.save(owner=self.request.user)
