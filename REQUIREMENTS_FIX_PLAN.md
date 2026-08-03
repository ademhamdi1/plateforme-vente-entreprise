# Requirements Gap Fix Plan

Fix plan for all gaps identified in the requirements comparison audit.
Each phase is self-contained and can be deployed independently.

---

## Phase 1: Fix Advanced Search (CRITICAL)

**Problem:** `EntrepriseListView` has no `filterset_fields` defined. DRF filter
backends are globally enabled but do nothing without this attribute. The frontend
sends `?secteur=...&region=...&prix_min=...` but the backend ignores them — search
likely returns all published enterprises regardless of filters.

Missing filters from requirements: chiffre_affaires, nombre_employes,
annee_creation, type_transaction (plus existing secteur/region/prix that need to be
made functional).

### Backend

**File:** `backend/apps/entreprises/views.py` — `EntrepriseListView`

1. Add `filterset_fields` to the view class:
   ```python
   filterset_fields = {
       'secteur': ['exact'],
       'region': ['exact'],
       'type_transaction': ['exact'],
       'prix_demande': ['gte', 'lte'],
       'chiffre_affaires': ['gte', 'lte'],
       'nombre_employes': ['gte', 'lte'],
       'annee_creation': ['gte', 'lte'],
   }
   ```
2. Add `search_fields` for text search:
   ```python
   search_fields = ['nom', 'description', 'points_forts']
   ```
3. Add `ordering_fields`:
   ```python
   ordering_fields = ['prix_demande', 'created_at', 'nombre_vues', 'annee_creation']
   ```

**Note:** The `get_queryset()` method already filters by `statut='publiee'` and
annotates featured status — `DjangoFilterBackend` will apply on top of this.

### Frontend

**File:** `frontend/src/pages/ListeEntreprises.js`

4. Add new filter inputs alongside existing secteur/region/prix:
   - Chiffre d'affaires min/max (two number inputs)
   - Nombre d'employés min/max (two number inputs)
   - Année de création min (single number input)
   - Type de transaction (dropdown: vente_totale, vente_partielle, recherche_associe, levee_fonds)
5. Wire all filters to the API call params in `loadEntreprises()`.
6. Add a "Réinitialiser les filtres" (reset) button.

**File:** `frontend/src/pages/Home.js`

7. The hero search bar currently passes secteur/region/prix — keep as-is (it
   redirects to ListeEntreprises with query params, which will now work properly).

### Test

- Verify that selecting a secteur actually filters results
- Verify prix_min/prix_max filters work
- Verify new CA/employés/année/transaction filters work
- Verify text search works

---

## Phase 2: Quick Config Fixes (3 independent changes)

### 2A: Premium Plan — Unlimited Ads

**Problem:** Requirements say Premium = "Nombre illimité d'annonces". Current
implementation caps Premium at 10 ads.

**File:** `backend/apps/users/abonnement_models.py`

1. Line 91: Change `abonnement.max_annonces = 10` to `abonnement.max_annonces = 999`
2. Line 35 comment: Update to reflect Premium is also illimité
3. Differentiation from Professionnel remains: badge_verifie, accompagnement
   personnalisé, publicité premium are only on Professionnel.

### 2B: Enable reCAPTCHA

**Problem:** `django-recaptcha` is in requirements and settings configured, but
the app is commented out in `INSTALLED_APPS`.

**File:** `backend/config/settings.py`

1. Line 29: Uncomment `'captcha',`
2. **File:** `backend/apps/users/serializers.py` — Add `CaptchaField` to
   `UserRegistrationSerializer`
3. **File:** `backend/apps/users/views.py` — Registration view already
   rate-limited; reCAPTCHA adds bot protection layer
4. **File:** `frontend/src/pages/Register.js` — Add reCAPTCHA widget (react-google-recaptcha
   package) to registration form
5. **File:** `frontend/src/pages/Contact.js` — Add reCAPTCHA to contact form

**Note:** Use production reCAPTCHA keys (replace test keys in `.env`). Test keys
allow automated testing without solving captcha.

### 2C: Email Verification Enforcement

