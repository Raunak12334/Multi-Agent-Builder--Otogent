import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendInviteEmail({
  to,
  organizationName,
  invitedBy,
  token,
}: {
  to: string;
  organizationName: string;
  invitedBy: string;
  token: string;
}) {
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "Otogent <onboarding@resend.dev>", // Replace with your domain in production
      to: [to],
      subject: `Invitation to join ${organizationName} on Otogent`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e293b; margin-bottom: 16px;">You've been invited!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            <strong>${invitedBy}</strong> has invited you to join the <strong>${organizationName}</strong> workspace on Otogent.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Otogent helps teams build and manage AI workforces to automate complex workflows.
          </p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            Accept Invitation
          </a>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
