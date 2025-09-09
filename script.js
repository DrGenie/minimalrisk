let chart;

function calculateProbabilities() {
    // Get levels (percentages) with self-explanatory names
    const gastrointestinalSymptomsLevelA = parseFloat(document.getElementById('gastrointestinal-symptoms-a').value);
    const fluLikeSymptomsLevelA = parseFloat(document.getElementById('flu-like-symptoms-a').value);
    const infectionLevelA = parseFloat(document.getElementById('infection-a').value);
    const lifeThreateningEventLevelA = parseFloat(document.getElementById('life-threatening-event-a').value);

    const gastrointestinalSymptomsLevelB = parseFloat(document.getElementById('gastrointestinal-symptoms-b').value);
    const fluLikeSymptomsLevelB = parseFloat(document.getElementById('flu-like-symptoms-b').value);
    const infectionLevelB = parseFloat(document.getElementById('infection-b').value);
    const lifeThreateningEventLevelB = parseFloat(document.getElementById('life-threatening-event-b').value);

    // Parameters with self-explanatory names (betas per %)
    const alternativeSpecificConstant = 0.1;
    const betaGastrointestinalSymptoms = -0.424;
    const betaFluLikeSymptoms = -0.227;
    const betaInfection = -0.328;
    const betaLifeThreateningEvent = -115.0;

    // Utilities
    const utilityA = alternativeSpecificConstant + 
                     betaGastrointestinalSymptoms * gastrointestinalSymptomsLevelA + 
                     betaFluLikeSymptoms * fluLikeSymptomsLevelA + 
                     betaInfection * infectionLevelA + 
                     betaLifeThreateningEvent * lifeThreateningEventLevelA;
    const utilityB = alternativeSpecificConstant + 
                     betaGastrointestinalSymptoms * gastrointestinalSymptomsLevelB + 
                     betaFluLikeSymptoms * fluLikeSymptomsLevelB + 
                     betaInfection * infectionLevelB + 
                     betaLifeThreateningEvent * lifeThreateningEventLevelB;
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