**Problem:** `User.is_verified` field exists and email verification flow works,
but unverified users can log in and use the platform normally.

**File:** `backend/apps/users/views.py` — `UserLoginView`

1. After authentication, check `user.is_verified`
2. If not verified, return 403 with message: "Veuillez vérifier votre email"
3. Include a "resend verification" link/info in the response

**File:** `frontend/src/pages/Login.js`

4. Handle 403 response — show a banner with a "Renvoyer l'email de vérification"
   button
5. Add a "skip for now" option ONLY if business decides to allow it

**Alternative (softer approach):** Allow login but show a persistent banner in
the TopBar/Dashboard: "Email non vérifié — [Renvoyer]"

**Recommendation:** Use the softer approach (allow login, show banner) to avoid
blocking users who can't access their email immediately.

---

## Phase 3: Messaging File Attachments

**Problem:** Backend `SendMessageView` supports file uploads
(`MultiPartParser`, `Message.fichier` field), but frontend `sendMessage()` only
sends JSON `{ content }` — no way to attach files.

### Frontend

**File:** `frontend/src/services/messagingService.js`

1. Modify `sendMessage()` to accept optional file parameter:
   ```javascript
   async sendMessage(conversationId, content, file = null) {
     if (file) {
       const formData = new FormData();
       formData.append('content', content);
       formData.append('fichier', file);
       const response = await api.post(
         `/entreprises/messages/conversations/${conversationId}/send/`,
         formData,
         { headers: { 'Content-Type': 'multipart/form-data' } }
       );
       return response.data;
     }
     // existing JSON path
     const response = await api.post(
       `/entreprises/messages/conversations/${conversationId}/send/`,
       { content }
     );
     return response.data;
   }
   ```

**File:** `frontend/src/pages/ConversationDetail.js`

2. Add a paperclip/attachment button next to the message input
3. Hidden `<input type="file">` triggered by the button
4. Show file name preview when selected
5. On send with file, call `sendMessage(convId, content, file)`
6. Display attached files in message bubbles (show as download links)
7. Handle file size validation (max 10MB, matching backend limit)

### Backend (verify only)

8. **File:** `backend/apps/entreprises/messaging_views.py` — Confirm
   `SendMessageView` already accepts `fichier` field (it does)
9. **File:** `backend/apps/entreprises/messaging_serializers.py` — Verify
   `MessageSerializer` includes `fichier` URL in response

---

## Phase 4: FAQ System

**Problem:** No FAQ model. `FAQ.js` page is hardcoded static content. Requirements
require admin-manageable FAQ.

### Backend

1. **New file:** `backend/apps/entreprises/faq_models.py`
   ```python
   class FAQ(models.Model):
       question = models.CharField(max_length=300)
       reponse = models.TextField()
       categorie = models.CharField(max_length=50, default='General')
       ordre = models.IntegerField(default=0)
       est_publie = models.BooleanField(default=True)
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       class Meta:
           ordering = ['ordre', 'created_at']
   ```

2. **New file:** `backend/apps/entreprises/faq_serializers.py` — `FAQSerializer`

3. **New file:** `backend/apps/entreprises/faq_views.py` — Two viewsets:
   - `FAQPublicView` — ReadOnly, filters `est_publie=True`, public access
   - `FAQAdminView` — Full CRUD, `IsAdmin` permission

4. **File:** `backend/apps/entreprises/urls.py` — Add:
   ```python
   path('faq/', FAQPublicView.as_view()),
   path('admin/faq/', FAQAdminView.as_view()),
   path('admin/faq/<int:pk>/', FAQAdminDetailView.as_view()),
   ```

5. **File:** `backend/apps/entreprises/admin.py` — Register FAQ model

6. Run `python manage.py makemigrations && python manage.py migrate`

### Frontend

7. **New file:** `frontend/src/services/faqService.js` — API service:
   `getFAQ()`, `createFAQ()`, `updateFAQ()`, `deleteFAQ()`

8. **File:** `frontend/src/pages/FAQ.js` — Rewrite to fetch from API instead of
   hardcoded data. Group by `categorie`. Show accordion-style expand/collapse.

