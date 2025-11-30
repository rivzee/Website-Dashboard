import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class EmailService {
  private mailerSend: MailerSend;
  private sender: Sender;

  constructor() {
    // Inisialisasi MailerSend
    this.mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY || '',
    });

    // Konfigurasi Pengirim
    this.sender = new Sender(
      process.env.MAILERSEND_SENDER_EMAIL || 'info@trial-3z0vklo0p00l7qrx.mlsender.net', // Default trial domain if not set
      process.env.MAILERSEND_SENDER_NAME || 'RISA BUR'
    );
  }

  // Kirim email selamat datang setelah registrasi
  async sendWelcomeEmail(to: string, fullName: string) {
    const recipients = [
      new Recipient(to, fullName)
    ];

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .feature {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-left: 4px solid #667eea;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Selamat Datang!</h1>
            <p>Terima kasih telah bergabung dengan RISA BUR</p>
          </div>
          
          <div class="content">
            <h2>Halo, ${fullName}! 👋</h2>
            
            <p>Selamat! Akun Anda telah berhasil dibuat. Kami sangat senang Anda bergabung dengan platform akuntansi modern kami.</p>
            
            <h3>✨ Apa yang bisa Anda lakukan sekarang?</h3>
            
            <div class="feature">
              <strong>📊 Dashboard Intuitif</strong>
              <p>Akses dashboard yang mudah digunakan untuk mengelola keuangan bisnis Anda.</p>
            </div>
            
            <div class="feature">
              <strong>👨‍💼 Akuntan Profesional</strong>
              <p>Terhubung dengan akuntan bersertifikat untuk kebutuhan akuntansi Anda.</p>
            </div>
            
            <div class="feature">
              <strong>📈 Laporan Real-time</strong>
              <p>Dapatkan laporan keuangan yang akurat dan up-to-date kapan saja.</p>
            </div>
            
            <div class="feature">
              <strong>🔒 Keamanan Terjamin</strong>
              <p>Data Anda dilindungi dengan enkripsi tingkat enterprise.</p>
            </div>
            
            <center>
              <a href="http://localhost:3000/login" class="button">
                🚀 Masuk ke Dashboard
              </a>
            </center>
            
            <p style="margin-top: 30px;">
              <strong>Email Anda:</strong> ${to}<br>
              <strong>Status Akun:</strong> Aktif ✅
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 RISA BUR - Kantor Jasa Akuntan Profesional</p>
            <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
          </div>
        </body>
        </html>
      `;

    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(recipients)
      .setSubject('🎉 Selamat Datang di RISA BUR!')
      .setHtml(htmlContent)
      .setText(`Selamat Datang, ${fullName}! Terima kasih telah bergabung dengan RISA BUR.`);

    try {
      const response = await this.mailerSend.email.send(emailParams);
      console.log('✅ Email terkirim:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Gagal mengirim email:', error);
      return { success: false, error: error };
    }
  }

  // Kirim email notifikasi order baru
  async sendOrderNotification(to: string, orderDetails: any) {
    const recipients = [
      new Recipient(to)
    ];

    const htmlContent = `
        <h2>Order Baru Diterima</h2>
        <p>Order ID: ${orderDetails.id}</p>
        <p>Status: ${orderDetails.status}</p>
        <p>Total: Rp ${orderDetails.totalAmount}</p>
        `;

    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(recipients)
      .setSubject('📦 Order Baru Diterima')
      .setHtml(htmlContent)
      .setText(`Order Baru Diterima. Order ID: ${orderDetails.id}, Total: Rp ${orderDetails.totalAmount}`);

    try {
      const response = await this.mailerSend.email.send(emailParams);
      console.log('✅ Email order terkirim:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Gagal mengirim email order:', error);
      return { success: false, error: error };
    }
  }
}
