FROM denoland/deno:latest

COPY [".", "."]

CMD [ "deno", "run", "-A", "./startInCloudRun.tsx" ]
