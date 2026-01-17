"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three"; // Import properly from npm
import Link from "next/link";

export default function ThreeShapes() {
  // This Reference will "hold" the HTML element where we render the 3D scene
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. SETUP SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Dark grey

    // --- 2. SETUP CAMERA ---
    // We use container width/height, not window, so it fits in our dashboard card if needed
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // --- 3. SETUP RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    
    // IMPORTANT: Attach to our 'containerRef', NOT document.body
    containerRef.current.appendChild(renderer.domElement);

    // --- 4. LIGHTING ---
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 5, 5);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0x404040); 
    scene.add(ambientLight);

    // --- OBJECT 1: CUBE ---
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -2.5;
    scene.add(cube);

    // --- OBJECT 2: SPHERE ---
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0;
    scene.add(sphere);

    // --- OBJECT 3: PRISM (Cylinder with 3 sides) ---
    const prismGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1, 3);
    const prismMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const prism = new THREE.Mesh(prismGeometry, prismMaterial);
    prism.position.x = 2.5;
    scene.add(prism);

    // --- 5. ANIMATION LOOP ---
    let animationId: number;
    
    function animate() {
      animationId = requestAnimationFrame(animate);

      // Rotation Logic
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      sphere.rotation.y += 0.01;

      prism.rotation.x += 0.01;
      prism.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    
    animate();

    // --- 6. HANDLE RESIZE ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // --- CLEANUP FUNCTION (Very Important in React) ---
    // When you leave this page, this runs to remove the canvas
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose Geometries to free memory
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      prismGeometry.dispose();
      prismMaterial.dispose();
    };
  }, []); // Empty dependency array means "Run once on mount"

  return (
    <div>
      {/* Absolute Positioned Back Button so it floats over the 3D scene */}
      <Link href="/" className="absolute top-8 left-8 text-white z-10 hover:text-green-400 font-bold text-xl">
        ← Back to Dashboard
      </Link>
      
      {/* The Container for Three.js */}
      <div ref={containerRef} className="w-full h-screen overflow-hidden" />
    </div>
  );
}
/*** 
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>3D Objects: Cube, Sphere, Prism</title>
//     <style>
//         body { margin: 0; overflow: hidden; }
//         canvas { display: block; }
//     </style>
// </head>
// <body>
//     <script type="module">
//         import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

//         // 1. Scene Setup
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x222222); // Dark grey background

//         // 2. Camera Setup
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.z = 5;

//         // 3. Renderer Setup
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(renderer.domElement);

//         // 4. Lighting
//         const light = new THREE.DirectionalLight(0xffffff, 1);
//         light.position.set(0, 5, 5);
//         scene.add(light);
//         const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
//         scene.add(ambientLight);

//         // --- OBJECT 1: CUBE ---
//         const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//         const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Green
//         const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//         cube.position.x = -2.5; // Move Left
//         scene.add(cube);

//         // --- OBJECT 2: SPHERE ---
//         const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32); // Radius, Segments
//         const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Red
//         const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//         sphere.position.x = 0; // Center
//         scene.add(sphere);

//         // --- OBJECT 3: TRIANGULAR PRISM ---
//         // A Cylinder with 3 radial segments creates a triangular prism
//         const prismGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1, 3); 
//         const prismMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Blue
//         const prism = new THREE.Mesh(prismGeometry, prismMaterial);
//         prism.position.x = 2.5; // Move Right
//         scene.add(prism);

//         // 5. Animation Loop
//         function animate() {
//             requestAnimationFrame(animate);

//             // Rotate objects
//             cube.rotation.x += 0.01;
//             cube.rotation.y += 0.01;

//             sphere.rotation.y += 0.01;

//             prism.rotation.x += 0.01;
//             prism.rotation.y += 0.01;

//             renderer.render(scene, camera);
//         }

//         animate();

//         // Handle Window Resize
//         window.addEventListener('resize', () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(window.innerWidth, window.innerHeight);
//         });
//     </script>
// </body>
// </html>

*/