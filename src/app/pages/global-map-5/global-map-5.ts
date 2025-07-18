import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-global-map-5',
  templateUrl: './global-map-5.html',
  styleUrls: ['./global-map-5.css'],
  standalone: true
})
export class GlobalMap5Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('globeCanvas') private canvasRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private globe!: THREE.Group;
  private animationFrameId!: number;
  private debouncedOnWindowResize: () => void;

  constructor() {
    this.debouncedOnWindowResize = this.debounce(this.onWindowResize.bind(this), 100);
  }

  ngOnInit(): void {
  }

  private debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function(this: any, ...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  ngAfterViewInit(): void {
    console.log('GlobalMap5Component: ngAfterViewInit called.');
    this.initThreeJs();
    this.loadGlobe();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  private initThreeJs(): void {
    console.log('GlobalMap5Component: initThreeJs called.');
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF); // White background

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 300;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 150;
    this.controls.maxDistance = 500;
    this.controls.minAzimuthAngle = -Math.PI / 2; // -90 degrees
    this.controls.maxAzimuthAngle = Math.PI / 2;  // +90 degrees
    this.controls.minPolarAngle = Math.PI / 2; // Lock vertical rotation to equator
    this.controls.maxPolarAngle = Math.PI / 2;  // Lock vertical rotation to equator

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', this.debouncedOnWindowResize, false);
    console.log('Three.js initialized: Scene, Camera, Renderer, Controls, Lighting.');
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private loadGlobe(): void {
    console.log('GlobalMap5Component: loadGlobe called.');
    this.globe = new THREE.Group();
    this.scene.add(this.globe);

    const sphereRadius = 100;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xADD8E6, transparent: true, opacity: 0.8 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.globe.add(sphere);

    // Load world data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world: any) => {
      console.log('World data loaded successfully.', world);
      const countries = topojson.feature(world, world.objects.countries) as any;
      console.log('TopoJSON features extracted.', countries);

      const defaultLineMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
      const indiaLineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 2 });

      countries.features.forEach((feature: any) => {
        const material = (feature.properties.name === 'India') ? indiaLineMaterial : defaultLineMaterial;
        const line = this.createCountryLine(feature, sphereRadius, material);
        if (line) {
          this.globe.add(line);
        }
      });
      console.log('Country lines added to globe.');

      // Set initial rotation to bring India to the front and straight
      this.globe.rotation.order = 'YXZ'; // Set rotation order
      this.globe.rotation.y = -1.35; // Approximately -77 degrees longitude for India
      this.globe.rotation.x = -0.7;    // Adjust for Kashmir to be at the top
      console.log('Globe initially positioned to show India straight.');

      // Center on India
      // const indiaFeature = countries.features.find((d: any) => d.properties.name === 'India');
      // if (indiaFeature) {
      //   const [lon, lat] = d3.geoCentroid(indiaFeature);
      //   const latRad = lat * Math.PI / 180;
      //   const lonRad = -lon * Math.PI / 180; // Negative longitude for correct rotation

      //   // Adjust rotation to bring India to the front
      //   this.globe.rotation.order = 'YXZ'; // Set rotation order
      //   this.globe.rotation.y = lonRad;
      //   this.globe.rotation.x = latRad;
      //   console.log('Globe centered on India.');
      // }

    }).catch(error => {
      console.error('Error loading the map data:', error);
    });
  }

  private createCountryLine(feature: any, radius: number, material: THREE.LineBasicMaterial): THREE.LineSegments | null {
    const points: number[] = [];
    const lineStrings: number[][] = [];

    const stream = d3.geoStream(feature.geometry, {
      point: (x, y) => {
        // Convert spherical coordinates (lon, lat) to Cartesian (x, y, z) on the sphere
        const phi = (90 - y) * Math.PI / 180; // Latitude to polar angle
        const theta = (x + 180) * Math.PI / 180; // Longitude to azimuthal angle

        points.push(
          -radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.cos(theta)
        );
      },
      lineStart: () => {},
      lineEnd: () => {
        if (points.length > 0) {
          lineStrings.push([...points]);
          points.length = 0; // Clear points for the next line segment
        }
      },
      polygonStart: () => {},
      polygonEnd: () => {},
      sphere: () => {},
    });

    if (lineStrings.length === 0) {
      console.warn(`No line strings generated for feature: ${feature.properties.name}`);
      return null; // No valid line segments found
    }

    const allPoints: number[] = [];
    lineStrings.forEach(ls => {
      for (let i = 0; i < ls.length - 3; i += 3) {
        allPoints.push(ls[i], ls[i+1], ls[i+2]);
        allPoints.push(ls[i+3], ls[i+4], ls[i+5]);
      }
    });

    if (allPoints.length === 0) {
      console.warn(`No points for BufferGeometry for feature: ${feature.properties.name}`);
      return null;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(allPoints, 3));
    console.log(`Generated line for feature: ${feature.properties.name} with ${allPoints.length / 3} points.`);

    return new THREE.LineSegments(geometry, material);
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
