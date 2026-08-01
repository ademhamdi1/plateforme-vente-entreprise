from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from django.utils import timezone


class FactureService:
    """
    Service de génération de factures PDF pour les abonnements
    """
    
    @staticmethod
    def generer_facture_pdf(historique_paiement):
        """
        Génère une facture PDF pour un paiement d'abonnement
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Styles personnalisés
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        header_style = ParagraphStyle(
            'CustomHeader',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=10
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#555555')
        )
        
        # Titre
        story.append(Paragraph("FACTURE", title_style))
        story.append(Spacer(1, 0.5*cm))
        
        # Informations entreprise
        story.append(Paragraph("<b>BusinessBuy</b>", header_style))
        story.append(Paragraph("Plateforme de vente et d'achat d'entreprises", normal_style))
        story.append(Paragraph("Tunis, Tunisie", normal_style))
        story.append(Paragraph("contact@businessbuy.tn", normal_style))
        story.append(Spacer(1, 1*cm))
        
        # Informations client
        user = historique_paiement.abonnement.user
        story.append(Paragraph("<b>Facturé à:</b>", header_style))
        story.append(Paragraph(f"{user.first_name} {user.last_name}", normal_style))
        story.append(Paragraph(user.email, normal_style))
        story.append(Spacer(1, 1*cm))
        
        # Détails de la facture
        facture_data = [
            ['Numéro de facture', f"FACT-{historique_paiement.id:06d}"],
            ['Date', historique_paiement.date_paiement.strftime('%d/%m/%Y')],
            ['Statut', 'Payé' if historique_paiement.statut == 'complete' else 'En attente'],
        ]
        
        facture_table = Table(facture_data, colWidths=[8*cm, 8*cm])
        facture_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2c3e50')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bdc3c7'))
        ]))
        
        story.append(facture_table)
        story.append(Spacer(1, 1.5*cm))
        
        # Détails du plan
        abonnement = historique_paiement.abonnement
        plan_nom = dict(abonnement.PLAN_CHOICES).get(abonnement.plan, abonnement.plan)
        
        story.append(Paragraph("<b>Détails de l'abonnement</b>", header_style))
        story.append(Spacer(1, 0.5*cm))
        
        # Tableau des détails
        details_data = [
            ['Description', 'Quantité', 'Prix unitaire', 'Total'],
            [
                f"Abonnement {plan_nom}",
                '1',
                f"{historique_paiement.montant:.2f} TND",
                f"{historique_paiement.montant:.2f} TND"
            ]
        ]
        
        details_table = Table(details_data, colWidths=[8*cm, 3*cm, 3*cm, 3*cm])
        details_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bdc3c7'))
        ]))
        
        story.append(details_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Total
        total_data = [
            ['', '', 'Sous-total:', f"{historique_paiement.montant:.2f} TND"],
            ['', '', 'TVA (19%):', f"{historique_paiement.montant * 0.19:.2f} TND"],
            ['', '', '<b>Total TTC:</b>', f"<b>{historique_paiement.montant * 1.19:.2f} TND</b>"]
        ]
        
        total_table = Table(total_data, colWidths=[8*cm, 3*cm, 3*cm, 3*cm])
        total_table.setStyle(TableStyle([
            ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('LINEABOVE', (2, 2), (-1, 2), 2, colors.HexColor('#2c3e50')),
        ]))
        
        story.append(total_table)
        story.append(Spacer(1, 2*cm))
        
        # Pied de page
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#7f8c8d'),
            alignment=TA_CENTER
        )
        
        story.append(Paragraph("Merci de votre confiance!", footer_style))
        story.append(Spacer(1, 0.3*cm))
        story.append(Paragraph(
            "Cette facture est générée automatiquement et ne nécessite pas de signature.",
            footer_style
        ))
        story.append(Paragraph(
            "Pour toute question, contactez-nous à contact@businessbuy.tn",
            footer_style
        ))
        
        # Générer le PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
