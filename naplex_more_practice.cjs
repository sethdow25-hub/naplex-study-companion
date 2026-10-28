'use strict';
function numeric(q, answer, unit, why, blueprint, sourceIds) {
  return {type:'numeric', q, answer, unit, why, blueprint, sourceIds, reviewKind:'independent_calculation'};
}
function multiple(q, options, correct, why, blueprint, sourceIds) {
  return {type:'multiple', q, options, correct, why, blueprint, sourceIds, reviewKind:'source_check'};
}
module.exports = {
  1:[multiple('What should be checked before substituting a biosimilar for its reference product? Select all that apply.',
    ['The specific product’s FDA status','Applicable state substitution requirements','The relevant prescription and patient circumstances','Assume every biosimilar is automatically substitutable everywhere'],[0,1,2],
    'Biosimilar and interchangeable-biosimilar determinations are product specific; substitution also depends on applicable state law and the prescription.','2.B',['biosimilars'])],
  2:[numeric('For a simplified nutrition calculation, a formula contains 100 g of digestible carbohydrate, providing 4 kcal per gram. How many kcal are supplied by that carbohydrate?',400,'kcal',
    '100 g × 4 kcal/g = 400 kcal. This exercise does not determine an individual patient’s nutrition needs.','1.C.7',['nutrition'])],
  3:[numeric('A hypothetical drug follows first-order elimination, with no additional doses. Its concentration is 80 mg/L. What is the concentration after two half-lives?',20,'mg/L',
    'The concentration falls from 80 to 40 mg/L after one half-life, then to 20 mg/L after a second. The stated first-order assumption matters.','1.C.9',['halflife'])],
  4:[numeric('An arithmetic exercise asks for 100 mL of a 0.5% w/v preparation. How many grams of ingredient are needed?',0.5,'g',
    '0.5% w/v means 0.5 g per 100 mL. This calculation alone does not establish a safe or stable preparation.','1.C.6',['math','compound'])],
  5:[multiple('A vaccine refrigerator temperature has gone outside the product’s recommended range. Which actions are appropriate? Select all that apply.',
    ['Notify the vaccine coordinator or supervisor','Mark affected vaccines as do not use and separate them as directed','Document the event and seek product-specific guidance','Assume the vaccines are usable because the vials look normal'],[0,1,2],
    'Follow the facility’s excursion procedure and obtain guidance from the immunization program or manufacturer. Do not assume visual appearance establishes viability.','2.D',['storage'])],
  10:[multiple('For a sterile compounded preparation, which issues need attention? Select all that apply.',
    ['The formulation and compatibility','Applicable standards and appropriate training','Contamination controls and product handling','Assume the preparation is sterile because it looks clear'],[0,1,2],
    'A calculation or a clear appearance cannot establish sterility. Use applicable current standards and product-specific information.','1.B.2',['compound','sterile'])],
  11:[
    multiple('A drug recall notice arrives. Which checks are useful? Select all that apply.',
      ['Compare the product and lot with the recall notice','Follow the specific recall instructions and organizational procedures','Communicate with the appropriate team about affected stock','Assume every lot of every product is always affected'],[0,1,2],
      'Recall actions depend on the affected product, lot, and the notice. Follow the specific instructions and local procedures.','5.B',['recall']),
    multiple('Which actions support privacy during a patient conversation? Select all that apply.',
      ['Limit the information shared to what is appropriate','Use reasonable safeguards against being overheard','Follow applicable privacy rules and workplace procedures','Discuss patient details loudly where unnecessary listeners can hear'],[0,1,2],
      'Reasonable safeguards and appropriate information sharing support confidentiality; exact requirements depend on the situation.','4.D',['privacy']),
    multiple('Which approaches support feedback for a pharmacy learner? Select all that apply.',
      ['Give feedback on observable, specific actions','Provide feedback close enough to the event to be useful','Allow the learner to reflect and practice','Wait until the end and give only a vague criticism'],[0,1,2],
      'Specific, timely, actionable feedback and opportunities to practice are useful elements of pharmacy training.','5.D',['feedback'])
  ]
};
