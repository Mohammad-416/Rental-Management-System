# authapp/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'phone', 'address', 'profile_pic', 'is_superuser']
        read_only_fields = ['id', 'is_superuser']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'name', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            name=validated_data.get('name') or ''
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UpdateProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['name', 'phone', 'address', 'profile_pic']
