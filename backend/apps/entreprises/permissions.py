from rest_framework import permissions


class IsVendeurOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée : seul le vendeur peut modifier/supprimer son entreprise
    """
    
    def has_object_permission(self, request, view, obj):
        # Les requêtes en lecture sont autorisées pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Les requêtes en écriture sont autorisées seulement pour le vendeur
        return obj.vendeur == request.user


class IsVendeur(permissions.BasePermission):
    """
    Permission pour les vendeurs seulement
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'vendeur'
