# Billing / Electrical Quotation App

A lightweight quotation builder inspired by modern electrical quote tools.

## Features implemented (phase 1)

- Company and client metadata.
- Dynamic line-item table with add/remove rows.
- User-entered values (no auto-filled business values).
- Auto-calculated subtotal, discount, tax, and grand total.
- Scope of work and terms fields.
- Save/load draft from browser localStorage.
- Print-friendly layout to export as PDF.

## Run locally

Because this is a static app, you can open `index.html` directly, or run a static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Next additions (suggested)

- Branded template themes.
- Shareable quote links.
- PDF generation with custom header/footer.
- Approval workflow and status tracking.
- GST breakup and multi-tax support.
