import controller from "./MyController.js";
import {randomHexColorCode} from "./utililty.js"
const renderer=new THREE.WebGLRenderer();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,1000);
const scene=new THREE.Scene();

const socket=io();

let player={
    position:{x:0,y:0,z:-50},
    color:randomHexColorCode()
};

const geom=new THREE.BoxGeometry(10,10,10);
const mat=new THREE.MeshBasicMaterial({color: player.color});
const mesh=new THREE.Mesh(geom,mat);

mesh.position.z=player.position.z;
mesh.position.x=player.position.x;
mesh.position.y=player.position.y;

scene.add(mesh);

const lig=new THREE.AmbientLight(0xffffff,100);

//setTimeout(()=>scene.remove(mesh),3000);


scene.add(lig);

const controls=new controller(mesh,scene,socket);


renderer.setSize(window.innerWidth,window.innerHeight);


requestAnimationFrame(function animateWorld(){
    renderer.render(scene,camera);
    controls.update();
    requestAnimationFrame(animateWorld.bind(this));
    
})

document.body.appendChild(renderer.domElement);


socket.on('connect',()=>{
		console.log("connesso al server");
});

var meshPlayers={};

socket.timeout(5000).emit("join",player);

socket.on("players",(players)=>{
    console.log("giocatori ottenuti");
    console.log(players);
    Object.keys(players).map(key=>{
        if(key!=socket.id){
            const geom=new THREE.BoxGeometry(10,10,10);
            const mat=new THREE.MeshBasicMaterial({color:players[key].color});
            console.log("dentro il map-->");
            console.log(players[key]);
            meshPlayers[players[key].id]=new THREE.Mesh(geom,mat);

            meshPlayers[players[key].id].position.x=players[key].position.x;
            meshPlayers[players[key].id].position.y=players[key].position.y;
            meshPlayers[players[key].id].position.z=players[key].position.z;


            console.log(meshPlayers[players[key].id]);

            scene.add(meshPlayers[players[key].id]);
            //setTimeout(()=>scene.remove(meshPlayers[player.id]),5000);
            //scene.remove(meshPlayers[player.id]);

        }
    });

});

socket.on("playerDisconnected",(id)=>{
    console.log("giocatore disconnesso");
    console.log(id);
    console.log(meshPlayers);
    console.log(meshPlayers[0]);
    scene.remove(meshPlayers[id]);
    delete meshPlayers[id];
    console.log(meshPlayers);
});




socket.on("joinPlayer",(newPlayer)=>{
    console.log(" newPlayer joined");
	const geom=new THREE.BoxGeometry(10,10,10);
		const mat=new THREE.MeshBasicMaterial({color:newPlayer.color});
		const mesh2=new THREE.Mesh(geom,mat);

		mesh2.position.x=newPlayer.position.x;
		mesh2.position.y=newPlayer.position.y;
		mesh2.position.z=newPlayer.position.z;

		scene.add(mesh2);
		meshPlayers[newPlayer.id]=mesh2;
        //setTimeout(()=>scene.remove(meshPlayers[player.id]),5000);
			
    });

socket.on("updateMovementPlayer",(id,newPos)=>{
    meshPlayers[id].position.set(newPos.x,newPos.y,newPos.z);
});