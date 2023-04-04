FROM denoland/deno:latest

ENV PORT 8080

COPY . .

RUN deno cache ./startInCloudRun.ts

CMD deno run -A ./startInCloudRun.ts
