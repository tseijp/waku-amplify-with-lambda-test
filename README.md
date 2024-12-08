# waku-amplify-with-lambda-test

### Installation and deploy

```ruby
npm create waku@latest
# ✔ Project Name … waku-amplify-with-lambda-test
cd waku-amplify-with-lambda-test
```

### Create files needed for deploy

<details>
<summary>

###### `amplify.yml`

</summary>

```yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
    postBuild:
      commands:
        - rm -rf ./.amplify-hosting
        - mkdir -p ./.amplify-hosting/compute
        - cp -r ./dist ./.amplify-hosting/compute/default
        - cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules
        - cp -r ./dist/public ./.amplify-hosting/static
        - cp -r ./dist/public ./.amplify-hosting/compute/default
        - cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json
        - cp startServer.mjs ./.amplify-hosting/compute/default/startServer.mjs
        - 'echo "{ \"type\": \"module\" }" > ./.amplify-hosting/compute/default/package.json'
  artifacts:
    baseDirectory: .amplify-hosting
    files:
      - '**/*'
```


</details>
<details>
<summary>

###### `deploy-manifest.json`

</summary>

```json
{
  "version": 1,
  "framework": { "name": "waku", "version": "0.21.7" },
  "imageSettings": {
    "sizes": [100, 200, 1920],
    "domains": [],
    "remotePatterns": [],
    "formats": [],
    "minimumCacheTTL": 60,
    "dangerouslyAllowSVG": false
  },
  "routes": [
    {
      "path": "/_amplify/image",
      "target": {
        "kind": "ImageOptimization",
        "cacheControl": "public, max-age=3600, immutable"
      }
    },
    {
      "path": "/*.*",
      "target": {
        "kind": "Static",
        "cacheControl": "public, max-age=2"
      },
      "fallback": {
        "kind": "Compute",
        "src": "default"
      }
    },
    {
      "path": "/*",
      "target": {
        "kind": "Compute",
        "src": "default"
      }
    }
  ],
  "computeResources": [
    {
      "name": "default",
      "runtime": "nodejs18.x",
      "entrypoint": "startServer.mjs"
    }
  ]
}
```

</details>
<details>
<summary>

###### `startServer.mjs`

</summary>

```js
import { Hono } from "hono";
import { compress } from "hono/compress";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { serverEngine } from "waku/unstable_hono";

const app = new Hono();

app.use(compress());

app.use(serveStatic({ root: "./public" }));

app.use(
  serverEngine({
    cmd: "start",
    loadEntries: () => import("./entries.js"),
    env: process.env,
  })
);

app.notFound((c) => c.text("404 Not Found", 404));

console.log(`ready: Listening on http://localhost:3000/`);

serve({ ...app, port: 3000 });
```

</details>

### Push to github and deploy

```
git init
git add .
git commit -m ":tada: init commit"
git branch -M main
git remote add origin https://github.com/tseijp/waku-amplify-with-lambda-test.git
git push -u origin main
```
