



class MyController {
    constructor(object, scene, socket, options) {

        this.object = object;
        this.options = options || {};
        this.domElement = this.options.domElement || document;
        this.velocity = this.options.velocity || 1;
        this.scene=scene;
        this.socket=socket;

        this.mouse=new THREE.Vector2();
        this.rayCaster=new THREE.Raycaster();
        

        this.domElement.addEventListener("keydown", this.onKeyDown.bind(this));
        this.domElement.addEventListener("keyup", this.onKeyUp.bind(this));

    }

    update(){
        if(this.moveFront){this.object.translateZ(-this.velocity)}
        if(this.moveBack){this.object.translateZ(this.velocity)}
        if(this.moveRight){this.object.translateX(this.velocity)}
        if(this.moveLeft){this.object.translateX(-this.velocity)}

        this.updatePositionOnServer();

    }

   
    onKeyDown(event){
        switch (event.keyCode) {
            case 38:
                this.moveFront=true;
                break;
            case 37:
                this.moveLeft=true;
                break;
            case 40:
                this.moveBack=true;
                break;
            case 39:
                this.moveRight=true;
        }
    }

    onKeyUp(event){
        switch (event.keyCode) {
            case 38:
                this.moveFront=false;
                break;
            case 37:
                this.moveLeft=false;
                break;
            case 40:
                this.moveBack=false;
                break;
            case 39:
                this.moveRight=false;
        }
    }

    updatePositionOnServer(){
        this.socket.emit("playerMoved",this.object.position);
    }

    
}

export default MyController;