9. **New file:** `frontend/src/pages/AdminFAQ.js` — Admin CRUD interface:
   - List all FAQs in a table
   - Create/edit/delete with modal forms
   - Toggle publish status
   - Reorder (ordre field)

10. **File:** `frontend/src/App.js` — Add route: `/admin/faq`

11. **File:** `frontend/src/components/TopBar.js` — Add link to AdminFAQ in
    profile dropdown (admin only)

---

## Phase 5: Homepage Categories Section

**Problem:** Requirements specify "Catégories d'entreprises" on the homepage.
Currently only a secteur dropdown exists in the search bar.

### Frontend

**File:** `frontend/src/pages/Home.js`

1. Add a "Parcourir par secteur" section between the hero and recent listings
2. Show 13 sector cards in a grid (icon + label + count of enterprises)
3. Each card links to `/entreprises?secteur=<value>`
4. Use SVG icons for each sector:
   - Industrie, Agriculture, Services, Commerce, Tourisme, Transport,
     Santé, Informatique, Éducation, BTP, Franchise, Startups, Autres

### Backend

5. **File:** `backend/apps/entreprises/views.py` — Add a lightweight endpoint
   to get sector counts:
   ```python
   path('secteurs/', SecteursCountView.as_view()),
   ```
   Returns `[{secteur: 'industrie', count: 5, label: 'Industrie'}, ...]`

6. **File:** `frontend/src/services/entrepriseService.js` — Add `getSecteurs()`

---

## Phase 6: Admin User Management

**Problem:** Requirements require admin to create/modify/suspend/delete users.
Currently only available via Django admin — no React UI.

### Backend

**File:** `backend/apps/users/admin_user_views.py` (new)

1. `AdminUserListView` — GET list of all users with filters (user_type, is_active,
   is_verified, search by email/name). Supports pagination.
2. `AdminUserDetailView` — GET/PUT individual user (modify type, is_active,
   is_verified)
3. `AdminUserSuspendView` — POST to set `is_active=False` (suspend)
4. `AdminUserDeleteView` — DELETE to remove user
5. All views use `IsAdmin` permission

**File:** `backend/apps/users/urls.py` — Add:
```python
path('admin/users/', AdminUserListView.as_view()),
path('admin/users/<int:pk>/', AdminUserDetailView.as_view()),
path('admin/users/<int:pk>/suspend/', AdminUserSuspendView.as_view()),
path('admin/users/<int:pk>/delete/', AdminUserDeleteView.as_view()),
```

**File:** `backend/apps/users/serializers.py` — Add `AdminUserSerializer` with
all fields including `is_active`, `is_verified`, `user_type`, `date_joined`.

### Frontend

**New file:** `frontend/src/services/adminUserService.js`

**New file:** `frontend/src/pages/AdminUsers.js`
- User table with columns: avatar, name, email, type badge, verified badge,
  status badge, registered date
- Search bar (by name/email)
- Filter by user_type (acheteur/vendeur/admin), status (active/suspended)
- Actions per user: Edit (modal — change type, toggle verified), Suspend/Reactivate,
  Delete (with confirmation)
- Pagination

**File:** `frontend/src/App.js` — Add route: `/admin/users`

**File:** `frontend/src/components/TopBar.js` — Add "Gestion des utilisateurs"
link in admin profile dropdown

**File:** `frontend/src/pages/AdminDashboard.js` — Add card/link to user management

---

## Phase 7: Admin Financial Management

**Problem:** Requirements require admin to manage payments, subscriptions, and
invoices globally. Currently only per-user views exist.

### Backend

**File:** `backend/apps/users/admin_finance_views.py` (new)

1. `AdminFinanceDashboardView` — GET financial KPIs:
   - Total revenue, monthly revenue, revenue by plan
   - Active subscriptions by plan
   - Recent payments list
   - Churn rate (cancelled subscriptions)

2. `AdminPaymentListView` — GET all payments with filters (statut, plan, date
   range). Paginated.

3. `AdminAbonnementListView` — GET all subscriptions with filters (plan, statut).
   Paginated.

4. `AdminFactureListView` — GET all invoices (HistoriquePaiement with statut=reussi).

