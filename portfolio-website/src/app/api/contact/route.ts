import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "akashkbhat2001@gmail.com";
const FROM_EMAIL = "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subject ? `Portfolio enquiry: ${subject}` : `Portfolio enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fafaf9; border-radius: 12px;">
          <h2 style="color: #1c1917; margin-bottom: 4px;">New message from your portfolio</h2>
          <p style="color: #78716c; font-size: 14px; margin-top: 0;">Sent via goldenhourlabs.vercel.app</p>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #78716c; width: 80px;">Name</td><td style="padding: 8px 0; color: #1c1917; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #78716c;">Email</td><td style="padding: 8px 0; color: #1c1917;"><a href="mailto:${email}" style="color: #15803d;">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding: 8px 0; color: #78716c;">Subject</td><td style="padding: 8px 0; color: #1c1917;">${subject}</td></tr>` : ""}
          </table>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <div style="background: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; font-size: 15px; color: #1c1917; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/contact]", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
