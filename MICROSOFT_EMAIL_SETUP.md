# Configuration Email Microsoft - Guide Complet

## 📧 Système d'envoi d'emails avec Microsoft

Ce système envoie automatiquement des emails après chaque paiement réussi :
- ✅ **Email de confirmation au client** : Détails de la commande
- ✅ **Email d'alerte à l'administrateur** : Notification de nouvelle commande

## 🔧 Configuration Microsoft Graph API (Recommandé)

### Option 1 : Microsoft Graph API (Recommandé)

Cette méthode utilise Microsoft Graph API pour envoyer des emails via votre compte Microsoft 365.

#### Étapes de configuration :

1. **Créer une application Azure AD**
   - Allez sur https://portal.azure.com
   - Naviguez vers **Azure Active Directory** → **App registrations**
   - Cliquez sur **New registration**
   - Nom : "SnipersMarketEmail Service"
   - Type : **Single tenant** ou **Multitenant**
   - Cliquez sur **Register**

2. **Configurer les permissions API**
   - Dans votre application, allez dans **API permissions**
   - Cliquez sur **Add a permission** → **Microsoft Graph**
   - Sélectionnez **Application permissions**
   - Ajoutez : `Mail.Send`
   - Cliquez sur **Grant admin consent** (nécessite un admin)

3. **Créer un secret client**
   - Allez dans **Certificates & secrets**
   - Cliquez sur **New client secret**
   - Description : "Email Service Secret"
   - Expiration : Choisissez une durée (recommandé : 24 mois)
   - Cliquez sur **Add**
   - ⚠️ **IMPORTANT** : Copiez immédiatement la valeur du secret (elle ne sera plus visible)

4. **Récupérer les informations nécessaires**
   - **Client ID (Application ID)** : Visible dans **Overview**
   - **Tenant ID (Directory ID)** : Visible dans **Overview**
   - **Client Secret** : La valeur que vous venez de copier

5. **Configurer les variables d'environnement**

   Ajoutez dans votre fichier `.env.local` :

   ```env
   # Microsoft Graph API Configuration
   MICROSOFT_CLIENT_ID=votre-client-id
   MICROSOFT_CLIENT_SECRET=votre-client-secret
   MICROSOFT_TENANT_ID=votre-tenant-id
   MICROSOFT_FROM_EMAIL=votre-email@votredomaine.com
   
   # Email de l'administrateur (pour recevoir les alertes)
   ADMIN_EMAIL=votre-email-admin@votredomaine.com
   ```

### Option 2 : SMTP Microsoft (Alternative)

Si vous préférez utiliser SMTP directement :

```env
# Configuration SMTP Microsoft
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@votredomaine.com
SMTP_PASSWORD=votre-mot-de-passe-app
MICROSOFT_FROM_EMAIL=votre-email@votredomaine.com
ADMIN_EMAIL=votre-email-admin@votredomaine.com
```

⚠️ **Note** : Microsoft prévoit de restreindre l'utilisation de SMTP basique. Il est recommandé d'utiliser Microsoft Graph API.

## 📋 Vérification de la configuration

### Test de l'envoi d'email

1. Effectuez un paiement de test
2. Vérifiez que :
   - Le client reçoit un email de confirmation
   - L'administrateur reçoit une alerte
3. Consultez les logs de l'application pour voir les erreurs éventuelles

### Logs à surveiller

```
✅ Email envoyé à client@example.com
✅ Email envoyé à admin@example.com
```

En cas d'erreur :
```
❌ Erreur lors de l'envoi de l'email: [détails]
```

## 🎨 Personnalisation des emails

Les templates d'emails sont dans `src/services/email/EmailService.ts` :

- `generateOrderConfirmationHTML()` : Email client
- `generateAdminAlertHTML()` : Email admin

Vous pouvez personnaliser :
- Les couleurs
- Le contenu
- Le format
- Les informations affichées

## 🔒 Sécurité

- ✅ Les clés API ne sont jamais commitées dans le code
- ✅ Utilisation de variables d'environnement
- ✅ Authentification sécurisée avec Microsoft Graph API
- ✅ Les emails sont envoyés de manière asynchrone (n'empêchent pas le paiement)

## 🐛 Dépannage

### Erreur : "Microsoft Graph Client non initialisé"
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que les permissions sont accordées dans Azure AD

### Erreur : "Insufficient privileges"
- Vérifiez que `Mail.Send` est accordé dans Azure AD
- Vérifiez que l'admin a donné son consentement

### Erreur : "Invalid client secret"
- Vérifiez que le secret n'a pas expiré
- Créez un nouveau secret si nécessaire

### Les emails ne sont pas envoyés
- Vérifiez les logs de l'application
- Vérifiez que l'email de l'expéditeur est valide
- Vérifiez les permissions dans Azure AD

## 📚 Ressources

- [Documentation Microsoft Graph API](https://docs.microsoft.com/en-us/graph/api/user-sendmail)
- [Guide Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Permissions Microsoft Graph](https://docs.microsoft.com/en-us/graph/permissions-reference)

## ✅ Checklist de configuration

- [ ] Application Azure AD créée
- [ ] Permissions `Mail.Send` accordées
- [ ] Consentement admin donné
- [ ] Secret client créé et copié
- [ ] Variables d'environnement configurées
- [ ] Test d'envoi d'email effectué
- [ ] Emails reçus (client et admin)
- [ ] Templates personnalisés si nécessaire

