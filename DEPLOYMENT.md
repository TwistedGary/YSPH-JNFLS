# YSPH publishing website

The site now includes a WSGI publishing backend with SQLite persistence. It cannot run the online editor on GitHub Pages alone. No server has been purchased and no production deployment has been made.

## GitHub Pages public website

Pushing to the `main` branch runs `.github/workflows/deploy-pages.yml`, which publishes the public static website through GitHub Pages. The site URL is shown by the **Deploy static site to GitHub Pages** workflow after its first successful run. The public journal uses `articles-seed.json` when the publishing API is unavailable, so its initial articles and search remain usable on Pages.

GitHub Pages does not run the private editor, authentication, or SQLite database. `admin.html` explains this clearly on the public Pages site. Continue using the production deployment below for browser-based publishing and persistent articles.

## Local preview

Run `YSPH_DEVELOPMENT=1 python3 server.py` from this folder and open http://localhost:8080/admin.html. On the first visit, choose an administrator password of at least 12 characters. The development server binds to loopback only. Articles and the password hash live in `.runtime/ysph.sqlite3`, excluded from Git and public file serving. Never use development mode on a public host.

## Production deployment

Use a Linux host with Docker Compose, persistent disk, and an assigned domain. Copy the project to that host. Point the domain's A/AAAA DNS records to it, and allow incoming TCP ports 80 and 443.

1. Copy `.env.example` to `.env`.
2. Set `YSPH_DOMAIN` to the domain, without a scheme or path.
3. Generate a setup token with `python3 -c 'import secrets; print(secrets.token_urlsafe(32))'` and set `YSPH_SETUP_TOKEN`. Keep `.env` private.
4. Run `docker compose up -d --build`.
5. Open `https://YOUR_DOMAIN/admin.html`. Enter the setup token and choose a unique administrator password. The setup route permanently refuses to create another administrator once one exists.
6. After setup, replace `YSPH_SETUP_TOKEN` with another random value and restart the web service. Existing accounts do not need it for login.

Caddy obtains and renews TLS certificates. Gunicorn serves the application behind it; the app container's port is not published. Set the exact public origin: host and origin checks reject mismatches. Sessions use Secure, HttpOnly, SameSite=Strict cookies in production, expire after 12 hours, and are invalidated on logout. Writes require a session-specific CSRF token. Login attempts are rate limited; only password hashes are stored.

## Daily publishing

Use the footer's **Editor login** link. Select **New article**, enter a date, category, title, summary and body in Chinese or English (the other language is optional). Categories are free text. Use `## Heading` and blank lines to structure the body. Add references and an optional HTTPS cover image URL, credit and description. Existing local images can be used with an `images/editorial/...jpg` path.

**Save draft** keeps an article private. Change Status to Published and click **Publish article** to make it appear immediately in the journal. Existing articles can be edited or returned to Draft. The chosen publication date controls ordering; ties use creation time and ID. Future publication dates are rejected: scheduled publishing is not implemented. There is no deletion button, avoiding accidental removal. Plain text is rendered safely; arbitrary HTML is not supported.

The public journal searches Chinese and English titles, categories, summaries and body text. It supports arbitrary new categories, newest/oldest ordering, and an empty-result state. A missing translation falls back to the available language. Cover upload is not implemented; use a hosted HTTPS image URL or add a local asset before deployment.

## Persistence, upgrades and backups

`article_data` is the persistent SQLite volume. Rebuild with `docker compose up -d --build`; never run `docker compose down -v` when preserving data. Initial guides are imported only into a new database; rebuilding does not overwrite published edits.

Use **Export articles** for a portable JSON content backup. This does not include the administrator account or sessions. For a full consistent database backup:

```sh
docker compose exec web python -c 'import sqlite3; s=sqlite3.connect("/data/ysph.sqlite3"); d=sqlite3.connect("/data/backup.sqlite3"); s.backup(d); d.close(); s.close()'
docker compose cp web:/data/backup.sqlite3 ./ysph-backup.sqlite3
```

Keep dated backup copies off the host. To restore, stop the web service, replace `ysph.sqlite3` in its volume using the backup, retain UID 10001 ownership, and start the service. Test restores before depending on a backup policy.

If the administrator password is lost, use trusted host access: back up the DB, remove the single admin row and all session rows, set a new setup token, then run the initial setup flow again. Articles remain intact. There is no email recovery service.

## Content and images

The existing guide source remains in `tools/library-content.json`; `articles-seed.json` is the initial database import. `tools/build-library.py` then `tools/build-journal.py` regenerate static content and image integration. Daily updates use the editor and database; these scripts do not import or overwrite database content. Image license/source records are in `images/editorial/credits.json`. Downloaded imagery is illustrative and does not imply the depicted people are society members or patients with the discussed condition.

Before deployment, run `python3 -m unittest discover -s tests` and JavaScript syntax checks. The included automated checks cover authentication, unauthorized writes, CSRF, draft visibility, publication/editing, date validation, persistent storage, concurrent-edit conflict detection and backup access.
