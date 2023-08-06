var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load sun texture
var textureLoader = new THREE.TextureLoader();
var sunTexture = textureLoader.load("./textures/sun.jpg"); // Path to your texture file

// Sun
var sunGeometry = new THREE.SphereGeometry(10, 32, 32);
var sunMaterial = new THREE.MeshPhongMaterial({
    map: sunTexture,        // Apply texture
    emissiveMap: sunTexture, // Same texture for emissive map
    emissive: 0xFFF000,      // White color will not tint the texture
    shininess: 30,
    specular: 0xFF0000
});
var sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

function createAsteroid() {
    var textureLoader = new THREE.TextureLoader();
    var asteroidTexture = textureLoader.load("./textures/asteroid.jpg"); // Path to your texture file
    var geometry = new THREE.TetrahedronGeometry(Math.random() * 0.5 + 0.1, 1);
    var material = new THREE.MeshPhongMaterial({
        map: asteroidTexture,
        emissiveMap: asteroidTexture,
        emissive:0x000000,
        specular: 0x888888,
        shininess: 30 // Increase this value for a more pronounced reflection
    });
    return new THREE.Mesh(geometry, material);
}

// Planets
var planetSizes = [0.387, 0.949, 1, 0.533, 4.452, 1.969, 1.887, 0.900];
var planetDistances = [15, 20, 25, 30, 45, 55, 65, 75];
var planets = [];
var orbits = [];
var planetMapTextures = ["./textures/mercury.jpg","./textures/venus.jpg","./textures/earth.jpg","./textures/mars.jpg","./textures/jupiter.jpg","./textures/saturn.jpg","./textures/uranus.jpg","./textures/neptune.jpg"];

for (var i = 0; i < 8; i++) {
    var planetGeometry = new THREE.SphereGeometry(planetSizes[i], 32, 32);
    var planetColor = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
    var textureLoader = new THREE.TextureLoader();
    var planetTexture = textureLoader.load(planetMapTextures[i]); // Path to your texture file
    var planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture, emissiveMap: planetTexture, emissive:0xFEEFFF, specular: 0xFF0000, shininess: 50 });

    var planet = new THREE.Mesh(planetGeometry, planetMaterial);
    var distance = planetDistances[i];
    var rotationSpeedFactor = planetSizes[i]; // Speed based on size
    var revolutionSpeedFactor = 0.0001 / planetSizes[i]; // Revolution speed based on size
    planets.push({ mesh: planet, distance: distance, speed: revolutionSpeedFactor + 0.0008, angle: 0, rotationSpeed: rotationSpeedFactor });
    // planets.push({ mesh: planet, distance: distance, speed: 0.0001 + i * 0.00002, angle: 0 });
    
    if (i == 5) { // Saturn is the 6th planet (0-index based)
        var innerRadius = 2.5; // Adjust this value to make the ring smaller
        var outerRadius = 3.0; // Adjust this value to make the ring smaller
        var ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 24);
        var ringMaterial = new THREE.MeshBasicMaterial({ color: 0xceb8b8, side: THREE.DoubleSide });
        var ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
        ring.position.y = 0; // Make sure the ring is centered around the planet
        ring.rotation.x = Math.PI / 2; // Rotate the ring to be horizontal
        ring.rotation.z = THREE.MathUtils.degToRad(78); // Tilt the ring by 78 degrees
    
        planet.add(ring); // Add ring to the Saturn planet mesh
    }
    
    


    scene.add(planet);

    // Create elliptical orbit
    var orbitPoints = [];
    var orbitRadiusX = distance;
    var orbitRadiusY = distance * 0.8;
    var segments = 100;
    for (var j = 0; j <= segments; j++) {
        var theta = (j / segments) * Math.PI * 2;
        var x = Math.cos(theta) * orbitRadiusX;
        var y = Math.sin(theta) * orbitRadiusY;
        orbitPoints.push(new THREE.Vector3(x, y, 0));
    }

    var orbitGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(orbitPoints), segments, 0.1, 16, false); // Using tube geometry for smooth curves
    var orbitMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 10 }); // Using Phong material for smooth shading
    var orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    orbits.push(orbit);
}
// Asteroid belt between Mars and Jupiter
var asteroidBelt = [];
var numAsteroids = 500;
var innerRadius = (planetDistances[3] + planetDistances[4]) / 2 - 2;
var outerRadius = (planetDistances[3] + planetDistances[4]) / 2 + 2;

// Creating asteroids
for (var i = 0; i < numAsteroids; i++) {
    var asteroid = createAsteroid();
    var theta = Math.random() * Math.PI * 2;
    var radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    var x = Math.cos(theta) * radius;
    var z = Math.sin(theta) * radius * 0.8; // Elliptical shape
    asteroid.position.set(x, 0, z);
    asteroid.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    asteroid.speed = Math.random() * 0.0005 + 0.0001; // Speed
    asteroid.angle = theta;
    asteroid.radius = radius; // Store radius for each asteroid
    scene.add(asteroid);
    asteroidBelt.push(asteroid);
}

scene.add(asteroidBelt);

    var starsGeometry = new THREE.BufferGeometry();
    var positions = [];

    for ( var i = 0; i < 10000; i ++ ) {
        var x = THREE.MathUtils.randFloatSpread(2000); 
        var y = THREE.MathUtils.randFloatSpread(2000); 
        var z = THREE.MathUtils.randFloatSpread(2000); 

        positions.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    var starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() }
        },
        vertexShader: `
            uniform float time;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_PointSize = 2.0 * ( 300.0 / -mvPosition.z );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float time;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                vec4 starColor = vec4(1.0, 1.0, 1.0, alpha);
                starColor.a *= sin(time * 0.9);
                if (starColor.a < 0.0) discard;
                gl_FragColor = starColor;
            }
        `,
        transparent: true
    });    

    var starField = new THREE.Points(starsGeometry, starMaterial);

    scene.add(starField);

