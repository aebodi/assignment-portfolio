# Assignment Portfolio

**Author:** Andres Bodington
**Project:** Assignment Portfolio — web-based class assignment hub
**Course:** Lewis University, Software Engineering

A static portfolio hub for every web-based assignment in the course. The hub page lists each
assignment as a card and links to three things: the copy hosted here, the assignment's own
deployment, and its source repository on GitHub. Placeholder cards mark the assignments still
to come.

Each completed assignment is also *hosted* by this site — its files live in a subfolder of
this repository, so one Azure Static Web App serves the hub and every assignment over HTTPS.

## Live site

Hosted on Azure Static Web Apps over HTTPS:

`https://<your-static-web-app-name>.azurestaticapps.net`

> Replace the placeholder above with the hostname Azure assigns after the first deployment,
> and replace the three `REPLACE-ME-*.azurestaticapps.net` placeholders in `index.html` with
> the hostnames of the individual assignment deployments.

## Files

| File or folder | Purpose |
| --- | --- |
| `index.html` | The hub page. The main file for the site. |
| `index.css` | External stylesheet for the hub page. |
| `staticwebapp.config.json` | Azure routing, MIME types, and the HSTS header. |
| `.github/workflows/azure-static-web-apps.yml` | GitHub Actions deployment to Azure. |
| `dice-roller/` | Hosted copy of the Yahtzee Dice Roller assignment. |
| `dog-breeds/` | Hosted copy of the Dog Breed Slideshow assignment. |
| `web-resume/` | Hosted copy of the Web Resume assignment. |
| `README.md` | This file. |
| `LICENSE` | MIT license. |

Each assignment subfolder keeps its own `README.md` and `LICENSE`, and its files keep the
names they were written and graded under (`styles.css` in two of them, `index.css` in the
resume). Renaming them would break each assignment's own relative links, so the file-naming
convention is applied per project rather than across the copies.

The deployment workflow is YAML, which forbids tab indentation, so that one file uses spaces.
Every other file in the repository is tab-indented.

## Compiling

There is nothing to compile. The hub is plain HTML5 and CSS3 with no build step, no
preprocessor, and no JavaScript. The hosted assignments are plain HTML, CSS, and browser
JavaScript.

## Running locally

Serve the folder over HTTP, which matches how Azure serves it and keeps the relative
subfolder links working:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`. The hosted assignments are at
`http://localhost:8080/dice-roller/`, `/dog-breeds/`, and `/web-resume/`.

Opening `index.html` directly in a browser also works for the hub page itself.

## Publishing to Azure

The master copy lives in GitHub at `https://github.com/aebodi/assignment-portfolio`, and
Azure Static Web Apps deploys from the `main` branch.

First-time setup:

1. In the Azure Portal, create a **Static Web App** (Free plan) and choose **GitHub** as the
   deployment source.
2. Authorize Azure, then select the `aebodi/assignment-portfolio` repository and the `main`
   branch.
3. For build details choose **Custom** and set:
   - App location: `/`
   - Api location: *(empty)*
   - Output location: *(empty)*
4. Azure commits a workflow file and adds the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to the
   repository. This repo already contains an equivalent workflow at
   `.github/workflows/azure-static-web-apps.yml` — keep one workflow file, not two, and make
   sure the secret name matches.

After setup, every push to `main` redeploys the site. Azure serves it over HTTPS from a global
CDN endpoint and provisions the TLS certificate.

The equivalent Azure CLI setup:

```bash
az group create --name rg-assignment-portfolio --location eastus2
az staticwebapp create \
	--name assignment-portfolio-andres \
	--resource-group rg-assignment-portfolio \
	--source https://github.com/aebodi/assignment-portfolio \
	--branch main \
	--app-location "/" \
	--output-location "" \
	--login-with-github
```

## Adding a new assignment

1. Copy the assignment's files into a new dash-case subfolder, leaving out its `.git` and
   `.github` directories:

   ```bash
   rsync -a --exclude '.git' --exclude '.github' --exclude '.DS_Store' ../new-project/ new-project/
   ```

2. Add the subfolder path to the `navigationFallback.exclude` list in
   `staticwebapp.config.json`, so Azure serves the subfolder instead of rewriting it to the
   hub page.
3. Replace one of the “Coming soon” cards in `index.html` with a full card:

   ```html
   <li class='card'>
   	<p class='sprint-label'>Sprint N</p>
   	<h3>Assignment name</h3>
   	<p class='card-body'>One sentence describing what it does.</p>
   	<ul class='link-row'>
   		<li><a class='link-primary' href='new-project/'>Open</a></li>
   		<li><a href='https://new-project.azurestaticapps.net'>Live site</a></li>
   		<li><a href='https://github.com/aebodi/new-project'>Source</a></li>
   	</ul>
   </li>
   ```

4. Add a row to the file table above and a credits entry below if the assignment includes any
   non-original content.

## Credits

The hub page, its stylesheet, and this README are original work for this course.

The hosted assignments carry their own credits in their own README files. Summarized here:

- **Dog Breed Slideshow** (`dog-breeds/`) is an implementation of the tutorial “Dogs,
  JavaScript & An API 🐶 Fetch, Promises & Async Await” by **Brad Schiff (LearnWebCode)** —
  https://www.youtube.com/watch?v=AVmGmLFcukM and https://learnwebcode.com. Breed data and
  photographs come from the free public **Dog CEO API**, https://dog.ceo/dog-api/.
- **Yahtzee Dice Roller** (`dice-roller/`) loads two third-party libraries from the jsDelivr
  CDN and does not bundle either one: **Three.js** 0.160.0 (MIT, https://threejs.org) for
  WebGL rendering, and **Rapier** `@dimforge/rapier3d-compat` 0.14.0 (Apache-2.0,
  https://rapier.rs) for the physics simulation.
- **Web Resume** (`web-resume/`) contains no third-party code, fonts, or images.

The GitHub Actions workflow is adapted from Microsoft's public Azure Static Web Apps
deployment template: https://learn.microsoft.com/azure/static-web-apps/

This repository began from the course's GitHub Pages “Hello World” template; none of that
template's code remains.

## AI use

Claude (Opus 5, via Claude Code) generated the hub page markup, the stylesheet, the Azure
configuration, and the first draft of this README from my description of the assignment
requirements. I chose the structure and the assignment list, reviewed and corrected the
output, and verified the site in a browser. Per-file disclosures appear at the top of each
source file, including inside each hosted assignment.

## License

MIT — see [LICENSE](LICENSE).
