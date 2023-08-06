FROM denoland/deno:latest AS build

WORKDIR /app

COPY . .

RUN deno compile -A ./startInCloudRun.ts

FROM denoland/deno:latest

ENV PORT 8080

COPY --from=build /app/startInCloudRun /app/startInCloudRun

CMD /app/startInCloudRun
