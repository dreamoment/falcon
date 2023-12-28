class AbortController {

    able: boolean = true

    constructor() {}

    abort() {
        this.able = false
    }
}


export default AbortController