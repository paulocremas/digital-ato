export function initShader(canvasId) {
    const canvas = document.getElementById(canvasId);
    const gl = canvas.getContext('webgl');

    const vsSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    const fsSource = `
        precision highp float;
        uniform vec2 u_res; uniform float u_time; uniform float u_seed;
        float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float noise(vec2 p){
            vec2 i = floor(p); vec2 f = fract(p);
            float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        vec3 hsl2rgb(vec3 c){
            vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0,4,2), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0*c.z - 1.0));
        }
        void main(){
            vec2 uv = gl_FragCoord.xy / u_res.xy; uv.x *= u_res.x / u_res.y;
            float t = u_time * 0.15; vec2 p = uv * 3.0;
            p += vec2(sin(t + p.y * 2.0 + u_seed), cos(t * 1.3 + p.x * 2.0)) * 0.4;
            float field = mix(noise(p + t), noise(p * 2.0 - t * 0.7), 0.5);
            vec3 col = hsl2rgb(vec3(fract(field + t * 0.1 + u_seed * 0.01), 0.6 + 0.4 * sin(field * 6.2831), 0.4 + 0.3 * field));
            gl_FragColor = vec4(col * smoothstep(0.9, 0.2, distance(uv, vec2(0.5))), 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1, 1, -1, 1, 1,-1, 1, 1]), gl.STATIC_DRAW);
    
    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    let currentSeed = Math.random() * 100, targetSeed = currentSeed, lastSwitchTime = 0;

    function render(now) {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        if (now - lastSwitchTime > 12000) { targetSeed = Math.random() * 100; lastSwitchTime = now; }
        currentSeed += (targetSeed - currentSeed) * 0.01;
        gl.uniform2f(gl.getUniformLocation(program, "u_res"), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(program, "u_time"), now / 1000);
        gl.uniform1f(gl.getUniformLocation(program, "u_seed"), currentSeed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
