import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Gmail usa SSL
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'), // contraseña de aplicación
      },
      tls: {
        rejectUnauthorized: false, // evita problemas en redes que interceptan SSL
      },
    });
  }

  async sendRecoveryCode(email: string, codigo: string) {

    const html = `
    <div style="
      font-family: Arial, sans-serif; 
      background-color: #f3f3f3; 
      padding: 30px;
    ">
      <div style="
        max-width: 480px; 
        margin: auto; 
        background: #ffffff; 
        border-radius: 16px; 
        padding: 32px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.08);
      ">
        
        <!-- LOGO -->
        <div style="text-align:center; margin-bottom: 25px;">
          <img 
            src="https://drive.google.com/uc?export=view&id=1qb236_j-T7wjJL7yqD4-fJSLAzmAW8PV" 
            alt="Fit Turnos" 
            style="width:140px; border-radius:8px;"
          />
        </div>

        <h2 style="
          color:#1c1c1c; 
          text-align:center; 
          font-size: 22px; 
          font-weight:600; 
          margin-bottom:12px;
        ">
          Recuperación de contraseña
        </h2>

        <p style="
          color:#444; 
          font-size: 15px; 
          text-align:center; 
          margin-bottom: 20px;
        ">
          Usá el siguiente código para continuar con el proceso:
        </p>

        <div style="
          text-align:center; 
          margin: 25px 0;
          padding: 20px 0;
          background:#eafff1;
          border: 2px solid #6edc8c;
          border-radius: 12px;
        ">
          <span style="
            font-size:38px; 
            font-weight:bold; 
            color:#24a35a;
            letter-spacing:4px;
          ">
            ${codigo}
          </span>
        </div>

        <p style="
          color:#666; 
          font-size: 14px; 
          text-align:center; 
          margin-bottom: 30px;
        ">
          Si no solicitaste este cambio, podés ignorar este mensaje.
        </p>

        <hr style="border:none; height:1px; background:#ddd; margin:20px 0;" />

        <p style="
          text-align:center; 
          color:#999; 
          font-size:12px; 
          margin-top: 14px;
        ">
          © ${new Date().getFullYear()} Fit Turnos — Todos los derechos reservados
        </p>

      </div>
    </div>
    `;

    return this.transporter.sendMail({
      to: email,
      from: this.configService.get('MAIL_FROM'),
      subject: 'Código de recuperación - Fit Turnos',
      html,
    });
  }
}
