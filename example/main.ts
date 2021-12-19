import {PublicScenario} from "./scenario/public.scenario.ts";

async function main(){
    const env_file = await Deno.readTextFile("./environments/production.env.json")
    const env = JSON.parse(env_file)
    const scenario = new PublicScenario(env)
    await scenario.run_test()
}

main().catch(err=>{
    console.error(err)
})