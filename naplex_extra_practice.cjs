'use strict';
// New original items; none are copied from an NABP exam or practice test.
function numeric(q, answer, unit, why, blueprint) {
  return {type:'numeric', q, answer, unit, why, blueprint, sourceIds:['math'], reviewKind:'independent_calculation'};
}
function multiple(q, options, correct, why, blueprint, sourceIds) {
  return {type:'multiple', q, options, correct, why, blueprint, sourceIds, reviewKind:'source_check'};
}
module.exports = {
  1:[
    numeric('A hypothetical suspension contains 40 mg/mL. What volume supplies 180 mg? Enter a number in mL.',4.5,'mL','180 mg ÷ 40 mg/mL = 4.5 mL. This is arithmetic practice, not a dosing recommendation.','1.C.5'),
    multiple('Which details help evaluate a reported penicillin reaction? Select all that apply.',
      ['The suspected drug and when it was taken','The symptoms or reaction experienced','How long ago the reaction occurred','The color of the pharmacy walls'],[0,1,2],
      'The specific medication, reaction, and timing help characterize the history. Further evaluation depends on the circumstances.','3.A',['allergy'])
  ],
  2:[
    numeric('A hypothetical infusion is ordered at 0.05 mg/kg/hour for an 80 kg patient. How many mg per hour is that?',4,'mg/hour','0.05 mg/kg/hour × 80 kg = 4 mg/hour. This is arithmetic practice, not a treatment recommendation.','1.C.3'),
    multiple('Which findings merit review for a person taking warfarin? Select all that apply.',
      ['A recent INR result','A newly started antibiotic','An unexplained black, tarry stool','Only the tablet color, without reviewing the medicine'],[0,1,2],
      'INR, possible bleeding, and interacting medicines are important. A possible serious bleed requires prompt clinical assessment.','3.D.2',['warfarin'])
  ],
  3:[
    numeric('A hypothetical U-100 insulin solution contains 100 units/mL. What volume contains 35 units? Enter a number in mL.',0.35,'mL','35 units ÷ 100 units/mL = 0.35 mL. This is a concentration exercise; follow the specific product and device instructions in practice.','1.C.5'),
    multiple('Which can be symptoms of low blood glucose? Select all that apply.',
      ['Shakiness','Sweating','Confusion','A guarantee that there will be no symptoms'],[0,1,2],
      'Low blood glucose can cause shakiness, sweating, or confusion; symptoms and treatment must be assessed in context.','3.C.5',['lowglucose'])
  ],
  4:[
    numeric('A hypothetical order is 6 mg/kg per dose for a person weighing 42 kg. How many mg are in one dose?',252,'mg','6 mg/kg × 42 kg = 252 mg per dose. The order is hypothetical and does not establish an appropriate medication dose.','1.C.2'),
    multiple('Which actions support antibiotic stewardship? Select all that apply.',
      ['Review the indication for treatment','Reassess when culture results and clinical response are available','Clarify the drug and reaction in an allergy history','Continue every broad-spectrum regimen unchanged regardless of evidence'],[0,1,2],
      'Appropriate use includes evaluating the indication, the allergy history, and opportunities to reassess treatment.','4.B',['abx','abxreview','allergy'])
  ],
  5:[
    numeric('For an arithmetic exercise, 8 hypothetical doses each use 0.5 mL. How many mL total are needed, ignoring waste and vial restrictions?',4,'mL','8 × 0.5 mL = 4 mL. Actual vaccine preparation and vial requirements are product-specific.','1.C.2'),
    multiple('Which checks belong in an immunization workflow? Select all that apply.',
      ['Review vaccine history and eligibility','Screen for contraindications and precautions','Check the correct product and route','Skip documentation if the patient feels well'],[0,1,2],
      'History, screening, the correct product and route, and documentation all matter. Use the current schedule and product guidance.','2.C',['vaccine','vaccineschedule'])
  ],
  6:[
    numeric('An exercise asks for 250 mL to infuse over 90 minutes. What is the pump rate in mL/hour, rounded to one decimal place?',166.7,'mL/hour','90 minutes is 1.5 hours. 250 ÷ 1.5 = 166.666… mL/hour, or 166.7 mL/hour to one decimal.','1.C.3'),
    multiple('Which steps are useful when reviewing an inhaled corticosteroid? Select all that apply.',
      ['Check the person’s device technique','Review whether the medicine is being taken as prescribed','For a product that instructs it, rinse the mouth after inhalation','Assume all inhalers use identical technique'],[0,1,2],
      'Technique and adherence affect treatment. Follow the specific product’s instructions; fluticasone labeling advises rinsing the mouth after use.','3.G',['asthma','inhaled'])
  ],
  7:[
    numeric('A hypothetical prescription is for 1.5 tablets twice daily for 14 days. How many tablets are needed?',42,'tablets','1.5 tablets × 2 doses/day × 14 days = 42 tablets.','1.C.2'),
    multiple('What steps are appropriate when opioid overdose is suspected? Select all that apply.',
      ['Call emergency services','Give naloxone if available and follow instructions','Stay with the person until emergency help arrives','Assume medical care is unnecessary if the person wakes up'],[0,1,2],
      'Naloxone can temporarily reverse opioid effects, but emergency help and continued observation remain important.','3.C.6',['naloxone'])
  ],
  8:[
    numeric('A hypothetical regimen is 40 mg/m² and the person’s body-surface area is 1.65 m². What is the calculated dose in mg?',66,'mg','40 mg/m² × 1.65 m² = 66 mg. This is a mathematical exercise, not a prescribing recommendation.','1.C.2'),
    multiple('Which steps help prevent a methotrexate schedule error? Select all that apply.',
      ['Verify the exact prescribed schedule and indication','Clarify a questionable daily schedule with the prescriber','Review relevant interactions and product instructions','Assume every non-oncology regimen is taken daily'],[0,1,2],
      'Some non-neoplastic regimens are weekly, and inadvertent daily use has caused serious harm. Verify the actual prescription.','3.C.2',['methotrexate'])
  ],
  9:[
    numeric('A hypothetical pediatric order is 12.5 mg/kg per dose for a child weighing 16 kg. How many mg are in one dose?',200,'mg','12.5 mg/kg × 16 kg = 200 mg per dose. This example does not establish a safe dose for any actual child.','1.C.2'),
    multiple('Which checks help with a child’s oral liquid medicine? Select all that apply.',
      ['Verify the current weight and units when weight matters','Check the prescribed mg dose and product concentration','Use an appropriately marked oral dosing device','Use an unmarked household spoon for accuracy'],[0,1,2],
      'Check the patient, dose, concentration, and measuring device. A marked oral dosing device is more appropriate than an unmarked household spoon.','3.C.2',['child','syringe'])
  ],
  10:[
    numeric('In a hypothetical one-year study, 18% of the control group and 12% of the treatment group have an event. What is the absolute risk reduction in percentage points?',6,'percentage points','18% − 12% = 6 percentage points over the study’s one-year follow-up.','1.C.8'),
    multiple('Which statements about clinical trials are sound? Select all that apply.',
      ['Randomization assigns participants by chance','Masking can limit knowledge of group assignment','The study population affects how results apply to a patient','Randomization guarantees that every possible bias is eliminated'],[0,1,2],
      'Randomization and masking address important sources of bias, but neither eliminates all limitations; consider the population and outcomes.','1.E',['study','blinding'])
  ],
  11:[
    numeric('A prescription provides 84 capsules. The directions are 2 capsules twice daily. How many days should the supply last?',21,'days','2 capsules × 2 times/day = 4 capsules/day; 84 ÷ 4 = 21 days.','1.C.2'),
    multiple('After a medication error that may have harmed someone, which actions support a safety response? Select all that apply.',
      ['Attend to the patient’s immediate clinical needs','Examine contributing system factors','Measure whether improvement steps have their intended effect','Assume one person is the only possible cause without investigation'],[0,1,2],
      'Address immediate patient needs, then use an appropriate systems approach to analyze the event and evaluate improvements.','5.C',['immediate','rca','qi'])
  ],
  12:[
    numeric('A hypothetical vial contains 1.2 g in 30 mL. What volume contains 200 mg? Enter a number in mL.',5,'mL','1.2 g = 1,200 mg, so the concentration is 40 mg/mL. 200 mg ÷ 40 mg/mL = 5 mL.','1.C.5'),
    multiple('Which information is relevant in a patient-specific medication review? Select all that apply.',
      ['The medication list and actual use','The nature of a reported allergy','Kidney function when relevant to the medicine','The medicine’s name without the patient’s circumstances'],[0,1,2],
      'The patient’s medicines, allergy history and relevant organ function all inform medication assessment.','3.A',['medhistory','allergy','kidney'])
  ]
};
