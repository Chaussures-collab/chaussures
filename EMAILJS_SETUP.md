# 📧 Guide EmailJS - Service Mail Alternatif

## Vue d'ensemble

EmailJS est un service de mail alternatif qui fonctionne sans serveur backend. Il est idéal comme fallback quand :
- Microsoft Graph API ne fonctionne pas (permissions insuffisantes)
- SMTP fails with authentication errors (Gmail, etc.)
- Vous préférez un service de mail hébergé

## 1. Configuration EmailJS

### Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Cliquez sur **Sign Up** (inscription gratuite)
3. Confirmez votre email
4. Connectez-vous à votre dashboard

### Obtenir vos credentials

**Service ID :**
1. Dans le dashboard, allez à **Email Services** (à gauche)
2. Cliquez sur **Add Service** ou utilisez un service existant
3. Copiez votre **Service ID** (ex: `service_abc123...`)

**Template ID :**
1. Allez à **Email Templates**
2. Créez un nouveau template ou utilisez le template par défaut
3. Copiez votre **Template ID** (ex: `template_xyz789...`)

**Public Key :**
1. Allez à **Account** (en haut à droite)
2. Allez à **API Keys**
3. Copiez votre **Public Key** (commence par `pXXXXXXXXXXXXXXXXXX`)

### Créer un template EmailJS

Template idéal pour les commandes :

```
Service: Gmail (ou autre)
From: Your Gmail account
To: {{to_email}}
Subject: {{subject}}
```

**Email Content:**
```html
<h2>{{subject}}</h2>
<p>{{message}}</p>
```

## 2. Configuration .env.local

Ajoutez ces variables à votre `.env.local` :

```
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Important :** Ces variables commencent par `NEXT_PUBLIC_` car EmailJS s'exécute côté client.

## 3. Utiliser le service EmailJS

### En backend (Node.js)

```typescript
import { EmailJSService } from "@/services/email/EmailJSService";

const emailService = new EmailJSService();

// Envoyer un email simple
const result = await emailService.sendEmail({
  to: "client@example.com",
  subject: "Confirmation de commande",
  html: "<h1>Merci!</h1>",
  text: "Merci pour votre achat"
});

console.log(result); // { success: true, messageId: "200" }
```

### En frontend (React)

```typescript
import { EmailJSService } from "@/services/email/EmailJSService";
import { useEffect } from "react";

export function MyComponent() {
  useEffect(() => {
    const emailService = new EmailJSService();
    
    if (emailService.isConfigured()) {
      emailService.sendContactEmail(
        "visitor@example.com",
        "John Doe",
        "Question about products",
        "Can you help me?"
      ).then(result => {
        if (result.success) {
          console.log("Email sent!");
        } else {
          console.error("Failed:", result.error);
        }
      });
    }
  }, []);
  
  return <div>Contact form...</div>;
}
```

## 4. Avantages et inconvénients

### ✅ Avantages
- **Gratuit** pour 200 emails/mois
- **Pas de configuration complexe** - juste des clés
- **Pas de serveur SMTP** - fonctionnait hors-ligne
- **Support bien documenté** - nombreux tutoriels
- **Service fiable** - utilisé par des milliers d'apps
- **Fonctionne côté client** - pas besoin de backend

### ❌ Inconvénients
- **Limité à 200 emails/mois** (plan gratuit)
- **Pas d'historique détaillé** des emails (version gratuite)
- **Pas d'authentification personnalisée** (simple token)
- **Public Key exposée** en frontend (mais contrôlée par CORS EmailJS)

## 5. Limite gratuite

- **200 emails/mois** (renouvelé automatiquement)
- Après dépassement : $1 pour 100 emails supplémentaires
- Parfait pour les petits sites e-commerce

## 6. Fallback automatique

Le système EmailJS est inclus mais vous pouvez aussi configurer un fallback :

```typescript
// Essaie Graph API → SMTP → EmailJS
export async function sendEmailWithFallback(options) {
  try {
    // Try primary service
    await emailService.sendEmail(options);
  } catch (error) {
    // Try EmailJS as fallback
    const emailjsService = new EmailJSService();
    await emailjsService.sendEmail(options);
  }
}
```

## 7. Tester votre configuration

### Depuis un script Node.js

```bash
node -e "
const service = require('@/services/email/EmailJSService');
const emailjs = new service.EmailJSService();
console.log('Status:', emailjs.getStatus());
"
```

### Depuis le frontend (console)

```javascript
import { EmailJSService } from "@/services/email/EmailJSService";
const emailjs = new EmailJSService();
console.log(emailjs.getStatus());
// Output: { isInitialized: true, serviceId: '✅', templateId: '✅', hasPublicKey: true }
```

## 8. Troubleshooting

| Problème | Solution |
|----------|----------|
| `"EmailJS n'est pas configuré"` | Vérifiez les variables `.env.local` (NEXT_PUBLIC_EMAILJS_*) |
| `"Invalid template ID"` | Copiez le bon ID depuis votre dashboard EmailJS |
| `"Public key invalid"` | Vérifiez que vous avez copié la bonne clé API |
| `"CORS error"` | Ajoutez votre domaine dans Settings → CORS allowed domains |
| `"Too many requests"` | Vous avez dépassé la limite gratuite (200/mois) |

## 9. Intégration avec PaymentManager

Le `PaymentManager` utilise automatiquement EmailJS comme fallback :

```typescript
// Dans src/services/payment/PaymentManager.ts
try {
  await emailService.sendEmail(...); // Essaie SMTP/Graph API
} catch (error) {
  const emailjs = new EmailJSService();
  await emailjs.sendEmail(...); // Fallback EmailJS
}
```

## 10. Méthodologie de vérification

### Avant de déployer en production

1. ✅ Créez un compte EmailJS gratuit
2. ✅ Générez un Service ID, Template ID, Public Key
3. ✅ Ajoutez les variables à `.env.local`
4. ✅ Testez avec `npm run test:full-webhook`
5. ✅ Vérifiez les logs pour confirmer l'envoi
6. ✅ Vérifiez que l'email a été reçu
7. ✅ Mettez à jour les variables sur Vercel

## 11. Cost for production

Pour production, considérez le plan payant :
- **Starter:** $9.99/mois (0-10k emails)
- **Pro:** $49.99/mois (0-50k emails)
- **Enterprise:** Custom pricing

## Prochaines étapes

1. S'inscrire sur EmailJS
2. Créer un template
3. Mettre à jour `.env.local`
4. Tester avec `npm run test:full-webhook`
5. Vérifier les emails reçus
6. Déployer en production
