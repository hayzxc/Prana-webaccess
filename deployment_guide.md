# Deploying Separate Go Backend Repo to Railway

Since you have a separate repository for your backend (`hayzxc/Golang-backend-for-livechat`), deployment is straightforward.

## Prerequisites

1.  **GitHub Repository**: Your backend repo is ready at `https://github.com/hayzxc/Golang-backend-for-livechat`.
2.  **Railway Account**: Log in to [Railway.app](https://railway.app/).

## Step 1: Deploy the Backend Repo

1.  Go to your Railway Dashboard.
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select your backend repository: **`Golang-backend-for-livechat`**.
4.  Click **Deploy Now**.

> **Important**: Ensure your `Dockerfile` is at the root of this repository. If you just uploaded the entire `backend` folder *inside* the repo, you might still need to set the Root Directory to `backend` in Settings -> Build. If the files (`main.go`, `Dockerfile`) are at the very top, you don't need to change anything.

## Step 2: Set Up the Database

Your backend needs a database to function.

1.  In the same Railway project, click **+ New**.
2.  Select **Database** -> **Add PostgreSQL**.
3.  Wait for it to initialize.

## Step 3: Configure Backend Variables

Link the database and set allowed origins.

1.  Click on your **Backend Service** card on Railway.
2.  Go to the **Variables** tab.
3.  Add the following:

    | Variable Name | Value | Description |
    | :--- | :--- | :--- |
    | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Select the variable from the dropdown (reference the Postgres service). |
    | `ALLOWED_ORIGINS` | `https://your-frontend-domain.vercel.app` | **CRITICAL**: Put your actual Frontend URL here. For testing, you can use `*`, but it's not recommended for production. |
    | `PORT` | `3001` | (Optional) Railway handles this, but good to be explicit. |

4.  **Redeploy**: If it doesn't auto-redeploy, go to the **Deployments** tab and click **Redeploy**.

## Step 4: Get Backend URL

1.  Go to the **Settings** tab of your Backend Service.
2.  Look for **Networking** -> **Public Networking**.
3.  Copy the **Public Domain** (e.g., `golang-backend-production.up.railway.app`). If there isn't one, click **Generate Domain**.

## Step 5: Connect Frontend to Backend

Now tell your frontend where the livechat server is.

1.  Go to your Frontend deployment settings (e.g., on Vercel or Railway).
2.  Find the Environment Variables section.
3.  Add/Update this variable:

    ```env
    NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.up.railway.app
    ```

4.  **Redeploy your Frontend**. The frontend needs to rebuild to bake in the new environment variable value.

## Verification

1.  Open your website.
2.  Open the Chat Widget.
3.  It should connect! If not, check the browser console (F12) for "CORS" errors (implies `ALLOWED_ORIGINS` issue) or "Connection Refused" (implies incorrect URL).

## Troubleshooting Common Errors

### "Failed to connect to database: DATABASE_URL is not set" needs to be fixed.

If you see this error in your Deployment Logs, it means you missed **Step 3**.

1.  Go to **Variables** tab in Railway.
2.  Click **New Variable**.
3.  Type `DATABASE_URL` as the name.
4.  For value, type `${{` and select the Postgres URL option.
5.  Click **Add**.
6.  The app should restart automatically.
