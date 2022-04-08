class IndexController extends BaseController {
    constructor() {
        super()

        this.isConnected()
            .then(result => {
                if(result.status === 204) {
                    navigate("person");
                } else {
                    this.root = document.getElementById("root");
                    this.root.classList.remove("hidden")

                    this.setTitle("Dating Review");
                    let home = {
                        text : "Accueil",
                        view : "index",
                        active : true
                    }
                    let links = [home];
                    this.setNavbarLinks(links);
                }
            });

    }
}

window.indexController = new IndexController()
