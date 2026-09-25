# Makeup by Dima

A responsive Next.js App Router website with TypeScript, Tailwind CSS, MongoDB/Mongoose, Cloudinary uploads, and a secure admin dashboard at `/admin`. No Supabase or legal pages.

## 1. Install

Use Node.js 22 LTS or newer and npm.

```sh
npm ci
cp .env.example .env.local
```

On PowerShell, use `Copy-Item .env.example .env.local` instead of `cp` if preferred.

## 2. MongoDB Atlas

Create an Atlas cluster, a dedicated database user with read/write access only to the application database, and a network access rule that permits your deployment. For Vercel, configure suitable Atlas network access for your hosting setup. Copy the driver connection string into `MONGODB_URI`, including the database name (for example `/makeup_by_dima`). URL-encode password special characters. Never commit this value.

## 3. Cloudinary

Create a Cloudinary account and copy the cloud name, API key, and API secret into `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Uploads go through an authenticated server endpoint; the API secret never reaches the browser. JPG, PNG, and WebP images up to 4 MB are accepted to stay within Vercel's request-size constraints. Cloudinary limits images to 2400 pixels and optimizes delivery; Next Image provides responsive image optimization. MongoDB stores URLs only.

Removing an entry does not delete the underlying Cloudinary asset, because an image may be shared across records. Clean up unused assets in Cloudinary when appropriate.

## 4. Environment variables

Set all variables listed in `.env.example`. Generate a random session secret:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Paste the result into `AUTH_SECRET` (minimum 32 characters). Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally and to the exact HTTPS origin of your production site when deployed. This is used for canonical URLs, sitemap, social previews, and mutation origin checks. For preview deployments, use that deployment's origin. Do not add a trailing path.

## 5. Admin credentials

```sh
npm run hash-password
```

The script prompts for a password of at least 12 characters and outputs a bcrypt hash. Input is visible, so run this privately. Put the hash into `ADMIN_PASSWORD_HASH` and your email into `ADMIN_EMAIL`. Do not store the plaintext password. The seed command uses Node's native environment-file loader, which preserves dollar signs in the hash. In Vercel enter the hash directly without quotes; this variable is only required for seeding, not runtime authentication.

## 6. Seed and run

```sh
npm run seed
npm run dev
```

Open `http://localhost:3000`, then sign in at `/admin`. Seeding creates an admin only if missing, inserts the four initial packages if the package collection is empty, and creates default settings if missing. It never overwrites edited content or existing passwords. It does not generate fabricated testimonials or before/after images.

Without `MONGODB_URI`, the homepage offers an explicitly labeled preview using initial package values. Once MongoDB is configured, packages and every editable content section come from the database. Database failures show a retry screen rather than silently displaying stale seed content. Seed the database before launch.

## 7. Manage the website

In **Site settings**, add your international WhatsApp number, Instagram URL, Google Maps URL, display name, bio, hero text and photograph, and the Marwanweb.dev portfolio URL. Unconfigured contact links are omitted. Booking controls become available after a WhatsApp number is saved. The footer credit becomes a clickable link when its destination is configured.

Each content section supports add, edit, delete, display order, and visibility. Lower display-order numbers appear first. Packages support feature lists and images; portfolio items support custom categories; before/after entries require two real images. Only publish testimonials and photos you have permission to use. Package details and gallery images open accessible native dialogs. Comparison sliders support touch and keyboard interaction. Changes appear on the next public page load without rebuilding.

No branding reference assets were provided. The typographic wordmark and warm neutral visual system follow the brief. The homepage's [Unsplash editorial photograph](https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec) is a **placeholder**, not a representation of Dima's client work. Upload your approved hero photograph in **Site settings** before launch. Gallery content is also managed in the admin.

## 8. Verify

```sh
npm run test
npm run lint
npm run typecheck
npm run build
npm start
```

The validation tests cover unsafe URLs, invalid prices, required comparison images, and WhatsApp encoding. With the production preview server running and Google Chrome installed, `npm run test:browser` checks desktop/mobile rendering, package dialogs, navigation, unauthenticated API protection, and SEO/PWA resources. This smoke script expects the four preview packages and no configured database. Screenshots go into the ignored `artifacts` directory. Use `npm run format` to format source files.

Before launching with real services, sign in, upload an image, add/edit/hide/reorder/delete one entry in each section, save all settings, and verify them on the public website. Check WhatsApp, Instagram, Maps, and the credit link on a phone. Atlas and Cloudinary integration checks require your real environment variables.

## 9. GitHub

Create an empty private or public repository, then run:

```sh
git init
git add .
git commit -m "Build Makeup by Dima website"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

`.env.local` and other secrets are ignored. Confirm no secrets are staged before pushing.

## 10. Vercel

Import the GitHub repository, select the Next.js preset, and use the default build command (`npm run build`). Add `MONGODB_URI`, `AUTH_SECRET`, Cloudinary credentials, and `NEXT_PUBLIC_SITE_URL` under project environment variables. Admin seed variables are only needed where you run the seed script. Seed Atlas from your local machine before deployment; do not run seeding during every build. Set matching environment variables for each Vercel environment, then deploy.

The application uses Node server routes compatible with Vercel and a reused MongoDB connection. It requires no persistent local filesystem. API uploads are capped at 4 MB. Rate limiting for login is stored in MongoDB, shared across server instances, with a 15-minute expiry and 10 attempts per account/window. For a high-traffic deployment, also configure platform-level request protections to limit broad credential stuffing.

## 11. Domain and PWA

Add your domain in Vercel Project Settings → Domains, configure the DNS records Vercel provides, set `NEXT_PUBLIC_SITE_URL` to that exact HTTPS origin, and redeploy. Test social previews and `/sitemap.xml` on the final domain.

The PWA includes a manifest, 192px/512px icons, an Apple touch icon, mobile metadata, and an offline fallback. Service workers register in production only. Android/desktop browsers can offer installation; iPhone users can use Share → Add to Home Screen. Installation is never forced. The service worker does not cache admin pages, API responses, or editable content; offline navigation displays a reconnect message.

## Security and operations

Admin HTML is session-gated on the server, and every mutation/upload API separately checks authentication and request origin. Sessions are signed HS256 JWTs in HTTP-only SameSite=Strict cookies, secure in production, with an eight-hour lifetime. Admin identity and session version are checked in MongoDB for every protected operation. Rotate `AUTH_SECRET` to revoke all sessions. To reset a password, update the admin's `passwordHash` in Atlas with a newly generated bcrypt hash and increment `sessionVersion`; the seed script intentionally does not reset existing credentials.

Inputs are allowlisted and validated with Zod, database updates use Mongoose validation, and uploads are authenticated. Never expose environment secrets with `NEXT_PUBLIC_` prefixes. Maintain database backups and review dependency updates. Actual deployment, domain connection, and live service verification require your accounts and credentials.

Architecture follows the [Next.js App Router documentation](https://nextjs.org/docs/app/getting-started/installation) and [Cloudinary Node upload documentation](https://cloudinary.com/documentation/node_image_and_video_upload).
#   M A K E U P - B Y - D I M A  
 