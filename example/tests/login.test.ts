import {Test} from "../../mod.ts";

export class LoginTest extends Test{
    requires = ["host","username","password"]
    provides = ["token"]
    url = "/api/v1/user/login"
    method = "POST"
    json_body = {
        "userid":"{{username}}",
        "password":"{{password}}"
    }
    async post(){
        let body = await this.response?.json()
        if (body.token){
            this.environment.set("token", body.token)
        }
    }
}