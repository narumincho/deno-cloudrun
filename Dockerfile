FROM denoland/deno:latest

COPY [".", "."]

CMD [ "deno", "run", "--allow-net=:8000", "--allow-env=NODE_ENV", "./main.tsx" ]
