---
title: 🛜 Set Up Pack Host
id: set_up_host
---

import DiffViewer from '@site/src/components/DiffViewer';
import Highlight from '@site/src/components/Highlight';

Before adding your resource pack, you'll need to set up hosting for it. If you're just testing locally, simply run /ce reload all - it'll handle both packing and sending the resource pack for you!

:::info
All of below configs are set up in the `config.yml` file.

For services that require API keys, we recommend using CraftEngine's <Highlight color="#1877F2">**environment variables**</Highlight>. \
 **Sharing your config.yml without using env vars is risky—don't do it!**
:::

:::tip

Want to check if your resource pack is fully hosted? Just run /ce reload all and see if it downloads properly!

:::

## Self-hosting
<Highlight color="#1877F2">**Basic Solution**</Highlight>

The good part? It's completely free - just needs your existing server. Perfect for testing and development. But unless you've got killer bandwidth, don't use this for production environments. Resource pack downloads will hog your server's connection and might lag out other players.

<DiffViewer>
{`
resource-pack:
    delivery:
      hosting:
        - type: "self"
-       ip: "localhost"
+       ip: "Your Server Ip" # for instance 111.222.333.444
          port: 8163
          protocol: "http"
          deny-non-minecraft-request: true
          one-time-token: true
          rate-limit:
            max-requests: 5
            reset-interval: 20 # seconds
`}
</DiffViewer>

:::info

The `deny-non-minecraft-request` setting blocks all requests from non-Minecraft clients. \
As for `one-time-token`, it generates a single-use, time-limited download link for each player.

You can avoid using IPv4 addresses for resource pack URLs by setting a full/complete URL instead.
```yaml
- type: "self"
  ip: "111.222.333.444"
  port: 8163
  url: "https://mydomain.com:8163/"
  ...more options
```

:::

:::caution

Don't use `https` if you don't have an SSL certificate.

:::

## Lobfile 
<Highlight color="#1877F2">**User Friendly**</Highlight><Highlight color="#10ae28ff">**Free**</Highlight>

Lobfile is actually a pretty solid choice for beginners looking for a resource hosting solution. It works well in most regions - except places with heavy internet restrictions like China, of course.

<details>
  <summary>Get API Key</summary>

1️⃣ Visit **https://lobfile.com/** and create an account \
2️⃣ Click `Account` -> `Settings` \
3️⃣ Click <Highlight color="#1877F2">**Copy API Key to Clipboard**</Highlight>

</details>

```yaml
resource-pack:
  delivery:
    hosting:
      - type: "lobfile"
        api-key: "abcdefghijkl"
        use-environment-variables: false
```

<details>
  <summary>Enviroment Variables</summary>
  - CE_LOBFILE_API_KEY
</details>

## S3 
<Highlight color="#1877F2">**Advanced User**</Highlight><Highlight color="#ae1010ff">**Paid**</Highlight>

S3 (Simple Storage Service) is a highly scalable, durable, and available object storage service offered by cloud service providers. To prevent bandwidth theft, CraftEngine issues unique, expiring tokens for every download—blocking direct abuse.

```yaml
resource-pack:
  delivery:
    hosting:
      - type: s3
        endpoint: ""
        bucket: ""
        access-key-id: ""
        access-key-secret: ""
        protocol: "https"
        path-style: false
        region: "auto"
        upload-path: "server_resource_pack.zip"
        use-legacy-signature: true
        validity: 10
        # Optional CDN
        cdn:
          domain: ""
          protocol: "https"
```

:::info

Different cloud providers have their own ways of setting up S3 storage. In future versions of the docs, we’ll try to include step-by-step guides with screenshots for the major providers.

:::

:::caution

The rest are some less common hosting methods. If you need them, feel free to keep reading. But if you want to host resource packs yourself, just use the API method ResourcePackHosts.register() instead.

:::

## External

```yaml
resource-pack:
  delivery:
    hosting:
      - type: external
        url: ""
        uuid: "" # Optional
        sha1: "" # Optional
```

:::info

Host your resource pack on an external server.
This eliminates bandwidth consumption on your own server.

Typically, after uploading your resource pack to a hosting platform, it will provide you with:

- URL
- UUID (Optional)
- SHA1 (Optional)

Simply fill these three fields with the corresponding values.

:::

:::caution

Note that regular resource pack updates are required to maintain version integrity. This maintenance procedure requires manual intervention.

:::

## OneDrive

```yaml
resource-pack:
  delivery:
    hosting:
      - type: onedrive
        use-environment-variables: false
        client-id: ""
        client-secret: ""
        refresh-token: ""
        upload-path: "server_resource_pack.zip"
```

<details>
  <summary>Enviroment Variables</summary>
  - CE_ONEDRIVE_CLIENT_ID
  - CE_ONEDRIVE_CLIENT_SECRET
  - CE_ONEDRIVE_REFRESH_TOKEN
</details>

## Dropbox

```yaml
resource-pack:
  delivery:
    hosting:
      - type: dropbox
        use-environment-variables: false
        app-key: ""
        app-secret: ""
        refresh-token: ""
        upload-path: "server_resource_pack.zip"
```

<details>
  <summary>Enviroment Variables</summary>
  - CE_DROPBOX_APP_KEY
  - CE_DROPBOX_APP_SECRET
  - CE_DROPBOX_REFRESH_TOKEN
</details>

## Alist

```yaml
resource-pack:
  delivery:
    hosting:
      - type: alist
        use-environment-variables: false
        disable-upload: false
        api-url: ""
        username: ""
        password: ""
        file-password: ""
        otp-code: ""
        upload-path: "server_resource_pack.zip"
```

<details>
  <summary>Enviroment Variables</summary>
  - CE_ALIST_USERNAME
  - CE_ALIST_PASSWORD
  - CE_ALIST_FILE_PASSWORD
</details>

## Gitlab

```yaml
resource-pack:
  delivery:
    hosting:
      - type: gitlab
        use-environment-variables: false
        gitlab-url: ""
        access-token: ""
        project-id: ""
```

<details>
  <summary>Enviroment Variables</summary>
  - CE_GITLAB_ACCESS_TOKEN
</details>

:::warning

According to GitLab's Terms of Service, you are not permitted to use GitLab's servers for content distribution. You must set up your own GitLab server.

https://handbook.gitlab.com/handbook/legal/acceptable-use-policy/

> We refer to “our services” throughout – this means all services (including related websites) owned or operated by GitLab. 
>
> 3. So our services, and those of others, run securely, and without disruption, you must not:
>
> Do anything to compromise, overburden, or otherwise impair our services or those of others, including using our services to mine or demonstrate proof-of-work for a cryptocurrency or blockchain, or for the primary purpose of distributing content.

:::