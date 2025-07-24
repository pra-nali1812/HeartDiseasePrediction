from django.utils import timezone

def get_risk_color(risk_level):
    """Return color coding for risk levels."""
    colors = {
        'LOW': '#4CAF50',      # Green
        'MODERATE': '#FFC107', # Yellow
        'HIGH': '#FF9800',     # Orange
        'CRITICAL': '#F44336'  # Red
    }
    return colors.get(risk_level, '#607D8B')  # Default blue-gray

def get_risk_icon(risk_level):
    """Return icon for risk levels."""
    icons = {
        'LOW': '✓',
        'MODERATE': '!',
        'HIGH': '⚠',
        'CRITICAL': '‼'
    }
    return icons.get(risk_level, '?')

def analyze_risk_factors(features):
    """Analyze the risk factors and return detailed medical explanations, and normal/healthy parameters."""
    reasons = []
    normal_parameters = []

    # Age analysis
    age = features.get('age', 0)
    if age > 50:
        reasons.append({
            'factor': 'Age',
            'value': age,
            'severity': 'high' if age > 65 else 'moderate',
            'explanation': (
                f"Advanced age ({age} years) is an independent risk factor for coronary artery disease. "
                "The risk of cardiovascular disease increases with age due to arterial stiffening, "
                "accumulation of atherosclerotic plaques, and reduced vascular compliance."
            ),
            'medical_implications': [
                "Increased arterial stiffness and reduced vascular compliance",
                "Higher likelihood of atherosclerotic plaque accumulation",
                "Reduced cardiovascular reserve capacity"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'Age',
            'value': age,
            'message': f'Age {age} is within a lower risk range for heart disease.'
        })

    # Blood pressure analysis
    trestbps = features.get('trestbps', 0)
    if trestbps >= 130:
        bp_category = "Stage 2 Hypertension" if trestbps >= 140 else "Stage 1 Hypertension"
        reasons.append({
            'factor': 'Blood Pressure',
            'value': f"{trestbps} mmHg",
            'severity': 'critical' if trestbps >= 140 else 'high',
            'explanation': (
                f"Elevated resting blood pressure ({trestbps} mmHg) is classified as {bp_category}. "
                "Chronic hypertension causes endothelial dysfunction and accelerates atherosclerosis, "
                "leading to increased cardiac workload and left ventricular hypertrophy."
            ),
            'medical_implications': [
                "Increased myocardial oxygen demand",
                "Accelerated coronary artery disease progression",
                "Left ventricular hypertrophy and diastolic dysfunction"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'Blood Pressure',
            'value': f'{trestbps} mmHg',
            'message': f'Blood pressure {trestbps} mmHg is within the normal range.'
        })

    # Cholesterol analysis
    chol = features.get('chol', 0)
    if chol > 200:
        chol_level = "high" if chol >= 240 else "borderline high"
        reasons.append({
            'factor': 'Cholesterol',
            'value': f"{chol} mg/dL",
            'severity': 'high' if chol >= 240 else 'moderate',
            'explanation': (
                f"Elevated total cholesterol level ({chol} mg/dL) is considered {chol_level}. "
                "Hypercholesterolemia promotes the development of atherosclerotic plaques in coronary arteries, "
                "reducing blood flow and increasing the risk of acute coronary syndromes."
            ),
            'medical_implications': [
                "Accelerated atherosclerosis",
                "Plaque formation and arterial narrowing",
                "Increased risk of acute coronary syndrome"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'Cholesterol',
            'value': f'{chol} mg/dL',
            'message': f'Cholesterol {chol} mg/dL is within the healthy range.'
        })

    # Thalassemia analysis
    thal = features.get('thal', 0)
    if thal in [6, 7]:  # 3 = normal; 6 = fixed defect; 7 = reversable defect
        defect_type = "fixed" if thal == 6 else "reversible"
        reasons.append({
            'factor': 'Thalassemia',
            'value': f"{defect_type.capitalize()} Defect",
            'severity': 'high' if thal == 6 else 'moderate',
            'explanation': (
                f"A {defect_type} perfusion defect was detected, indicating "
                f"{'permanent damage' if thal == 6 else 'temporary ischemia'} in the heart muscle. "
                f"This suggests {'prior myocardial infarction' if thal == 6 else 'reversible myocardial ischemia'} "
                "which significantly impacts cardiac function and prognosis."
            ),
            'medical_implications': [
                "Reduced myocardial perfusion",
                "Increased risk of arrhythmias",
                f"{'Irreversible' if thal == 6 else 'Potentially reversible'} myocardial damage"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'Thalassemia',
            'value': thal,
            'message': 'No perfusion defect detected (normal thalassemia parameter).'
        })

    # Exercise induced angina
    exang = features.get('exang', 0)
    if exang == 1:
        reasons.append({
            'factor': 'Exercise Angina',
            'value': 'Present',
            'severity': 'high',
            'explanation': (
                "Exercise-induced angina indicates myocardial ischemia during physical activity, "
                "suggesting significant coronary artery disease. This occurs when oxygen demand "
                "exceeds supply due to narrowed coronary arteries."
            ),
            'medical_implications': [
                "Demand-supply mismatch in coronary circulation",
                "High likelihood of significant coronary artery stenosis",
                "Increased risk of acute coronary events"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'Exercise Angina',
            'value': 'Absent',
            'message': 'No exercise-induced angina detected.'
        })

    # ST depression analysis
    oldpeak = features.get('oldpeak', 0)
    if oldpeak > 1:
        severity = 'high' if oldpeak > 2 else 'moderate'
        reasons.append({
            'factor': 'ST Depression',
            'value': f"{oldpeak} mm",
            'severity': severity,
            'explanation': (
                f"ST segment depression of {oldpeak} mm during exercise testing indicates myocardial ischemia. "
                "This electrical manifestation of subendocardial ischemia suggests significant coronary artery disease, "
                "particularly when occurring at low workload."
            ),
            'medical_implications': [
                "Subendocardial ischemia",
                "Coronary artery disease with flow-limiting lesions",
                "Increased risk of future cardiac events"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'ST Depression',
            'value': f'{oldpeak} mm',
            'message': 'No significant ST segment depression detected.'
        })

    # Number of major vessels with reduced blood flow
    ca = features.get('ca', 0)
    if ca > 0:
        vessel_text = "vessel" if ca == 1 else "vessels"
        reasons.append({
            'factor': 'Affected Vessels',
            'value': f"{ca} major {vessel_text}",
            'severity': 'critical' if ca >= 2 else 'high',
            'explanation': (
                f"Reduced blood flow in {ca} major coronary artery {vessel_text} was detected. "
                f"This indicates {'multivessel' if ca > 1 else 'significant'} coronary artery disease. "
                "The number of diseased vessels is directly correlated with the severity of coronary artery disease "
                "and impacts both treatment strategy and prognosis."
            ),
            'medical_implications': [
                f"{'Multivessel' if ca > 1 else 'Single-vessel'} coronary artery disease",
                "Reduced myocardial perfusion reserve",
                "Higher risk of major adverse cardiac events"
            ]
        })
    else:
        normal_parameters.append({
            'factor': 'Affected Vessels',
            'value': ca,
            'message': 'No major coronary vessels with reduced blood flow detected.'
        })

    return {'risk_factors': reasons, 'normal_parameters': normal_parameters}

def determine_risk_level(risk_factors, prediction_result):
    """Determine overall risk level based on risk factors and prediction result."""
    if not risk_factors:
        return 'LOW' if not prediction_result else 'MODERATE'
    severity_order = {'critical': 3, 'high': 2, 'moderate': 1, 'low': 0}
    max_severity = 0
    for factor in risk_factors:
        sev = factor.get('severity', 'low').lower()
        max_severity = max(max_severity, severity_order.get(sev, 0))
    # If model predicts disease, bump up risk by one level
    if prediction_result:
        max_severity = min(max_severity + 1, 3)
    levels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']
    return levels[max_severity]

def generate_findings(risk_factors, prediction_result):
    """Generate detailed medical findings with visual indicators."""
    if not risk_factors:
        return {
            'summary': "No significant risk factors identified.",
            'risk_factors': []
        }
    
    # Sort risk factors by severity (critical, high, moderate, low)
    severity_order = {'critical': 0, 'high': 1, 'moderate': 2, 'low': 3}
    sorted_factors = sorted(risk_factors, 
                          key=lambda x: severity_order.get(x.get('severity', 'low'), 3))
    
    # Generate summary statement
    risk_level = determine_risk_level(risk_factors, prediction_result)
    risk_icon = get_risk_icon(risk_level)
    risk_color = get_risk_color(risk_level)
    
    if prediction_result:
        summary = f"{risk_icon} <span style='color:{risk_color};font-weight:bold'>{risk_level} RISK</span> of heart disease identified based on the following factors:"
    else:
        summary = f"{risk_icon} <span style='color:{risk_color};font-weight:bold'>{risk_level} RISK</span> - The patient shows some risk factors that require monitoring:"
    
    # Format each risk factor with visual indicators
    formatted_factors = []
    for factor in sorted_factors:
        severity = factor.get('severity', 'low')
        color = get_risk_color(severity.upper())
        icon = get_risk_icon(severity.upper())
        
        formatted_factor = {
            'factor': factor['factor'],
            'value': factor['value'],
            'severity': severity,
            'severity_icon': icon,
            'severity_color': color,
            'explanation': factor['explanation'],
            'medical_implications': factor.get('medical_implications', [])
        }
        formatted_factors.append(formatted_factor)
    
    return {
        'summary': summary,
        'risk_level': risk_level.upper(),
        'risk_icon': risk_icon,
        'risk_color': risk_color,
        'risk_factors': formatted_factors
    }

def generate_recommendations(risk_factors, prediction_result):
    """Generate detailed, evidence-based recommendations."""
    risk_level = determine_risk_level(risk_factors, prediction_result)
    
    # Base recommendations for all risk levels
    recommendations = [
        {
            'category': 'Medical Evaluation',
            'items': [
                "Schedule a comprehensive cardiovascular evaluation with a cardiologist",
                "Consider stress testing or coronary CT angiography for further assessment"
            ]
        },
        {
            'category': 'Lifestyle Modifications',
            'items': [
                "Adopt a heart-healthy diet (Mediterranean or DASH diet recommended)",
                "Engage in 150+ minutes of moderate-intensity exercise weekly",
                "Achieve and maintain a healthy BMI (18.5-24.9)"
            ]
        },
        {
            'category': 'Risk Factor Management',
            'items': [
                "Maintain blood pressure < 130/80 mmHg",
                "Target LDL cholesterol < 100 mg/dL (or <70 mg/dL if high risk)",
                "Achieve HbA1c < 7% if diabetic",
                "Complete smoking cessation if applicable"
            ]
        },
        {
            'category': 'Medication Considerations',
            'items': [
                "Statin therapy based on risk level and LDL",
                "Antiplatelet therapy (e.g., low-dose aspirin) if indicated",
                "Antihypertensive medications if BP remains elevated"
            ]
        },
        {
            'category': 'Follow-up & Monitoring',
            'items': [
                "Regular follow-up every 3-6 months for risk factor assessment",
                "Annual lipid profile and metabolic panel",
                "Home blood pressure monitoring"
            ]
        }
    ]
    
    # Risk-level specific modifications
    if risk_level == 'LOW':
        recommendations = [
            {'category': 'General Health', 'items': [
                "Maintain current healthy lifestyle habits",
                "Annual physical examination",
                "Regular cardiovascular risk assessment every 2-3 years"
            ]}
        ]
    elif risk_level == 'MODERATE':
        recommendations = [
            rec for rec in recommendations 
            if rec['category'] in ['Lifestyle Modifications', 'Risk Factor Management', 'Follow-up & Monitoring']
        ]
    elif risk_level == 'HIGH':
        recommendations = [
            rec for rec in recommendations 
            if rec['category'] != 'Medication Considerations' or risk_level == 'HIGH'
        ]
    
    # Add urgent recommendations for critical risk
    if risk_level == 'CRITICAL':
        recommendations.insert(0, {
            'category': 'Urgent Action Required',
            'items': [
                "Immediate cardiology consultation recommended",
                "Consider hospital admission for further evaluation",
                "Cardiac monitoring and serial cardiac biomarkers"
            ]
        })
    
    return recommendations
