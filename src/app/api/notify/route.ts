import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.MAIL_SMTP_HOST;
  const user = process.env.MAIL_SMTP_USERNAME;
  const pass = process.env.MAIL_SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.error("Missing SMTP env vars:", { host: !!host, user: !!user, pass: !!pass });
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.MAIL_SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return NextResponse.json({ error: "SMTP not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { type } = body;

    let subject = "";
    let html = "";

    if (type === "donation") {
      const { name, amount, depositDate, donorEmail } = body;
      subject = `[후원] 새로운 후원금 입금정보가 접수되었습니다`;
      html = `
        <h2>새로운 후원금 입금정보가 접수되었습니다</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;width:120px;">후원자</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">${name || "익명"}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;">금액</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">${Number(amount).toLocaleString("ko-KR")}원</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;">입금일자</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">${depositDate}</td>
          </tr>
        </table>
      `;

      // 후원자 이메일이 있으면 감사 메일 발송
      if (donorEmail && typeof donorEmail === "string") {
        const thankYouHtml = `
          <div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
            <div style="background:linear-gradient(135deg,#38bdf8,#0284c7);padding:32px;text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:24px;">진보당 이승효 후보</h1>
              <p style="color:#e0f2fe;margin:8px 0 0;">서울시의회 동대문구 제2선거구</p>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;">
              <h2 style="color:#0369a1;margin:0 0 16px;">소중한 후원에 감사드립니다</h2>
              <p style="color:#334155;line-height:1.8;margin:0 0 20px;">
                ${name || "후원자"}님, 안녕하세요.<br/>
                진보당 서울시의회 동대문구 제2선거구 후보 <strong>이승효</strong>입니다.
              </p>
              <p style="color:#334155;line-height:1.8;margin:0 0 20px;">
                보내주신 <strong>${Number(amount).toLocaleString("ko-KR")}원</strong>의 후원금 입금정보가
                정상적으로 접수되었습니다.
              </p>
              <table style="border-collapse:collapse;width:100%;margin:0 0 20px;">
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e2e8f0;background:#f0f9ff;font-weight:bold;color:#0369a1;width:100px;">후원자</td>
                  <td style="padding:10px 14px;border:1px solid #e2e8f0;">${name || "익명"}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e2e8f0;background:#f0f9ff;font-weight:bold;color:#0369a1;">금액</td>
                  <td style="padding:10px 14px;border:1px solid #e2e8f0;">${Number(amount).toLocaleString("ko-KR")}원</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e2e8f0;background:#f0f9ff;font-weight:bold;color:#0369a1;">입금일자</td>
                  <td style="padding:10px 14px;border:1px solid #e2e8f0;">${depositDate}</td>
                </tr>
              </table>
              <p style="color:#334155;line-height:1.8;margin:0 0 8px;">
                기부금영수증은 확인 후 별도 안내드리겠습니다.
              </p>
              <p style="color:#334155;line-height:1.8;margin:0;">
                주민과 함께하는 정치를 만들어가겠습니다.<br/>
                다시 한번 진심으로 감사드립니다.
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
              <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                진보당 서울시의회 동대문구 제2선거구 후보 이승효
              </p>
            </div>
          </div>
        `;

        transporter.sendMail({
          from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
          to: donorEmail,
          subject: "소중한 후원에 감사드립니다 - 이승효 후보",
          html: thankYouHtml,
        }).catch((err) => console.error("Donor thank-you email failed:", err));
      }
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // 관리자에게 알림 메일
    const recipients = new Set<string>();
    if (process.env.ADMIN_EMAIL) recipients.add(process.env.ADMIN_EMAIL);
    if (process.env.DONATION_EMAIL) recipients.add(process.env.DONATION_EMAIL);
    const to = Array.from(recipients).join(",");

    if (to) {
      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to,
        subject,
        html,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
