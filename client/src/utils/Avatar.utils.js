import * as THREE from 'three'

export function createLabel(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '48px Arial';
    context.fillStyle = 'red';
    context.fillText(text, 50, 50);
  
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
  
    sprite.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
    return sprite;
  }