import { main } from "./main.tsx";

main({ portNumber: Number.parseInt(Deno.env.get("PORT") ?? "", 10) });
