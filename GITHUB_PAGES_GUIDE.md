# Publish TechGroei Website On GitHub Pages

Goal: host the website for free on GitHub Pages and pay only for the domain.

## Recommended Setup

Use a public GitHub repository with GitHub Pages.

Recommended repository name:

`techgroei-website`

You can also use a user site repository named:

`yourgithubusername.github.io`

For TechGroei, `techgroei-website` is cleaner because the custom domain will be the public URL anyway.

## Files To Upload

Upload these files from this folder to the root of the GitHub repository:

- `index.html`
- `style.css`
- `.nojekyll`
- `techgroei_logo.svg`
- `techgroei_logo.jpg`
- `hero_ai_architecture_1775508554138.png`

Optional:

- `one_slider_capabilities.html`

Do not upload planning documents, Trello notes, admin files, or private business documents to the public website repository.

## Before Uploading

In `index.html`, replace:

- `info@techgroei.com` with the final business email
- `VAT: add VAT number before publishing` with the real VAT number, or remove it temporarily

## Publish From GitHub

1. Create a new public repository on GitHub.
2. Upload the website files into the repository root.
3. Go to repository `Settings`.
4. Open `Pages` from the left menu.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select branch `main`.
7. Select folder `/root`.
8. Click `Save`.
9. Wait a few minutes.
10. GitHub will show the temporary Pages URL.

Temporary URL format:

`https://yourgithubusername.github.io/techgroei-website/`

If using `yourgithubusername.github.io` as the repository name, the URL is:

`https://yourgithubusername.github.io/`

## Connect Custom Domain

Recommended final domain:

`techgroei.be`

Recommended public website URL:

`https://www.techgroei.be`

Also redirect:

`https://techgroei.be`

## GitHub Pages Custom Domain Setting

1. In the website repository, go to `Settings`.
2. Open `Pages`.
3. Under `Custom domain`, enter:

`www.techgroei.be`

4. Click `Save`.
5. GitHub will create or update a `CNAME` file in the repository.
6. Wait for GitHub to check DNS.
7. Enable `Enforce HTTPS` when available.

## DNS Records At Domain Provider

At the company where you buy the domain, create these records.

### For `www.techgroei.be`

Type:

`CNAME`

Name/Host:

`www`

Value/Target:

`yourgithubusername.github.io`

Replace `yourgithubusername` with your GitHub username.

Do not include the repository name in the CNAME value.

### For `techgroei.be`

Create four `A` records.

Type: `A`

Name/Host: `@`

Values:

`185.199.108.153`

`185.199.109.153`

`185.199.110.153`

`185.199.111.153`

Optional IPv6 records:

Type: `AAAA`

Name/Host: `@`

Values:

`2606:50c0:8000::153`

`2606:50c0:8001::153`

`2606:50c0:8002::153`

`2606:50c0:8003::153`

## Important DNS Rules

- Add the custom domain in GitHub before relying on DNS.
- Do not use wildcard DNS records like `*.techgroei.be`.
- DNS can take up to 24 hours to update.
- Use `www.techgroei.be` as the main domain and let `techgroei.be` redirect to it.
- Enable HTTPS in GitHub Pages after DNS is detected.

## Check DNS On Windows

After DNS changes, use PowerShell:

```powershell
Resolve-DnsName www.techgroei.be
Resolve-DnsName techgroei.be -Type A
```

Expected:

- `www.techgroei.be` should point to `yourgithubusername.github.io`.
- `techgroei.be` should show GitHub Pages IP addresses.

## Cost

GitHub Pages hosting:

Free for public repositories on GitHub Free.

Domain:

Paid yearly or multi-year through the domain registrar.

Email:

Separate from hosting. If you want `info@techgroei.be`, you need email hosting such as Google Workspace, Microsoft 365, or registrar email forwarding.
