function calculate() {
  // Retrieve inputs
  const a_infection = parseFloat(document.getElementById("a_infection").value);
  const a_fatigue   = parseFloat(document.getElementById("a_fatigue").value);
  const a_nausea    = parseFloat(document.getElementById("a_nausea").value);

  const b_infection = parseFloat(document.getElementById("b_infection").value);
  const b_fatigue   = parseFloat(document.getElementById("b_fatigue").value);
  const b_nausea    = parseFloat(document.getElementById("b_nausea").value);

  // Simple linear utility function with equal weights
  const beta = -2.0; // risk aversion coefficient
  const Ua = beta * (a_infection + a_fatigue + a_nausea);
  const Ub = beta * (b_infection + b_fatigue + b_nausea);
  const Uq = 0; // status quo baseline

  // Multinomial logit probabilities
  const expUa = Math.exp(Ua);
  const expUb = Math.exp(Ub);
  const expUq = Math.exp(Uq);

  const denom = expUa + expUb + expUq;
  const Pa = (expUa / denom).toFixed(2);
  const Pb = (expUb / denom).toFixed(2);
  const Pq = (expUq / denom).toFixed(2);

  // Display results
  document.getElementById("output").innerHTML = `
    Probability of choosing Treatment A: <b>${Pa}</b><br>
    Probability of choosing Treatment B: <b>${Pb}</b><br>
    Probability of choosing Status Quo: <b>${Pq}</b>
  `;
}
