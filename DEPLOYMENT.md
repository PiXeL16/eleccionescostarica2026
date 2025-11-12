# Deployment Guide

This document explains how to deploy the Elecciones CR 2026 website using the automated GitHub Actions + Coolify pipeline.

## Architecture

The deployment uses a two-stage approach:

1. **GitHub Actions**: Builds the Docker image with embedded static files and analytics
2. **Coolify**: Pulls and runs the pre-built Docker image

## Environment Variables

### PostHog Analytics (Build-time variables)

Since the site uses static export, PostHog configuration must be available at **build time** (not runtime).

#### Setup in GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

   ```
   POSTHOG_KEY: your-posthog-project-api-key
   POSTHOG_HOST: https://app.posthog.com
   ```

4. These are automatically passed to the Docker build via the GitHub Actions workflow

#### How it works

The workflow (`. github/workflows/deploy-production.yml`) passes these secrets as build arguments:

```yaml
build-args: |
  NEXT_PUBLIC_POSTHOG_KEY=${{ secrets.POSTHOG_KEY }}
  NEXT_PUBLIC_POSTHOG_HOST=${{ secrets.POSTHOG_HOST }}
```

The Dockerfile accepts these and sets them as environment variables during the Next.js build:

```dockerfile
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
```

Next.js then bakes these values into the static JavaScript files.

### Coolify Configuration

Coolify **does not need** the PostHog variables because they're already baked into the Docker image.

Coolify only needs:
- **COOLIFY_WEBHOOK**: Webhook URL for triggering deployments (set in GitHub Secrets)
- **COOLIFY_TOKEN**: Authorization token (set in GitHub Secrets)

## Deployment Flow

1. **Push to main branch** or **manual workflow dispatch**
2. GitHub Actions:
   - Checks out code
   - Builds Docker image with PostHog env vars
   - Pushes image to GitHub Container Registry (ghcr.io)
   - Triggers Coolify webhook
3. Coolify:
   - Receives webhook notification
   - Pulls latest image from GHCR
   - Restarts container with new image
   - Site is live!

## Manual Deployment

### Via GitHub Actions

1. Go to **Actions** tab in GitHub
2. Select "Deploy to Production" workflow
3. Click "Run workflow" → Choose "main" branch → "Run workflow"

### Via Coolify

1. Log into your Coolify instance
2. Find the Elecciones CR 2026 application
3. Click "Deploy" or "Restart"

## Verifying PostHog Integration

After deployment, verify PostHog is working:

1. Open browser DevTools → Console
2. Visit https://eleccionescostarica.org/
3. Check for PostHog initialization messages (if any)
4. Visit PostHog dashboard → Live events to see pageviews

If PostHog is not loading:
- Verify GitHub Secrets are set correctly
- Check the build logs in GitHub Actions for the env var values
- Inspect the built JavaScript files to confirm the values are embedded

## Troubleshooting

### PostHog not tracking

**Symptom**: No events showing in PostHog dashboard

**Possible causes**:
1. GitHub Secrets not set or set incorrectly
2. Build didn't include the env vars
3. PostHog API key is invalid

**Solution**:
1. Verify secrets in GitHub Settings → Secrets and variables → Actions
2. Check the latest GitHub Actions run logs
3. Look for the build args being passed to Docker
4. Re-run the workflow after fixing secrets

### Deployment not triggering

**Symptom**: Push to main doesn't trigger deployment

**Possible causes**:
1. GitHub Actions workflow is disabled
2. Coolify webhook or token is incorrect

**Solution**:
1. Check **Actions** tab → Workflows → Ensure workflow is enabled
2. Verify COOLIFY_WEBHOOK and COOLIFY_TOKEN secrets
3. Manually trigger the workflow to test

### Container won't start

**Symptom**: Coolify shows container as "stopped" or "unhealthy"

**Possible causes**:
1. Port 8080 already in use
2. Health check failing
3. Missing database file

**Solution**:
1. Check Coolify logs for the container
2. Verify database.db is included in the Docker image
3. Test the image locally: `docker run -p 8080:8080 ghcr.io/pixel16/eleccionescostarica2026:latest`

## Local Testing

To test the full Docker build locally with PostHog:

```bash
# Build with PostHog env vars
docker build \
  --build-arg NEXT_PUBLIC_POSTHOG_KEY=your-key \
  --build-arg NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com \
  -t elecciones2026-local \
  .

# Run the container
docker run -p 8080:8080 elecciones2026-local

# Visit http://localhost:8080
```

## Security Notes

- PostHog keys are **public** (they're in the client-side JavaScript)
- Never put sensitive/secret keys in `NEXT_PUBLIC_*` variables
- Use PostHog's domain allowlist feature to prevent unauthorized use
- Coolify webhook and token should remain secret (never commit them)

## Reference

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [PostHog Documentation](https://posthog.com/docs)
- [Coolify Documentation](https://coolify.io/docs)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
