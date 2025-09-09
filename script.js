let chart;

function calculateProbabilities() {
    // Get levels (0,1,2) with self-explanatory names
    const seriousInfectionLevelA = parseFloat(document.getElementById('serious-infection-a').value);
    const neurologicalSideEffectsLevelA = parseFloat(document.getElementById('neurological-side-effects-a').value);
    const hospitalizationPerYearLevelA = parseFloat(document.getElementById('hospitalization-per-year-a').value);

    const seriousInfectionLevelB = parseFloat(document.getElementById('serious-infection-b').value);
    const neurologicalSideEffectsLevelB = parseFloat(document.getElementById('neurological-side-effects-b').value);
    const hospitalizationPerYearLevelB = parseFloat(document.getElementById('hospitalization-per-year-b').value);

    // Parameters with self-explanatory names
    const alternativeSpecificConstant = 0.1;
    const betaSeriousInfection = -1.0;
    const betaNeurologicalSideEffects = -1.5;
    const betaHospitalizationPerYear = -2.0;

    // Utilities
    const utilityA = alternativeSpecificConstant + 
                     betaSeriousInfection * seriousInfectionLevelA + 
                     betaNeurologicalSideEffects * neurologicalSideEffectsLevelA + 
                     betaHospitalizationPerYear * hospitalizationPerYearLevelA;
    const utilityB = alternativeSpecificConstant + 
                     betaSeriousInfection * seriousInfectionLevelB + 
                     betaNeurologicalSideEffects * neurologicalSideEffectsLevelB + 
                     betaHospitalizationPerYear * hospitalizationPerYearLevelB;
    const utilityStatusQuo = 0;

    // Exponentials
    const expUtilityA = Math.exp(utilityA);
    const expUtilityB = Math.exp(utilityB);
    const expUtilityStatusQuo = Math.exp(utilityStatusQuo); // 1

    const denominator = expUtilityA + expUtilityB + expUtilityStatusQuo;

    const probabilityA = (expUtilityA / denominator) * 100;
    const probabilityB = (expUtilityB / denominator) * 100;
    const probabilityStatusQuo = (expUtilityStatusQuo / denominator) * 100;

    // Display
    document.getElementById('probA').textContent = probabilityA.toFixed(1) + '%';
    document.getElementById('probB').textContent = probabilityB.toFixed(1) + '%';
    document.getElementById('probSQ').textContent = probabilityStatusQuo.toFixed(1) + '%';

    // Interpretation
    let interpretationText = '';
    if (probabilityA > probabilityStatusQuo && probabilityA > probabilityB) {
        interpretationText = 'Patients are most likely to choose Treatment A over B and status quo, indicating minimal risks for Treatment A in this PCT.';
    } else if (probabilityB > probabilityStatusQuo && probabilityB > probabilityA) {
        interpretationText = 'Patients are most likely to choose Treatment B over A and status quo, indicating minimal risks for Treatment B in this PCT.';
    } else if (probabilityStatusQuo > probabilityA && probabilityStatusQuo > probabilityB) {
        interpretationText = 'Patients prefer status quo, suggesting neither treatment offers minimal risks compared to current options.';
    } else {
        interpretationText = 'Probabilities are mixed; further evaluation recommended.';
    }
    document.getElementById('interpretation').textContent = interpretationText;

    // Chart
    const ctx = document.getElementById('probChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Treatment A', 'Treatment B', 'Status Quo'],
            datasets: [{
                label: 'Choice Probability (%)',
                data: [probabilityA, probabilityB, probabilityStatusQuo],
                backgroundColor: ['#3498db', '#e74c3c', '#95a5a6'],
                borderColor: ['#2980b9', '#c0392b', '#7f8c8d'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    document.getElementById('results').style.display = 'block';
}
