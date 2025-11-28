<p align="center">
  <a target="blank"><img src="https://drive.google.com/uc?export=view&id=1qb236_j-T7wjJL7yqD4-fJSLAzmAW8PV" width="120" alt="Fit Turnos Logo" /></a>
</p>


# Fit Turnos – Backend
Backend oficial del sistema de gestión de turnos deportivos **Fit Turnos**, desarrollado con **NestJS** y desplegado en **Render**, con base de datos en **MySQL (Clever Cloud)**.

Este backend maneja autenticación JWT, roles, activación de usuarios, reservas, actividades, profesores, envío de emails y notificaciones.

---

## 🚀 Tecnologías principales
- NestJS
- TypeORM
- MySQL (Clever Cloud)
- JWT + Passport
- Nodemailer + Brevo SMTP
- Render (backend)
- Firebase (frontend)

---

## ⚙️ Instalación y configuración

### .env
```
# --- Database Local---
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=
# DB_PASSWORD=
# DB_NAME=fit_turnos

# --- JWT ---
JWT_SECRET=super_secreto_fitturnos_2025
JWT_EXPIRES_IN=1d

# --- App ---
PORT=3000

# --- Email ---
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=2525
MAIL_USER=9cc8ee001@smtp-brevo.com
MAIL_PASS=bskSKaO43pxZXc6
MAIL_FROM="Fit Turnos <nataliagelmi@gmail.com>"

# --- Frontend URL ---
FRONT_URL=http://localhost:5173

# --- Backend URL ---
BACK_URL=https://app-fit-turnos-be.onrender.com
```

---
## ▶️ Instalación
```
npm install @nestjs-modules/mailer nodemailer

npm install handlebars

npm install nodemailer-smtp-transport

npm install @nestjs/jwt

npm install jsonwebtoken

npm install bcrypt

npm install @types/bcrypt --save-dev

npm install nodemailer

npm install class-transformer

npm install @nestjs/jwt @nestjs/passport passport passport-jwt

npm install bcrypt

npm install --save-dev @types/bcrypt

npm install class-validator class-transformer
```
Front End:
```
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

npm install sweetalert2

npm install react-router-dom
```

## ▶️ Ejecución

```
npm run start:dev
```

---

## 🔐 Autenticación y Roles
- admin
- profesor
- usuario

---

## 🛡️ Reglas de Negocio
- Solo administradores activan usuarios y cambian roles.
- El admin principal es **admin@fitturnos.com**.
- Usuarios no activados no pueden reservar.

---

## 📧 Emails (Brevo)
Configuración SMTP mediante Nodemailer.

---
## 🌐 Deploy
Backend (Render): https://app-fit-turnos-be.onrender.com  
Frontend (Firebase): https://fit-turnos.web.app  



