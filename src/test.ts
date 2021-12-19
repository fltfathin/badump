import nunjucks from 'https://deno.land/x/nunjucks@3.2.3/mod.js';

export type EnvironmentRecord = Record<string, string | number>
interface TestProperties {
    env: EnvironmentRecord
}

class Environment{
    values: EnvironmentRecord = {};
    constructor(environment: EnvironmentRecord) {
        this.values = environment
    }
    get(key:string){
        return this.values[key]
    }
    set(key:string, value:string|number|undefined){
        let repr = `${value}`.substr(0,30)
        if (typeof value === "string" && value.length>30){repr += "..."}
        console.log(`env ${key} is set to ${repr}`)
        if (value){
            this.values[key] = value
        }
    }
}

export class Test {
    requires: string[] = ["host"]
    provides: string[] = []
    // properties
    url = "/";
    method = "GET";
    response?: Response;
    environment: Environment;
    json_body?: Record<string, string|number>;
    #url?: string;
    done = false;
    headers: Record<string, string|number> =  {};
    locals: Environment = new Environment({});
    //
    constructor(properties: TestProperties) {
        this.environment = new Environment(properties.env)
    }

    // getters and setters
    private get request_url(): string{
        if (this.#url){
            return this.#url
        }
        this.#url = this.render("{{host}}"+this.url)
        return this.#url
    }
    private get env(){
        return {
            ...this.environment.values,
            ...this.locals.values
        }
    }
    private get body(){
        if (this.json_body){
            this.headers = {
                ...this.headers,
                'Content-Type':'application/json'
            }
            return this.render(JSON.stringify(this.json_body))
        }
        return undefined;
    }
    get #headers(){
        if (this.json_body){
            return JSON.parse(this.render(JSON.stringify(this.headers)))
        }
        return undefined;
    }

    private render(template: string):string{
        return nunjucks.renderString(template, this.env)
    }

    private validate_env(){
        const keys: string[] = Object.keys(this.environment.values);
        const missing_keys = [];
        for (const required of this.requires) {
            if(!keys.includes(required)){
                missing_keys.push(required)
            }
        }
        if (missing_keys.length>0){
            console.log(this.render(`${this.method} ${this.request_url} ! environment variables missing`), missing_keys)
            return false
        }
        return true
    }

    // core request
    async query_server(){
        if (!this.validate_env()){
            return this.environment.values
        }
        this.validate_env()
        await this.pre()
        this.response = await fetch(this.request_url, {
            method: this.method,
            body: this.body,
            headers: this.#headers
        })
        console.log(this.render(`${this.method} ${this.request_url} -> ${this.response.status} ${this.response.statusText}`))
        await this.post()
        this.done = true;
        return this.environment.values
    }

    // scripting
    async pre(){}
    async post(){}
}