All use `IsAdmin` permission.

**File:** `backend/apps/users/urls.py` — Add finance admin endpoints.

### Frontend

**New file:** `frontend/src/services/adminFinanceService.js`

**New file:** `frontend/src/pages/AdminFinances.js`
- Revenue KPI cards (total, this month, by plan)
- Revenue chart (monthly bar chart)
- Payments table with filters (statut, plan, date)
- Subscriptions table (active, by plan)
- Invoice list with download links

**File:** `frontend/src/App.js` — Add route: `/admin/finances`

**File:** `frontend/src/components/TopBar.js` — Add "Finances" link in admin
profile dropdown

**File:** `frontend/src/pages/AdminDashboard.js` — Add financial summary card
with link to full finance page

---

## Phase 8: Database Backup Automation

**Problem:** Requirements specify "Sauvegardes automatiques". No backup mechanism
exists.

### Approach: Cron + pg_dump script

1. **New file:** `scripts/backup_db.sh`
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/home/salon/backups"
   mkdir -p "$BACKUP_DIR"
   docker compose exec -T db pg_dump -U "$DB_USER" "$DB_NAME" \
     | gzip > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
   # Keep last 30 days
   find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +30 -delete
   ```

2. **Server setup:** Add cron job on the VPS:
   ```cron
   0 3 * * * /home/salon/plateforme-vente-entreprise/scripts/backup_db.sh >> /var/log/db_backup.log 2>&1
   ```

3. **Optional:** Upload backups to S3-compatible storage (Backblaze B2, Wasabi)
   for offsite redundancy. Add `aws s3 cp` step to backup script.

4. **Document:** Add backup/restore instructions to README.

---

## Phase 9: Actualités Admin UI (Bonus)

**Problem:** Actualité model exists and works via Django admin, but no React admin
UI for CRUD operations.

### Backend

1. **File:** `backend/apps/entreprises/actualite_views.py` — Change from
   `ReadOnlyModelViewSet` to full `ModelViewSet` with `IsAdmin` write permission
   and `AllowAny` read permission.
2. Add create/update/delete endpoints to URL routing.

### Frontend

3. **New file:** `frontend/src/pages/AdminActualites.js` — CRUD interface for news
   articles
4. **File:** `frontend/src/App.js` — Add route `/admin/actualites`
5. **File:** `frontend/src/components/TopBar.js` — Add link in admin dropdown

---

## Implementation Order & Dependencies

```
Phase 1 (Search filters)        — No dependencies, CRITICAL
Phase 2A (Premium unlimited)    — No dependencies, 1-line change
Phase 2B (reCAPTCHA)            — Needs frontend package install
Phase 2C (Email verification)   — No dependencies
Phase 3 (File attachments)      — No dependencies
Phase 4 (FAQ system)            — Needs DB migration
Phase 5 (Categories section)    — Depends on Phase 1 (search must work first)
Phase 6 (Admin users)           — Needs DB migration (new serializers only)
Phase 7 (Admin finances)        — No dependencies
Phase 8 (DB backups)            — Server-only, no code changes
Phase 9 (Actualités admin)      — No dependencies
```

**Recommended sprint grouping:**

| Sprint | Phases | Est. Effort |
|--------|--------|-------------|
| Sprint 1 | Phase 1 + 2A + 2C | 1 day — fixes critical search bug + quick wins |
| Sprint 2 | Phase 3 + 2B | 1 day — messaging files + reCAPTCHA |
| Sprint 3 | Phase 4 + 5 | 1.5 days — FAQ system + homepage categories |
| Sprint 4 | Phase 6 + 7 | 2 days — admin user + financial management |
| Sprint 5 | Phase 8 + 9 | 0.5 days — backups + news admin UI |

**Total estimated effort: ~6 days**

---

## After All Phases

Expected completion score:

| Metric | Before | After |
|--------|--------|-------|
| Fully implemented | 59 / 80 (74%) | 80 / 80 (100%) |
| Including partials | 65 / 80 (82%) | 80 / 80 (100%) |
| Critical bugs fixed | 1 (search) | 0 |
| Requirements gaps | 15 | 0 |
