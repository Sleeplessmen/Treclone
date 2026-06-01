interface SendPasswordResetEmailInput {
    to: string
    resetToken: string
    appUrl?: string
}

interface SendEmailVerificationEmailInput {
    to: string
    verificationToken: string
    appUrl?: string
}

type EmailPayload = {
    to: string
    subject: string
    html: string
}

function getAppUrl(appUrl?: string) {
    return (
        appUrl ||
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.APP_URL ||
        'http://localhost:3000'
    ).replace(/\/$/, '')
}

function parseBoolean(value?: string) {
    if (!value) return false
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

async function sendWithMailpit({ to, subject, html }: EmailPayload) {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || '1025')
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.EMAIL_FROM
    const secure = parseBoolean(process.env.SMTP_SECURE)

    if (!host || !from) {
        throw new Error('SMTP_HOST and EMAIL_FROM are required for SMTP email.')
    }

    const nodemailerModule = await import('nodemailer')
    const transporter = nodemailerModule.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    })

    await transporter.sendMail({
        from,
        to,
        subject,
        html,
    })
}

async function sendWithResend({ to, subject, html }: EmailPayload) {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.EMAIL_FROM

    if (!apiKey || !from) {
        console.warn(
            'Email was not sent because RESEND_API_KEY or EMAIL_FROM is missing.'
        )
        return
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to,
            subject,
            html,
        }),
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Failed to send email: ${message}`)
    }
}

async function sendEmail(payload: EmailPayload) {
    if (process.env.SMTP_HOST) {
        await sendWithMailpit(payload)
        return
    }

    await sendWithResend(payload)
}

export async function sendPasswordResetEmail({
    to,
    resetToken,
    appUrl,
}: SendPasswordResetEmailInput) {
    const resetUrl = `${getAppUrl(appUrl)}/reset-password?token=${encodeURIComponent(
        resetToken
    )}`

    await sendEmail({
        to,
        subject: 'Reset your Treclone password',
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
                    <h1 style="font-size: 20px;">Reset your password</h1>
                    <p>Use the button below to reset your Treclone password. This link expires in 1 hour.</p>
                    <p>
                        <a href="${resetUrl}" style="display: inline-block; background: #2f6b24; color: white; padding: 10px 16px; text-decoration: none; border-radius: 6px;">
                            Reset password
                        </a>
                    </p>
                    <p>If you did not request this, you can ignore this email.</p>
                    <p style="font-size: 12px; color: #6b7280;">${resetUrl}</p>
                </div>
            `,
    })
}

export async function sendEmailVerificationEmail({
    to,
    verificationToken,
    appUrl,
}: SendEmailVerificationEmailInput) {
    const verificationUrl = `${getAppUrl(appUrl)}/verify-email?token=${encodeURIComponent(
        verificationToken
    )}`

    await sendEmail({
        to,
        subject: 'Verify your Treclone email',
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
                    <h1 style="font-size: 20px;">Verify your email</h1>
                    <p>Use the button below to verify your Treclone account. This link expires in 24 hours.</p>
                    <p>
                        <a href="${verificationUrl}" style="display: inline-block; background: #2f6b24; color: white; padding: 10px 16px; text-decoration: none; border-radius: 6px;">
                            Verify email
                        </a>
                    </p>
                    <p>If you did not create this account, you can ignore this email.</p>
                    <p style="font-size: 12px; color: #6b7280;">${verificationUrl}</p>
                </div>
            `,
    })
}
