import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // Use true for port 465, false for port 587
	auth: {
		user: process.env.APP_USER,
		pass: process.env.APP_PASS,
	},
});

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.APP_URL!],
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "USER",
				required: false,
			},
			phone: {
				type: "string",
				required: false,
			},
			status: {
				type: "string",
				defaultValue: "ACTIVE",
				required: false,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }, request) => {
			try {
				const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
				const info = await transporter.sendMail({
					from: '"Prisma Blog" <prismablog@ph.com>',
					to: user.email,
					subject: "Verify your email – Prisma Blog",
					text: `
Hi ${user.name || "there"},

Thanks for signing up for Prisma Blog.

Please verify your email by clicking the link below:
${verificationUrl}

If you didn’t create this account, you can ignore this email.

— Prisma Blog Team
`,
					html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">
                Prisma Blog
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#111827;">
              <h2 style="margin-top:0;">Verify your email address</h2>

              <p style="font-size:15px;line-height:1.6;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>

              <p style="font-size:15px;line-height:1.6;">
                Thanks for signing up for <strong>Prisma Blog</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${verificationUrl}"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:600;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#374151;line-height:1.6;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px;color:#2563eb;word-break:break-all;">
                ${verificationUrl}
              </p>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;">
                If you didn’t create an account, you can safely ignore this email.
              </p>

              <p style="margin-top:32px;font-size:14px;color:#111827;">
                — Prisma Blog Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#6b7280;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
				});
				console.log("Message sent:", info.messageId);
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			},
		},
	},
});
