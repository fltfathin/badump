import {Test, EnvironmentRecord} from "./test.ts"

export class Scenario {
    tests: typeof Test[] = []
    env: EnvironmentRecord
    constructor(env: EnvironmentRecord) {
        this.env = env
    }
    async run_test(){
        for (const test of this.tests) {
            const t = new test({env: this.env});
            this.env = await t.query_server()
        }
    }
}