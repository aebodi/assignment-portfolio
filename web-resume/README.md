# Web Resume

**Author:** Andres Bodington
**Project:** Web Resume — Sprint 2
**Course:** Lewis University, Software Engineering

A static HTML and CSS web resume built for Lewis University resume review services. The page
renders as an on-screen resume, prints cleanly to US Letter, and links to a downloadable PDF
copy of the same resume.

## Live site

Hosted on Azure Static Web Apps over HTTPS:

`https://<your-static-web-app-name>.azurestaticapps.net`

> Replace the placeholder above with the hostname Azure assigns after the first deployment.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All HTML for the site. |
| `index.css` | All CSS for the site, including the `@media print` rules. |
| `andres-bodington-resume.pdf` | Printable PDF version of the resume, linked from the page. |
| `staticwebapp.config.json` | Azure Static Web Apps routing, MIME types, and HSTS header. |
| `.github/workflows/azure-static-web-apps.yml` | GitHub Actions deployment to Azure. |
| `LICENSE` | MIT license. |

## Compiling

There is nothing to compile. The project is plain HTML5 and CSS3 with no build step, no
preprocessor, and no JavaScript.

## Running locally

Open the page directly in a browser:

```bash
open index.html
```

Or serve the folder over HTTP, which matches how Azure serves it:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.

To check the printable layout, use the browser's Print preview (Cmd/Ctrl + P) and select
US Letter with default margins. The toolbar and footer are hidden in print output.

## Publishing to Azure

The master copy of the site lives in GitHub at `https://github.com/aebodi/web_resume`, and
Azure Static Web Apps deploys from the `main` branch.

First-time setup:

1. In the Azure Portal, create a **Static Web App** (Free plan) and choose **GitHub** as the
   deployment source.
2. Authorize Azure, then select the `aebodi/web_resume` repository and the `main` branch.
3. For build details choose **Custom** and set:
   - App location: `/`
   - Api location: *(empty)*
   - Output location: *(empty)*
4. Azure commits a workflow file and adds the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to the
   repository. This repo already contains an equivalent workflow at
   `.github/workflows/azure-static-web-apps.yml` — keep one workflow file, not two, and make
   sure the secret name matches.

After setup, every push to `main` redeploys the site automatically. Azure serves it over
HTTPS from a global CDN endpoint and provisions the TLS certificate.

The equivalent Azure CLI setup:

```bash
az group create --name rg-web-resume --location eastus2
az staticwebapp create \
	--name web-resume-andres \
	--resource-group rg-web-resume \
	--source https://github.com/aebodi/web_resume \
	--branch main \
	--app-location "/" \
	--output-location "" \
	--login-with-github
```

## Credits

All resume content, wording, and layout decisions are my own. No third-party code, templates,
fonts, or images are included; the page uses system font stacks only.

The GitHub Actions workflow is adapted from Microsoft's public Azure Static Web Apps
deployment template: https://learn.microsoft.com/azure/static-web-apps/

## AI use

Claude (Opus 5, via Claude Code) generated the initial `index.html` structure and the
`index.css` stylesheet from the content of my existing PDF resume, and drafted the Azure
deployment workflow from Microsoft's template. I supplied all resume content, reviewed and
corrected the markup and styling, and verified the printed output. Per-file disclosures appear
at the top of each source file.

## License

MIT — see [LICENSE](LICENSE).
