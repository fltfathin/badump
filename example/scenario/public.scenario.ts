import {Scenario} from "../../mod.ts";
import {IndexTest} from "../tests/index.test.ts";
import {LoginTest} from "../tests/login.test.ts";

export class PublicScenario extends Scenario{
    tests = [
        IndexTest,
        LoginTest
    ]
}