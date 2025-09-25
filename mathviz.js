// MathViz 3D Volume Visualization using Three.js
(function () {
    // Defer initialization until THREE is available
    function waitForThree(startTime) {
        if (window.THREE) { init(); return; }
        if (!startTime) startTime = Date.now();
        if (Date.now() - startTime > 5000) {
            const msg = document.createElement('div');
            msg.style.color = '#fff';
            msg.style.padding = '12px';
            msg.textContent = '3D engine failed to load. Please check your internet connection or try a modern browser.';
            const mountEl = document.getElementById('rendererMount');
            if (mountEl) mountEl.appendChild(msg);
            return;
        }
        setTimeout(() => waitForThree(startTime), 100);
    }
    waitForThree();

    function init() {
    const mount = document.getElementById('rendererMount');
    if (!mount) return;

    const shapeSelect = document.getElementById('shapeSelect');
    const btnVisualize = document.getElementById('btn-visualize');
    const btnReset = document.getElementById('btn-reset');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomInFab = document.getElementById('btn-zoom-in-fab');
    const btnZoomOutFab = document.getElementById('btn-zoom-out-fab');
    const btnSurface = document.getElementById('btn-surface');
    const btnBack3d = document.getElementById('btn-back3d');
    const volumeValue = document.getElementById('volumeValue');
    const volumeFormula = document.getElementById('volumeFormula');
    const surfaceValue = document.getElementById('surfaceValue');
    const glassCount = document.getElementById('glassCount');
    const dimL = document.getElementById('dimL');
    const dimW = document.getElementById('dimW');
    const dimH = document.getElementById('dimH');

    const inputs = {
        cuboid: {
            root: document.getElementById('inputs-cuboid'),
            L: document.getElementById('cuboid-length'),
            W: document.getElementById('cuboid-width'),
            H: document.getElementById('cuboid-height'),
        },
        sphere: {
            root: document.getElementById('inputs-sphere'),
            r: document.getElementById('sphere-radius'),
        },
        cone: {
            root: document.getElementById('inputs-cone'),
            r: document.getElementById('cone-radius'),
            h: document.getElementById('cone-height'),
        },
        cylinder: {
            root: document.getElementById('inputs-cylinder'),
            r: document.getElementById('cyl-radius'),
            h: document.getElementById('cyl-height'),
        },
        triangularPrism: {
            root: document.getElementById('inputs-triangularPrism'),
            b: document.getElementById('tri-base'),
            h: document.getElementById('tri-height'),
            L: document.getElementById('tri-length'),
        },
    };

    // Three.js setup
    const scene = new THREE.Scene();
    // Lighter environment background
    scene.background = new THREE.Color(0xdbe7ff);
    function getMountSize() {
        const rect = mount.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width || mount.clientWidth || 800));
        const h = Math.max(1, Math.floor(rect.height || mount.clientHeight || 520));
        return { w, h };
    }
    const { w: initW, h: initH } = getMountSize();
    const camera = new THREE.PerspectiveCamera(50, initW / initH, 0.1, 1000);
    camera.position.set(8, 8, 12);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(initW, initH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lights
    const hemi = new THREE.HemisphereLight(0xbfd6ff, 0x8aa0c8, 1.2);
    scene.add(hemi);
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(5, 10, 7);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dir2.position.set(-6, 6, -4);
    scene.add(dir2);

    // Ground grid for reference
    // Lighter grid for bright theme
    const grid = new THREE.GridHelper(40, 40, 0x9ab6ff, 0xbfd3ff);
    grid.position.y = -0.001;
    scene.add(grid);

    // Controls-lite (rotate, pan, zoom)
    let isDragging = false;
    let prev = { x: 0, y: 0 };
    let dragButton = 0; // 0 left, 1 middle, 2 right
    const target = new THREE.Object3D();
    scene.add(target);
    function onPointerDown(e) { isDragging = true; dragButton = e.button; prev.x = e.clientX; prev.y = e.clientY; }
    function onPointerUp() { isDragging = false; }
    function onPointerMove(e) {
        if (!isDragging) return;
        const dx = (e.clientX - prev.x) * 0.01;
        const dy = (e.clientY - prev.y) * 0.01;
        if (dragButton === 2) {
            // Pan: translate target opposite to mouse along camera's right/up
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
            const up = new THREE.Vector3().copy(camera.up).normalize();
            const dist = camera.position.distanceTo(target.position);
            const scale = Math.max(0.002, Math.min(0.02, dist * 0.002));
            target.position.addScaledVector(right, -dx / 0.01 * scale);
            target.position.addScaledVector(up, dy / 0.01 * scale);
        } else {
            // Rotate
            target.rotation.y += dx;
            target.rotation.x += dy;
        }
        prev.x = e.clientX; prev.y = e.clientY;
    }
    renderer.domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // Mouse wheel zoom
    function onWheel(e) {
        e.preventDefault();
        const zoomFactor = Math.exp(e.deltaY * 0.001);
        const toCam = camera.position.clone().sub(target.position);
        toCam.multiplyScalar(zoomFactor);
        camera.position.copy(target.position.clone().add(toCam));
    }
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Zoom buttons
    function zoomBy(factor) {
        const toCam = camera.position.clone().sub(target.position);
        toCam.multiplyScalar(factor);
        camera.position.copy(target.position.clone().add(toCam));
    }
    const zoomInHandler = () => zoomBy(0.85);
    const zoomOutHandler = () => zoomBy(1.15);
    // Toolbar zoom buttons may not exist (we keep FAB buttons in viewport)
    if (btnZoomIn) btnZoomIn.addEventListener('click', zoomInHandler);
    if (btnZoomOut) btnZoomOut.addEventListener('click', zoomOutHandler);
    if (btnZoomInFab) btnZoomInFab.addEventListener('click', zoomInHandler);
    if (btnZoomOutFab) btnZoomOutFab.addEventListener('click', zoomOutHandler);

    // Resize handler
    function onResize() {
        const { w, h } = getMountSize();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);
    // Ensure first layout resize occurs after DOM ready
    setTimeout(onResize, 0);

    // Geometry holders
    let solidMesh = null; // outline/solid of the container shape
    let waterMesh = null; // water volume (unused in solid-only mode)
    let outlineLines = [];
    let netGroup = null; // flattened net group for cuboid
    let dimHelpers = []; // dimension lines and labels
    let isFlattened = false;

    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x4f9cf7,
        transparent: true,
        opacity: 0.7,
        roughness: 0.25,
        metalness: 0.1,
        depthWrite: true,
        side: THREE.FrontSide,
    });

    // Glass-morphism material (darker glass)
    const solidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x446099,
        transparent: true,
        opacity: 0.8,
        roughness: 0.8,
        metalness: 0.3,
        transmission: 0.75,
        ior: 1.1,
        thickness: 2.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        side: THREE.FrontSide,
    });

    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xaec2ff });
    const faceMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide, opacity: 0.95, transparent: true });

    function clearShape() {
        if (solidMesh) { target.remove(solidMesh); solidMesh.geometry.dispose(); solidMesh = null; }
        if (waterMesh) { target.remove(waterMesh); waterMesh.geometry.dispose(); waterMesh = null; }
        // remove outlines
        outlineLines.forEach(line => { target.remove(line); line.geometry.dispose(); });
        outlineLines = [];
        // remove dimension helpers
        if (dimHelpers && dimHelpers.length) {
            dimHelpers.forEach(obj => {
                if (obj.isLine && obj.geometry) obj.geometry.dispose();
                if (obj.isSprite && obj.material) {
                    if (obj.material.map) obj.material.map.dispose();
                    obj.material.dispose();
                }
                target.remove(obj);
            });
            dimHelpers = [];
        }
        // remove net
        if (netGroup) {
            netGroup.traverse(obj => { if (obj.isMesh) obj.geometry.dispose(); });
            target.remove(netGroup);
            netGroup = null;
        }
        isFlattened = false;
        btnBack3d.classList.add('hidden');
    }

    function addOutline(mesh) {
        // Use a higher threshold angle so curved surfaces (e.g., cylinder, sphere)
        // only show silhouette/top-bottom edges instead of every side segment
        const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 1.0 });
        const line = new THREE.LineSegments(edges, lineMat);
        // Always render on top of the mesh for visibility
        line.material.depthTest = false;
        line.renderOrder = 1000;
        // Align outline to the mesh transform
        line.position.copy(mesh.position);
        line.rotation.copy(mesh.rotation);
        line.scale.copy(mesh.scale);
        target.add(line);
        outlineLines.push(line);
    }

    // Shared: create high-DPI label sprite that always looks crisp
    function createLabelSprite(text, fontPx = 20, pad = 10) {
        const dpr = Math.min(3, window.devicePixelRatio || 1);
        // Measure text first
        const meas = document.createElement('canvas').getContext('2d');
        meas.font = `bold ${fontPx}px Poppins, Arial, sans-serif`;
        const widthCss = Math.ceil(meas.measureText(text).width) + pad * 2;
        const heightCss = Math.ceil(fontPx + pad * 1.6);

        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(widthCss * dpr);
        canvas.height = Math.ceil(heightCss * dpr);
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.font = `bold ${fontPx}px Poppins, Arial, sans-serif`;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, widthCss, heightCss);
        ctx.strokeStyle = 'rgba(255,255,255,0.95)';
        ctx.strokeRect(0.75, 0.75, widthCss - 1.5, heightCss - 1.5);
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, pad, heightCss / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 8;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        const scale = 0.02; // world units per CSS pixel
        sprite.scale.set(widthCss * scale, heightCss * scale, 1);
        return sprite;
    }

    function createCuboid(L, W, H) {
        const geom = new THREE.BoxGeometry(L, H, W);
        solidMesh = new THREE.Mesh(geom, solidMaterial.clone());
        solidMesh.position.y = H / 2;
        solidMesh.renderOrder = 1;
        target.add(solidMesh);
        // Edge outline for visibility
        addOutline(solidMesh);
        // Add dimension lines and labels for L, W, H
        addDimensionHelpers(L, W, H);

        // Solid-only mode: do not add internal water
    }

    function addDimensionHelpers(L, W, H) {
        const offset = 0.15;
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        function addDimLine(a, b, text) {
            const g = new THREE.BufferGeometry().setFromPoints([a, b]);
            const line = new THREE.Line(g, lineMat);
            target.add(line);
            dimHelpers.push(line);
            const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
            const sprite = createLabelSprite(text);
            sprite.position.copy(mid);
            sprite.position.y += 0.02;
            target.add(sprite);
            dimHelpers.push(sprite);
        }
        const px = L / 2, py = H / 2, pz = W / 2;
        // L (top edge)
        addDimLine(new THREE.Vector3(-px, H + offset, pz + offset), new THREE.Vector3(px, H + offset, pz + offset), `L = ${L} cm`);
        // W (top edge)
        addDimLine(new THREE.Vector3(px + offset, H + offset, -pz), new THREE.Vector3(px + offset, H + offset, pz), `W = ${W} cm`);
        // H (front edge)
        addDimLine(new THREE.Vector3(-px - offset, 0, -pz - offset), new THREE.Vector3(-px - offset, H, -pz - offset), `H = ${H} cm`);
    }

    function createSphere(r) {
        const geom = new THREE.SphereGeometry(r, 48, 32);
        solidMesh = new THREE.Mesh(geom, solidMaterial);
        target.add(solidMesh);
        addOutline(solidMesh);

        // Solid-only mode: no internal water
    }

    function createCone(r, h) {
        const geom = new THREE.ConeGeometry(r, h, 64);
        solidMesh = new THREE.Mesh(geom, solidMaterial);
        solidMesh.position.y = h / 2;
        target.add(solidMesh);
        addOutline(solidMesh);

        // Solid-only mode: no internal water
    }

    function createCylinder(r, h) {
        const geom = new THREE.CylinderGeometry(r, r, h, 96, 1, false);
        solidMesh = new THREE.Mesh(geom, solidMaterial.clone());
        solidMesh.position.y = h / 2;
        target.add(solidMesh);
        addOutline(solidMesh);
    }

    function createTriangularPrism(b, h, L) {
        // Build a right triangular prism from a triangle (b,h) extruded along X by L
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(b, 0);
        shape.lineTo(0, h);
        shape.closePath();
        const extrudeGeom = new THREE.ExtrudeGeometry(shape, { depth: L, bevelEnabled: false, steps: 1 });
        // Align so length goes along Z and sits on ground
        extrudeGeom.rotateY(Math.PI/2);
        extrudeGeom.rotateX(-Math.PI/2);
        const mesh = new THREE.Mesh(extrudeGeom, solidMaterial.clone());
        // Lift so it rests on ground plane at y=0
        mesh.position.y = 0.001;
        solidMesh = mesh;
        target.add(solidMesh);
        addOutline(solidMesh);
    }

    function computeVolume(shape) {
        if (shape === 'cuboid') {
            const L = Number(inputs.cuboid.L.value);
            const W = Number(inputs.cuboid.W.value);
            const H = Number(inputs.cuboid.H.value);
            const V = L * W * H;
            return { V, formula: 'V = L × W × H', params: { L, W, H } };
        }
        if (shape === 'sphere') {
            const r = Number(inputs.sphere.r.value);
            const V = (4 / 3) * Math.PI * Math.pow(r, 3);
            return { V, formula: 'V = 4/3 π r³', params: { r } };
        }
        if (shape === 'cone') {
            const r = Number(inputs.cone.r.value);
            const h = Number(inputs.cone.h.value);
            const V = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
            return { V, formula: 'V = 1/3 π r² h', params: { r, h } };
        }
        if (shape === 'cylinder') {
            const r = Number(inputs.cylinder.r.value);
            const h = Number(inputs.cylinder.h.value);
            const V = Math.PI * r * r * h;
            return { V, formula: 'V = π r² h', params: { r, h } };
        }
        if (shape === 'triangularPrism') {
            const b = Number(inputs.triangularPrism.b.value);
            const h = Number(inputs.triangularPrism.h.value);
            const L = Number(inputs.triangularPrism.L.value);
            const V = 0.5 * b * h * L;
            return { V, formula: 'V = (1/2) b h L', params: { b, h, L } };
        }
        return { V: 0, formula: '—', params: {} };
    }

    function animateFill(shape, params) {
        // animate water fill from 0 to full height
        let t = 0; // 0..1
        const duration = 1200; // ms
        const start = performance.now();

        function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

        function frame(now) {
            t = Math.min(1, (now - start) / duration);
            const e = easeOutCubic(t);
            if (!waterMesh) return;

            if (shape === 'cuboid') {
                const H = params.H;
                const targetH = Math.max(H - 0.04, 0.02);
                waterMesh.scale.y = Math.max(0.0001, e * targetH);
                waterMesh.position.y = (waterMesh.scale.y) / 2;
            } else if (shape === 'sphere') {
                const r = params.r;
                waterMesh.scale.set(1, e, 1);
                waterMesh.position.y = -r + e * (2 * r);
            } else if (shape === 'cone') {
                const h = params.h;
                const r = params.r;
                const currentH = Math.max(e * (h - 0.02), 0.02);
                const currentR = Math.max((r - 0.02) * (currentH / (h - 0.02)), 0.02);
                const geom = new THREE.ConeGeometry(currentR, currentH, 64);
                waterMesh.geometry.dispose();
                waterMesh.geometry = geom;
                waterMesh.position.y = currentH / 2;
            }

            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function visualize() {
        try {
            const shape = shapeSelect.value;
            clearShape();
            const { V, formula, params } = computeVolume(shape);
            // Validate inputs for cuboid
            if (shape === 'cuboid') {
                const { L, W, H } = params;
                if (!isFinite(L) || !isFinite(W) || !isFinite(H) || L <= 0 || W <= 0 || H <= 0) {
                    volumeValue.textContent = 'Enter positive L, W, H';
                    glassCount.textContent = '—';
                    surfaceValue.textContent = '—';
                    volumeFormula.textContent = 'V = L × W × H';
                    return;
                }
            }
            volumeValue.textContent = `${V.toFixed(3)} cm³`;
            // Show formula with numbers
            if (shape === 'cuboid') {
                const { L, W, H } = params;
                volumeFormula.textContent = `V = L × W × H = ${L} × ${W} × ${H}`;
            } else if (shape === 'sphere') {
                const { r } = params;
                volumeFormula.textContent = `V = 4/3 π r³ = 4/3 π ${r}³`;
            } else if (shape === 'cone') {
                const { r, h } = params;
                volumeFormula.textContent = `V = 1/3 π r² h = 1/3 π ${r}² × ${h}`;
            } else if (shape === 'cylinder') {
                const { r, h } = params;
                volumeFormula.textContent = `V = π r² h = π ${r}² × ${h}`;
            } else if (shape === 'triangularPrism') {
                const { b, h, L } = params;
                volumeFormula.textContent = `V = 1/2 · b · h · L = 1/2 · ${b} · ${h} · ${L}`;
            } else {
                volumeFormula.textContent = formula;
            }
            // Glasses back on
            const glasses = V / 220;
            glassCount.textContent = isFinite(glasses) ? `${glasses.toFixed(2)} glasses (~${Math.ceil(glasses)} full)` : '—';
            if (shape === 'cuboid') {
                const { L, W, H } = params;
                surfaceValue.textContent = `${surfaceAreaCuboid(L, W, H).toFixed(3)} cm²`;
                if (dimL) dimL.textContent = `L = ${L}`;
                if (dimW) dimW.textContent = `W = ${W}`;
                if (dimH) dimH.textContent = `H = ${H}`;
            } else if (shape === 'sphere') {
                const { r } = params;
                surfaceValue.textContent = '—';
                if (dimL) dimL.textContent = `r: ${r}`;
                if (dimW) dimW.textContent = '—';
                if (dimH) dimH.textContent = '—';
            } else if (shape === 'cone') {
                const { r, h } = params;
                surfaceValue.textContent = '—';
                if (dimL) dimL.textContent = `r,h: ${r},${h}`;
                if (dimW) dimW.textContent = '—';
                if (dimH) dimH.textContent = '—';
            } else if (shape === 'cylinder') {
                const { r, h } = params;
                surfaceValue.textContent = '—';
                if (dimL) dimL.textContent = `r,h: ${r},${h}`;
                if (dimW) dimW.textContent = '—';
                if (dimH) dimH.textContent = '—';
            } else if (shape === 'triangularPrism') {
                const { b, h, L } = params;
                surfaceValue.textContent = '—';
                if (dimL) dimL.textContent = `b,h,L: ${b},${h},${L}`;
                if (dimW) dimW.textContent = '—';
                if (dimH) dimH.textContent = '—';
            } else {
                surfaceValue.textContent = '—';
                if (dimL) dimL.textContent = '—';
                if (dimW) dimW.textContent = '—';
                if (dimH) dimH.textContent = '—';
            }

            if (shape === 'cuboid') {
                createCuboid(params.L, params.W, params.H);
            } else if (shape === 'sphere') {
                createSphere(params.r);
            } else if (shape === 'cone') {
                createCone(params.r, params.h);
            } else if (shape === 'cylinder') {
                createCylinder(params.r, params.h);
            } else if (shape === 'triangularPrism') {
                createTriangularPrism(params.b, params.h, params.L);
            }
            // Solid-only: no fill animation
        } catch (err) {
            volumeValue.textContent = 'Visualization error';
            volumeFormula.textContent = String(err && err.message ? err.message : err);
        }
    }

    function surfaceAreaCuboid(L, W, H) {
        return 2 * (L * W + L * H + W * H);
    }

    function flattenCuboid() {
        // Only for cuboid
        shapeSelect.value = 'cuboid';
        updateInputsUI();
        const L = Math.max(Number(inputs.cuboid.L.value), 0.01);
        const W = Math.max(Number(inputs.cuboid.W.value), 0.01);
        const H = Math.max(Number(inputs.cuboid.H.value), 0.01);

        // Update readouts
        const SA = surfaceAreaCuboid(L, W, H);
        surfaceValue.textContent = `${SA.toFixed(3)} cm²`;
        volumeFormula.textContent = 'SA = 2(LW + LH + WH)';

        // Clear any 3D meshes
        if (solidMesh) { target.remove(solidMesh); solidMesh.geometry.dispose(); solidMesh = null; }
        if (waterMesh) { target.remove(waterMesh); waterMesh.geometry.dispose(); waterMesh = null; }
        outlineLines.forEach(line => { target.remove(line); line.geometry.dispose(); });
        outlineLines = [];

        // Build a flat 2D net (6 faces only)
        netGroup = new THREE.Group();
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 1.0 });
        function makeLabelText(text) { return createLabelSprite(text, 22, 12); }

        function addPlane(w, h, x, z, label, labelText) {
            const g = new THREE.PlaneGeometry(w, h);
            const m = new THREE.MeshStandardMaterial({ color: 0x2b3d68, roughness: 0.7, metalness: 0.05 });
            const mesh = new THREE.Mesh(g, m);
            mesh.rotation.x = -Math.PI / 2; // lay flat on ground plane
            mesh.position.set(x, 0.002, z);
            mesh.name = label;
            const edges = new THREE.EdgesGeometry(g);
            const lines = new THREE.LineSegments(edges, edgeMat);
            lines.rotation.x = -Math.PI / 2;
            lines.position.set(x, 0.003, z);
            lines.material.depthTest = false;
            lines.renderOrder = 1000;
            netGroup.add(mesh);
            netGroup.add(lines);
            if (labelText) {
                const sprite = makeLabelText(labelText);
                sprite.position.set(x, 0.06, z);
                if (sprite.material) sprite.material.depthTest = false;
                sprite.renderOrder = 1100;
                netGroup.add(sprite);
            }
        }

        // Layout: Base L×H centered. Left/Right: W×H on X-edges. Front/Back: L×W on Z-edges. Top: L×H beyond back.
        // Base at origin (width along X = L, height along Z = H)
        addPlane(L, H, 0, 0, 'base', `${L} × ${H} cm²`);
        // Left and Right faces (share H with base); place flush along X edges
        addPlane(W, H, -(L/2 + W/2), 0, 'left', `${W} × ${H} cm²`);
        addPlane(W, H,  (L/2 + W/2), 0, 'right', `${W} × ${H} cm²`);
        // Front and Back faces (share L with base); place flush along Z edges
        addPlane(L, W, 0,  (H/2 + W/2), 'front', `${L} × ${W} cm²`);
        addPlane(L, W, 0, -(H/2 + W/2), 'back', `${L} × ${W} cm²`);
        // Top face beyond back; same size as base
        addPlane(L, H, 0, -(H + W), 'top', `${L} × ${H} cm²`);

        target.add(netGroup);
        isFlattened = true;
        btnBack3d.classList.remove('hidden');
    }

    function rebuildCuboid3D() {
        if (!isFlattened) return;
        const L = Math.max(Number(inputs.cuboid.L.value), 0.01);
        const W = Math.max(Number(inputs.cuboid.W.value), 0.01);
        const H = Math.max(Number(inputs.cuboid.H.value), 0.01);
        // remove net and rebuild 3D cuboid
        if (netGroup) { netGroup.traverse(obj => { if (obj.isMesh) obj.geometry.dispose(); }); target.remove(netGroup); netGroup = null; }
        isFlattened = false;
        btnBack3d.classList.add('hidden');
        clearShape();
        createCuboid(L, W, H);
        const V = L * W * H;
        volumeValue.textContent = `${V.toFixed(3)} cm³`;
        const glasses = V / 220; glassCount.textContent = `${glasses.toFixed(2)} glasses (~${Math.ceil(glasses)})`;
        surfaceValue.textContent = `${surfaceAreaCuboid(L, W, H).toFixed(3)} cm²`;
        volumeFormula.textContent = 'V = L × W × H';
        animateFill('cuboid', { L, W, H });
    }

    function flattenCone() {
        shapeSelect.value = 'cone';
        updateInputsUI();
        const r = Math.max(Number(inputs.cone.r.value), 0.01);
        const h = Math.max(Number(inputs.cone.h.value), 0.01);
        // Clear 3D
        clearShape();
        const s = Math.sqrt(r*r + h*h); // slant height
        const theta = (2 * Math.PI * r) / s; // radians
        surfaceValue.textContent = `Lateral area: π r s = ${(Math.PI*r*s).toFixed(3)} cm²`;
        volumeFormula.textContent = `Sector radius s=${s.toFixed(3)}, angle θ=${(theta*180/Math.PI).toFixed(1)}°`;

        netGroup = new THREE.Group();
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 1.0 });
        // Sector for lateral surface
        const segs = 128;
        const shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.absarc(0,0, s, 0, theta, false);
        shape.lineTo(0,0);
        const geom = new THREE.ShapeGeometry(shape, segs);
        const mat = new THREE.MeshStandardMaterial({ color: 0x2b3d68, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide });
        const sector = new THREE.Mesh(geom, mat);
        sector.rotation.x = -Math.PI/2;
        sector.position.y = 0.002;
        netGroup.add(sector);
        // Sector edges
        const pts = geom.attributes.position; // not trivial to edge-extract from shape; draw approximate arc
        const arcGeom = new THREE.BufferGeometry().setFromPoints(
            Array.from({length: segs+1}, (_,i)=>{
                const ang = (i/segs)*theta; return new THREE.Vector3(Math.cos(ang)*s, 0, Math.sin(ang)*s);
            })
        );
        const arc = new THREE.Line(arcGeom, edgeMat);
        arc.rotation.x = -Math.PI/2; arc.position.y = 0.003; netGroup.add(arc);

        // Base circle
        const baseGeom = new THREE.CircleGeometry(r, 96);
        const base = new THREE.Mesh(baseGeom, mat.clone());
        base.rotation.x = -Math.PI/2; base.position.set(s + r + 0.5, 0.002, 0);
        netGroup.add(base);
        const baseEdge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
            Array.from({length: 97}, (_,i)=>{ const a = (i/96)*2*Math.PI; return new THREE.Vector3(Math.cos(a)*r + s + r + 0.5, 0.003, Math.sin(a)*r); })
        ), edgeMat);
        netGroup.add(baseEdge);

        // Labels
        const label = createLabelSprite(`r=${r} cm, h=${h} cm, s=${s.toFixed(2)} cm, θ=${(theta*180/Math.PI).toFixed(1)}°`);
        label.position.set(0, 0.06, 0);
        label.material.depthTest = false; label.renderOrder = 1100; netGroup.add(label);

        target.add(netGroup);
        btnBack3d.classList.remove('hidden');
    }

    function flattenSphere() {
        shapeSelect.value = 'sphere';
        updateInputsUI();
        const r = Math.max(Number(inputs.sphere.r.value), 0.01);
        clearShape();
        const SA = 4*Math.PI*r*r;
        surfaceValue.textContent = `Surface area: 4πr² = ${SA.toFixed(3)} cm²`;
        volumeFormula.textContent = `A = 4πr², r = ${r} cm`;
        // Also show volume for reference
        volumeValue.textContent = `${((4/3)*Math.PI*r*r*r).toFixed(3)} cm³`;

        netGroup = new THREE.Group();
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 1.0 });
        const goreCount = 12; // adjustable quality
        const goreWidth = (2*Math.PI*r)/goreCount; // arc length around equator per gore
        const mat = new THREE.MeshStandardMaterial({ color: 0x2b3d68, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide });
        // Build gores as tapered rectangles approximating curvature by vertical segments
        const rings = 24;
        const spacing = goreWidth + 0.2;
        for (let g=0; g<goreCount; g++) {
            const pointsTop = [];
            const pointsBot = [];
            for (let i=0;i<=rings;i++) {
                const v = -Math.PI/2 + (i/rings)*Math.PI; // latitude
                const radiusAtLat = r * Math.cos(v);
                const halfWidth = (radiusAtLat / r) * (goreWidth/2);
                pointsTop.push(new THREE.Vector3(-halfWidth, 0, (i/rings)*(2*r) - r));
                pointsBot.push(new THREE.Vector3( halfWidth, 0, (i/rings)*(2*r) - r));
            }
            const shape = new THREE.Shape(pointsTop.map(p=>new THREE.Vector2(p.x, p.z)));
            for (let i=pointsBot.length-1;i>=0;i--) shape.lineTo(pointsBot[i].x, pointsBot[i].z);
            const geom = new THREE.ShapeGeometry(shape, 64);
            const mesh = new THREE.Mesh(geom, mat);
            mesh.rotation.x = -Math.PI/2;
            mesh.position.x = g*spacing;
            mesh.position.y = 0.002;
            netGroup.add(mesh);
            // edges
            const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geom), edgeMat);
            edge.rotation.x = -Math.PI/2; edge.position.x = g*spacing; edge.position.y = 0.003; netGroup.add(edge);
        }
        // Label
        const label = createLabelSprite(`r=${r} cm, gores=${goreCount}`);
        label.position.set((goreCount*spacing)/2 - spacing/2, 0.06, -r-0.5);
        label.material.depthTest = false; label.renderOrder = 1100; netGroup.add(label);

        target.add(netGroup);
        btnBack3d.classList.remove('hidden');
    }

    function flattenCylinder() {
        shapeSelect.value = 'cylinder';
        updateInputsUI();
        const r = Math.max(Number(inputs.cylinder.r.value), 0.01);
        const h = Math.max(Number(inputs.cylinder.h.value), 0.01);
        clearShape();
        surfaceValue.textContent = `Surface area: 2πrh + 2πr² = ${(2*Math.PI*r*h + 2*Math.PI*r*r).toFixed(3)} cm²`;
        volumeFormula.textContent = `Lateral: rectangle ${h} × ${ (2*Math.PI*r).toFixed(2) } + two bases r=${r}`;

        netGroup = new THREE.Group();
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 1.0 });
        const mat = new THREE.MeshStandardMaterial({ color: 0x2b3d68, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide });

        // Lateral rectangle: height h, width = circumference 2πr
        const width = 2 * Math.PI * r;
        const rectGeom = new THREE.PlaneGeometry(width, h);
        const rect = new THREE.Mesh(rectGeom, mat);
        rect.rotation.x = -Math.PI/2; rect.position.set(0, 0.002, 0);
        netGroup.add(rect);
        const rectEdge = new THREE.LineSegments(new THREE.EdgesGeometry(rectGeom), edgeMat);
        rectEdge.rotation.x = -Math.PI/2; rectEdge.position.set(0, 0.003, 0); rectEdge.material.depthTest=false; rectEdge.renderOrder=1000; netGroup.add(rectEdge);
        let lbl = createLabelSprite(`h=${h} cm, width=2πr=${width.toFixed(2)} cm`);
        lbl.position.set(0, 0.06, 0); lbl.material.depthTest=false; lbl.renderOrder=1100; netGroup.add(lbl);

        // Two base circles left and right of rectangle
        const baseGeom = new THREE.CircleGeometry(r, 96);
        const base1 = new THREE.Mesh(baseGeom, mat.clone());
        base1.rotation.x = -Math.PI/2; base1.position.set(-(width/2 + r + 0.5), 0.002, 0);
        netGroup.add(base1);
        const base1Edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
            Array.from({length: 97}, (_,i)=>{ const a=(i/96)*2*Math.PI; return new THREE.Vector3(Math.cos(a)*r - (width/2 + r + 0.5), 0.003, Math.sin(a)*r); })
        ), edgeMat); netGroup.add(base1Edge);

        const base2 = new THREE.Mesh(baseGeom, mat.clone());
        base2.rotation.x = -Math.PI/2; base2.position.set((width/2 + r + 0.5), 0.002, 0);
        netGroup.add(base2);
        const base2Edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
            Array.from({length: 97}, (_,i)=>{ const a=(i/96)*2*Math.PI; return new THREE.Vector3(Math.cos(a)*r + (width/2 + r + 0.5), 0.003, Math.sin(a)*r); })
        ), edgeMat); netGroup.add(base2Edge);

        target.add(netGroup);
        btnBack3d.classList.remove('hidden');
    }

    // Shape input switching
    function updateInputsUI() {
        const value = shapeSelect.value;
        inputs.cuboid.root.classList.toggle('hidden', value !== 'cuboid');
        inputs.sphere.root.classList.toggle('hidden', value !== 'sphere');
        inputs.cone.root.classList.toggle('hidden', value !== 'cone');
        inputs.cylinder.root.classList.toggle('hidden', value !== 'cylinder');
        inputs.triangularPrism.root.classList.toggle('hidden', value !== 'triangularPrism');
    }

    shapeSelect.addEventListener('change', updateInputsUI);
    btnVisualize.addEventListener('click', visualize);
    btnSurface.addEventListener('click', () => {
        const shape = shapeSelect.value;
        if (shape === 'cuboid') return flattenCuboid();
        if (shape === 'cone') return flattenCone();
        if (shape === 'sphere') return flattenSphere();
        if (shape === 'cylinder') return flattenCylinder();
    });
    btnBack3d.addEventListener('click', rebuildCuboid3D);
    btnReset.addEventListener('click', () => { clearShape(); volumeValue.textContent = '—'; volumeFormula.textContent = '—'; surfaceValue.textContent = '—'; glassCount.textContent = '—'; });

    // Enter key triggers visualize
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') visualize();
    });

    // Basic render loop
    function render() {
        camera.lookAt(target.position);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();

    // Initialize
    updateInputsUI();
    // Default to cuboid selection and auto-visualize
    shapeSelect.value = 'cuboid';
    setTimeout(() => {
        btnVisualize && btnVisualize.click();
    }, 50);
    }
})();

