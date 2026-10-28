/* Additional original lessons, practice items, and calculation drills. */
(() => {
 const L=(title,intro,...points)=>({title,intro,points});
 const Q=(q,right,a,b,c,why)=>({q,options:[right,a,b,c],correct:0,why});
 const extra=[
  {lessons:[
   L('Reading an order safely','Check the complete order before calculating or dispensing.',
     'Identify the patient, medication, strength, formulation, route, dose, frequency, duration and quantity. Clarify missing or ambiguous instructions.',
     'Compare the order against allergies, organ function, duplicate therapy and the medication’s intended use. A mathematically correct dose can still be inappropriate for the patient.',
     'For oral liquids, distinguish the prescribed amount in mg from the measurable volume in mL; verify the concentration on the actual product.'),
   L('Drug information and dosage forms','The source and dosage form can change the answer.',
     'Product labeling provides indication, dosing, contraindications, warnings, interactions and administration details; check the current label for the specific product.',
     'Immediate-release and extended-release products may have different instructions. Do not assume a modified-release tablet can be crushed or substituted on a milligram-for-milligram basis.',
     'When sources differ, consider publication dates, the question being asked, patient-specific factors and the strength of evidence.')
  ],questions:[
   Q('What should be checked before crushing an extended-release tablet?','The product-specific administration instructions','Only the tablet color','Only the patient’s age','The pharmacy’s hours','Modified-release products can have special administration instructions; verify the specific product.'),
   Q('A liquid contains 50 mg per mL. How much drug is in 4 mL?','200 mg','50 mg','100 mg','400 mg','50 mg/mL × 4 mL = 200 mg.'),
   Q('Which is an example of a medication discrepancy?','The patient takes a medicine not shown on the current list','The patient brings an updated medication list','The prescriber verifies an allergy','The concentration is legible','A medicine actually taken but absent from the current list is a discrepancy to reconcile.'),
   Q('What is the first step in solving a calculation?','Identify the requested quantity and its units','Round every input before reading the problem','Discard the concentration','Ignore the patient’s weight','Identify what is requested and keep units visible through the calculation.'),
   Q('Which source describes a specific drug’s contraindications and administration?','Current product labeling','A blank prescription form','An unrelated product advertisement','The patient’s calendar','Current product labeling is a key source for drug-specific use and safety information.')
  ]},
  {lessons:[
   L('Heart failure medications','Treatment differs by the type of heart failure and the patient’s presentation.',
     'Patients with heart failure and reduced ejection fraction may be considered for several evidence-based medication classes, including specific beta blockers, renin-angiotensin system therapies, mineralocorticoid receptor antagonists and SGLT2 inhibitors when appropriate.',
     'Blood pressure, kidney function, potassium, volume status, contraindications and tolerance influence the treatment plan. Loop diuretics are commonly used to relieve congestion.',
     'Review the product, its role, monitoring and treatment plan; do not assume that all beta blockers are interchangeable for every indication.'),
   L('Clot prevention and bleeding','Evaluate the indication as well as the risk of therapy.',
     'Antiplatelet medicines and anticoagulants have different mechanisms and indications; both may contribute to bleeding risk.',
     'With warfarin, monitor INR and consider interacting prescriptions, OTC products and changes in vitamin K intake. Direct oral anticoagulants have product-specific dosing and interaction requirements.',
     'Urgent bleeding symptoms require timely evaluation; patient education includes recognizing and reporting concerning bleeding.')
  ],questions:[
   Q('Which medication is commonly used to relieve fluid congestion?','A loop diuretic','An antacid','A topical antifungal','A vaccine','Loop diuretics are commonly used to address fluid overload.'),
   Q('What is a key difference between anticoagulants and antiplatelets?','They act at different steps in clot formation','Both have the same mechanism','Neither can increase bleeding','They are interchangeable for every indication','Antiplatelets and anticoagulants have different mechanisms and indications.'),
   Q('Which test is used to monitor warfarin?','INR','A1c','TSH','Peak flow','INR measures the anticoagulant response to warfarin.'),
   Q('What should be reviewed before selecting a direct oral anticoagulant dose?','The product, indication, kidney function and interacting medicines','Only the tablet color','Only the month of the year','Only the pharmacy location','Direct oral anticoagulant dosing is product- and indication-specific and may depend on kidney function and interactions.'),
   Q('Which finding should be assessed in heart failure medication review?','Symptoms, blood pressure and volume status','Only eye color','Only shoe size','Only a medication’s shape','Symptoms, volume status and vital signs help evaluate heart failure treatment.')
  ]},
  {lessons:[
   L('Diabetes medication classes','Compare medication benefits, safety and practical use.',
     'Insulin products vary in onset, duration, concentration and device. Basal and mealtime regimens serve different purposes; check the exact product and instructions.',
     'Metformin, GLP-1 receptor agonists, SGLT2 inhibitors and other non-insulin therapies differ in benefits, organ-function considerations, adverse effects and use. Selection depends on the patient and current recommendations.',
     'Hypoglycemia risk differs by drug class and regimen. Review prevention and the patient’s individualized response plan.'),
   L('Medication review in kidney disease','Use the estimate and unit requested by the problem or drug label.',
     'Kidney-function estimates are not interchangeable in every medication decision. Drug labeling may specify the measure used for dosing.',
     'Review changes over time, relevant symptoms and other factors that affect interpretation of serum creatinine.',
     'The goal is to select the appropriate reference, evaluate the patient, adjust when indicated, and monitor the response and adverse effects.')
  ],questions:[
   Q('Why must an insulin concentration be verified?','Insulin products can have different concentrations','Every product contains the same concentration','Concentration never affects the volume','Insulin is never measured in units','Different concentrations can make a volume-based error dangerous.'),
   Q('Which factor may influence selection of a diabetes medicine?','Other health conditions and access to the medication','Only the color of a pen','Only the day of the week','The pharmacy’s wall color','The patient’s conditions, safety, preferences and access matter.'),
   Q('A result labeled eGFR is best described as:','An estimate of kidney filtration','A precise direct measurement in every patient','A blood glucose concentration','A dose of medication','eGFR is an estimate and must be interpreted in context.'),
   Q('How much insulin is in 0.3 mL of U-100 insulin?','30 units','3 units','100 units','300 units','0.3 mL × 100 units/mL = 30 units.'),
   Q('Why review how levothyroxine is taken?','Administration and other products can affect absorption','Its absorption is never affected by other products','It is administered only intravenously','It never requires monitoring','Food, administration timing and interacting products can affect absorption.')
  ]},
  {lessons:[
   L('Cultures, susceptibility and reassessment','Interpret laboratory results along with the clinical picture.',
     'Specimen collection, infection site and timing can affect interpretation. A positive result should be considered in the context of the patient, rather than treated as the entire diagnosis.',
     'Susceptibility results may support narrowing therapy when appropriate. Clinical response, organism, site, allergies and other patient factors remain important.',
     'Assess antibiotic need, dose, route, duration, adverse effects and relevant follow-up throughout therapy.'),
   L('Antibiotic interactions and safety','Pair class-based knowledge with the product’s current instructions.',
     'Doxycycline and some other antibiotics can interact with mineral-containing products such as antacids or iron; follow the specific product’s separation instructions.',
     'Antibiotic-associated diarrhea and allergic reactions require assessment, especially when severe or persistent.',
     'Different drugs have different renal, hepatic and monitoring considerations. Avoid applying one antibiotic’s instructions to every product in the class.')
  ],questions:[
   Q('What can reduce absorption of some oral antibiotics?','Certain mineral-containing antacids or supplements','A clean water glass','A medication list','A culture report','Some antibiotics bind to polyvalent minerals, reducing absorption. Check the specific product instructions.'),
   Q('Why reassess empiric therapy?','Culture results and response may support a more targeted plan','All antibiotics must always be continued unchanged','Viral infections need broader antibiotics','The infection site no longer matters','Clinical response and culture results can guide reassessment and narrowing when appropriate.'),
   Q('Which is important when evaluating an antibiotic allergy?','The reported drug and the nature of the reaction','The shape of the tablet alone','The patient’s favorite meal','Only the pharmacy name','The drug and reaction help assess the allergy history.'),
   Q('What should be reviewed for an antimicrobial course?','Dose, route, duration and response','Only the label color','Only the price','Only the dosage form','Review indication, dose, route, duration, safety and response.'),
   Q('What is antibiotic stewardship intended to improve?','Appropriate antibiotic use and patient safety','Automatic treatment of all viral illnesses','Avoidance of all cultures','Use of the broadest drug for every case','Stewardship supports appropriate selection and use while reducing harm and resistance.')
  ]},
  {lessons:[
   L('HIV medication interactions','Drug interaction review is a routine part of antiretroviral care.',
     'Document prescribed and nonprescription products, supplements, prior antiretroviral use and adherence barriers.',
     'Interactions can change antiretroviral exposure; some integrase inhibitors interact with mineral-containing products. Specific instructions vary by drug and formulation.',
     'Use current HIV guidance and a current interaction reference; recommendations evolve with new evidence and therapies.'),
   L('Vaccine workflow','A safe immunization process begins before the dose is prepared.',
     'Check the current schedule, the patient’s age, medical conditions, previous doses, contraindications and precautions.',
     'Verify product, expiration, storage, dose, route and administration site; document the administration and provide required information according to current rules.',
     'Respond to and report adverse events through appropriate channels. Review live-vaccine precautions for the specific immunocompromised patient.')
  ],questions:[
   Q('Which can affect antiretroviral treatment success?','Adherence, resistance and drug interactions','Only the package color','The season alone','The pharmacist’s initials','Adherence, resistance and interactions can affect treatment success.'),
   Q('Which reference should be checked for an up-to-date adult vaccine recommendation?','The current CDC immunization schedule and notes','An unrelated antibiotic label','A five-year-old personal calendar','Only a price list','Use the current CDC schedule, notes and product information.'),
   Q('Some integrase inhibitors require review of interactions with:','Mineral-containing supplements and antacids','All drinking water','Every vaccine','Only topical moisturizers','Some integrase inhibitors interact with polyvalent cations; check drug-specific instructions.'),
   Q('Which is an appropriate vaccine workflow step?','Check product, route, storage and prior doses','Skip the allergy history','Assume all products use the same schedule','Document nothing','Product verification and the patient’s immunization history are important.'),
   Q('What is VAERS?','A system for reporting vaccine adverse events','A kidney-function equation','A warfarin monitoring test','A type of insulin','VAERS is the Vaccine Adverse Event Reporting System.')
  ]},
  {lessons:[
   L('Reliever and controller concepts','Evaluate the prescribed regimen rather than assuming one inhaler has every role.',
     'Short-acting bronchodilators such as albuterol can provide quick symptom relief. Other inhaled therapies reduce inflammation or provide longer-acting bronchodilation.',
     'Contemporary asthma regimens can combine agents for different roles; follow the patient’s specific prescription and current guidance.',
     'Technique, device preparation, adherence and symptom patterns are essential to assessing control.'),
   L('Fluids and gastrointestinal self-care','Separate a straightforward calculation from the clinical decision.',
     'A concentration relates the amount of a substance to a volume. Track units such as mg/mL or mEq/mL and convert time before calculating an IV rate.',
     'For gastrointestinal symptoms, assess severity, duration, hydration and warning signs before determining whether self-care is appropriate.',
     'Review drug interactions, duplication of OTC ingredients and administration instructions for the specific product.')
  ],questions:[
   Q('Which medicine can act as a quick-relief bronchodilator?','Albuterol','Warfarin','Levothyroxine','Methotrexate','Albuterol is a short-acting bronchodilator used in many quick-relief regimens.'),
   Q('Why review inhaler technique?','Incorrect technique can reduce medication delivery','Technique cannot affect a dose','All devices are used identically','It replaces assessment of symptoms','Inhaler technique can affect delivery and treatment control.'),
   Q('How many mEq are in 10 mL of a 3 mEq/mL solution?','30 mEq','3 mEq','10 mEq','100 mEq','3 mEq/mL × 10 mL = 30 mEq.'),
   Q('What should be assessed before recommending GI self-care?','Duration, severity, hydration and warning signs','Only the label color','Only the person’s favorite food','The medication’s shelf position','Duration, severity and warning signs help determine whether evaluation is needed.'),
   Q('Which is a common inhaled corticosteroid counseling point?','Rinse the mouth after use','Skip all prescribed controller doses','Use every device identically','Stop monitoring symptoms','Mouth rinsing after inhaled corticosteroid use helps reduce local oral adverse effects.')
  ]},
  {lessons:[
   L('Safety in psychiatric treatment','Consider the medication, condition, age and current symptoms.',
     'Antidepressants, antipsychotics and mood stabilizers have different time courses, adverse effects and interactions. Review the specific product and treatment response.',
     'Sedation and other additive effects may occur with combinations of central nervous system depressants; review alcohol and nonprescription products too.',
     'Lithium levels can change with kidney function, fluid balance and interacting medicines. Clinical symptoms and the prescribed monitoring plan matter.'),
   L('Opioid safety and overdose','Recognize medication-related harm and the need for timely action.',
     'Opioids can cause sedation, constipation and respiratory depression; additive sedating medicines can increase risk.',
     'Naloxone can reverse opioid overdose effects, but emergency services and monitoring are still necessary because further treatment may be needed.',
     'For a suspected overdose, follow emergency and poison-control guidance rather than treating a sample calculation as an actual dose.')
  ],questions:[
   Q('What can increase sedation risk with an opioid?','Another central nervous system depressant','A medication list','A blood pressure cuff','A food diary','Combining opioids with other CNS depressants can increase sedation and respiratory risk.'),
   Q('Which factor may change lithium exposure?','Kidney function and fluid balance','Only tablet color','Only eye color','The season alone','Kidney function, fluid balance and interactions can affect lithium levels.'),
   Q('What does naloxone do?','It can reverse opioid overdose effects','It treats every type of poisoning','It replaces emergency care','It is an antidepressant','Naloxone can reverse opioid overdose effects; emergency care and monitoring remain important.'),
   Q('Which is a common opioid adverse effect?','Constipation','Guaranteed absence of sedation','Permanent immunity to infection','Elimination of bleeding risk','Constipation is a common opioid adverse effect.'),
   Q('When reviewing a psychiatric medication, what matters?','Symptoms, response, interactions and adverse effects','Only the package size','Only the manufacturer’s logo','Only the current date','Treatment review includes response, safety, interactions and adherence.')
  ]},
  {lessons:[
   L('Infection risk during cancer treatment','Treatment-related changes in blood counts can increase infection risk.',
     'Some cancer therapies suppress bone marrow, reducing neutrophils and increasing the risk of infection.',
     'A fever or other signs of infection during cancer treatment require prompt assessment according to the oncology care plan.',
     'Review the specific drug’s monitoring, protective measures and supportive care; not all regimens have identical risks.'),
   L('Immunosuppressant and methotrexate safety','Pay close attention to monitoring, interactions and the dosing schedule.',
     'Tacrolimus exposure can be affected by drug interactions. The treatment team may monitor drug concentrations and kidney function.',
     'Methotrexate used for some non-oncology conditions is commonly dosed weekly. A daily-versus-weekly error can cause serious harm; verify the prescription and indication.',
     'Immunosuppressive drugs can increase infection risk. Review each agent’s laboratory monitoring and the patient’s prevention plan.')
  ],questions:[
   Q('What is neutropenia?','A low number of neutrophils','An elevated blood glucose','An elevated INR','An increased platelet count','Neutropenia is a low neutrophil count and can increase infection risk.'),
   Q('What is an important concern with tacrolimus?','Drug interactions and monitoring','It never interacts with other drugs','It is always interchangeable between products','Kidney function is irrelevant','Tacrolimus exposure and kidney function may need monitoring; check interactions.'),
   Q('Why verify the methotrexate schedule?','Some non-oncology regimens are weekly, and daily errors can be serious','All uses are taken every hour','The schedule never matters','It is only used as a cream','Weekly-versus-daily dosing errors can cause serious harm.'),
   Q('What is the result of 120 mg/m² × 1.5 m²?','180 mg','60 mg','120 mg','240 mg','120 × 1.5 = 180 mg; square-meter units cancel.'),
   Q('What is an important component of oncology supportive care?','Monitoring and managing treatment-related adverse effects','Ignoring infection signs','Assuming all regimens are the same','Omitting the medication history','Supportive care addresses treatment effects, symptoms and complications.')
  ]},
  {lessons:[
   L('Pediatric medication safety','The concentration and the measuring device matter as much as the calculated dose.',
     'Check the child’s current weight, whether the order is per dose or per day, the product concentration, the maximum dose and the prescribed schedule.',
     'Calculate the amount in mg before converting to mL. Use an appropriate oral measuring device and clear directions.',
     'Review caregiver understanding and practical administration barriers. Never assume a household spoon provides an accurate dose.'),
   L('Medication review in older adults','Pay attention to the total medication burden and what is actually taken.',
     'Multiple medicines can increase the chance of interactions and adverse events. Include OTC products and supplements in reconciliation.',
     'Kidney function, falls, cognition, dexterity, cost and duplicate therapy may affect the treatment plan.',
     'Assess the indication and ongoing benefit of each medicine and discuss concerns with the treating team.')
  ],questions:[
   Q('What should be verified for a child’s liquid medicine?','Weight, mg dose, product concentration and measuring device','Only bottle color','Only caregiver occupation','Only the shelf location','Weight, dose, concentration and measurement all affect safe administration.'),
   Q('Why include OTC products in an older adult’s medication list?','They may interact with or duplicate other medicines','They never have active ingredients','They cannot cause adverse effects','They replace prescription records','OTC products can contribute to interactions and duplication.'),
   Q('What device is appropriate for measuring a small oral liquid dose?','An appropriately marked oral syringe','A household soup spoon','A drinking glass','An unmarked cup','A correctly marked oral syringe helps measure small liquid doses.'),
   Q('What should pregnancy medication review include?','The indication and current product-specific evidence','A blanket assumption that all medicine is unsafe','Only the medication’s color','Automatic discontinuation without assessment','The care team weighs indication, risks and current evidence for the patient.'),
   Q('Which can be a practical barrier to adherence?','Medication cost','A written plan','Clear instructions','A medication list','Cost and access may make a prescribed regimen difficult to follow.')
  ]},
  {lessons:[
   L('Concentration and dilution','Use the strength and volume from the exact preparation.',
     'For a weight-in-volume percentage, 1% w/v means 1 gram per 100 mL, equivalent to 10 mg/mL. Confirm that the problem specifies the type of percentage.',
     'When appropriate for a simple dilution, the amount of active ingredient before and after dilution is the same; use consistent concentration and volume units.',
     'For compounded preparations, verify compatibility, stability, accurate measurement and the applicable standards; arithmetic alone is not enough.'),
   L('Comparing risks and trial results','Choose the measure that answers the question.',
     'Absolute risk reduction is the difference between control and treatment event rates. Relative risk compares one event rate with another.',
     'NNT is the reciprocal of the absolute risk reduction as a decimal and is rounded up. Interpret it for the population, outcome and follow-up period studied.',
     'Randomization and blinding address different sources of bias. Read the full study methods and limitations before applying a result.')
  ],questions:[
   Q('What does 1% w/v mean?','1 g per 100 mL','1 mg per 100 mL','100 g per 1 mL','1 g per 1 mL','A 1% w/v solution contains 1 gram in 100 mL.'),
   Q('What is 1% w/v in mg/mL?','10 mg/mL','1 mg/mL','100 mg/mL','1,000 mg/mL','1 g = 1,000 mg; 1,000 mg ÷ 100 mL = 10 mg/mL.'),
   Q('What does blinding help reduce?','Bias related to knowing group assignment','The need to define an outcome','The need to report methods','All possible study limitations','Blinding can reduce bias related to knowing the intervention assignment.'),
   Q('A control event rate is 15% and treatment is 10%. What is ARR?','5 percentage points','1 percentage point','10 percentage points','50 percentage points','15% − 10% = 5 percentage points, or 0.05.'),
   Q('If ARR is 0.05, what is NNT?','20','5','10','50','NNT = 1 ÷ 0.05 = 20.')
  ]},
  {lessons:[
   L('From error to improvement','A strong response addresses the patient and the system.',
     'Assess and support the patient first, notify the appropriate team and follow institutional documentation and reporting procedures.',
     'Examine contributing factors such as similar labels, interruptions, handoffs or confusing workflows. The aim is to prevent recurrence.',
     'Consider a measurable process change, implement it according to policy and reassess whether it improved safety.'),
   L('Professional decisions and communication','Ethics and access affect day-to-day pharmacy practice.',
     'Protect confidentiality and follow applicable requirements for sharing information. Communicate clearly and respectfully with patients and the care team.',
     'Ask about barriers such as cost, language, transportation and understanding. Adapt the plan with the patient and team when possible.',
     'Review delegation, supervision and feedback responsibilities in the relevant setting; roles can vary with applicable law and policy.')
  ],questions:[
   Q('What should be addressed first when an error may have harmed a patient?','The patient’s immediate safety and clinical needs','Only the appearance of the label','A marketing report','The weekly supply order','Assess the patient and follow the organization’s safety response process.'),
   Q('Which factor may contribute to a medication error?','Similar product labels and workflow interruptions','A complete allergy list','A clear handoff','Verification of the correct patient','Look-alike labels and interruptions can contribute to error.'),
   Q('What is an example of a quality-improvement activity?','Measuring whether a process change reduces errors','Ignoring event patterns','Changing policy without review','Recording no outcomes','Quality improvement evaluates and measures the effects of process changes.'),
   Q('What does MedWatch accept?','Reports of certain serious medical-product problems','Only vaccination appointments','A medication dose calculation','A pharmacy’s opening schedule','MedWatch accepts reports about serious human medical-product problems.'),
   Q('Why ask about medication cost?','Cost can affect access and adherence','Cost never influences use','It replaces the medication history','It determines the patient’s diagnosis','Cost can be a meaningful barrier to obtaining and taking medication.')
  ]},
  {lessons:[
   L('A repeatable patient-case method','Use the same sequence for familiar and unfamiliar cases.',
     'Read the actual question, then identify relevant history, medication use, allergies, vital signs and laboratory results.',
     'Look for an indication, safety issue, interaction, inappropriate dose, missing monitoring or a counseling need.',
     'Select the best answer supported by the facts. If information is missing, recognize what must be verified rather than inventing it.'),
   L('Final calculation and exam strategy','Make accuracy and pacing part of your final practice.',
     'Write the requested unit, convert before calculating, and estimate whether the answer is reasonable. Avoid rounding until the appropriate final step.',
     'Use mixed timed sets to practice choosing a method; review error patterns and work fresh questions on difficult topics.',
     'The current NABP bulletin describes a six-hour, 225-question exam with no return to a confirmed answer. Verify the latest bulletin before test day.')
  ],questions:[
   Q('What is a useful first step in a patient case?','Identify the question and relevant patient information','Choose a familiar drug without reading','Ignore the allergy list','Skip the medication history','The stem and relevant patient information frame the clinical decision.'),
   Q('Why keep units throughout a calculation?','They help identify conversion and setup errors','They make the problem longer without benefit','Units never affect the result','Only the final number matters','Tracking units helps confirm that the setup yields the requested quantity.'),
   Q('When should you round in a multistep calculation?','At the appropriate final step unless instructed otherwise','Before reading the question','After every step regardless of instruction','Never check the answer','Avoid premature rounding and follow the question’s instructions.'),
   Q('A practice question was missed because the allergy was overlooked. What is the best response?','Record the error pattern and practice reviewing allergies','Memorize the answer without reviewing the case','Ignore all future allergies','Stop checking patient information','Reviewing the underlying mistake helps improve future performance.'),
   Q('Where should you confirm test-day rules?','The current NABP candidate bulletin','An old informal discussion only','An unrelated product label','The weather forecast','NABP’s current candidate bulletin is the authoritative place for exam policies.')
  ]}
 ];
 const refs={
  2:[{name:'MedlinePlus: warfarin',url:'https://medlineplus.gov/druginfo/meds/a682277.html'},{name:'MedlinePlus: lisinopril',url:'https://medlineplus.gov/druginfo/meds/a692051.html'}],
  4:[{name:'MedlinePlus: doxycycline',url:'https://medlineplus.gov/druginfo/meds/a682063.html'}],
  6:[{name:'MedlinePlus: inhaler technique',url:'https://www.medlineplus.gov/druginfo/meds/a601172.html'}],
  8:[{name:'NCI: infection and neutropenia',url:'https://www.cancer.gov/about-cancer/treatment/side-effects/infection'},{name:'MedlinePlus: methotrexate',url:'https://medlineplus.gov/druginfo/meds/a682019.html'},{name:'MedlinePlus: tacrolimus',url:'https://www.medlineplus.gov/druginfo/meds/a601117.html'}]
 };
 for(const w of window.STUDY_DATA){
   const e=extra[w.n-1];w.lessons.push(...e.lessons);w.questions.push(...e.questions);
   if(refs[w.n])w.sources.push(...refs[w.n]);
   const strength=50+25*w.n;
   w.questions.push(Q('A liquid contains '+strength+' mg in 5 mL. How many mL supply '+(strength*2)+' mg?','10 mL','2.5 mL','5 mL','20 mL',(strength*2)+' mg × 5 mL ÷ '+strength+' mg = 10 mL.'));
   const volume=200+20*w.n, rate=volume/2;
   w.questions.push(Q('An infusion of '+volume+' mL is given over 2 hours. What is the rate?',rate+' mL/hour',volume+' mL/hour',(rate+20)+' mL/hour',(rate/2)+' mL/hour',volume+' mL ÷ 2 hours = '+rate+' mL/hour.'));
   const days=7+w.n, qty=days*2;
   w.questions.push(Q('A patient takes 2 tablets daily for '+days+' days. How many tablets are needed?',qty+' tablets',days+' tablets',(days*3)+' tablets',(qty+5)+' tablets','2 tablets/day × '+days+' days = '+qty+' tablets.'));
 }
})();
