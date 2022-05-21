# cloudflare-r2-agent

#### How to use

Open ```wrangler.toml```

```name``` : Project Name

```account_id``` : Your CloudFlare Account ID

```JWT_SECRET``` : A JWT SECRET

```bucket_name``` : R2 Storage Bucket Name

#### JWT Signature Structure

```json
{
  "file": "{your_file_name}",
  "exp": 1653125037
}
```

Example URL: ```https://{your_cloudflare_workers_url}/{your_file_name}?token={signed_jwt_token}```