// Variable to keep track of time
var clock = new THREE.Clock();

// Lighting
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

var sunLight = new THREE.PointLight(0xFFFFFF, 10, 1000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Spotlights for each planet
var spotLights = [];

for (var i = 0; i < planets.length; i++) {
    var spotLight = new THREE.SpotLight(0xFFFFFF, 2, planetDistances[i] * 2, Math.PI / 2, 0.1, 1);
    spotLight.position.set(0, 0, 0); // Sun's position
    spotLight.target.position.set(planetDistances[i], 0, 0); // Initial target position (will be updated)
    scene.add(spotLight);
    scene.add(spotLight.target);
    spotLights.push(spotLight);
}



// Top view, without tilt
camera.position.x = 0;
camera.position.y = 50; // Increased distance for a better view
camera.position.z = -100;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedPlanet = null;
var zoomed = false;

window.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', function() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        var intersectedObject = intersects[0].object;

        planets.forEach(function(planet) {
            if (planet.mesh === intersectedObject) {
                selectedPlanet = planet;
                if (zoomed) {
                    // Zoom out
                    camera.position.x = 0;
                    camera.position.y = 50;
                    camera.position.z = -100;
                    zoomed = false;
                } else {
                    // Zoom in
                    camera.position.x = planet.mesh.position.x;
                    camera.position.y = planet.mesh.position.y + 5;
                    camera.position.z = planet.mesh.position.z + 20;
                    zoomed = true;
                }
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            }
        });
    }
});
var isLeftMouseDown = false;
var onMousePositionLeft;
var rotationSpeed = 0.002;

window.addEventListener('mousedown', function (event) {
    if (event.button !== 0) return; // Only left click
    isLeftMouseDown = true;
    onMousePositionLeft = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mousemove', function (event) {
    if (!isLeftMouseDown) return;
    var movementX = event.clientX - onMousePositionLeft.x;
    var movementY = event.clientY - onMousePositionLeft.y;

    // Apply rotation to the entire solar system
    scene.rotation.y += movementX * rotationSpeed;
    scene.rotation.x += movementY * rotationSpeed;

    onMousePositionLeft = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mouseup', function (event) {
    if (event.button !== 0) return; // Only left click
    isLeftMouseDown = false;
});

window.addEventListener('keydown', function (event) {
    if (event.key === 's' || event.key === 'S') {
        orbits.forEach(function (orbit) {
            orbit.visible = !orbit.visible;
        });
    }
});

var isMouseDown = false;
var onMousePosition;
window.addEventListener('mousedown', function (event) {
    if (event.button !== 2) return; // Only right click
    isMouseDown = true;
    onMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mousemove', function (event) {
    if (!isMouseDown) return;
    var movementX = event.clientX - onMousePosition.x;
    var movementY = event.clientY - onMousePosition.y;
    camera.rotation.y += movementX * 0.002;
    camera.rotation.x += movementY * 0.002;
    onMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mouseup', function (event) {
    if (event.button !== 2) return; // Only right click
    isMouseDown = false;
});

window.addEventListener('wheel', function(event) {
    if (!selectedPlanet) {
        var zoomFactor = 1 + event.deltaY * 0.001;
        camera.position.x *= zoomFactor;
        camera.position.y *= zoomFactor;
        camera.position.z *= zoomFactor;
        return;
    }

    // Scale the selected planet
    var scale = 1 + event.deltaY * 0.001;
    selectedPlanet.mesh.scale.x *= scale;
    selectedPlanet.mesh.scale.y *= scale;
    selectedPlanet.mesh.scale.z *= scale;
    if (selectedPlanet.ring) {
        selectedPlanet.ring.scale.x *= scale;
        selectedPlanet.ring.scale.y *= scale;
        selectedPlanet.ring.scale.z *= scale;
    }
});

var animate = function () {
    requestAnimationFrame(animate);

    planets.forEach(function (planet, index) {
        var theta = planet.angle;
        var orbitRadiusX = planet.distance;
        var orbitRadiusY = planet.distance * 0.8;
        var x = Math.cos(theta) * orbitRadiusX;
        var y = Math.sin(theta) * orbitRadiusY;
        planet.mesh.position.set(x, 0, y);
        planet.angle += planet.speed;
    
        // Rotating planet on its axis
        planet.mesh.rotation.y += planet.rotationSpeed/50;
    
        // If the planet has a ring, rotate the ring as well
        if(planet.ring){
            planet.ring.rotation.y += planet.rotationSpeed/50;
        }
    
        // Update spotlight target to follow planet
        spotLights[index].target.position.set(x, 0, y);
    });
    
    // Star twinkling
    var time = clock.getElapsedTime();
    starField.material.opacity = (1 + Math.sin(time * 0.5)) * 0.5; // Adjust frequency and amplitude for different effects

    // Animate asteroid belt
    asteroidBelt.forEach(function (asteroid) {
        var theta = asteroid.angle;
        var radiusX = asteroid.radius; // Using stored radius
        var radiusY = asteroid.radius * 0.8; // Elliptical shape
        var x = Math.cos(theta) * radiusX;
        var z = Math.sin(theta) * radiusY;
        asteroid.position.set(x, 0, z);
        asteroid.angle += asteroid.speed;
    });

    renderer.render(scene, camera);
};

animate();