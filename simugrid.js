function rk4Step(f, t, y, dt) { // makes my life easier
  const k1 = f(t, y);
  const y_k2 = y.map((yi, i) => yi + 0.5 * dt * k1[i]);
  const k2 = f(t + 0.5 * dt, y_k2);
  const y_k3 = y.map((yi, i) => yi + 0.5 * dt * k2[i]);
  const k3 = f(t + 0.5 * dt, y_k3);
  const y_k4 = y.map((yi, i) => yi + dt * k3[i]);
  const k4 = f(t + dt, y_k4);

  return y.map((yi, i) => yi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function systemDerivatives (t, y) {
  const [Vbus, Vin1, Vout1, Vin2, Vout2, TPV, rawSOC, Vp2, Vp3, Vp4] = y;

  const SOC = Math.max(0.0001, Math.min(1.0, rawSOC));

  const Cbus = 1e-2, C = 1e-4, Cm = 500, QLi = 10000; // constants
  const Rb1 = 1e4, Rb2 = 0.05, Rc1 = 10, Rc2_1 = 0.1, Rc2_2 = 0.1;
  const alpha_PV = 0.9, As = 1.6, h = 15, T_inf = 298.15;
  
  const Rp = [0.01, 0.02, 0.05];
  const Cp = [1000, 2000, 5000];

  const u0 = 0.8, u1 = 0.5, u2 = 0.6;
  const Iload = 10, G = 1000, Iin1 = 5, Iin2 = 2;
  const ILi = Iin2;

  const Iout1 = (Vout1 - Vbus) / Rb2;
  const Iout2 = (Vout2 - Vbus) / Rb2;

  const dVbus = (1 / Cbus) * (Iout1 + Iout2 - u0 * Iload - Vbus / Rb1); // dc bus
  
  const dVin1 = (1 / C) * (Iin1 - Vin1 / Rc1 - (Vin1 - u1 * Vout1) / Rc2_1); // boost conv.
  const dVout1 = (1 / C) * ((u1 / Rc2_1) * (Vin1 - u1 * Vout1) - Vout1 / Rc1 - Iout1);

  const dVin2 = (1 / C) * (Iin2 - Vin2 / Rc1 - (u2 / Rc2_2) * (u2 * Vin2 - Vout2)); // buck conv.
  const dVout2 = (1 / C) * ((u2 / Rc2_2) * (u2 * Vin2 - Vout2) - Vout2 / Rc1 - Iout2);
  
  const PPV = Math.max(0, Math.min(5000, Iin1 * Vin1)); // thermal stuff
  const thermalGain = alpha_PV * As * G;
  const thermalLoss = h * As * (TPV - T_inf);
  const dTPV = (1 / Cm) * (thermalGain - thermalLoss - PPV);
  
  const dSOC = -ILi / QLi; // battery stuff

  const dVp2 = (1 / Cp[0]) * (ILi - Vp2 / Rp[0]);
  const dVp3 = (1 / Cp[1]) * (ILi - Vp3 / Rp[1]); // battery dynamic voltage stuff
  const dVp4 = (1 / Cp[2]) * (ILi - Vp4 / Rp[2]);

  const derivatives = [dVbus, dVin1, dVout1, dVin2, dVout2, dTPV, dSOC, dVp2, dVp3, dVp4];

  if (t >= 0.020 && t <= 0.022) {
    derivatives.forEach((d, i) => {
      if (!Number.isFinite(d)) {
        console.log(`t = ${t.toFixed(4)}s | Derivative index [${i}] is ${d} | State y[${i}] = ${y[i]}`);
      }
    });
  }

//   if (t >= 0.0199 && t <= 0.0201) {
//     console.log(`t = ${t.toFixed(4)}s Check Inputs:`, {
//       Vbus: y[0],
//       Vin1: y[1],
//       Vout1: y[2],
//       TPV: y[5],
//       PPV: y[1] * y[5] 
//     });
//   }

  return [dVbus, dVin1, dVout1, dVin2, dVout2, dTPV, dSOC, dVp2, dVp3, dVp4];
}

function getBatteryTerminalVoltage (SOC, VpArray, ILi, R1_Li = 0.01) {
  const OCV = 2.2 + 1.4 * SOC; 
  const V_polarization = VpArray.reduce((sum, v) => sum + v, 0);
  return OCV - V_polarization - (ILi * R1_Li); 
}

let time = 0;
const dt = 0.00001;

// [Vbus, Vin1, Vout1, Vin2, Vout2, TPV, SOC, Vp2, Vp3, Vp4] initial stuff
let state = [400.0, 300.0, 400.0, 350.0, 400.0, 298.15, 0.8, 0.0, 0.0, 0.0];

function runStep() {
  state = rk4Step(systemDerivatives, time, state, dt);
  time += dt;

  const currentSOC = state[6];
  const polarizationVoltages = [state[7], state[8], state[9]];
  const V_Li = getBatteryTerminalVoltage(currentSOC, polarizationVoltages, 2.0);

//   console.log(`t = ${time.toFixed(3)}s | Vbus = ${state[0].toFixed(2)}V | V_Li = ${V_Li.toFixed(2)}V`);
}