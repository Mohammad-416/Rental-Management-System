from django.urls import path
from .views import ( SuperUserCreateView, 
    CSRFTokenView, RegisterView, LoginView, LogoutView, WhoAmIView,
    UpdateProfileView, CompleteProfileView, DeleteUserView, AdminDeleteUserView
)

urlpatterns = [
    path('create-superuser/', SuperUserCreateView.as_view()),
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('whoami/', WhoAmIView.as_view(), name='whoami'),
    path('profile/', UpdateProfileView.as_view(), name='update-profile'),         # PATCH multipart/form-data
    path('profile/complete/', CompleteProfileView.as_view(), name='complete-profile'),
    path('me/delete/', DeleteUserView.as_view(), name='delete-me'),
    path('admin/delete/<int:user_id>/', AdminDeleteUserView.as_view(), name='admin-delete'),
]
