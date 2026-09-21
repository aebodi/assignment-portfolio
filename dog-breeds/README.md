# Dog Breed Slideshow

**Author:** Andres Bodington
**Project:** Dog Breed Slideshow — Sprint 2, “Lions, Tigers, and Bears, Oh My!”

A small web application that lists every breed from the public Dog CEO API, then shows that
breed’s photos one at a time with Previous and Next buttons. Plain HTML, CSS, and JavaScript —
no frameworks, no build step, no dependencies.

## Credits

This application is an implementation of the tutorial **“Dogs, JavaScript & An API 🐶 Fetch,
Promises & Async Await” by Brad Schiff (LearnWebCode)**. The application concept, the
fetch/promise/async-await structure, and the error-handling approach are his. Full credit to
Brad Schiff.

- Tutorial video: https://www.youtube.com/watch?v=AVmGmLFcukM
- Brad Schiff / LearnWebCode: https://learnwebcode.com

Breed data and photographs come from the **Dog CEO API**, a free public API:

- https://dog.ceo/dog-api/

The CSS in `styles.css` is original and does not follow the tutorial’s styling.

AI use for this project is disclosed at the top of each source file.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure: breed dropdown, image viewer, status line, Previous/Next buttons |
| `styles.css` | Layout and presentation |
| `script.js` | Fetch calls to the Dog CEO API and the slideshow logic |

## Compiling

There is nothing to compile. The application is plain HTML, CSS, and JavaScript that the
browser runs directly — no build step, no package manager, no dependencies to install.

## Running

Open `index.html` in any modern web browser.

To run it from a local web server instead:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000 in your browser.

## Hosting on Azure

The application is hosted as an Azure Static Web App.

**Live site:** _(URL to be added once the Static Web App is created)_

To deploy it yourself:

1. Push this folder to a GitHub repository.
2. In the Azure portal choose **Create a resource → Static Web App**.
3. Set **Deployment source** to GitHub and pick the repository and the `main` branch.
4. Under **Build Details**, choose build preset **Custom**, set **App location** to `/`, and
   leave **Api location** and **Output location** empty — the site is plain HTML/CSS/JS with
   no build step.
5. Click **Review + create**. Azure adds a GitHub Actions workflow under `.github/workflows/`
   that publishes the site on every push to `main` and gives you a URL of the form
   `https://<name>.azurestaticapps.net`.

## Coding standards

Source lines in this project are wrapped at 100 characters. Indentation is tabs; line endings
are LF.

## License

MIT — see [LICENSE](LICENSE), which also carries the credit notice for Brad Schiff’s tutorial.
