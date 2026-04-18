import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/**
 * SETUP (one-time, 2 minutes):
 * ─────────────────────────────────────────────────────────────────
 * In your EmailJS dashboard → Email Templates → Create New template:
 *
 *   To email  : {{to_email}}
 *   To name   : {{to_name}}
 *   Subject   : {{subject}}
 *   Body (HTML): paste exactly this one line →  {{{html_content}}}
 *
 * Copy the Template ID and paste it below ↓
 * ─────────────────────────────────────────────────────────────────
 */
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'   // ← paste your template ID here

/**
 * Sends the activation email with credentials to the agent.
 * The full HTML is built here — nothing to configure in EmailJS.
 */
export async function sendActivationEmail(admin, activationLink, generatedPassword) {
  const html = buildEmailHTML(admin, activationLink, generatedPassword)

  const result = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email:     admin.email,
      to_name:      `${admin.firstName} ${admin.lastName}`,
      subject:      `Bienvenue ${admin.firstName} — Votre compte AdminPanel`,
      html_content: html,
    },
    PUBLIC_KEY
  )

  console.info('[EmailService] sent →', admin.email, result.status)
  return result
}

/* ─────────────────────────────────────────────────────────────────
   HTML email template — fully built in code
───────────────────────────────────────────────────────────────── */
function buildEmailHTML(admin, activationLink, generatedPassword) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Activation de compte</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;background:#ffffff;border-radius:16px;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f3460,#533483);
                       padding:36px 40px;text-align:center;">
              <div style="width:52px;height:52px;border-radius:14px;
                          background:rgba(255,255,255,0.15);
                          display:inline-flex;align-items:center;justify-content:center;
                          font-size:24px;font-weight:700;color:#fff;
                          line-height:52px;margin-bottom:16px;">A</div>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;
                         letter-spacing:-0.3px;">AdminPanel</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.75);">
                Votre compte a été créé avec succès
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <p style="margin:0 0 8px;font-size:16px;color:#374151;">
                Bonjour <strong style="color:#1a1a2e;">${admin.firstName} ${admin.lastName}</strong>,
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.6;">
                Un compte administrateur vient d'être créé pour vous sur
                <strong>AdminPanel</strong>. Voici vos informations de connexion.
              </p>

              <!-- Credentials card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1.5px solid #e5e7eb;border-radius:12px;
                            overflow:hidden;margin-bottom:28px;">
                <tr>
                  <td colspan="2"
                      style="background:#f8f9fc;padding:10px 18px;
                             border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:11px;font-weight:700;color:#6b7280;
                                 text-transform:uppercase;letter-spacing:0.6px;">
                      Informations de connexion
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 18px;font-size:13px;color:#9ca3af;
                             font-weight:600;width:110px;border-bottom:1px solid #f0f1f5;">
                    Organisation
                  </td>
                  <td style="padding:12px 18px;font-size:13px;color:#1a1a2e;
                             font-weight:500;border-bottom:1px solid #f0f1f5;">
                    ${admin.organization}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 18px;font-size:13px;color:#9ca3af;
                             font-weight:600;border-bottom:1px solid #f0f1f5;">
                    Email
                  </td>
                  <td style="padding:12px 18px;font-size:13px;color:#1a1a2e;
                             font-weight:500;border-bottom:1px solid #f0f1f5;">
                    ${admin.email}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 18px;font-size:13px;color:#9ca3af;
                             font-weight:600;background:#fffbeb;">
                    Mot de passe
                  </td>
                  <td style="padding:12px 18px;background:#fffbeb;">
                    <span style="font-family:monospace;font-size:16px;font-weight:700;
                                 color:#b45309;letter-spacing:1px;">
                      ${generatedPassword}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fffbeb;border:1px solid #fde68a;
                            border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#92400e;line-height:1.5;">
                    ⚠️ &nbsp;Ce mot de passe a été généré automatiquement.
                    Nous vous recommandons de le modifier après votre première connexion.
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                Cliquez sur le bouton ci-dessous pour <strong>activer votre compte</strong>.
                Ce lien est valable <strong>24 heures</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${activationLink}"
                       style="display:inline-block;padding:14px 36px;
                              background:linear-gradient(135deg,#0f3460,#533483);
                              color:#ffffff;font-size:15px;font-weight:700;
                              text-decoration:none;border-radius:10px;
                              letter-spacing:0.2px;">
                      Activer mon compte
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;
                        text-align:center;line-height:1.6;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:<br/>
                <a href="${activationLink}"
                   style="color:#0f3460;word-break:break-all;font-size:11px;">
                  ${activationLink}
                </a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f0f1f5;
                       text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                Si vous n'êtes pas à l'origine de cette demande,
                ignorez cet email en toute sécurité.<br/>
                &copy; ${new Date().getFullYear()} AdminPanel
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}
