from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from base.models import *
from rest_framework.response import Response
from rest_framework import status

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['tenant', 'user', 'phone_number', 'is_active']


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'isAdmin']

    def get_id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class UserSerializerWithTokenAndCustomer(UserSerializerWithToken):
    customer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'isAdmin', 'token',
            'customer'
        ]

    def get_customer(self, obj):
        try:
            customer = Customer.objects.get(user=obj)
            return CustomerSerializer(customer).data
        except Customer.DoesNotExist:
            return Response({'detail': 'user does not exist'}, status=status.HTTP_400_BAD_REQUEST)