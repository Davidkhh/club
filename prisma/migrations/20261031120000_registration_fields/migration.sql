-- Поля регистрации: почта, телефон, тип доступа (free/paid) и IP.
-- contact больше не обязателен (новая форма пишет email/phone отдельно).
ALTER TABLE "leads" ADD COLUMN "email" TEXT NOT NULL DEFAULT '';
ALTER TABLE "leads" ADD COLUMN "phone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "leads" ADD COLUMN "access" TEXT NOT NULL DEFAULT 'free';
ALTER TABLE "leads" ADD COLUMN "ip" TEXT;
ALTER TABLE "leads" ALTER COLUMN "contact" DROP NOT NULL;
ALTER TABLE "leads" ADD CONSTRAINT "leads_access_check" CHECK ("access" IN ('free', 'paid'));
