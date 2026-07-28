from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, SavedEntreprise, Alert


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'phone', 'address', 'city', 'region',
            'profile_picture', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'username', 'email', 'user_type', 'is_verified', 'created_at']
    
    def update(self, instance, validated_data):
        """
        Mise à jour du profil utilisateur
        """
        # Mettre à jour tous les champs modifiables
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.city = validated_data.get('city', instance.city)
        instance.region = validated_data.get('region', instance.region)
        
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data.get('profile_picture')
        
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'user_type', 'phone'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class SavedEntrepriseSerializer(serializers.ModelSerializer):
    entreprise_detail = serializers.SerializerMethodField(read_only=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Import here to avoid circular import
        from apps.entreprises.models import Entreprise
        self.fields['entreprise'].queryset = Entreprise.objects.all()
    
    class Meta:
        model = SavedEntreprise
        fields = ['id', 'user', 'entreprise', 'entreprise_detail', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'entreprise_detail']
    
    def get_entreprise_detail(self, obj):
        from apps.entreprises.serializers import EntrepriseListSerializer
        return EntrepriseListSerializer(obj.entreprise).data
    
    def to_representation(self, instance):
        """
        Override to return entreprise details instead of just ID
        """
        representation = super().to_representation(instance)
        representation['entreprise'] = self.get_entreprise_detail(instance)
        return representation


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'id', 'user', 'name', 'region',
            'min_price', 'max_price', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
