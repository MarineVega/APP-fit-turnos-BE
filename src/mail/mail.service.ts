import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly mailService: MailService;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get('MAIL_PORT') || '465'),
      secure: true, // Gmail + 465 = SSL
      auth: {
        user: this.configService.get('MAIL_USER') || '',
        pass: this.configService.get('MAIL_PASS') || '',
      },
      tls: { rejectUnauthorized: false },
    });

    this.transporter.verify((error) => {
      if (error) console.error('❌ ERROR SMTP:', error);
      else console.log('📨 SMTP listo — Emails pueden enviarse.');
    });
  }

  // -------------------------------------------------------
  // TEMPLATE 1 — Email de recuperación de contraseña
  // -------------------------------------------------------
  private getRecoveryTemplate(codigo: string) {
    const year = new Date().getFullYear();

    return `
    <div style="width:100%; background:#f3f3f3; padding:30px 0; font-family:Arial,sans-serif;">
      <div style="
        max-width:480px; 
        margin:auto;
        background:white;
        border-radius:16px;
        padding:32px;
        box-shadow:0 4px 18px rgba(0,0,0,0.1);
      ">
        
        <div style="text-align:center; margin-bottom:25px;">
          <img src="https://drive.google.com/uc?export=view&id=1qb236_j-T7wjJL7yqD4-fJSLAzmAW8PV"
               style="width:140px; border-radius:8px;" 
               alt="Fit Turnos" />
        </div>

        <h2 style="text-align:center; color:#1c1c1c; font-size:22px; margin-bottom:18px;">
          Recuperación de contraseña
        </h2>

        <p style="font-size:15px; color:#444; text-align:center;">
          Usá el siguiente código para continuar:
        </p>

        <div style="
          font-size:36px;
          font-weight:bold;
          margin:20px auto;
          padding:15px 0;
          border-radius:10px;
          background:#e8ffe8;
          border:2px solid #4bb96b;
          width:200px;
          text-align:center;
        ">
          ${codigo}
        </div>

        <p style="font-size:14px; color:#666; text-align:center;">
          Si no solicitaste este cambio, ignorá este mensaje.
        </p>

        <hr style="border:none; height:1px; background:#ddd; margin:30px 0;" />

        <p style="text-align:center; color:#999; font-size:12px;">
          © ${year} Fit Turnos — Todos los derechos reservados
        </p>
      </div>
    </div>`;
  }

  // -------------------------------------------------------
  // TEMPLATE 2 — Email de verificación de cuenta
  // -------------------------------------------------------
  private getVerificationTemplate(url: string) {
    const year = new Date().getFullYear();

    return `
    <div style="width:100%; background:#f3f3f3; padding:30px 0; font-family:Arial,sans-serif;">
      <div style="
        max-width:480px;
        margin:auto;
        background:white;
        border-radius:16px;
        padding:32px;
        box-shadow:0 4px 18px rgba(0,0,0,0.1);
      ">
        
        <div style="text-align:center; margin-bottom:25px;">
          <img src="https://drive.google.com/uc?export=view&id=1qb236_j-T7wjJL7yqD4-fJSLAzmAW8PV"
               style="width:140px; border-radius:8px;" 
               alt="Fit Turnos" />
        </div>

        <h2 style="text-align:center; color:#1c1c1c; font-size:22px; margin-bottom:18px;">
          Confirmá tu cuenta
        </h2>

        <p style="font-size:15px; color:#444; text-align:center; margin-bottom:25px;">
          Para activar tu cuenta, hacé clic en el siguiente botón:
        </p>

        <div style="text-align:center; margin:20px 0;">
          <a href="${url}" 
            style="
              background:#24a35a;
              padding:14px 28px;
              color:white;
              font-size:16px;
              border-radius:8px;
              text-decoration:none;
              font-weight:600;
              display:inline-block;
          ">
            Activar cuenta
          </a>
        </div>

        <p style="font-size:14px; color:#666; text-align:center;">
          Si el botón no funciona, copiá y pegá este enlace:
        </p>

        <p style="color:#1c1c1c; word-break:break-all; text-align:center; font-size:13px; margin-top:10px;">
          ${url}
        </p>

        <hr style="border:none; height:1px; background:#ddd; margin:30px 0;" />

        <p style="text-align:center; color:#999; font-size:12px;">
          © ${year} Fit Turnos — Todos los derechos reservados
        </p>
      </div>
    </div>`;
  }

  // -------------------------------------------------------
  // ENVÍO — RECUPERACIÓN DE CONTRASEÑA
  // -------------------------------------------------------
  async sendRecoveryCode(email: string, codigo: string) {
    const html = this.getRecoveryTemplate(codigo);

    try {
      const info = await this.transporter.sendMail({
        to: email,
        from: this.configService.get('MAIL_FROM'),
        subject: 'Código de recuperación - Fit Turnos',
        html,
      });

      console.log('📧 EMAIL RECOVERY ENVIADO:', info);
      return info;
    } catch (error) {
      console.error('❌ ERROR AL ENVIAR RECOVERY:', error);
      throw error;
    }
  }

  // -------------------------------------------------------
  // ENVÍO — VERIFICACIÓN DE CUENTA
  // -------------------------------------------------------
  async sendVerificationEmail(email: string, url: string) {
    const html = this.getVerificationTemplate(url);

    try {
      const info = await this.transporter.sendMail({
        to: email,
        from: this.configService.get('MAIL_FROM'),
        subject: 'Confirmá tu cuenta - Fit Turnos',
        html,
      });

      console.log('📧 EMAIL VERIFICACIÓN ENVIADO:', info);
      return info;
    } catch (error) {
      console.error('❌ ERROR AL ENVIAR VERIFICACIÓN:', error);
      throw error;
    }
  }
}
