from django.contrib import admin
from .models import RentalProduct
from django.utils.html import format_html

@admin.register(RentalProduct)
class RentalProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'is_approved', 'is_rejected', 'is_active', 'created_at', 'thumbnail')
    list_filter = ('is_approved', 'is_rejected', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'owner__username', 'owner__email')
    actions = ['approve_selected', 'reject_selected']
    readonly_fields = ('thumbnail',)

    def thumbnail(self, obj):
        if obj.main_image:
            return format_html('<img src="{}" style="height:80px;"/>', obj.main_image.url)
        return "-"
    thumbnail.short_description = "Image"

    def approve_selected(self, request, queryset):
        updated = queryset.update(is_approved=True, is_rejected=False, rejection_reason='')
        self.message_user(request, f"{updated} product(s) approved.")
    approve_selected.short_description = "Approve selected products"

    def reject_selected(self, request, queryset):
        updated = queryset.update(is_approved=False, is_rejected=True)
        self.message_user(request, f"{updated} product(s) marked as rejected.")
    reject_selected.short_description = "Reject selected products"
