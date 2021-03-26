import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    let plug;

    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2; 

    const onDocumentMouseMove = (event) => {
      mouseX = ( event.clientX - windowHalfX );
      mouseY = ( event.clientY - windowHalfY );
    }

    document.addEventListener( 'mousemove', onDocumentMouseMove )

    const { THREE } = window;
    const scene = new THREE.Scene();

    const hLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(hLight);
    const lightAmbient = new THREE.AmbientLight('#ffffff', 0.9);
    scene.add(lightAmbient);

    const camera = new THREE.PerspectiveCamera(75, 600/600, 0.1, 1000);
    camera.translateZ(1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(600, 600);
    document.getElementById("3dContainer").appendChild(renderer.domElement);

    const objLoader = new THREE.OBJLoader();
    objLoader.setPath('/blender-files/');

    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('/blender-files/');

    new Promise((resolve) => {
      mtlLoader.load('plug-v2.mtl', (materials) => {
        resolve(materials);
      });
    }).then((materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('plug-v2.obj', (object) => {
        plug = object;
        scene.add(object);
      });
    });

    const render = () => {
      requestAnimationFrame(render);
      renderer.setClearColor( 0x000000, 0 );
      renderer.render(scene, camera);

      // if (plug) {
      //   plug.rotation.x = 1.57;
      // }

      targetX = mouseX * .001;
      targetY = mouseY * .001;

      if ( plug ) {
        plug.rotation.y += 0.05 * ( targetX - plug.rotation.y );
        plug.rotation.x += 0.05 * ( targetY - plug.rotation.x );
      }
    }
    render();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{"3D model test"}</p>
        <p>{"SVG => Blender => threejs"}</p>
        <div id="3dContainer" />        
      </header>
    </div>
  );
}

export default App;
