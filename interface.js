const runSim = document.getElementById("run-sim");
const stopSim = document.getElementById("stop-sim");
const resetBtn = document.getElementById("reset-btn");

const simBus = document.getElementById("sim-bus");
const vin1 = document.getElementById("vin1");
const vin2 = document.getElementById("vin2");

const vin3 = document.getElementById("vin3");
const vin4 = document.getElementById("vin4");

const solark = document.getElementById("solark");
const bsoc = document.getElementById("bsoc");

const vp2 = document.getElementById("vp2");
const vp3 = document.getElementById("vp3");
const vp4 = document.getElementById("vp4");

const currentTime = document.getElementById("current-time");

let isRunning = false;
let animationFrameId = null;

function updateUI (t, s) {
  currentTime.innerText = t.toFixed(3);

  simBus.innerText = String(state[0].toFixed(2)) + "V"; // dc bus output

  vin1.innerText = String(state[1].toFixed(2)) + "V"; // boost converters
  vin2.innerText = String(state[2].toFixed(2)) + "V";

  vin3.innerText = String(state[3].toFixed(2)) + "V"; // buck converters
  vin4.innerText = String(state[4].toFixed(2)) + "V";

  solark.innerText = String(state[5].toFixed(2)) + "K"; // solar heat

  bsoc.innerText = String(state[6].toFixed(2));

  vp2.innerText = String(state[7].toFixed(2)) + "V";
  vp3.innerText = String(state[8].toFixed(2)) + "V";
  vp4.innerText = String(state[9].toFixed(2)) + "V";
}

const stepsPerFrame = 50; 

function simulationLoop() {
  if (!isRunning) return;

  for (let i = 0; i < stepsPerFrame; i++) {
    state = rk4Step(systemDerivatives, time, state, dt);
    time += dt;

    if (Number.isNaN(state[0])) {
      console.error(`Simulation exploded into NaN at t = ${time.toFixed(4)}s`);
      stopSimulation();
      return;
    }
  }

  updateUI(time, state);

  animationFrameId = requestAnimationFrame(simulationLoop);
}

function startSimulation() {
  if (!isRunning) {
    isRunning = true;
    animationFrameId = requestAnimationFrame(simulationLoop);
  }
}

function stopSimulation() {
  isRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

runSim.onclick = function () {
  startSimulation();
}

stopSim.onclick = function () {
  stopSimulation();
}

resetBtn.onclick = function () {
  time = 0;
  currentTime.innerText = "0.00";

  state = [400.0, 300.0, 400.0, 350.0, 400.0, 298.15, 0.8, 0.0, 0.0, 0.0];

  simBus.innerText = "";
  
  vin1.innerText = "";
  vin2.innerText = "";

  vin3.innerText = "";
  vin4.innerText = "";

  solark.innerText = "";

  bsoc.innerText = "";

  vp2.innerText = "";
  vp3.innerText = "";
  vp4.innerText = "";
}