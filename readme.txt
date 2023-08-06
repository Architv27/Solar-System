Description
This JavaScript program uses the three.js library to render a 3D solar system simulation. The simulation includes the sun, 
eight planets with respective orbits, an asteroid belt, and a star field. The planets are textured, and they rotate and 
revolve in their orbits. This program allows the user to interact with the simulation by rotating the view, zooming in and out, 
selecting a planet to focus on, and toggling the visibility of the orbits.

Libraries Used
three.js: This library is used to create and display animated 3D computer graphics in a web browser. It allows the creation of 
complex 3D scenes with a very high level of detail.

How to run?
Use a live server to view this.

Features

Solar System
The solar system contains the sun, eight planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune), their respective
orbits, and an asteroid belt between Mars and Jupiter. Each planet is textured and orbits the sun at a unique distance and speed. 
The orbits are displayed using smooth curves and can be toggled on and off by pressing the 's' key.

Planets
Planets are created with a size, rotation speed, and revolution speed. The planets also have a textured appearance based on 
their respective images. Saturn has a ring around it, and each planet has a unique spotlight that illuminates it.

Asteroid Belt
The asteroid belt is an elliptical collection of 500 asteroids that orbit between Mars and Jupiter. Each asteroid is created with
a size, speed, and position.

Star Field
A field of 10,000 stars is created in the background, giving the appearance of a galaxy. The stars twinkle over time.

Interactivity
The simulation allows the user to interact in several ways:

Rotate the view of the entire solar system by clicking and dragging with the left mouse button.
Change the camera view by clicking and dragging with the right mouse button.
Select a planet to focus on by clicking on it. Clicking again will zoom out.
Zoom in and out with the mouse wheel.
Toggle the visibility of the orbits by pressing the 's' key.
Scale the selected planet using the mouse wheel.
