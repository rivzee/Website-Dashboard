import nodemailer from 'nodemailer';

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send Welcome Email
export async function sendWelcomeEmail(to: string, fullName: string) {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured. Skipping welcome email.');
    return { success: false, error: 'Email not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Selamat Datang di RISA BUR</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Selamat Datang!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">RISA BUR - Kantor Jasa Akuntan</p>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Halo, ${fullName}! 👋</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    Terima kasih telah mendaftar di <strong>RISA BUR</strong>. Akun Anda telah berhasil dibuat dan siap digunakan.
                </p>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    Dengan akun ini, Anda dapat:
                </p>
                
                <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 20px; padding: 0;">
                    <li>📋 Memesan layanan akuntansi profesional</li>
                    <li>📁 Upload dokumen dengan aman</li>
                    <li>📊 Memantau progress pekerjaan</li>
                    <li>💬 Berkomunikasi dengan tim akuntan</li>
                    <li>📄 Download laporan yang sudah selesai</li>
                </ul>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://website-kja.vercel.app/login" 
                       style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                        Login Sekarang →
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami di 
                    <a href="mailto:info@risabur.com" style="color: #3b82f6;">info@risabur.com</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 RISA BUR. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Kantor Jasa Akuntan Profesional</p>
            </div>
        </div>
    </body>
    </html>
    `;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"RISA BUR" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '🎉 Selamat Datang di RISA BUR!',
      html: htmlContent,
    });

    console.log('✅ Welcome email sent to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Send Order Notification Email
export async function sendOrderNotification(to: string, orderDetails: any) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured. Skipping order notification.');
    return { success: false, error: 'Email not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesanan Berhasil - RISA BUR</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">✅ Pesanan Diterima!</h1>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Pesanan Anda Berhasil Dibuat!</h2>
                
                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Order ID</p>
                    <p style="margin: 0 0 20px 0; color: #1f2937; font-weight: bold;">#${orderDetails.id?.slice(0, 8) || 'N/A'}</p>
                    
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Total</p>
                    <p style="margin: 0; color: #1f2937; font-weight: bold;">Rp ${Number(orderDetails.totalAmount || 0).toLocaleString('id-ID')}</p>
                </div>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                    Langkah selanjutnya: Silakan lakukan pembayaran untuk memproses pesanan Anda.
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://website-kja.vercel.app/dashboard/my-orders" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                        Lihat Pesanan →
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 RISA BUR. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"RISA BUR" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '📦 Pesanan Anda Berhasil Dibuat - RISA BUR',
      html: htmlContent,
    });

    console.log('✅ Order notification email sent to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send order notification email:', error);
    return { success: false, error: error.message };
  }
}

// Send Payment Verified Email
export async function sendPaymentVerifiedEmail(to: string, orderDetails: any) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured. Skipping payment verified email.');
    return { success: false, error: 'Email not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pembayaran Terverifikasi - RISA BUR</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">💳 Pembayaran Terverifikasi!</h1>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Pembayaran Anda Telah Dikonfirmasi!</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    Terima kasih! Pembayaran untuk pesanan <strong>#${orderDetails.id?.slice(0, 8) || 'N/A'}</strong> telah berhasil diverifikasi.
                </p>
                
                <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #15803d; font-weight: bold;">✅ Status: Pembayaran Diterima</p>
                    <p style="margin: 10px 0 0 0; color: #166534; font-size: 14px;">Tim akuntan kami akan segera memproses pesanan Anda.</p>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://website-kja.vercel.app/dashboard/my-orders/${orderDetails.id}" 
                       style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                        Lihat Detail Pesanan →
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 RISA BUR. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"RISA BUR" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '💳 Pembayaran Terverifikasi - RISA BUR',
      html: htmlContent,
    });

    console.log('✅ Payment verified email sent to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send payment verified email:', error);
    return { success: false, error: error.message };
  }
}

// Send Order Completed Email
export async function sendOrderCompletedEmail(to: string, orderDetails: any) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured. Skipping order completed email.');
    return { success: false, error: 'Email not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesanan Selesai - RISA BUR</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Pesanan Selesai!</h1>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Pekerjaan Anda Telah Diselesaikan!</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    Kabar baik! Pesanan <strong>#${orderDetails.id?.slice(0, 8) || 'N/A'}</strong> telah selesai dikerjakan oleh tim akuntan kami.
                </p>
                
                <div style="background: #faf5ff; border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #7c3aed; font-weight: bold;">📄 Laporan Tersedia</p>
                    <p style="margin: 10px 0 0 0; color: #6b21a8; font-size: 14px;">Anda dapat mengunduh laporan dari dashboard.</p>
                </div>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                    Jika ada revisi yang diperlukan, Anda memiliki kesempatan untuk mengajukan revisi maksimal 2 kali.
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://website-kja.vercel.app/dashboard/my-orders/${orderDetails.id}" 
                       style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                        Lihat & Download Laporan →
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                    ⭐ Puas dengan layanan kami? Berikan rating dan review Anda!
                </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 RISA BUR. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"RISA BUR" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '🎉 Pesanan Selesai - Laporan Tersedia - RISA BUR',
      html: htmlContent,
    });

    console.log('✅ Order completed email sent to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send order completed email:', error);
    return { success: false, error: error.message };
  }
}

// Send Revision Request Notification Email (to Accountant)
export async function sendRevisionNotificationEmail(to: string, revisionDetails: any) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured. Skipping revision notification email.');
    return { success: false, error: 'Email not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Permintaan Revisi Baru - RISA BUR</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">📝 Permintaan Revisi Baru</h1>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Ada Revisi yang Perlu Ditangani</h2>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400e; font-weight: bold;">📋 ${revisionDetails.title || 'Permintaan Revisi'}</p>
                    <p style="margin: 10px 0 0 0; color: #b45309; font-size: 14px;">${revisionDetails.description || 'Silakan cek dashboard untuk detail.'}</p>
                </div>
                
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Klien:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${revisionDetails.requester?.fullName || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Layanan:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${revisionDetails.order?.service?.name || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://website-kja.vercel.app/dashboard/revisions" 
                       style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                        Lihat & Tangani Revisi →
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 RISA BUR. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"RISA BUR" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '📝 Permintaan Revisi Baru - RISA BUR',
      html: htmlContent,
    });

    console.log('✅ Revision notification email sent to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send revision notification email:', error);
    return { success: false, error: error.message };
  }
}
