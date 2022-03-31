class IndexController extends BaseController {
    constructor() {
        super()
        this.model = new Model()
    }

    sayHello() {
        this.toast("bonjourToast")
    }
}

window.indexController = new IndexController()
