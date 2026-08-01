"""
Service d'envoi d'emails
Utilise Celery pour envoi asynchrone
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


class EmailService:
    """Service pour envoyer différents types d'emails"""
    
    @staticmethod
    def send_welcome_email(user):
        """
        Email de bienvenue à l'inscription
        
        Args:
            user: User instance
        """
        subject = '🎉 Bienvenue sur Entreprises TN!'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1e40af;">Bienvenue {user.first_name or user.username}!</h2>
                    
                    <p>Merci de vous être inscrit sur <strong>Entreprises TN</strong>, la première plateforme tunisienne dédiée à l'achat et la vente d'entreprises.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Prochaines étapes :</h3>
                        <ul>
                            <li>Complétez votre profil</li>
                            <li>Explorez les entreprises disponibles</li>
                            <li>Configurez vos alertes de recherche</li>
                            <li>Contactez les vendeurs</li>
                        </ul>
                    </div>
                    
                    <p>Notre équipe est là pour vous accompagner dans votre projet.</p>
                    
                    <p style="margin-top: 30px;">
                        Cordialement,<br>
                        <strong>L'équipe Entreprises TN</strong>
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280;">
                        Des questions? Contactez-nous à {settings.DEFAULT_FROM_EMAIL}
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_entreprise_published_email(user, entreprise):
        """
        Email quand une entreprise est validée et publiée
        
        Args:
            user: User (vendeur)
            entreprise: Entreprise instance
        """
        subject = f'✅ Votre entreprise "{entreprise.nom}" a été publiée!'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #10b981;">Bonne nouvelle!</h2>
                    
                    <p>Votre entreprise <strong>{entreprise.nom}</strong> a été validée par notre équipe et est maintenant publiée sur la plateforme.</p>
                    
                    <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
                        <h3 style="margin-top: 0; color: #10b981;">Entreprise publiée</h3>
                        <p><strong>Nom:</strong> {entreprise.nom}</p>
                        <p><strong>Secteur:</strong> {entreprise.get_secteur_display()}</p>
                        <p><strong>Région:</strong> {entreprise.get_region_display()}</p>
                        <p><strong>Prix:</strong> {entreprise.prix_demande} TND</p>
                    </div>
                    
                    <p>Les acheteurs peuvent maintenant voir votre annonce et vous contacter.</p>
                    
                    <p><a href="{settings.CORS_ALLOWED_ORIGINS[0]}/entreprises/{entreprise.slug}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Voir mon annonce</a></p>
                    
                    <p style="margin-top: 30px;">
                        Cordialement,<br>
                        <strong>L'équipe Entreprises TN</strong>
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_entreprise_rejected_email(user, entreprise, raison):
        """
        Email quand une entreprise est refusée
        
        Args:
            user: User (vendeur)
            entreprise: Entreprise instance
            raison: Raison du refus
        """
        subject = f'❌ Votre entreprise "{entreprise.nom}" nécessite des modifications'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #ef4444;">Modifications nécessaires</h2>
                    
                    <p>Votre entreprise <strong>{entreprise.nom}</strong> nécessite quelques modifications avant publication.</p>
                    
                    <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ef4444;">
                        <h3 style="margin-top: 0; color: #ef4444;">Raison:</h3>
                        <p>{raison}</p>
                    </div>
                    
                    <p>Veuillez modifier votre annonce et la soumettre à nouveau.</p>
                    
                    <p><a href="{settings.CORS_ALLOWED_ORIGINS[0]}/modifier/{entreprise.slug}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Modifier mon annonce</a></p>
                    
                    <p style="margin-top: 30px;">
                        Cordialement,<br>
                        <strong>L'équipe Entreprises TN</strong>
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_new_message_email(user, conversation, sender):
        """
        Email quand un nouveau message est reçu
        
        Args:
            user: User (destinataire)
            conversation: Conversation instance
            sender: User (expéditeur)
        """
        subject = f'💬 Nouveau message de {sender.get_full_name() or sender.username}'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1e40af;">Nouveau message</h2>
                    
                    <p>Vous avez reçu un nouveau message de <strong>{sender.get_full_name() or sender.username}</strong>.</p>
                    
                    <p><a href="{settings.CORS_ALLOWED_ORIGINS[0]}/messages/{conversation.id}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Lire le message</a></p>
                    
                    <p style="margin-top: 30px;">
                        Cordialement,<br>
                        <strong>L'équipe Entreprises TN</strong>
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_alerte_notification_email(user, entreprises, alerte):
        """
        Email pour notifier des nouvelles entreprises correspondant à une alerte
        
        Args:
            user: User (acheteur)
            entreprises: Liste d'Entreprise instances
            alerte: AlerteRecherche instance
        """
        count = len(entreprises)
        subject = f'🔔 {count} nouvelle(s) entreprise(s) correspond(ent) à votre alerte'
        
        entreprises_html = ''
        for ent in entreprises[:5]:  # Max 5 dans l'email
            entreprises_html += f"""
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <h4 style="margin: 0 0 10px 0;">{ent.nom}</h4>
                <p style="margin: 5px 0;"><strong>Secteur:</strong> {ent.get_secteur_display()}</p>
                <p style="margin: 5px 0;"><strong>Région:</strong> {ent.get_region_display()}</p>
                <p style="margin: 5px 0;"><strong>Prix:</strong> {ent.prix_demande} TND</p>
                <a href="{settings.CORS_ALLOWED_ORIGINS[0]}/entreprises/{ent.slug}" style="color: #1e40af;">Voir les détails →</a>
            </div>
            """
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1e40af;">Nouvelles entreprises!</h2>
                    
                    <p><strong>{count} nouvelle(s) entreprise(s)</strong> correspond(ent) aux critères de votre alerte <strong>"{alerte.nom_alerte}"</strong>.</p>
                    
                    {entreprises_html}
                    
                    <p><a href="{settings.CORS_ALLOWED_ORIGINS[0]}/entreprises" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Voir toutes les entreprises</a></p>
                    
                    <p style="margin-top: 30px;">
                        Cordialement,<br>
                        <strong>L'équipe Entreprises TN</strong>
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280;">
                        <a href="{settings.CORS_ALLOWED_ORIGINS[0]}/alertes" style="color: #6b7280;">Gérer mes alertes</a>
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_verification_email(user, uid, token):
        """
        Email de vérification d'inscription
        
        Args:
            user: User instance
            uid: UID encodé
            token: Token de vérification
        """
        verification_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/verify-email/{uid}/{token}"
        subject = '✉️ Vérifiez votre adresse email'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1e40af;">Bienvenue sur Entreprises TN!</h2>
                    
                    <p>Bonjour {user.first_name or user.username},</p>
                    
                    <p>Merci de vous être inscrit sur notre plateforme. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_url}" style="display: inline-block; background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            ✉️ Vérifier mon email
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                        <a href="{verification_url}" style="color: #1e40af; word-break: break-all;">{verification_url}</a>
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        Ce lien est valide pendant 24 heures.
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280;">
                        Si vous n'avez pas créé de compte, ignorez cet email.
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_password_reset_email(user, uid, token):
        """
        Email de réinitialisation de mot de passe
        
        Args:
            user: User instance
            uid: UID encodé
            token: Token de réinitialisation
        """
        reset_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/reset-password/{uid}/{token}"
        subject = '🔐 Réinitialisation de votre mot de passe'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #ef4444;">Réinitialisation de mot de passe</h2>
                    
                    <p>Bonjour {user.first_name or user.username},</p>
                    
                    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" style="display: inline-block; background-color: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            🔐 Réinitialiser mon mot de passe
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                        <a href="{reset_url}" style="color: #ef4444; word-break: break-all;">{reset_url}</a>
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        Ce lien est valide pendant 1 heure.
                    </p>
                    
                    <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ef4444;">
                        <p style="margin: 0; color: #991b1b; font-weight: bold;">⚠️ Sécurité</p>
                        <p style="margin: 5px 0 0 0; color: #991b1b;">
                            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.
                        </p>
                    </div>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280;">
                        Pour toute question, contactez-nous à {settings.DEFAULT_FROM_EMAIL}
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True,
        )
    
    @staticmethod
    def send_contact_confirmation_email(contact_message):
        """
        Email de confirmation après envoi du formulaire de contact
        
        Args:
            contact_message: ContactMessage instance
        """
        subject = '✅ Nous avons bien reçu votre message'
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #10b981;">Message reçu!</h2>
                    
                    <p>Bonjour {contact_message.nom},</p>
                    
                    <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais (généralement sous 24-48h).</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Récapitulatif de votre message:</h3>
                        <p><strong>Sujet:</strong> {contact_message.get_sujet_display() if contact_message.sujet else 'Non spécifié'}</p>
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">{contact_message.message}</p>
                    </div>
                    
                    <p>En attendant, n'hésitez pas à explorer notre plateforme et consulter notre <a href="{settings.CORS_ALLOWED_ORIGINS[0]}/faq" style="color: #1e40af;">FAQ</a>.</p>
                    
                    <p style="margin-top: 30px;">
                        Cordialement,<br>
                        <strong>L'équipe Entreprises TN</strong>
                    </p>
                </div>
            </body>
        </html>
        """
        
        plain_message = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[contact_message.email],
            html_message=html_content,
            fail_silently=True,
        )