// Trick Trig: Pythagorean theorem with 3 squares and pouring animation
(function(){
    // DOM elements for Trick Trig view
    const trigTab = document.querySelector('.mathviz-sidebar [data-view="trig"]');
    const volumeTab = document.querySelector('.mathviz-sidebar [data-view="volume3d"]');
    const viewVolume = document.getElementById('view-volume3d');
    const viewTrig = document.getElementById('view-trig');
    if (!trigTab || !viewTrig) return;

    // Enable tab switching only for these two views
    function activate(view){
        if (view === 'trig') {
            viewTrig.classList.add('active');
            viewVolume.classList.remove('active');
            trigTab.classList.add('active');
            volumeTab && volumeTab.classList.remove('active');
            document.body.classList.add('tt-active');
            // ensure SVG exists
            ensureSVG();
            // apply default
            applyInputs();
        } else {
            viewVolume.classList.add('active');
            viewTrig.classList.remove('active');
            volumeTab && volumeTab.classList.add('active');
            trigTab.classList.remove('active');
            document.body.classList.remove('tt-active');
        }
    }
    trigTab.addEventListener('click', () => activate('trig'));
    volumeTab && volumeTab.addEventListener('click', () => activate('volume3d'));

    const aInput = document.getElementById('tt-legA');
    const bInput = document.getElementById('tt-legB');
    const cInput = document.getElementById('tt-hypC');
    const applyBtn = document.getElementById('tt-apply');
    const animBtn = document.getElementById('tt-animate');
    const resetBtn = document.getElementById('tt-reset');
    const tabs = document.querySelectorAll('.tt-tab');
    const pythMount = document.getElementById('tt-mount');
    const trigBasicMount = document.getElementById('tb-mount');
    const trigBasicGraph = document.getElementById('tb-graph');
    const errBox = document.getElementById('tt-error');
    const mount = document.getElementById('tt-mount');
    if (!aInput || !bInput || !cInput || !applyBtn || !animBtn || !resetBtn || !mount) return;

    let svg, gRoot, liquidA, liquidB, liquidC, squareA, squareB, squareC, triGroup;

    function ensureSVG(){
        if (svg) return;
        svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 800 520');
        svg.setAttribute('class','tt-svg');
        gRoot = document.createElementNS('http://www.w3.org/2000/svg','g');
        svg.appendChild(gRoot);
        mount.innerHTML = '';
        mount.appendChild(svg);
    }

    function isRightTriangle(a,b,c){
        const sides = [a,b,c].map(Number).sort((x,y)=>x-y);
        const aa = sides[0], bb = sides[1], cc = sides[2];
        if (!(aa>0 && bb>0 && cc>0)) return false;
        const lhs = aa*aa + bb*bb;
        const rhs = cc*cc;
        const tol = Math.max(1e-6, 1e-3 * rhs);
        return Math.abs(lhs - rhs) <= tol;
    }

    function drawScene(a, b, c){
        gRoot.innerHTML = '';
        // scale to fit: map longest side to ~220 px for clear squares
        const longest = Math.max(a,b,c);
        const unit = 220 / longest;
        const ax = 160, ay = 340; // base left point
        const bx = ax + a*unit, by = ay; // base right
        const cy = ay - b*unit; const cx = ax; // vertical leg up

        // triangle
        triGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        const tri = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        tri.setAttribute('points', `${ax},${ay} ${bx},${by} ${cx},${cy}`);
        tri.setAttribute('fill','rgba(148,163,184,0.25)');
        tri.setAttribute('stroke','#e2e8f0'); tri.setAttribute('stroke-width','2');
        triGroup.appendChild(tri);
        // right angle marker at A
        const m = 12;
        const ra = document.createElementNS('http://www.w3.org/2000/svg','polyline');
        ra.setAttribute('points', `${ax},${ay} ${ax+m},${ay} ${ax+m},${ay-m}`);
        ra.setAttribute('fill','none'); ra.setAttribute('stroke','#e2e8f0'); ra.setAttribute('stroke-width','2');
        triGroup.appendChild(ra);
        // labels
        const lblA = label((`a = ${a}`), (ax+bx)/2, ay+18);
        const lblB = label((`b = ${b}`), ax-18, (ay+cy)/2);
        const midHx = (bx+cx)/2, midHy = (by+cy)/2;
        const lblC = label((`c = ${c}`), midHx+10, midHy-10);
        triGroup.appendChild(lblA); triGroup.appendChild(lblB); triGroup.appendChild(lblC);
        gRoot.appendChild(triGroup);

        // Squares attached to each side
        // Square on side a (base AB) outward below
        const aLen = a*unit; const aX = ax; const aY = ay;
        squareA = rect(aX, aY, aLen, aLen, 'bottom');
        gRoot.appendChild(squareA);
        // liquid A
        liquidA = liquidRect(aX, aY, aLen, aLen, 'A');
        gRoot.appendChild(liquidA);

        // Square on side b (vertical AC) outward left
        const bLen = b*unit; const bX = ax; const bY = cy;
        squareB = rect(bX, bY, bLen, bLen, 'left');
        gRoot.appendChild(squareB);
        // Position liquid B using the same reference corner as the square; helper offsets inside
        liquidB = liquidRect(bX, bY, bLen, bLen, 'B');
        gRoot.appendChild(liquidB);

        // Square on hypotenuse c, constructed outward of hypotenuse (rotated)
        const hx = bx - cx, hy = by - cy; // vector along hypotenuse from C to B
        const hLen = Math.sqrt(hx*hx + hy*hy);
        const ux = hx / hLen, uy = hy / hLen; // unit along hyp
        const nx = uy, ny = -ux; // outward normal flipped to opposite side
        const cLen = c*unit;
        const p0x = cx, p0y = cy;
        const p1x = bx, p1y = by;
        const p2x = p1x + nx * cLen, p2y = p1y + ny * cLen;
        const p3x = p0x + nx * cLen, p3y = p0y + ny * cLen;
        squareC = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        squareC.setAttribute('points', `${p0x},${p0y} ${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`);
        squareC.setAttribute('class','tt-square hyp');
        gRoot.appendChild(squareC);

        // empty destination liquid shape placed inside hyp square (start at 0 area)
        liquidC = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        liquidC.setAttribute('points', `${p0x},${p0y}`);
        liquidC.setAttribute('class','tt-liquid-c');
        liquidC.style.opacity = '0.0';
        gRoot.appendChild(liquidC);
    }

    function rect(x,y,w,h,anchor){
        const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
        let rx = x, ry = y;
        if (anchor === 'bottom') { ry = y; rx = x; }
        if (anchor === 'left') { rx = x - w; ry = y; }
        r.setAttribute('x', rx);
        r.setAttribute('y', ry);
        r.setAttribute('width', w);
        r.setAttribute('height', h);
        r.setAttribute('class','tt-square');
        return r;
    }
    function liquidRect(x,y,w,h,kind){
        const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
        let rx = x, ry = y;
        if (kind === 'A') { ry = y; rx = x; }
        if (kind === 'B') { rx = x; ry = y; }
        r.setAttribute('x', kind==='A' ? x : x - w);
        r.setAttribute('y', y);
        r.setAttribute('width', w);
        r.setAttribute('height', h);
        r.setAttribute('class', kind==='A' ? 'tt-liquid' : 'tt-liquid-b');
        return r;
    }
    function label(text, x, y){
        const t = document.createElementNS('http://www.w3.org/2000/svg','text');
        t.textContent = text; t.setAttribute('x', x); t.setAttribute('y', y); t.setAttribute('class','tt-label');
        return t;
    }

    function applyInputs(){
        const a = Number(aInput.value);
        const b = Number(bInput.value);
        const c = Number(cInput.value);
        const ok = isRightTriangle(a,b,c);
        errBox.classList.toggle('hidden', ok);
        if (!ok) return;
        drawScene(a,b,c);
    }

    function reset(){
        aInput.value = '6';
        bInput.value = '8';
        cInput.value = '10';
        errBox.classList.add('hidden');
        applyInputs();
    }

    function animatePour(){
        const a = Number(aInput.value), b = Number(bInput.value), c = Number(cInput.value);
        if (!isRightTriangle(a,b,c)) { errBox.classList.remove('hidden'); return; }
        // animate transfer: shrink A and B liquid heights to 0 while growing C polygon to hyp square
        const rectA = liquidA; const rectB = liquidB; const polyC = liquidC; const hypSq = squareC;
        const hypPoints = hypSq.getAttribute('points');
        const pts = hypPoints.split(' ').map(p=>p.split(',').map(Number));
        const [p0, p1, p2, p3] = pts;
        const startH_A = Number(rectA.getAttribute('height'));
        const startH_B = Number(rectB.getAttribute('height'));
        const startYA = Number(rectA.getAttribute('y'));
        const startYB = Number(rectB.getAttribute('y'));
        const startXA = Number(rectA.getAttribute('x'));
        const startXB = Number(rectB.getAttribute('x'));
        const dur = 1600;
        const t0 = performance.now();
        function ease(x){ return 1 - Math.pow(1-x,3); }
        function lerp(a,b,t){ return a + (b-a)*t; }
        function frame(now){
            const t = Math.min(1, (now - t0) / dur);
            const e = ease(t);
            // shrink A height
            const hA = (1-e) * startH_A;
            rectA.setAttribute('height', Math.max(0, hA));
            rectA.setAttribute('y', startYA + (startH_A - hA));
            // shrink B height
            const hB = (1-e) * startH_B;
            rectB.setAttribute('height', Math.max(0, hB));
            rectB.setAttribute('y', startYB + (startH_B - hB));
            // grow C polygon from p0 towards full square
            polyC.style.opacity = String(0.15 + 0.85*e);
            const q0 = [lerp(p0[0], p0[0], e), lerp(p0[1], p0[1], e)];
            const q1 = [lerp(p0[0], p1[0], e), lerp(p0[1], p1[1], e)];
            const q2 = [lerp(p0[0], p2[0], e), lerp(p0[1], p2[1], e)];
            const q3 = [lerp(p0[0], p3[0], e), lerp(p0[1], p3[1], e)];
            polyC.setAttribute('points', `${q0[0]},${q0[1]} ${q1[0]},${q1[1]} ${q2[0]},${q2[1]} ${q3[0]},${q3[1]}`);
            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // wire buttons
    applyBtn.addEventListener('click', applyInputs);
    resetBtn.addEventListener('click', reset);
    animBtn.addEventListener('click', animatePour);

    // subview switching: Pythagoras vs Trig Basic (placeholder)
    const pythControls = document.getElementById('pyth-controls');
    const tbControls = document.getElementById('tb-controls');
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.getAttribute('data-subview');
            if (view === 'pythagoras') {
                pythMount.classList.add('active');
                pythMount.classList.remove('hidden');
                trigBasicMount.classList.remove('active');
                trigBasicMount.classList.add('hidden');
                trigBasicGraph.classList.remove('active');
                trigBasicGraph.classList.add('hidden');
                pythControls.classList.remove('hidden');
                tbControls.classList.add('hidden');
            } else {
                trigBasicMount.classList.add('active');
                trigBasicMount.classList.remove('hidden');
                trigBasicGraph.classList.add('active');
                trigBasicGraph.classList.remove('hidden');
                pythMount.classList.remove('active');
                pythMount.classList.add('hidden');
                pythControls.classList.add('hidden');
                tbControls.classList.remove('hidden');
            }
        });
    });

    // default state prepared but don't switch tabs automatically
    ensureSVG();
    reset();

    // Trig Basic Implementation
    let tbSvg = null, tbCircleG = null, tbAngle = 0; // radians
    let tbPoint = null, tbProjX = null, tbProjY = null, tbAxisG = null, tbGridG = null;
    let tbXYLabel = null, tbAngleLabel = null;
    let tbGraphSvg = null, tbCosPath = null, tbSinPath = null, tbTanPath = null, tbMarker = null, tbAngleGraphLabel = null, tbVerticalLine = null;
    const TB_GRAPH_LEFT = 40, TB_GRAPH_RIGHT = 20, TB_GRAPH_AMP = 60;
    const TB_TAN_SCALE = Math.round(TB_GRAPH_AMP * 0.5); // smaller tan amplitude so it fits area
    const DEG = Math.PI / 180;
    const tbAngleText = document.getElementById('tb-angle-text');
    const tbXYText = document.getElementById('tb-xy-text');
    const tbCosText = document.getElementById('tb-cos-text');
    const tbSinText = document.getElementById('tb-sin-text');
    const tbTanText = document.getElementById('tb-tan-text');
    const tbShowLabels = document.getElementById('tb-show-labels');
    const tbDegRadio = document.getElementById('tb-deg');
    const tbRadRadio = document.getElementById('tb-rad');

    function tbEnsureSVGS(){
        if (!tbSvg) {
            tbSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            tbSvg.setAttribute('viewBox','0 0 800 360');
            tbSvg.setAttribute('class','tt-svg');
            trigBasicMount.innerHTML = '';
            trigBasicMount.appendChild(tbSvg);

            tbGridG = document.createElementNS('http://www.w3.org/2000/svg','g');
            tbSvg.appendChild(tbGridG);
            tbAxisG = document.createElementNS('http://www.w3.org/2000/svg','g');
            tbSvg.appendChild(tbAxisG);
            tbCircleG = document.createElementNS('http://www.w3.org/2000/svg','g');
            tbSvg.appendChild(tbCircleG);
        }
        if (!tbGraphSvg) {
            tbGraphSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            tbGraphSvg.setAttribute('viewBox','0 0 800 180');
            tbGraphSvg.setAttribute('class','tt-svg');
            trigBasicGraph.innerHTML = '';
            trigBasicGraph.appendChild(tbGraphSvg);
        }
    }

    function tbDrawGrid(show){
        tbGridG.innerHTML = '';
        if (!show) return;
        const gcol = 'rgba(255,255,255,0.15)';
        for (let x=0; x<=800; x+=80) addLine(tbGridG, x, 20, x, 500, gcol);
        for (let y=20; y<=500; y+=80) addLine(tbGridG, 0, y, 800, y, gcol);
    }
    function tbDrawAxes(){
        tbAxisG.innerHTML='';
        addLine(tbAxisG, 100, 180, 700, 180, '#e2e8f0'); // x
        addLine(tbAxisG, 400, 20, 400, 340, '#e2e8f0'); // y
        // labels
        addText(tbAxisG, 'x', 690, 165);
        addText(tbAxisG, 'y', 412, 32);
    }
    function addLine(parent, x1,y1,x2,y2, stroke){
        const l = document.createElementNS('http://www.w3.org/2000/svg','line');
        l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',x2); l.setAttribute('y2',y2);
        l.setAttribute('stroke',stroke); l.setAttribute('stroke-width','2');
        l.setAttribute('opacity','0.9');
        parent.appendChild(l);
    }
    function addText(parent, text, x, y){
        const t = document.createElementNS('http://www.w3.org/2000/svg','text');
        t.textContent=text; t.setAttribute('x',x); t.setAttribute('y',y); t.setAttribute('class','tt-label');
        parent.appendChild(t);
    }

    function tbDrawCircle(){
        tbCircleG.innerHTML='';
        const R = 130; const cx = 400, cy = 180;
        // circle
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',cx); c.setAttribute('cy',cy); c.setAttribute('r',R);
        c.setAttribute('fill','rgba(0,0,0,0)'); c.setAttribute('stroke','#000'); c.setAttribute('stroke-width','3');
        tbCircleG.appendChild(c);
        // grid square
        const grid = document.createElementNS('http://www.w3.org/2000/svg','rect');
        grid.setAttribute('x', cx-R); grid.setAttribute('y', cy-R); grid.setAttribute('width', R*2); grid.setAttribute('height', R*2);
        grid.setAttribute('fill','rgba(0,0,0,0)'); grid.setAttribute('stroke','#000'); grid.setAttribute('stroke-width','2'); grid.setAttribute('opacity','0.4');
        tbCircleG.appendChild(grid);

        // phasor arm
        const arm = document.createElementNS('http://www.w3.org/2000/svg','line'); arm.setAttribute('stroke','#ffffff'); arm.setAttribute('stroke-width','2'); arm.setAttribute('marker-end','url(#tb-arrow)');
        // arrow marker
        let defs = tbSvg.querySelector('defs'); if (!defs){ defs = document.createElementNS('http://www.w3.org/2000/svg','defs'); tbSvg.appendChild(defs); }
        if (!tbSvg.querySelector('#tb-arrow')){
            const m = document.createElementNS('http://www.w3.org/2000/svg','marker'); m.setAttribute('id','tb-arrow'); m.setAttribute('markerWidth','8'); m.setAttribute('markerHeight','8'); m.setAttribute('refX','7'); m.setAttribute('refY','3'); m.setAttribute('orient','auto');
            const path = document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d','M0,0 L0,6 L7,3 z'); path.setAttribute('fill','#2563eb'); m.appendChild(path); defs.appendChild(m);
        }
        tbCircleG.appendChild(arm);

        // projections
        tbProjX = document.createElementNS('http://www.w3.org/2000/svg','line'); tbProjX.setAttribute('stroke','#22c55e'); tbProjX.setAttribute('stroke-width','4');
        tbProjY = document.createElementNS('http://www.w3.org/2000/svg','line'); tbProjY.setAttribute('stroke','#2563eb'); tbProjY.setAttribute('stroke-width','4');
        tbCircleG.appendChild(tbProjX); tbCircleG.appendChild(tbProjY);

        // draggable point
        tbPoint = document.createElementNS('http://www.w3.org/2000/svg','circle'); tbPoint.setAttribute('r','3.5'); tbPoint.setAttribute('fill','#ef4444'); tbCircleG.appendChild(tbPoint);

        // labels inside phasor: (x,y) next to red point, and angle near center
        tbXYLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        tbXYLabel.setAttribute('class','tt-label'); tbXYLabel.setAttribute('text-anchor','start');
        tbCircleG.appendChild(tbXYLabel);
        tbAngleLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        tbAngleLabel.setAttribute('class','tt-label'); tbAngleLabel.setAttribute('text-anchor','middle');
        tbCircleG.appendChild(tbAngleLabel);

        function updateArm(){
            const x = cx + R * Math.cos(tbAngle); const y = cy - R * Math.sin(tbAngle);
            arm.setAttribute('x1', cx); arm.setAttribute('y1', cy); arm.setAttribute('x2', x); arm.setAttribute('y2', y);
            tbPoint.setAttribute('cx', x); tbPoint.setAttribute('cy', y);
            // projections
            tbProjX.setAttribute('x1', cx); tbProjX.setAttribute('y1', y); tbProjX.setAttribute('x2', x); tbProjX.setAttribute('y2', y);
            tbProjY.setAttribute('x1', x); tbProjY.setAttribute('y1', cy); tbProjY.setAttribute('x2', x); tbProjY.setAttribute('y2', y);
            tbUpdateGraphs();
            // labels
            const isRadMode = tbRadRadio && tbRadRadio.checked;
            if (tbAngleText) {
                if (isRadMode) {
                    const rad = ((tbAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
                    tbAngleText.textContent = `${rad.toFixed(3)} rad`;
                } else {
                    const rawDeg = (tbAngle*180/Math.PI);
                    const deg = ((rawDeg % 360) + 360) % 360;
                    tbAngleText.textContent = `${deg.toFixed(1)}°`;
                }
            }
            const cosv = Math.cos(tbAngle), sinv = Math.sin(tbAngle);
            if (tbXYText) tbXYText.textContent = `(${cosv.toFixed(3)}, ${sinv.toFixed(3)})`;
            if (tbCosText) tbCosText.textContent = `${cosv.toFixed(3)}`;
            if (tbSinText) tbSinText.textContent = `${sinv.toFixed(3)}`;
            if (tbTanText) {
                const tanv = Math.abs(cosv) < 1e-6 ? '∞' : (sinv/cosv).toFixed(3);
                tbTanText.textContent = `${tanv}`;
            }
            const show = tbShowLabels ? tbShowLabels.checked : true;
            if (tbAngleText && tbXYText) {
                const container = document.getElementById('tb-values');
                if (container) container.style.display = show ? '' : 'none';
            }
            // position in-figure labels
            if (tbXYLabel && tbAngleLabel) {
                tbXYLabel.textContent = `(${cosv.toFixed(3)}, ${sinv.toFixed(3)})`;
                tbXYLabel.setAttribute('x', x + 10);
                tbXYLabel.setAttribute('y', y - 10);
                tbXYLabel.style.display = show ? '' : 'none';
                if (isRadMode) {
                    const rad = ((tbAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
                    tbAngleLabel.textContent = `θ = ${rad.toFixed(3)} rad`;
                } else {
                    const rawDeg = (tbAngle*180/Math.PI);
                    const deg = ((rawDeg % 360) + 360) % 360;
                    tbAngleLabel.textContent = `θ = ${deg.toFixed(1)}°`;
                }
                tbAngleLabel.setAttribute('x', cx);
                tbAngleLabel.setAttribute('y', cy - (R*0.55));
                tbAngleLabel.style.display = show ? '' : 'none';
            }
        }

        function onDrag(e){
            const pt = tbSvg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
            const ctm = tbSvg.getScreenCTM(); if (!ctm) return; const ip = pt.matrixTransform(ctm.inverse());
            const dx = ip.x - cx; const dy = ip.y - cy; tbAngle = Math.atan2(-dy, dx); // y down => invert
            updateArm();
        }
        function startDrag(e){ e.preventDefault(); window.addEventListener('mousemove', onDrag); window.addEventListener('mouseup', stopDrag); }
        function stopDrag(){ window.removeEventListener('mousemove', onDrag); window.removeEventListener('mouseup', stopDrag); }
        tbPoint.addEventListener('mousedown', startDrag);
        tbCircleG.addEventListener('mousedown', startDrag);

        updateArm();
    }

    function tbBuildGraph(){
        const g = tbGraphSvg; g.innerHTML='';
        const w=800,h=180, cx=0, cy=h/2; const xAxis = document.createElementNS('http://www.w3.org/2000/svg','line');
        xAxis.setAttribute('x1', String(TB_GRAPH_LEFT)); xAxis.setAttribute('y1',cy); xAxis.setAttribute('x2', String(w - TB_GRAPH_RIGHT)); xAxis.setAttribute('y2',cy); xAxis.setAttribute('stroke','#e2e8f0'); xAxis.setAttribute('stroke-width','2'); g.appendChild(xAxis);
        // grid ticks
        if (document.getElementById('tb-show-grid').checked){
            for (let x=TB_GRAPH_LEFT; x<=w-TB_GRAPH_RIGHT; x+=80){ const l=document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',x); l.setAttribute('y1','20'); l.setAttribute('x2',x); l.setAttribute('y2',h-20); l.setAttribute('stroke','rgba(255,255,255,0.15)'); g.appendChild(l);}    
            for (let y=20; y<=h-20; y+=36){ const l=document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1', String(TB_GRAPH_LEFT)); l.setAttribute('y1',y); l.setAttribute('x2', String(w - TB_GRAPH_RIGHT)); l.setAttribute('y2',y); l.setAttribute('stroke','rgba(255,255,255,0.15)'); g.appendChild(l);}    
        }
        const pathCos = document.createElementNS('http://www.w3.org/2000/svg','path'); pathCos.setAttribute('fill','none'); pathCos.setAttribute('stroke','#2563eb'); pathCos.setAttribute('stroke-width','3');
        const pathSin = document.createElementNS('http://www.w3.org/2000/svg','path'); pathSin.setAttribute('fill','none'); pathSin.setAttribute('stroke','#22c55e'); pathSin.setAttribute('stroke-width','3');
        const pathTan = document.createElementNS('http://www.w3.org/2000/svg','path'); pathTan.setAttribute('fill','none'); pathTan.setAttribute('stroke','#f97316'); pathTan.setAttribute('stroke-width','2'); pathTan.setAttribute('opacity','0.95');
        const range = 2*Math.PI; // 0..2π width for compact view
        const x0 = TB_GRAPH_LEFT; const x1 = w - TB_GRAPH_RIGHT; const scaleX = (x1-x0)/range; const mid = cy; const amp = TB_GRAPH_AMP;
        // x-axis ticks (degrees or radians)
        const isRadMode = tbRadRadio && tbRadRadio.checked;
        let ticks, tickLabels;
        if (isRadMode) {
            ticks = [0, Math.PI/6, Math.PI/4, Math.PI/3, Math.PI/2, 2*Math.PI/3, 3*Math.PI/4, 5*Math.PI/6, Math.PI, 7*Math.PI/6, 5*Math.PI/4, 4*Math.PI/3, 3*Math.PI/2, 5*Math.PI/3, 7*Math.PI/4, 11*Math.PI/6, 2*Math.PI];
            tickLabels = ['0', 'π/6', 'π/4', 'π/3', 'π/2', '2π/3', '3π/4', '5π/6', 'π', '7π/6', '5π/4', '4π/3', '3π/2', '5π/3', '7π/4', '11π/6', '2π'];
        } else {
            ticks = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360].map(d => d * Math.PI / 180);
            tickLabels = ['0°', '30°', '45°', '60°', '90°', '120°', '135°', '150°', '180°', '210°', '225°', '240°', '270°', '300°', '315°', '330°', '360°'];
        }
        ticks.forEach((t, i) => {
            const x = x0 + t*scaleX;
            const tick = document.createElementNS('http://www.w3.org/2000/svg','line');
            tick.setAttribute('x1', String(x)); tick.setAttribute('y1', String(cy-4)); tick.setAttribute('x2', String(x)); tick.setAttribute('y2', String(cy+4));
            tick.setAttribute('stroke','#e2e8f0'); tick.setAttribute('stroke-width','1.5'); g.appendChild(tick);
            const lbl = document.createElementNS('http://www.w3.org/2000/svg','text');
            lbl.setAttribute('class','tt-label'); lbl.setAttribute('text-anchor','middle'); 
            // Alternate label positions to avoid overlap in radian mode
            const yPos = isRadMode && (i % 2 === 1) ? h-6 : h-12;
            lbl.setAttribute('x', String(x)); lbl.setAttribute('y', String(yPos));
            lbl.textContent = tickLabels[i];
            g.appendChild(lbl);
        });
        function build(fn){
            let d=''; let first=true; for (let t=0; t<=2*Math.PI; t+=0.02){ const x = x0 + t*scaleX; const y = mid - amp*fn(t); if(first){ d+=`M${x},${y}`; first=false;} else { d+=` L${x},${y}`; } }
            return d;
        }
        function buildTan(){
            const limitY = h/2 - 24; // keep a small margin
            let d=''; let penDown=false;
            // Draw clean segments between asymptotes at π/2 and 3π/2
            const asymptotes = [0.5*Math.PI, 1.5*Math.PI];
            const step = 0.004; // small step for smoothness
            let lastWasNear = false;
            for (let t=0; t<=2*Math.PI; t+=step){
                // detect proximity to any asymptote
                const near = asymptotes.some(a => Math.abs(t - a) < 0.03);
                const x = x0 + t*scaleX;
                if (near){ penDown=false; lastWasNear=true; continue; }
                const raw = Math.tan(t);
                let y = mid - TB_TAN_SCALE*raw;
                y = Math.max(mid - limitY, Math.min(mid + limitY, y));
                if (!penDown){ d += `M${x},${y}`; penDown=true; }
                else { d += ` L${x},${y}`; }
                lastWasNear=false;
            }
            return d;
        }
        if (document.getElementById('tb-show-cos').checked) { pathCos.setAttribute('d', build(Math.cos)); g.appendChild(pathCos); tbCosPath = pathCos; } else tbCosPath = null;
        if (document.getElementById('tb-show-sin').checked) { pathSin.setAttribute('d', build(Math.sin)); g.appendChild(pathSin); tbSinPath = pathSin; } else tbSinPath = null;
        if (document.getElementById('tb-show-tan').checked) {
            // add dashed asymptote lines at π/2 and 3π/2
            const asym = [0.5*Math.PI, 1.5*Math.PI];
            asym.forEach(a => {
                const ax = x0 + a*scaleX;
                const l = document.createElementNS('http://www.w3.org/2000/svg','line');
                l.setAttribute('x1', String(ax)); l.setAttribute('y1','20'); l.setAttribute('x2', String(ax)); l.setAttribute('y2', String(h-20));
                l.setAttribute('stroke','#f97316'); l.setAttribute('stroke-width','1.5'); l.setAttribute('stroke-dasharray','6 6'); l.setAttribute('opacity','0.6');
                g.appendChild(l);
            });
            pathTan.setAttribute('d', buildTan()); g.appendChild(pathTan); tbTanPath = pathTan;
        } else tbTanPath = null;

        // marker for current angle on graph
        tbMarker = document.createElementNS('http://www.w3.org/2000/svg','circle'); tbMarker.setAttribute('r','4'); tbMarker.setAttribute('fill','#ef4444'); g.appendChild(tbMarker);
        // vertical line pointer
        tbVerticalLine = document.createElementNS('http://www.w3.org/2000/svg','line'); tbVerticalLine.setAttribute('stroke','#ef4444'); tbVerticalLine.setAttribute('stroke-width','2'); tbVerticalLine.setAttribute('opacity','0.8'); g.appendChild(tbVerticalLine);
        // angle label on graph
        tbAngleGraphLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        tbAngleGraphLabel.setAttribute('class','tt-label'); tbAngleGraphLabel.setAttribute('text-anchor','middle');
        g.appendChild(tbAngleGraphLabel);
        tbUpdateGraphs();
    }

    function tbUpdateGraphs(){
        if (!tbGraphSvg) return;
        const w=800,h=180, x0=TB_GRAPH_LEFT, x1=w-TB_GRAPH_RIGHT; const range = 2*Math.PI; const scaleX = (x1-x0)/range; const mid=h/2, amp=TB_GRAPH_AMP;
        const t = ((tbAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
        const x = x0 + t*scaleX;
        let y = null;
        if (tbCosPath) { y = mid - amp*Math.cos(tbAngle); }
        else if (tbSinPath) { y = mid - amp*Math.sin(tbAngle); }
        else if (tbTanPath) {
            const limitY = h/2 - 24;
            if (Math.abs(Math.cos(tbAngle)) < 0.05) {
                y = null; // hide marker at asymptote
            } else {
                y = mid - TB_TAN_SCALE*Math.tan(tbAngle);
                y = Math.max(mid - limitY, Math.min(mid + limitY, y));
            }
        }
        if (tbMarker && y !== null){
            tbMarker.setAttribute('cx', x); tbMarker.setAttribute('cy', y); tbMarker.style.display = '';
            if (tbVerticalLine) {
                tbVerticalLine.setAttribute('x1', String(x)); tbVerticalLine.setAttribute('y1', '20');
                tbVerticalLine.setAttribute('x2', String(x)); tbVerticalLine.setAttribute('y2', String(h-20));
                tbVerticalLine.style.display = '';
            }
        } else if (tbMarker){ 
            tbMarker.style.display = 'none'; 
            if (tbVerticalLine) tbVerticalLine.style.display = 'none';
        }
        // angle label
        if (tbAngleGraphLabel){
            const isRadMode = tbRadRadio && tbRadRadio.checked;
            if (isRadMode) {
                const rad = ((tbAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
                tbAngleGraphLabel.textContent = `θ = ${rad.toFixed(3)} rad`;
            } else {
                const d = ((tbAngle*180/Math.PI)%360+360)%360;
                tbAngleGraphLabel.textContent = `θ = ${d.toFixed(1)}°`;
            }
            tbAngleGraphLabel.setAttribute('x', x);
            tbAngleGraphLabel.setAttribute('y', 24);
            tbAngleGraphLabel.style.display = (tbShowLabels && tbShowLabels.checked) ? '' : 'none';
        }
    }

    function tbReset(){ tbAngle = 30*DEG; tbEnsureSVGS(); tbDrawGrid(document.getElementById('tb-show-grid').checked); tbDrawAxes(); tbDrawCircle(); tbBuildGraph(); }

    // controls
    document.getElementById('tb-reset').addEventListener('click', tbReset);
    document.getElementById('tb-show-grid').addEventListener('change', ()=>{ if (!tbSvg) return; tbDrawGrid(document.getElementById('tb-show-grid').checked); });
    ['tb-show-cos','tb-show-sin','tb-show-tan'].forEach(id=>{ const el=document.getElementById(id); el.addEventListener('change', ()=>{ if (!tbGraphSvg) return; tbBuildGraph(); }); });
    if (tbShowLabels) tbShowLabels.addEventListener('change', ()=>{ const container = document.getElementById('tb-values'); if (container) container.style.display = tbShowLabels.checked ? '' : 'none'; });
    // radian/degree mode switching
    if (tbDegRadio) tbDegRadio.addEventListener('change', ()=>{ if (tbGraphSvg) tbBuildGraph(); });
    if (tbRadRadio) tbRadRadio.addEventListener('change', ()=>{ if (tbGraphSvg) tbBuildGraph(); });

    // when switching to trig-basic tab, initialize if needed
    tabs.forEach(btn => { btn.addEventListener('click', () => { const view = btn.getAttribute('data-subview'); if (view === 'trig-basic') { tbReset(); } }); });
})();

// Circle: Interactive circle visualization with area, circumference, and diameter calculations
(function(){
    // DOM elements for Circle view
    const circleTab = document.querySelector('.mathviz-sidebar [data-view="circle"]');
    const volumeTab = document.querySelector('.mathviz-sidebar [data-view="volume3d"]');
    const trigTab = document.querySelector('.mathviz-sidebar [data-view="trig"]');
    const viewCircle = document.getElementById('view-circle');
    const viewVolume = document.getElementById('view-volume3d');
    const viewTrig = document.getElementById('view-trig');
    if (!circleTab || !viewCircle) return;

    // Enable tab switching
    function activate(view){
        if (view === 'circle') {
            viewCircle.classList.add('active');
            viewVolume.classList.remove('active');
            viewTrig.classList.remove('active');
            circleTab.classList.add('active');
            volumeTab && volumeTab.classList.remove('active');
            trigTab && trigTab.classList.remove('active');
            document.body.classList.remove('tt-active');
            // ensure SVG exists
            ensureCircleSVG();
            // apply default
            calculateCircle();
        } else if (view === 'volume3d') {
            viewVolume.classList.add('active');
            viewCircle.classList.remove('active');
            viewTrig.classList.remove('active');
            volumeTab && volumeTab.classList.add('active');
            circleTab.classList.remove('active');
            trigTab && trigTab.classList.remove('active');
            document.body.classList.remove('tt-active');
        } else if (view === 'trig') {
            viewTrig.classList.add('active');
            viewVolume.classList.remove('active');
            viewCircle.classList.remove('active');
            trigTab && trigTab.classList.add('active');
            volumeTab && volumeTab.classList.remove('active');
            circleTab.classList.remove('active');
            document.body.classList.add('tt-active');
        }
    }
    circleTab.addEventListener('click', () => activate('circle'));
    volumeTab && volumeTab.addEventListener('click', () => activate('volume3d'));
    trigTab && trigTab.addEventListener('click', () => activate('trig'));

    const radiusInput = document.getElementById('circle-radius');
    const calculateBtn = document.getElementById('btn-circle-calculate');
    const resetBtn = document.getElementById('btn-circle-reset');
    const circleMount = document.getElementById('circle-mount');
    const circleArea = document.getElementById('circleArea');
    const circleCircumference = document.getElementById('circleCircumference');
    const circleDiameter = document.getElementById('circleDiameter');
    const circleFormula = document.getElementById('circleFormula');
    
    // Circle Theorems elements
    const theoremMount = document.getElementById('theorem-mount');
    const basicControls = document.getElementById('basic-circle-controls');
    const theoremsControls = document.getElementById('theorems-controls');
    const basicReadout = document.getElementById('basic-readout');
    const theoremReadout = document.getElementById('theorem-readout');
    const theoremTitle = document.getElementById('theoremTitle');
    const angle1 = document.getElementById('angle1');
    const angle2 = document.getElementById('angle2');
    const theoremExplanation = document.getElementById('theoremExplanation');
    const theoremResetBtn = document.getElementById('btn-theorem-reset');
    
    if (!radiusInput || !calculateBtn || !resetBtn || !circleMount) return;

    let circleSvg, circleG, circleElement, radiusLine, diameterLine, centerPoint, radiusLabel, diameterLabel, areaLabel;

    function ensureCircleSVG(){
        if (circleSvg) return;
        circleSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        circleSvg.setAttribute('viewBox','0 0 800 520');
        circleSvg.setAttribute('class','tt-svg');
        circleG = document.createElementNS('http://www.w3.org/2000/svg','g');
        circleSvg.appendChild(circleG);
        circleMount.innerHTML = '';
        circleMount.appendChild(circleSvg);
    }

    function drawCircle(radius){
        circleG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const scale = 20; // pixels per unit
        const scaledRadius = radius * scale;
        
        // Circle
        circleElement = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circleElement.setAttribute('cx', centerX);
        circleElement.setAttribute('cy', centerY);
        circleElement.setAttribute('r', scaledRadius);
        circleElement.setAttribute('fill', 'rgba(59, 130, 246, 0.1)');
        circleElement.setAttribute('stroke', '#3b82f6');
        circleElement.setAttribute('stroke-width', '3');
        circleG.appendChild(circleElement);
        
        // Center point
        centerPoint = document.createElementNS('http://www.w3.org/2000/svg','circle');
        centerPoint.setAttribute('cx', centerX);
        centerPoint.setAttribute('cy', centerY);
        centerPoint.setAttribute('r', '4');
        centerPoint.setAttribute('fill', '#ef4444');
        circleG.appendChild(centerPoint);
        
        // Radius line
        radiusLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        radiusLine.setAttribute('x1', centerX);
        radiusLine.setAttribute('y1', centerY);
        radiusLine.setAttribute('x2', centerX + scaledRadius);
        radiusLine.setAttribute('y2', centerY);
        radiusLine.setAttribute('stroke', '#22c55e');
        radiusLine.setAttribute('stroke-width', '3');
        radiusLine.setAttribute('marker-end', 'url(#circle-arrow)');
        circleG.appendChild(radiusLine);
        
        // Diameter line
        diameterLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        diameterLine.setAttribute('x1', centerX - scaledRadius);
        diameterLine.setAttribute('y1', centerY);
        diameterLine.setAttribute('x2', centerX + scaledRadius);
        diameterLine.setAttribute('y2', centerY);
        diameterLine.setAttribute('stroke', '#f97316');
        diameterLine.setAttribute('stroke-width', '2');
        diameterLine.setAttribute('stroke-dasharray', '5 5');
        circleG.appendChild(diameterLine);
        
        // Arrow marker
        let defs = circleSvg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
            circleSvg.appendChild(defs);
        }
        if (!circleSvg.querySelector('#circle-arrow')) {
            const marker = document.createElementNS('http://www.w3.org/2000/svg','marker');
            marker.setAttribute('id','circle-arrow');
            marker.setAttribute('markerWidth','8');
            marker.setAttribute('markerHeight','8');
            marker.setAttribute('refX','7');
            marker.setAttribute('refY','3');
            marker.setAttribute('orient','auto');
            const path = document.createElementNS('http://www.w3.org/2000/svg','path');
            path.setAttribute('d','M0,0 L0,6 L7,3 z');
            path.setAttribute('fill','#22c55e');
            marker.appendChild(path);
            defs.appendChild(marker);
        }
        
        // Labels
        radiusLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        radiusLabel.setAttribute('x', centerX + scaledRadius/2);
        radiusLabel.setAttribute('y', centerY - 10);
        radiusLabel.setAttribute('class', 'tt-label');
        radiusLabel.setAttribute('text-anchor', 'middle');
        radiusLabel.textContent = `r = ${radius}`;
        circleG.appendChild(radiusLabel);
        
        diameterLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        diameterLabel.setAttribute('x', centerX);
        diameterLabel.setAttribute('y', centerY - scaledRadius - 20);
        diameterLabel.setAttribute('class', 'tt-label');
        diameterLabel.setAttribute('text-anchor', 'middle');
        diameterLabel.textContent = `d = ${(2 * radius).toFixed(1)}`;
        circleG.appendChild(diameterLabel);
        
        // Area label
        areaLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        areaLabel.setAttribute('x', centerX);
        areaLabel.setAttribute('y', centerY + scaledRadius + 30);
        areaLabel.setAttribute('class', 'tt-label');
        areaLabel.setAttribute('text-anchor', 'middle');
        areaLabel.textContent = `A = πr² = π(${radius})²`;
        circleG.appendChild(areaLabel);
    }

    function calculateCircle(){
        const radius = Number(radiusInput.value);
        if (radius <= 0) {
            circleArea.textContent = 'Enter positive radius';
            circleCircumference.textContent = '—';
            circleDiameter.textContent = '—';
            circleFormula.textContent = '—';
            return;
        }
        
        const area = Math.PI * radius * radius;
        const circumference = 2 * Math.PI * radius;
        const diameter = 2 * radius;
        
        circleArea.textContent = `${area.toFixed(3)} units²`;
        circleCircumference.textContent = `${circumference.toFixed(3)} units`;
        circleDiameter.textContent = `${diameter.toFixed(3)} units`;
        circleFormula.textContent = `A = πr² = π(${radius})² = ${area.toFixed(3)}`;
        
        drawCircle(radius);
    }

    function resetCircle(){
        radiusInput.value = '5';
        calculateCircle();
    }

    // Event listeners
    calculateBtn.addEventListener('click', calculateCircle);
    resetBtn.addEventListener('click', resetCircle);
    radiusInput.addEventListener('input', calculateCircle);
    
    // Enter key triggers calculation
    radiusInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calculateCircle();
    });

    // Circle Theorems functionality
    let theoremSvg, theoremG, currentTheorem = 1;
    
    function ensureTheoremSVG(){
        if (theoremSvg) return;
        theoremSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        theoremSvg.setAttribute('viewBox','0 0 800 520');
        theoremSvg.setAttribute('class','circle-theorem-svg');
        theoremG = document.createElementNS('http://www.w3.org/2000/svg','g');
        theoremSvg.appendChild(theoremG);
        theoremMount.innerHTML = '';
        theoremMount.appendChild(theoremSvg);
    }

    function drawTheorem1(){
        theoremG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const radius = 150;
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'rgba(59, 130, 246, 0.05)');
        circle.setAttribute('stroke', '#3b82f6');
        circle.setAttribute('stroke-width', '2');
        theoremG.appendChild(circle);
        
        // Define points on circle perimeter
        const points = {
            A: { x: centerX + radius * Math.cos(Math.PI), y: centerY + radius * Math.sin(Math.PI) }, // 180°
            B: { x: centerX + radius * Math.cos(0), y: centerY + radius * Math.sin(0) }, // 0°
            C: { x: centerX + radius * Math.cos(2 * Math.PI / 3), y: centerY + radius * Math.sin(2 * Math.PI / 3) }, // 120°
            D: { x: centerX + radius * Math.cos(Math.PI / 3), y: centerY + radius * Math.sin(Math.PI / 3) } // 60°
        };
        
        // Chord AB
        const chordAB = document.createElementNS('http://www.w3.org/2000/svg','line');
        chordAB.setAttribute('x1', points.A.x);
        chordAB.setAttribute('y1', points.A.y);
        chordAB.setAttribute('x2', points.B.x);
        chordAB.setAttribute('y2', points.B.y);
        chordAB.setAttribute('stroke', '#000');
        chordAB.setAttribute('stroke-width', '3');
        theoremG.appendChild(chordAB);
        
        // Points (static)
        const pointA = createStaticPoint(points.A.x, points.A.y, 'A');
        theoremG.appendChild(pointA);
        
        const pointB = createStaticPoint(points.B.x, points.B.y, 'B');
        theoremG.appendChild(pointB);
        
        const pointC = createStaticPoint(points.C.x, points.C.y, 'C');
        theoremG.appendChild(pointC);
        
        const pointD = createStaticPoint(points.D.x, points.D.y, 'D');
        theoremG.appendChild(pointD);
        
        // Lines from C to A and B
        const lineCA = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineCA.setAttribute('x1', points.C.x);
        lineCA.setAttribute('y1', points.C.y);
        lineCA.setAttribute('x2', points.A.x);
        lineCA.setAttribute('y2', points.A.y);
        lineCA.setAttribute('stroke', '#22c55e');
        lineCA.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineCA);
        
        const lineCB = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineCB.setAttribute('x1', points.C.x);
        lineCB.setAttribute('y1', points.C.y);
        lineCB.setAttribute('x2', points.B.x);
        lineCB.setAttribute('y2', points.B.y);
        lineCB.setAttribute('stroke', '#22c55e');
        lineCB.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineCB);
        
        // Lines from D to A and B
        const lineDA = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineDA.setAttribute('x1', points.D.x);
        lineDA.setAttribute('y1', points.D.y);
        lineDA.setAttribute('x2', points.A.x);
        lineDA.setAttribute('y2', points.A.y);
        lineDA.setAttribute('stroke', '#f97316');
        lineDA.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineDA);
        
        const lineDB = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineDB.setAttribute('x1', points.D.x);
        lineDB.setAttribute('y1', points.D.y);
        lineDB.setAttribute('x2', points.B.x);
        lineDB.setAttribute('y2', points.B.y);
        lineDB.setAttribute('stroke', '#f97316');
        lineDB.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineDB);
        
        // Calculate and display angles
        const angleACB = calculateAngle(points.A, points.C, points.B);
        const angleADB = calculateAngle(points.A, points.D, points.B);
        
        // Angle arcs
        drawAngleArc(points.A, points.C, points.B, '#22c55e', 'ACB');
        drawAngleArc(points.A, points.D, points.B, '#f97316', 'ADB');
        
        // Highlight the arc that both angles subtend
        drawArcHighlight(points.A, points.B, centerX, centerY, radius);
        
        // Update readout
        theoremTitle.textContent = 'Angles in the Same Segment are Equal';
        angle1.textContent = `∠ACB = ${angleACB.toFixed(1)}°`;
        angle2.textContent = `∠ADB = ${angleADB.toFixed(1)}°`;
        theoremExplanation.textContent = `Both angles subtend the same arc AB. Notice they are equal: ${Math.abs(angleACB - angleADB) < 0.1 ? 'Yes!' : 'They are equal!'}`;
    }
    
    function drawTheorem2(){
        theoremG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const radius = 150;
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'rgba(59, 130, 246, 0.05)');
        circle.setAttribute('stroke', '#3b82f6');
        circle.setAttribute('stroke-width', '2');
        theoremG.appendChild(circle);
        
        // Define points
        const points = {
            A: { x: centerX + radius * Math.cos(Math.PI), y: centerY + radius * Math.sin(Math.PI) }, // 180°
            B: { x: centerX + radius * Math.cos(0), y: centerY + radius * Math.sin(0) }, // 0°
            C: { x: centerX + radius * Math.cos(Math.PI / 3), y: centerY + radius * Math.sin(Math.PI / 3) } // 60°
        };
        
        // Center point
        const centerPoint = createStaticPoint(centerX, centerY, 'O');
        theoremG.appendChild(centerPoint);
        
        // Points A, B, C
        const pointA = createStaticPoint(points.A.x, points.A.y, 'A');
        theoremG.appendChild(pointA);
        
        const pointB = createStaticPoint(points.B.x, points.B.y, 'B');
        theoremG.appendChild(pointB);
        
        const pointC = createStaticPoint(points.C.x, points.C.y, 'C');
        theoremG.appendChild(pointC);
        
        // Lines from center to A and B
        const lineOA = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineOA.setAttribute('x1', centerX);
        lineOA.setAttribute('y1', centerY);
        lineOA.setAttribute('x2', points.A.x);
        lineOA.setAttribute('y2', points.A.y);
        lineOA.setAttribute('stroke', '#ef4444');
        lineOA.setAttribute('stroke-width', '3');
        theoremG.appendChild(lineOA);
        
        const lineOB = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineOB.setAttribute('x1', centerX);
        lineOB.setAttribute('y1', centerY);
        lineOB.setAttribute('x2', points.B.x);
        lineOB.setAttribute('y2', points.B.y);
        lineOB.setAttribute('stroke', '#ef4444');
        lineOB.setAttribute('stroke-width', '3');
        theoremG.appendChild(lineOB);
        
        // Lines from C to A and B
        const lineCA = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineCA.setAttribute('x1', points.C.x);
        lineCA.setAttribute('y1', points.C.y);
        lineCA.setAttribute('x2', points.A.x);
        lineCA.setAttribute('y2', points.A.y);
        lineCA.setAttribute('stroke', '#22c55e');
        lineCA.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineCA);
        
        const lineCB = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineCB.setAttribute('x1', points.C.x);
        lineCB.setAttribute('y1', points.C.y);
        lineCB.setAttribute('x2', points.B.x);
        lineCB.setAttribute('y2', points.B.y);
        lineCB.setAttribute('stroke', '#22c55e');
        lineCB.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineCB);
        
        // Calculate angles
        const angleAOB = calculateAngle(points.A, {x: centerX, y: centerY}, points.B);
        const angleACB = calculateAngle(points.A, points.C, points.B);
        
        // Angle arcs
        drawAngleArc(points.A, {x: centerX, y: centerY}, points.B, '#ef4444', 'AOB');
        drawAngleArc(points.A, points.C, points.B, '#22c55e', 'ACB');
        
        // Update readout
        theoremTitle.textContent = 'Angle at the Centre is Twice the Angle at Circumference';
        angle1.textContent = `∠AOB (center) = ${angleAOB.toFixed(1)}°`;
        angle2.textContent = `∠ACB (circumference) = ${angleACB.toFixed(1)}°`;
        theoremExplanation.textContent = `The angle at the center (${angleAOB.toFixed(1)}°) is twice the angle at the circumference (${angleACB.toFixed(1)}°).`;
    }
    
    function drawTheorem3(){
        theoremG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const radius = 150;
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'rgba(59, 130, 246, 0.05)');
        circle.setAttribute('stroke', '#3b82f6');
        circle.setAttribute('stroke-width', '2');
        theoremG.appendChild(circle);
        
        // Point of contact (tangent point)
        const contactPoint = { x: centerX + radius, y: centerY };
        
        // Center point
        const centerPoint = createStaticPoint(centerX, centerY, 'O');
        theoremG.appendChild(centerPoint);
        
        // Contact point (tangent point)
        const pointT = createStaticPoint(contactPoint.x, contactPoint.y, 'T');
        theoremG.appendChild(pointT);
        
        // Radius from center to contact point (perpendicular to tangent)
        const radiusLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        radiusLine.setAttribute('x1', centerX);
        radiusLine.setAttribute('y1', centerY);
        radiusLine.setAttribute('x2', contactPoint.x);
        radiusLine.setAttribute('y2', contactPoint.y);
        radiusLine.setAttribute('stroke', '#ef4444');
        radiusLine.setAttribute('stroke-width', '4');
        radiusLine.setAttribute('stroke-dasharray', '5,5');
        theoremG.appendChild(radiusLine);
        
        // Tangent line (vertical, perpendicular to horizontal radius)
        const tangentLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        tangentLine.setAttribute('x1', contactPoint.x);
        tangentLine.setAttribute('y1', contactPoint.y + 120);
        tangentLine.setAttribute('x2', contactPoint.x);
        tangentLine.setAttribute('y2', contactPoint.y - 120);
        tangentLine.setAttribute('stroke', '#22c55e');
        tangentLine.setAttribute('stroke-width', '4');
        theoremG.appendChild(tangentLine);
        
        // Right angle marker (square at the intersection)
        const rightAngleSize = 25;
        const rightAngle = document.createElementNS('http://www.w3.org/2000/svg','path');
        rightAngle.setAttribute('d', `M ${contactPoint.x - rightAngleSize} ${contactPoint.y} L ${contactPoint.x - rightAngleSize} ${contactPoint.y - rightAngleSize} L ${contactPoint.x} ${contactPoint.y - rightAngleSize}`);
        rightAngle.setAttribute('stroke', '#8b5cf6');
        rightAngle.setAttribute('stroke-width', '3');
        rightAngle.setAttribute('fill', 'rgba(139, 92, 246, 0.1)');
        theoremG.appendChild(rightAngle);
        
        // Add labels for the lines
        const radiusLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        radiusLabel.setAttribute('x', centerX + radius/2 - 10);
        radiusLabel.setAttribute('y', centerY - 10);
        radiusLabel.setAttribute('class', 'circle-theorem-label');
        radiusLabel.setAttribute('fill', '#ef4444');
        radiusLabel.setAttribute('font-weight', 'bold');
        radiusLabel.textContent = 'Radius OT';
        theoremG.appendChild(radiusLabel);
        
        const tangentLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        tangentLabel.setAttribute('x', contactPoint.x + 15);
        tangentLabel.setAttribute('y', contactPoint.y - 60);
        tangentLabel.setAttribute('class', 'circle-theorem-label');
        tangentLabel.setAttribute('fill', '#22c55e');
        tangentLabel.setAttribute('font-weight', 'bold');
        tangentLabel.textContent = 'Tangent Line';
        theoremG.appendChild(tangentLabel);
        
        // Calculate the angle between radius and tangent (should be 90°)
        const angle = calculateAngle(
            {x: centerX, y: centerY}, 
            contactPoint, 
            {x: contactPoint.x, y: contactPoint.y - 50}
        );
        
        // Update readout
        theoremTitle.textContent = 'Tangent-Radius Perpendicularity Theorem';
        angle1.textContent = `∠OT = ${angle.toFixed(1)}°`;
        angle2.textContent = 'Right angle (90°)';
        theoremExplanation.textContent = 'A tangent to a circle is perpendicular to the radius drawn at the point of contact. The radius OT is perpendicular to the tangent line at point T.';
    }
    
    function drawTheorem4(){
        theoremG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const radius = 150;
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'rgba(59, 130, 246, 0.05)');
        circle.setAttribute('stroke', '#3b82f6');
        circle.setAttribute('stroke-width', '2');
        theoremG.appendChild(circle);
        
        // Cyclic quadrilateral points
        const points = {
            A: { x: centerX + radius * Math.cos(Math.PI), y: centerY + radius * Math.sin(Math.PI) }, // 180°
            B: { x: centerX + radius * Math.cos(Math.PI / 2), y: centerY + radius * Math.sin(Math.PI / 2) }, // 90°
            C: { x: centerX + radius * Math.cos(0), y: centerY + radius * Math.sin(0) }, // 0°
            D: { x: centerX + radius * Math.cos(3 * Math.PI / 2), y: centerY + radius * Math.sin(3 * Math.PI / 2) } // 270°
        };
        
        // Points
        const pointA = createStaticPoint(points.A.x, points.A.y, 'A');
        theoremG.appendChild(pointA);
        
        const pointB = createStaticPoint(points.B.x, points.B.y, 'B');
        theoremG.appendChild(pointB);
        
        const pointC = createStaticPoint(points.C.x, points.C.y, 'C');
        theoremG.appendChild(pointC);
        
        const pointD = createStaticPoint(points.D.x, points.D.y, 'D');
        theoremG.appendChild(pointD);
        
        // Quadrilateral sides
        const sides = [
            [points.A, points.B, '#22c55e'],
            [points.B, points.C, '#f97316'],
            [points.C, points.D, '#22c55e'],
            [points.D, points.A, '#f97316']
        ];
        
        sides.forEach(([start, end, color]) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute('x1', start.x);
            line.setAttribute('y1', start.y);
            line.setAttribute('x2', end.x);
            line.setAttribute('y2', end.y);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', '2');
            theoremG.appendChild(line);
        });
        
        // Calculate opposite angles
        const angleA = calculateAngle(points.D, points.A, points.B);
        const angleC = calculateAngle(points.B, points.C, points.D);
        const angleB = calculateAngle(points.A, points.B, points.C);
        const angleD = calculateAngle(points.C, points.D, points.A);
        
        // Update readout
        theoremTitle.textContent = 'Cyclic Quadrilateral - Opposite Angles are Supplementary';
        angle1.textContent = `∠A + ∠C = ${(angleA + angleC).toFixed(1)}°`;
        angle2.textContent = `∠B + ∠D = ${(angleB + angleD).toFixed(1)}°`;
        theoremExplanation.textContent = `Opposite angles of a cyclic quadrilateral add up to 180° (supplementary).`;
    }
    
    function drawTheorem5(){
        theoremG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const radius = 150;
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'rgba(59, 130, 246, 0.05)');
        circle.setAttribute('stroke', '#3b82f6');
        circle.setAttribute('stroke-width', '2');
        theoremG.appendChild(circle);
        
        // Points on circle
        const points = {
            A: { x: centerX + radius * Math.cos(Math.PI), y: centerY + radius * Math.sin(Math.PI) }, // 180°
            B: { x: centerX + radius * Math.cos(0), y: centerY + radius * Math.sin(0) }, // 0°
            C: { x: centerX + radius * Math.cos(Math.PI / 3), y: centerY + radius * Math.sin(Math.PI / 3) } // 60°
        };
        
        // Tangent endpoints (rotated 90 degrees around point B)
        const tangentM = { x: points.B.x, y: points.B.y + 100 };
        const tangentN = { x: points.B.x, y: points.B.y - 100 };
        
        // Points
        const pointA = createStaticPoint(points.A.x, points.A.y, 'A');
        theoremG.appendChild(pointA);
        
        const pointB = createStaticPoint(points.B.x, points.B.y, 'B');
        theoremG.appendChild(pointB);
        
        const pointC = createStaticPoint(points.C.x, points.C.y, 'C');
        theoremG.appendChild(pointC);
        
        const pointM = createStaticPoint(tangentM.x, tangentM.y, 'M');
        theoremG.appendChild(pointM);
        
        const pointN = createStaticPoint(tangentN.x, tangentN.y, 'N');
        theoremG.appendChild(pointN);
        
        // Chord AB
        const chordAB = document.createElementNS('http://www.w3.org/2000/svg','line');
        chordAB.setAttribute('x1', points.A.x);
        chordAB.setAttribute('y1', points.A.y);
        chordAB.setAttribute('x2', points.B.x);
        chordAB.setAttribute('y2', points.B.y);
        chordAB.setAttribute('stroke', '#000');
        chordAB.setAttribute('stroke-width', '3');
        theoremG.appendChild(chordAB);
        
        // Tangent line (vertical, touching at point B, from M to N)
        const tangentLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        tangentLine.setAttribute('x1', tangentM.x);
        tangentLine.setAttribute('y1', tangentM.y);
        tangentLine.setAttribute('x2', tangentN.x);
        tangentLine.setAttribute('y2', tangentN.y);
        tangentLine.setAttribute('stroke', '#22c55e');
        tangentLine.setAttribute('stroke-width', '3');
        theoremG.appendChild(tangentLine);
        
        // Lines from C to A and B
        const lineCA = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineCA.setAttribute('x1', points.C.x);
        lineCA.setAttribute('y1', points.C.y);
        lineCA.setAttribute('x2', points.A.x);
        lineCA.setAttribute('y2', points.A.y);
        lineCA.setAttribute('stroke', '#f97316');
        lineCA.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineCA);
        
        const lineCB = document.createElementNS('http://www.w3.org/2000/svg','line');
        lineCB.setAttribute('x1', points.C.x);
        lineCB.setAttribute('y1', points.C.y);
        lineCB.setAttribute('x2', points.B.x);
        lineCB.setAttribute('y2', points.B.y);
        lineCB.setAttribute('stroke', '#f97316');
        lineCB.setAttribute('stroke-width', '2');
        theoremG.appendChild(lineCB);
        
        // Calculate angles
        // Angle between tangent MN and chord AB at point B
        const angleNBA = calculateAngle(tangentN, points.B, points.A);
        // Angle in alternate segment
        const angleACB = calculateAngle(points.A, points.C, points.B);
        
        // Update readout
        theoremTitle.textContent = 'Alternate Segment Theorem';
        angle1.textContent = `∠NBA = ${angleNBA.toFixed(1)}°`;
        angle2.textContent = `∠ACB = ${angleACB.toFixed(1)}°`;
        theoremExplanation.textContent = `The angle between tangent and chord (${angleNBA.toFixed(1)}°) equals the angle in alternate segment (${angleACB.toFixed(1)}°).`;
    }
    
    function drawTheorem6(){
        theoremG.innerHTML = '';
        
        const centerX = 400;
        const centerY = 260;
        const radius = 150;
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'rgba(59, 130, 246, 0.05)');
        circle.setAttribute('stroke', '#3b82f6');
        circle.setAttribute('stroke-width', '2');
        theoremG.appendChild(circle);
        
        // Intersecting chords
        const points = {
            A: { x: centerX - radius * 0.6, y: centerY - radius * 0.8 },
            B: { x: centerX + radius * 0.6, y: centerY + radius * 0.8 },
            C: { x: centerX - radius * 0.8, y: centerY + radius * 0.6 },
            D: { x: centerX + radius * 0.8, y: centerY - radius * 0.6 },
            P: { x: centerX, y: centerY } // Intersection point
        };
        
        // Points
        const pointA = createStaticPoint(points.A.x, points.A.y, 'A');
        theoremG.appendChild(pointA);
        
        const pointB = createStaticPoint(points.B.x, points.B.y, 'B');
        theoremG.appendChild(pointB);
        
        const pointC = createStaticPoint(points.C.x, points.C.y, 'C');
        theoremG.appendChild(pointC);
        
        const pointD = createStaticPoint(points.D.x, points.D.y, 'D');
        theoremG.appendChild(pointD);
        
        const pointP = createStaticPoint(points.P.x, points.P.y, 'P');
        theoremG.appendChild(pointP);
        
        // Chord AB
        const chordAB = document.createElementNS('http://www.w3.org/2000/svg','line');
        chordAB.setAttribute('x1', points.A.x);
        chordAB.setAttribute('y1', points.A.y);
        chordAB.setAttribute('x2', points.B.x);
        chordAB.setAttribute('y2', points.B.y);
        chordAB.setAttribute('stroke', '#22c55e');
        chordAB.setAttribute('stroke-width', '3');
        theoremG.appendChild(chordAB);
        
        // Chord CD
        const chordCD = document.createElementNS('http://www.w3.org/2000/svg','line');
        chordCD.setAttribute('x1', points.C.x);
        chordCD.setAttribute('y1', points.C.y);
        chordCD.setAttribute('x2', points.D.x);
        chordCD.setAttribute('y2', points.D.y);
        chordCD.setAttribute('stroke', '#f97316');
        chordCD.setAttribute('stroke-width', '3');
        theoremG.appendChild(chordCD);
        
        // Calculate segment lengths
        const AP = Math.sqrt((points.A.x - points.P.x) ** 2 + (points.A.y - points.P.y) ** 2);
        const PB = Math.sqrt((points.P.x - points.B.x) ** 2 + (points.P.y - points.B.y) ** 2);
        const CP = Math.sqrt((points.C.x - points.P.x) ** 2 + (points.C.y - points.P.y) ** 2);
        const PD = Math.sqrt((points.P.x - points.D.x) ** 2 + (points.P.y - points.D.y) ** 2);
        
        const product1 = AP * PB;
        const product2 = CP * PD;
        
        // Update readout
        theoremTitle.textContent = 'Intersecting Chords Theorem';
        angle1.textContent = `AP × PB = ${product1.toFixed(1)}`;
        angle2.textContent = `CP × PD = ${product2.toFixed(1)}`;
        theoremExplanation.textContent = `When two chords intersect, the products of their segments are equal: AP × PB = CP × PD.`;
    }
    
    function drawArcHighlight(pointA, pointB, centerX, centerY, radius) {
        // Draw the arc that both angles subtend
        const angleA = Math.atan2(pointA.y - centerY, pointA.x - centerX);
        const angleB = Math.atan2(pointB.y - centerY, pointB.x - centerX);
        
        const startAngle = Math.min(angleA, angleB);
        const endAngle = Math.max(angleA, angleB);
        
        const arcRadius = radius + 10;
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        
        const x1 = centerX + arcRadius * Math.cos(startAngle);
        const y1 = centerY + arcRadius * Math.sin(startAngle);
        const x2 = centerX + arcRadius * Math.cos(endAngle);
        const y2 = centerY + arcRadius * Math.sin(endAngle);
        
        path.setAttribute('d', `M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#8b5cf6');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-dasharray', '8 4');
        path.setAttribute('opacity', '0.7');
        theoremG.appendChild(path);
        
        // Add arc label
        const midAngle = (startAngle + endAngle) / 2;
        const labelX = centerX + (arcRadius + 20) * Math.cos(midAngle);
        const labelY = centerY + (arcRadius + 20) * Math.sin(midAngle);
        
        const arcLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
        arcLabel.setAttribute('x', labelX);
        arcLabel.setAttribute('y', labelY);
        arcLabel.setAttribute('text-anchor', 'middle');
        arcLabel.setAttribute('class', 'circle-theorem-label');
        arcLabel.setAttribute('fill', '#8b5cf6');
        arcLabel.setAttribute('font-weight', 'bold');
        arcLabel.textContent = 'Arc AB';
        theoremG.appendChild(arcLabel);
    }
    
    function createStaticPoint(x, y, label) {
        const group = document.createElementNS('http://www.w3.org/2000/svg','g');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '8');
        circle.setAttribute('fill', '#ef4444');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        group.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'circle-theorem-label');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        group.appendChild(text);
        
        return group;
    }
    
    
    function calculateAngle(p1, vertex, p2) {
        const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
        const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
        
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        const angle = Math.acos(dot / (mag1 * mag2));
        return angle * 180 / Math.PI;
    }
    
    function drawAngleArc(p1, vertex, p2, color, label) {
        const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
        const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
        
        const angle1 = Math.atan2(v1.y, v1.x);
        const angle2 = Math.atan2(v2.y, v2.x);
        
        const radius = 30;
        const startAngle = Math.min(angle1, angle2);
        const endAngle = Math.max(angle1, angle2);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        
        const x1 = vertex.x + radius * Math.cos(startAngle);
        const y1 = vertex.y + radius * Math.sin(startAngle);
        const x2 = vertex.x + radius * Math.cos(endAngle);
        const y2 = vertex.y + radius * Math.sin(endAngle);
        
        path.setAttribute('d', `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`);
        path.setAttribute('class', 'angle-arc');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '3');
        theoremG.appendChild(path);
        
        // Add angle label
        const midAngle = (startAngle + endAngle) / 2;
        const labelX = vertex.x + (radius + 15) * Math.cos(midAngle);
        const labelY = vertex.y + (radius + 15) * Math.sin(midAngle);
        
        const labelText = document.createElementNS('http://www.w3.org/2000/svg','text');
        labelText.setAttribute('x', labelX);
        labelText.setAttribute('y', labelY);
        labelText.setAttribute('text-anchor', 'middle');
        labelText.setAttribute('class', 'circle-theorem-label');
        labelText.setAttribute('fill', color);
        labelText.setAttribute('font-weight', 'bold');
        labelText.textContent = label;
        theoremG.appendChild(labelText);
    }

    // Tab switching for Circle sections
    function switchCircleTab(subview) {
        const circleTabs = document.querySelectorAll('.circle-tab');
        const basicControls = document.getElementById('basic-circle-controls');
        const theoremsControls = document.getElementById('theorems-controls');
        const basicReadout = document.getElementById('basic-readout');
        const theoremReadout = document.getElementById('theorem-readout');
        const circleMount = document.getElementById('circle-mount');
        const theoremMount = document.getElementById('theorem-mount');
        
        circleTabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-subview="${subview}"]`).classList.add('active');
        
        if (subview === 'basic') {
            basicControls.classList.remove('hidden');
            theoremsControls.classList.add('hidden');
            basicReadout.classList.remove('hidden');
            theoremReadout.classList.add('hidden');
            circleMount.classList.add('active');
            circleMount.classList.remove('hidden');
            theoremMount.classList.remove('active');
            theoremMount.classList.add('hidden');
        } else {
            basicControls.classList.add('hidden');
            theoremsControls.classList.remove('hidden');
            basicReadout.classList.add('hidden');
            theoremReadout.classList.remove('hidden');
            circleMount.classList.remove('active');
            circleMount.classList.add('hidden');
            theoremMount.classList.add('active');
            theoremMount.classList.remove('hidden');
            ensureTheoremSVG();
            drawTheorem1();
        }
    }

    // Initialize
    ensureCircleSVG();
    resetCircle();
    
    // Circle tab switching
    document.querySelectorAll('.circle-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const subview = tab.getAttribute('data-subview');
            switchCircleTab(subview);
        });
    });
    
    // Theorem tab switching
    document.querySelectorAll('.theorem-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.theorem-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTheorem = parseInt(tab.getAttribute('data-theorem'));
            
            // Draw the selected theorem
            switch(currentTheorem) {
                case 1:
                    drawTheorem1();
                    break;
                case 2:
                    drawTheorem2();
                    break;
                case 3:
                    drawTheorem3();
                    break;
                case 4:
                    drawTheorem4();
                    break;
                case 5:
                    drawTheorem5();
                    break;
                case 6:
                    drawTheorem6();
                    break;
            }
        });
    });
    
    // Theorem reset
    if (theoremResetBtn) {
        theoremResetBtn.addEventListener('click', () => {
            // Redraw the current theorem
            switch(currentTheorem) {
                case 1:
                    drawTheorem1();
                    break;
                case 2:
                    drawTheorem2();
                    break;
                case 3:
                    drawTheorem3();
                    break;
                case 4:
                    drawTheorem4();
                    break;
                case 5:
                    drawTheorem5();
                    break;
                case 6:
                    drawTheorem6();
                    break;
            }
        });
    }
})();

