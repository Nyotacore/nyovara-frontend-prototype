/* =========================================================================
   NYOVARA DEMONSTRATION DATA — deterministic seed, dates relative to today.
   All organisations, people, vessels and IMO numbers are fictional.
   ========================================================================= */
(function () {
  'use strict';
  const N = (window.N = window.N || {});
  N.seed = function () {
    let s = 20261113;
    const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const T = new Date(); T.setHours(0, 0, 0, 0);
    const d = (n) => { const x = new Date(T); x.setDate(x.getDate() + n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
    const ts = (n, h) => { const x = new Date(T); x.setDate(x.getDate() + n); x.setHours(h == null ? int(7, 18) : h, int(0, 59)); return x.toISOString(); };
    const R = (arr) => arr.map((name, i) => ({ id: 'ref_' + i + '_' + name.replace(/\W/g, '').slice(0, 10), name, active: true }));
    const ORG = 'Atlantic Meridian Shipmanagement';

    const ranks = { Deck: ['Master', 'Chief Officer', 'Second Officer', 'Third Officer', 'Bosun', 'Able Seaman', 'Ordinary Seaman', 'Deck Cadet'], Engine: ['Chief Engineer', 'Second Engineer', 'Third Engineer', 'Fourth Engineer', 'Motorman', 'Oiler', 'Fitter', 'Wiper', 'Engine Cadet'], Electrical: ['Electro-Technical Officer'], Catering: ['Chief Cook', 'Messman'] };
    const allRanks = [].concat(...Object.values(ranks));
    const deptOf = (r) => Object.keys(ranks).find((k) => ranks[k].includes(r));
    const reference = {
      ranks: R(allRanks), departments: R(['Deck', 'Engine', 'Electrical', 'Catering', 'Shore Operations']),
      crewTypes: R(['Permanent', 'Contract', 'Rotational', 'Cadet / Trainee', 'Relief']),
      crewStatuses: R(['Available', 'Employed', 'Onboard', 'On Leave', 'Inactive', 'Suspended', 'Terminated']),
      vesselTypes: R(['Container Ship', 'Bulk Carrier', 'Product Tanker', 'Crude Oil Tanker', 'LPG Carrier', 'Offshore Supply Vessel', 'General Cargo', 'Anchor Handling Tug']),
      nationalities: R(['Nigerian', 'Ghanaian', 'Filipino', 'Indian', 'Ukrainian', 'Polish', 'Croatian', 'Indonesian', 'Romanian', 'Kenyan', 'South African', 'Sri Lankan', 'Malaysian', 'Bangladeshi', 'Cameroonian']),
      certCategories: R(['STCW Basic Safety', 'Certificate of Competency', 'Endorsement', 'Specialised Training', 'Medical First Aid', 'Security', 'Tanker Familiarisation', 'GMDSS']),
      medicalCategories: R(['ENG1 / Seafarer Medical', 'Drug & Alcohol Test', 'Yellow Fever Vaccination', 'Chest X-Ray', 'Audiometry']),
      travelDocTypes: R(["International Passport", "Seaman's Book", 'Discharge Book', 'Visa', 'Work Permit', 'Travel Authorisation', 'Other']),
      ports: R(['Lagos (Apapa)', 'Onne', 'Tema', 'Abidjan', 'Durban', 'Rotterdam', 'Antwerp', 'Singapore', 'Port Klang', 'Jebel Ali', 'Algeciras', 'Lomé', 'Walvis Bay', 'Mombasa', 'Santos', 'Houston', 'Fujairah', 'Port Harcourt', 'Bonny Offshore Terminal', 'Las Palmas']),
      employmentTypes: R(['Fixed-term Contract', 'Permanent', 'Trip Contract', 'Cadetship']),
      welfareCategories: R(['General wellbeing', 'Working conditions', 'Accommodation', 'Food and nutrition', 'Connectivity', 'Access to support', 'Medical assistance', 'Family emergency', 'Shore leave', 'Wages & allotments', 'General feedback']),
      trainingCategories: R(['Safety', 'Technical', 'Leadership', 'Navigation', 'Engineering', 'Regulatory', 'Professional Development']),
      payrollCategories: R(['Basic Salary', 'Overtime', 'Bonus', 'Leave Allowance', 'Travel Allowance', 'Hardship Allowance', 'Union Dues', 'Pension', 'Income Tax', 'Advance Recovery']),
      locations: R(['Lagos Office', 'Port Harcourt Office', 'Manila Crewing Office', 'Mumbai Crewing Office', 'Gdynia Office', 'Remote']),
      manningAgents: R(['Bight Crew Services Ltd', 'Pacific Manning Partners Inc', 'Konkan Marine Staffing Pvt Ltd', 'Baltic Crew Supply Sp. z o.o.', 'Gulf of Guinea Crewing Co.']),
      shipManagers: R(['Olumide Bankole', 'Hannah Mensah', 'Rajesh Iyer', 'Katarzyna Nowak']),
      regulationCategories: R(['SMC-9 Category A', 'SMC-9 Category B', 'SMC-9 Category C', 'Not Applicable']),
      alertTypes: R(['Standard (90/60/30/7 days)', 'Critical (120/90/60/30/7 days)', 'Short (30/7 days)', 'No alert']),
      drinking: R(['No', 'Occasionally', 'Socially', 'Prefer not to say']), smoking: R(['No', 'Yes', 'Occasionally', 'Quit']),
      maritalStatus: R(['Single', 'Married', 'Divorced', 'Widowed', 'Separated']),
      qualifications: R(['Secondary School', 'OND Nautical Science', 'HND Marine Engineering', 'BSc Nautical Science', 'BEng Marine Engineering', 'Diploma Catering', 'MSc Maritime Studies']),
      hudValidity: R(['Option A (pending definition)', 'Option B (pending definition)'])
    };

    const people = [
      ['Emmanuel', 'Adeyemi', 'M', 'Nigerian', 'Second Officer'], ['Marek', 'Kowalski', 'M', 'Polish', 'Master'], ['Joseph', 'Mensah', 'M', 'Ghanaian', 'Chief Officer'], ['Ramon', 'Dela Cruz', 'M', 'Filipino', 'Third Officer'], ['Chinedu', 'Okonkwo', 'M', 'Nigerian', 'Chief Engineer'],
      ['Arjun', 'Nair', 'M', 'Indian', 'Second Engineer'], ['Oleksandr', 'Bondarenko', 'M', 'Ukrainian', 'Electro-Technical Officer'], ['Jericho', 'Santos', 'M', 'Filipino', 'Bosun'], ['Kwabena', 'Asante', 'M', 'Ghanaian', 'Able Seaman'], ['Ibrahim', 'Musa', 'M', 'Nigerian', 'Chief Cook'],
      ['Grace', 'Eze', 'F', 'Nigerian', 'Deck Cadet'], ['Ivan', 'Horvat', 'M', 'Croatian', 'Master'], ['Budi', 'Santoso', 'M', 'Indonesian', 'Third Engineer'], ['Andrei', 'Popescu', 'M', 'Romanian', 'Chief Officer'], ['Peter', 'Kamau', 'M', 'Kenyan', 'Motorman'],
      ['Samuel', 'Nkosi', 'M', 'South African', 'Second Officer'], ['Ruwan', 'Perera', 'M', 'Sri Lankan', 'Fourth Engineer'], ['Mark Anthony', 'Reyes', 'M', 'Filipino', 'Able Seaman'], ['Tunde', 'Ogunleye', 'M', 'Nigerian', 'Oiler'], ['Priya', 'Sharma', 'F', 'Indian', 'Third Officer'],
      ['Dmytro', 'Shevchenko', 'M', 'Ukrainian', 'Chief Engineer'], ['Kofi', 'Boateng', 'M', 'Ghanaian', 'Ordinary Seaman'], ['Nnamdi', 'Ibe', 'M', 'Nigerian', 'Fitter'], ['Rizal', 'Hakim', 'M', 'Malaysian', 'Second Engineer'], ['Tomasz', 'Wiśniewski', 'M', 'Polish', 'Chief Officer'],
      ['Aminu', 'Bello', 'M', 'Nigerian', 'Wiper'], ['Jose', 'Villanueva', 'M', 'Filipino', 'Messman'], ['Vikram', 'Rao', 'M', 'Indian', 'Master'], ['Luka', 'Babić', 'M', 'Croatian', 'Second Engineer'], ['Esther', 'Achieng', 'F', 'Kenyan', 'Deck Cadet'],
      ['Yaw', 'Owusu', 'M', 'Ghanaian', 'Able Seaman'], ['Emeka', 'Nwosu', 'M', 'Nigerian', 'Third Officer'], ['Rahim', 'Uddin', 'M', 'Bangladeshi', 'Oiler'], ['Paul', 'Fon', 'M', 'Cameroonian', 'Bosun'], ['Christian', 'Ionescu', 'M', 'Romanian', 'Third Engineer'],
      ['Joel', 'Bautista', 'M', 'Filipino', 'Chief Cook'], ['Adebayo', 'Lawal', 'M', 'Nigerian', 'Electro-Technical Officer'], ['Nikhil', 'Menon', 'M', 'Indian', 'Fourth Engineer'], ['Sipho', 'Dlamini', 'M', 'South African', 'Motorman'], ['Agus', 'Wijaya', 'M', 'Indonesian', 'Able Seaman'],
      ['Halyna', 'Kovalenko', 'F', 'Ukrainian', 'Second Officer'], ['Femi', 'Adebisi', 'M', 'Nigerian', 'Engine Cadet'], ['Dariusz', 'Zieliński', 'M', 'Polish', 'Chief Engineer'], ['Ebo', 'Quansah', 'M', 'Ghanaian', 'Fitter'], ['Carlo', 'Mendoza', 'M', 'Filipino', 'Ordinary Seaman'],
      ['Uchenna', 'Agu', 'M', 'Nigerian', 'Chief Officer'], ['Mihai', 'Stan', 'M', 'Romanian', 'Messman'], ['Ali', 'Abdullahi', 'M', 'Nigerian', 'Able Seaman']
    ];
    const vesselsSeed = [
      ['MV Atlantic Aurora', 'Container Ship', 'Liberia', 2016, 41200, 50800, 'Underway', 'Tema'], ['MT Gulf Meridian', 'Product Tanker', 'Marshall Islands', 2014, 29700, 49990, 'In Port', 'Lagos (Apapa)'],
      ['MV Benin Star', 'Bulk Carrier', 'Panama', 2012, 33000, 57000, 'Underway', 'Durban'], ['MT Niger Delta Spirit', 'Crude Oil Tanker', 'Nigeria', 2010, 58100, 105400, 'In Port', 'Bonny Offshore Terminal'],
      ['OSV Bight Endeavour', 'Offshore Supply Vessel', 'Nigeria', 2018, 3100, 4500, 'Underway', 'Onne'], ['MV Harmattan Trader', 'General Cargo', 'Malta', 2011, 9600, 12650, 'In Port', 'Abidjan'],
      ['LPG Kaduna Breeze', 'LPG Carrier', 'Liberia', 2019, 20500, 23800, 'Underway', 'Algeciras'], ['AHT Ogun Pioneer', 'Anchor Handling Tug', 'Nigeria', 2015, 2200, 2600, 'Inactive', 'Port Harcourt']
    ];
    const imoCheck = (six) => { const ds = String(six).split('').map(Number); const sum = ds.reduce((a, x, i) => a + x * (7 - i), 0); return `${six}${sum % 10}`; };
    const vessels = vesselsSeed.map((v, i) => ({ id: 'ves_' + (i + 1), name: v[0], type: v[1], flag: v[2], yearBuilt: v[3], gt: v[4], dwt: v[5], position: v[6] === 'Inactive' ? 'In Port' : v[6], status: v[6] === 'Inactive' ? 'Inactive' : 'Active', currentPort: v[7], imo: imoCheck(941200 + i * 1371), mmsi: String(657100000 + i * 1137), callSign: '5N' + String.fromCharCode(65 + i) + 'Z' + (i + 3), owner: i % 2 ? 'Meridian Tankers Holdings Ltd' : 'Atlantic Meridian Shipping Ltd', operator: ORG, shipManager: pick(reference.shipManagers).name, classSociety: pick(['DNV', 'ABS', 'Lloyd\'s Register', 'Bureau Veritas']), crewComplement: [22, 24, 21, 26, 14, 16, 22, 10][i] }));

    // ---- crew ----
    const crewStatusPlan = ['Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Onboard', 'Available', 'Onboard', 'Onboard', 'On Leave', 'Onboard', 'Onboard', 'Available', 'Onboard', 'Onboard', 'Available', 'Onboard', 'On Leave', 'Employed', 'Onboard', 'Onboard', 'Onboard', 'On Leave', 'Available', 'Onboard', 'Available', 'Inactive', 'Onboard', 'On Leave', 'Onboard', 'Available', 'Employed', 'Onboard', 'Suspended', 'On Leave', 'Available', 'Terminated', 'Onboard', 'Inactive', 'On Leave', 'Employed', 'Terminated'];
    // first 10 crew on Aurora; others distributed
    const vesselFor = (i, st) => { if (st !== 'Onboard') return null; if (i < 10) return 'ves_1'; return 'ves_' + (2 + (i % 6)); };
    const NOKREL = ['Spouse', 'Mother', 'Father', 'Brother', 'Sister'];
    const cities = { Nigerian: ['Lagos', 'Port Harcourt', 'Warri', 'Calabar'], Ghanaian: ['Accra', 'Takoradi', 'Tema'], Filipino: ['Manila', 'Cebu', 'Iloilo'], Indian: ['Mumbai', 'Kochi', 'Chennai'], Ukrainian: ['Odesa', 'Kherson', 'Mykolaiv'], Polish: ['Gdynia', 'Szczecin', 'Gdańsk'], Croatian: ['Rijeka', 'Split'], Indonesian: ['Jakarta', 'Surabaya'], Romanian: ['Constanța', 'Galați'], Kenyan: ['Mombasa', 'Nairobi'], 'South African': ['Durban', 'Cape Town'], 'Sri Lankan': ['Colombo', 'Galle'], Malaysian: ['Port Klang', 'Johor Bahru'], Bangladeshi: ['Chattogram', 'Dhaka'], Cameroonian: ['Douala', 'Limbe'] };
    const countryOf = { Nigerian: 'Nigeria', Ghanaian: 'Ghana', Filipino: 'Philippines', Indian: 'India', Ukrainian: 'Ukraine', Polish: 'Poland', Croatian: 'Croatia', Indonesian: 'Indonesia', Romanian: 'Romania', Kenyan: 'Kenya', 'South African': 'South Africa', 'Sri Lankan': 'Sri Lanka', Malaysian: 'Malaysia', Bangladeshi: 'Bangladesh', Cameroonian: 'Cameroon' };
    const wageByRank = { Master: 11800, 'Chief Officer': 8400, 'Second Officer': 5200, 'Third Officer': 4300, 'Deck Cadet': 900, Bosun: 2600, 'Able Seaman': 1950, 'Ordinary Seaman': 1400, 'Chief Engineer': 11200, 'Second Engineer': 8000, 'Third Engineer': 5000, 'Fourth Engineer': 4100, 'Electro-Technical Officer': 5400, Motorman: 1900, Oiler: 1850, Fitter: 2400, Wiper: 1300, 'Engine Cadet': 900, 'Chief Cook': 2300, Messman: 1250 };
    const crew = people.map((p, i) => {
      const [g, sn, sex, nat, rank] = p; const st = crewStatusPlan[i] || 'Available';
      const city = pick(cities[nat]); const signOn = st === 'Onboard' ? d(-int(20, 150)) : '';
      const married = rnd() > 0.35;
      const c = {
        id: 'crw_' + (i + 1), code: 'AMS-' + String(1001 + i), givenName: g, surname: sn, fatherName: pick(['Samuel', 'Joseph', 'David', 'Peter', 'Michael', 'John', 'Andrew']) + ' ' + sn,
        poolCode: 'POOL-' + ['DK', 'EN', 'EL', 'CT'][Object.keys(ranks).indexOf(deptOf(rank))] + '-' + String(i + 1).padStart(2, '0'),
        location: pick(reference.locations.slice(0, 5)).name, inactive: st === 'Inactive', shipManager: pick(reference.shipManagers).name, department: deptOf(rank), rank, crewType: rank.includes('Cadet') ? 'Cadet / Trainee' : pick(['Contract', 'Rotational', 'Permanent', 'Contract']),
        status: st, cvId: 'CV-' + (52000 + i * 17), regulation: pick(['SMC-9 Category A', 'SMC-9 Category B', 'Not Applicable']), fixedSalary: wageByRank[rank], currency: 'USD', huedValidity: '', signedOn: signOn,
        hasContract: ['Onboard', 'Employed'].includes(st), blacklisted: st === 'Terminated' && i % 2 === 0, resigned: st === 'Terminated' && i % 2 === 1, notRecommended: st === 'Terminated', comments: '',
        drinking: pick(['No', 'Occasionally', 'Socially']), smoking: pick(['No', 'No', 'Yes', 'Quit']),
        gender: sex === 'M' ? 'Male' : 'Female', maritalStatus: married ? 'Married' : 'Single', dob: d(-int(22, 56) * 365 - int(0, 300)), nationality: nat, placeOfBirth: city,
        email: `${g.split(' ')[0].toLowerCase()}.${sn.toLowerCase().replace(/[^a-z]/g, '')}@mail.com`, height: int(160, 192), weight: int(58, 98), phone: '+' + int(20, 380) + ' ' + int(700, 909) + ' ' + int(100, 999) + ' ' + int(1000, 9999), mobile: '+' + int(20, 380) + ' 80' + int(1, 9) + ' ' + int(100, 999) + ' ' + int(1000, 9999), fax: '', city, religion: '', country: countryOf[nat],
        presentAddress: `${int(2, 180)} ${pick(['Marina Road', 'Harbour Street', 'Seaview Avenue', 'Admiralty Way', 'Port Road'])}, ${city}`, homeAddress: `${int(2, 99)} ${pick(['Unity Close', 'Palm Grove', 'Church Street', 'Market Road'])}, ${city}`,
        hireType: rnd() > 0.45 ? 'Through Manning Agent' : 'Direct', manningAgent: '', experienceMonths: int(rank.includes('Cadet') ? 3 : 24, rank.match(/Master|Chief/) ? 260 : 140), dischargeBook: 'DB' + int(100000, 999999),
        taxNo: 'TIN-' + int(10000000, 99999999), epf: 'EPF' + int(1000000, 9999999), nric: rnd() > 0.85 ? int(700101, 991231) + '-14-' + int(1000, 9999) : '', socso: 'SOC' + int(100000, 999999), qualification: rank.includes('Engineer') ? 'HND Marine Engineering' : rank.match(/Officer|Master/) ? 'BSc Nautical Science' : rank.includes('Cook') ? 'Diploma Catering' : 'Secondary School', remarks: '',
        vesselId: vesselFor(i, st), availableFrom: st === 'Available' ? d(int(-10, 20)) : st === 'On Leave' ? d(int(10, 70)) : st === 'Onboard' ? d(int(20, 140)) : '', photo: null, attachments: [{ name: `CV_${sn}_${g.split(' ')[0]}.pdf`, size: int(90, 600) * 1024, type: 'application/pdf' }],
        nextOfKin: [{ id: 'nok_' + i + 'a', name: (married ? pick(['Ngozi', 'Maria', 'Anita', 'Olena', 'Akosua', 'Lerato', 'Joanna']) : pick(['Comfort', 'Teresa', 'Lakshmi', 'Halina', 'Esi'])) + ' ' + sn, relationship: married ? 'Spouse' : 'Mother', phone: '', mobile: '+' + int(20, 380) + ' 81' + int(1, 9) + ' ' + int(100, 999) + ' ' + int(1000, 9999), email: '', country: countryOf[nat], city, address: `${int(2, 99)} ${pick(['Unity Close', 'Palm Grove', 'Church Street'])}, ${city}`, comments: '', primary: true }].concat(rnd() > 0.6 ? [{ id: 'nok_' + i + 'b', name: pick(['Daniel', 'Grace', 'Ruth', 'Samuel']) + ' ' + sn, relationship: pick(NOKREL.slice(1)), phone: '', mobile: '+' + int(20, 380) + ' 70' + int(1, 9) + ' ' + int(100, 999) + ' ' + int(1000, 9999), email: '', country: countryOf[nat], city, address: '', comments: 'Secondary contact', primary: false }] : []),
        children: married && rnd() > 0.35 ? Array.from({ length: int(1, 3) }, (_, k) => ({ id: 'chd_' + i + '_' + k, name: pick(['Daniel', 'Favour', 'Miguel', 'Ananya', 'Sofia', 'Kwame', 'Zara', 'Ethan', 'Amara']) + ' ' + sn, sex: rnd() > 0.5 ? 'Male' : 'Female', dob: d(-int(1, 17) * 365 - int(0, 300)) })) : [],
        history: [{ status: 'Available', ts: ts(-400), user: 'System import', note: 'Migrated from legacy crew system' }].concat(st !== 'Available' ? [{ status: st, ts: signOn ? new Date(signOn + 'T09:00:00').toISOString() : ts(-int(5, 60)), user: 'Adaeze Okafor', note: '' }] : []),
        createdOn: ts(-400), createdBy: 'System import'
      };
      if (c.hireType === 'Through Manning Agent') c.manningAgent = { Filipino: 'Pacific Manning Partners Inc', Indian: 'Konkan Marine Staffing Pvt Ltd', Polish: 'Baltic Crew Supply Sp. z o.o.', Ukrainian: 'Baltic Crew Supply Sp. z o.o.' }[nat] || pick(['Bight Crew Services Ltd', 'Gulf of Guinea Crewing Co.']);
      return c;
    });
    crew[0].email = 'e.adeyemi@mail.com'; crew[0].experienceMonths = 74; crew[0].huedValidity = '';
    crew[30].status = 'Available'; // keep pool realistic
    // pending verification
    crew[41].status = 'Available'; crew[41].awaitingVerification = true; crew[29].awaitingVerification = true;

    // ---- certificates / medical / travel docs ----
    const certs = [], medical = [], travelDocs = [], employment = [], seaService = [], contracts = [];
    const CERTS_BASE = [['Basic Safety Training (STCW A-VI/1)', 'STCW Basic Safety', 1825], ['Proficiency in Survival Craft (A-VI/2-1)', 'Specialised Training', 1825], ['Advanced Fire Fighting (A-VI/3)', 'Specialised Training', 1825], ['Ship Security Awareness (A-VI/6-1)', 'Security', 0]];
    const CERTS_OFF = [['Certificate of Competency', 'Certificate of Competency', 1825], ['GMDSS General Operator Certificate', 'GMDSS', 1825], ['ECDIS Generic Training', 'Specialised Training', 0], ['Medical First Aid (A-VI/4-1)', 'Medical First Aid', 1825]];
    const ENG_OFF = [['Certificate of Competency (Engine)', 'Certificate of Competency', 1825], ['High Voltage Management', 'Specialised Training', 1825]];
    const authorities = { Nigerian: 'NIMASA', Ghanaian: 'Ghana Maritime Authority', Filipino: 'MARINA', Indian: 'DG Shipping', Ukrainian: 'Maritime Administration of Ukraine', Polish: 'Urząd Morski w Gdyni', Croatian: 'Ministry of Sea, Croatia', Indonesian: 'DG Sea Transportation', Romanian: 'Romanian Naval Authority', Kenyan: 'Kenya Maritime Authority', 'South African': 'SAMSA', 'Sri Lankan': 'Merchant Shipping Secretariat', Malaysian: 'Marine Department Malaysia', Bangladeshi: 'Department of Shipping', Cameroonian: 'Ministry of Transport, Cameroon' };
    crew.forEach((c, i) => {
      const list = CERTS_BASE.concat(c.rank.match(/Master|Officer/) && c.department === 'Deck' ? CERTS_OFF : []).concat(c.rank.match(/Engineer/) ? ENG_OFF : []);
      list.forEach(([name, cat, validity], k) => {
        const issue = d(-int(200, 1600)); let exp = validity ? N.addDaysRaw(issue, validity) : '';
        if (i % 7 === 2 && k === 1) exp = d(int(5, 40)); if (i % 9 === 4 && k === 0) exp = d(-int(3, 60)); if (i % 11 === 6 && k === 2) exp = d(int(45, 85));
        certs.push({ id: `crt_${i}_${k}`, crewId: c.id, name, category: cat, number: `${cat.split(' ')[0].toUpperCase().slice(0, 4)}/${int(10000, 99999)}/${2019 + int(0, 6)}`, authority: authorities[c.nationality], issueDate: issue, expiryDate: exp, attachment: { name: name.split(' (')[0].replace(/\W+/g, '_') + '.pdf', size: int(120, 900) * 1024, type: 'application/pdf' }, verification: i % 13 === 5 && k === 0 ? 'Pending Verification' : 'Verified', verifiedBy: 'Hannah Mensah', verifiedOn: N.addDaysRaw(issue, int(3, 30)), archived: false });
      });
      medical.push({ id: 'med_' + i, crewId: c.id, certificate: 'ENG1 / Seafarer Medical', examDate: d(-int(30, 700)), expiryDate: i % 10 === 3 ? d(int(4, 25)) : i % 17 === 8 ? d(-int(2, 30)) : d(int(60, 700)), authority: pick(['Seafarers Medical Centre, Lagos', 'Approved Medical Practitioner — Manila', 'Mumbai Port Medical Centre', 'Gdynia Maritime Clinic']), fitness: i % 19 === 7 ? 'Fit with Restrictions' : 'Fit for Duty', restrictions: i % 19 === 7 ? 'No work aloft for 3 months' : '', attachment: { name: 'Medical_Certificate.pdf', size: 240000, type: 'application/pdf' } });
      medical.push({ id: 'med2_' + i, crewId: c.id, certificate: 'Drug & Alcohol Test', examDate: d(-int(10, 300)), expiryDate: d(int(60, 300)), authority: 'Approved Laboratory', fitness: 'Fit for Duty', restrictions: '', attachment: null });
      travelDocs.push({ id: 'trv_p' + i, crewId: c.id, alertType: 'Critical (120/90/60/30/7 days)', docType: 'International Passport', number: ['A', 'P', 'E', 'N'][i % 4] + int(10000000, 99999999), country: c.country, issueDate: d(-int(300, 3000)), expiryDate: i % 8 === 1 ? d(int(20, 100)) : i % 15 === 9 ? d(-int(5, 90)) : d(int(200, 2500)), placeOfIssue: c.city, issuedBy: 'Immigration Service, ' + c.country, active: true, attachment: { name: 'Passport_bio_page.jpg', size: 380000, type: 'image/jpeg' } });
      travelDocs.push({ id: 'trv_s' + i, crewId: c.id, alertType: 'Standard (90/60/30/7 days)', docType: "Seaman's Book", number: 'SB' + int(100000, 999999), country: c.country, issueDate: d(-int(300, 2500)), expiryDate: i % 6 === 4 ? d(int(10, 80)) : d(int(150, 2000)), placeOfIssue: c.city, issuedBy: authorities[c.nationality], active: true, attachment: { name: 'Seamans_book.pdf', size: 520000, type: 'application/pdf' } });
      if (i % 3 === 0) travelDocs.push({ id: 'trv_v' + i, crewId: c.id, alertType: 'Short (30/7 days)', docType: 'Visa', number: 'C1/D-' + int(1000000, 9999999), country: 'United States', issueDate: d(-int(100, 900)), expiryDate: d(int(-20, 900)), placeOfIssue: 'Embassy', issuedBy: 'US Department of State', active: true, attachment: null });
      // employment & sea service
      const emp = [['Atlantic Meridian Shipmanagement', null], [pick(['Coastline Marine Ltd', 'Westbridge Ship Management', 'Harbourline Shipping', 'Equator Tankers Ltd']), pick(['MV Coral Dawn', 'MT Sahel Pride', 'MV Lagoon Express', 'MT Ocean Herald'])], [pick(['Delta Offshore Services', 'Bluewater Bulk Carriers', 'Seaward Logistics']), pick(['OSV Sea Falcon', 'MV Green Harvest', 'MV Cape Unity'])]];
      let end = c.status === 'Onboard' ? '' : d(-int(20, 120));
      emp.forEach(([employer, vn], k) => {
        const vv = k === 0 ? (c.vesselId ? vessels.find((x) => x.id === c.vesselId) : pick(vessels.slice(0, 7))) : null;
        const start = N.addDaysRaw(end || d(0), -int(150, 260)); const vname = vv ? vv.name : vn;
        employment.push({ id: `emp_${i}_${k}`, crewId: c.id, employer, vessel: vname, position: k === 2 && rnd() > 0.5 ? allRanks[Math.max(0, allRanks.indexOf(c.rank) + 1)] : c.rank, contractRef: `CT-${2019 + 3 - k + (k ? 0 : 3)}-${int(100, 999)}`, start, end: k === 0 ? end : N.addDaysRaw(start, int(150, 240)), status: k === 0 && !end ? 'Active' : 'Completed', remarks: '' });
        seaService.push({ id: `sea_${i}_${k}`, crewId: c.id, vessel: vname, imo: vv ? vv.imo : imoCheck(930000 + int(1000, 9999)), rank: c.rank, employer, signOn: start, signOff: k === 0 ? end : N.addDaysRaw(start, int(150, 240)), voyageRef: k === 0 ? 'VOY-' + int(2400, 2499) : '', verification: k === 2 && i % 5 === 0 ? 'Pending Verification' : 'Verified' });
        end = N.addDaysRaw(start, -int(40, 120));
      });
      if (['Onboard', 'Employed'].includes(c.status)) contracts.push({ id: 'ctr_' + i, ref: `CT-2026-${String(400 + i)}`, crewId: c.id, vesselId: c.vesselId || pick(vessels.slice(0, 7)).id, rank: c.rank, start: c.signedOn || d(int(5, 25)), end: c.signedOn ? N.addDaysRaw(c.signedOn, 180) : d(int(190, 220)), wage: wageByRank[c.rank], currency: 'USD', type: c.rank.includes('Cadet') ? 'Cadetship' : 'Fixed-term Contract', status: c.status === 'Employed' ? 'Pending Approval' : 'Active' });
    });
    travelDocs.find((t) => t.id === 'trv_p0').expiryDate = d(104);
    // overlapping sea service example (flag)
    seaService.push({ id: 'sea_overlap', crewId: 'crw_9', vessel: 'MV Lagoon Express', imo: imoCheck(931455), rank: 'Able Seaman', employer: 'Harbourline Shipping', signOn: seaService.find((x) => x.crewId === 'crw_9').signOn, signOff: '', voyageRef: '', verification: 'Pending Verification' });

    // ---- voyages & port calls ----
    const voyages = [], portCalls = [];
    const legs = [['Lagos (Apapa)', 'Tema'], ['Tema', 'Abidjan'], ['Onne', 'Durban'], ['Durban', 'Singapore'], ['Bonny Offshore Terminal', 'Rotterdam'], ['Lagos (Apapa)', 'Lomé'], ['Algeciras', 'Lagos (Apapa)'], ['Abidjan', 'Las Palmas'], ['Rotterdam', 'Antwerp'], ['Port Harcourt', 'Walvis Bay']];
    let vn = 2481;
    vessels.forEach((v, i) => {
      if (v.status === 'Inactive') { voyages.push({ id: 'voy_' + vn, ref: 'VOY-' + vn++, vesselId: v.id, from: 'Onne', to: 'Port Harcourt', plannedDep: d(-120), eta: d(-116), actualDep: d(-120), actualArr: d(-115), status: 'Completed', officer: 'Capt. Ivan Horvat', cargo: 'Tow', distance: 140 }); return; }
      const [a, b] = legs[i]; const st = v.position === 'Underway' ? 'Underway' : 'Scheduled';
      voyages.push({ id: 'voy_' + vn, ref: 'VOY-' + vn, vesselId: v.id, from: a, to: b, plannedDep: d(-int(2, 9)), eta: d(int(2, 12)), actualDep: st === 'Underway' ? d(-int(2, 6)) : '', actualArr: '', status: i === 2 ? 'Delayed' : st === 'Scheduled' ? 'Scheduled' : 'Underway', officer: i === 0 ? 'Capt. Marek Kowalski' : pick(['Capt. Ivan Horvat', 'Capt. Vikram Rao', 'Capt. Joseph Mensah']), cargo: { 'Container Ship': '1,840 TEU', 'Product Tanker': 'Gasoil 38,000 MT', 'Bulk Carrier': 'Clinker 52,000 MT', 'Crude Oil Tanker': 'Bonny Light 950,000 bbl', 'LPG Carrier': 'LPG 19,500 m³' }[v.type] || 'Project cargo', distance: int(180, 6200) });
      portCalls.push({ id: 'pc_' + vn + 'a', voyageId: 'voy_' + vn, port: a, country: '', arrival: d(-int(10, 14)), departure: d(-int(2, 9)), activities: 'Loading, bunkering', crewChanges: i === 0 ? 'Yes' : 'No', remarks: '' });
      portCalls.push({ id: 'pc_' + vn + 'b', voyageId: 'voy_' + vn, port: b, country: '', arrival: d(int(2, 12)), departure: d(int(14, 18)), activities: 'Discharge, stores', crewChanges: i % 2 ? 'Yes' : 'No', remarks: 'ETA subject to berth availability' });
      vn++;
      // historic voyages
      for (let k = 0; k < 2; k++) { const from = pick(reference.ports).name, to = pick(reference.ports).name; voyages.push({ id: 'voy_' + vn, ref: 'VOY-' + vn, vesselId: v.id, from, to: to === from ? 'Singapore' : to, plannedDep: d(-40 - k * 35), eta: d(-30 - k * 35), actualDep: d(-40 - k * 35), actualArr: d(-29 - k * 35), status: 'Completed', officer: pick(['Capt. Marek Kowalski', 'Capt. Ivan Horvat', 'Capt. Vikram Rao']), cargo: '', distance: int(400, 5200) }); vn++; }
    });
    voyages.push({ id: 'voy_' + vn, ref: 'VOY-' + vn++, vesselId: 'ves_1', from: 'Tema', to: 'Abidjan', plannedDep: d(16), eta: d(19), actualDep: '', actualArr: '', status: 'Planned', officer: 'Capt. Marek Kowalski', cargo: '1,620 TEU', distance: 290 });
    voyages.push({ id: 'voy_' + vn, ref: 'VOY-' + vn++, vesselId: 'ves_6', from: 'Abidjan', to: 'Las Palmas', plannedDep: d(-80), eta: d(-72), actualDep: '', actualArr: '', status: 'Cancelled', officer: 'Capt. Vikram Rao', cargo: '', distance: 1700 });

    // ---- crew changes / relief ----
    const onboard = crew.filter((c) => c.status === 'Onboard');
    const avail = crew.filter((c) => c.status === 'Available');
    const crewChanges = [
      { id: 'cc_1', ref: 'CC-2026-0141', vesselId: 'ves_1', port: 'Tema', plannedDate: d(9), offCrewId: 'crw_9', onCrewId: 'crw_31', rank: 'Able Seaman', travel: 'Flight LOS–ACC, 2 nights hotel', docCheck: 'Passed', status: 'Pending Approval', history: [{ status: 'Draft', ts: ts(-4), user: 'Adaeze Okafor' }, { status: 'Pending Approval', ts: ts(-3), user: 'Adaeze Okafor' }] },
      { id: 'cc_2', ref: 'CC-2026-0138', vesselId: 'ves_3', port: 'Durban', plannedDate: d(14), offCrewId: onboard[12] && onboard[12].id, onCrewId: avail[1].id, rank: onboard[12] && onboard[12].rank, travel: 'To be booked', docCheck: 'Issues found', status: 'Draft', history: [] },
      { id: 'cc_3', ref: 'CC-2026-0132', vesselId: 'ves_2', port: 'Lagos (Apapa)', plannedDate: d(-6), offCrewId: 'crw_16', onCrewId: onboard[11] && onboard[11].id, rank: 'Second Officer', travel: 'Local transfer', docCheck: 'Passed', status: 'Completed', history: [{ status: 'Approved', ts: ts(-12), user: 'Hannah Mensah' }, { status: 'Completed', ts: ts(-6), user: 'Capt. Ivan Horvat' }] },
      { id: 'cc_4', ref: 'CC-2026-0144', vesselId: 'ves_5', port: 'Onne', plannedDate: d(4), offCrewId: onboard[15] && onboard[15].id, onCrewId: avail[2].id, rank: onboard[15] && onboard[15].rank, travel: 'Crew boat from Onne jetty', docCheck: 'Passed', status: 'Approved', history: [{ status: 'Approved', ts: ts(-1), user: 'Hannah Mensah' }] }
    ];
    const relief = onboard.slice(0, 9).map((c, i) => ({ id: 'rel_' + i, vesselId: c.vesselId, currentCrewId: c.id, rank: c.rank, expectedSignOff: c.availableFrom || d(30 + i * 5), replacementId: i < 4 ? avail[i % avail.length].id : '', plannedDate: i < 4 ? N.addDaysRaw(c.availableFrom || d(30), -2) : '', port: pick(['Tema', 'Lagos (Apapa)', 'Durban', 'Onne']), travel: i < 3 ? 'Booked' : 'Pending', status: i < 2 ? 'Approved' : i < 4 ? 'Pending Approval' : 'Planned' }));

    // ---- recruitment ----
    const vacancies = [
      ['Second Officer — Container Ship', 'Second Officer', 'ves_1', 'Deck', 1, 'Published', 3], ['Chief Engineer — Product Tanker', 'Chief Engineer', 'ves_2', 'Engine', 1, 'Published', 6], ['Able Seaman (x3) — Bulk Carrier', 'Able Seaman', 'ves_3', 'Deck', 3, 'Published', 2],
      ['Electro-Technical Officer', 'Electro-Technical Officer', 'ves_7', 'Electrical', 1, 'Published', 3], ['Chief Cook — Offshore Supply', 'Chief Cook', 'ves_5', 'Catering', 1, 'Unpublished', 1], ['Third Engineer — LPG Carrier', 'Third Engineer', 'ves_7', 'Engine', 1, 'Closed', 2], ['Deck Cadets — 2027 Intake', 'Deck Cadet', '', 'Deck', 6, 'Published', 0], ['Master — Crude Oil Tanker', 'Master', 'ves_4', 'Deck', 1, 'Draft', 8]
    ].map((v, i) => ({ id: 'vac_' + (i + 1), ref: 'VAC-2026-' + String(60 + i).padStart(4, '0'), title: v[0], rank: v[1], vesselId: v[2], department: v[3], positions: v[4], status: v[5], requiredCerts: v[1].includes('Engineer') ? 'CoC (Engine), BST, AFF' : v[1].includes('Cook') ? 'BST, Ship\'s Cook Certificate' : 'CoC, BST, GMDSS', experience: v[6] ? v[6] + ' years in rank' : 'None — cadetship', duration: v[1].includes('Cadet') ? '12 months' : '6 months ± 1', joiningDate: d(int(20, 70)), deadline: d(int(5, 30)), description: `Atlantic Meridian is recruiting a ${v[1]} for ${v[2] ? vessels.find((x) => x.id === v[2]).name : 'our fleet'}. Competitive MLC-compliant terms, rotational contracts and onboard connectivity.`, salaryMin: Math.round(wageByRank[v[1]] * 0.92), salaryMax: Math.round(wageByRank[v[1]] * 1.1), currency: 'USD', createdOn: ts(-int(5, 40)) }));
    const candNames = ['Oluwaseun Afolabi', 'Daniel Agyeman', 'Jomar Castillo', 'Sanjay Pillai', 'Piotr Lewandowski', 'Bogdan Marin', 'Musa Danjuma', 'Rhea Fernandes', 'Kevin Otieno', 'Ana Kovač', 'Chukwuemeka Obi', 'Adrian Lim', 'Theophilus Darko', 'Renato Aquino', 'Yusuf Garba', 'Mateusz Kaczmarek', 'Ifeanyi Okoro', 'Nana Ama Boateng', 'Ritesh Kumar', 'Florin Dumitru', 'Bayo Akande', 'Ernesto Ramos', 'Kelechi Uzor', 'Sergiy Melnyk'];
    const appStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Approved', 'Rejected', 'Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Withdrawn'];
    const applications = candNames.map((n, i) => { const vac = vacancies[i % 6]; const st = appStatuses[i % appStatuses.length]; return { id: 'app_' + (i + 1), ref: 'APP-2026-' + String(310 + i).padStart(4, '0'), candidate: n, email: n.toLowerCase().replace(/[^a-z ]/g, '').replace(' ', '.') + '@mail.com', phone: '+234 80' + int(1, 9) + ' ' + int(100, 999) + ' ' + int(1000, 9999), nationality: pick(['Nigerian', 'Ghanaian', 'Filipino', 'Indian', 'Polish', 'Romanian', 'Kenyan', 'Croatian']), vacancyId: vac.id, rank: vac.rank, experience: int(2, 14) + ' years', status: st, appliedOn: ts(-int(2, 35)), cv: { name: 'CV_' + n.split(' ')[1] + '.pdf', size: int(100, 400) * 1024, type: 'application/pdf' }, certificates: [{ name: 'CoC_' + n.split(' ')[1] + '.pdf', size: 210000, type: 'application/pdf' }], score: ['Shortlisted', 'Interview', 'Selected', 'Approved'].includes(st) ? int(62, 92) : null, approvals: st === 'Approved' ? [{ stage: 'Recruitment Officer', decision: 'Approved', user: 'Femi Johnson', ts: ts(-6) }, { stage: 'Crewing Manager', decision: 'Approved', user: 'Hannah Mensah', ts: ts(-4) }, { stage: 'Organisation Approver', decision: 'Approved', user: 'Adaeze Okafor', ts: ts(-2) }] : st === 'Selected' ? [{ stage: 'Recruitment Officer', decision: 'Approved', user: 'Femi Johnson', ts: ts(-2) }] : [], reviews: ['Shortlisted', 'Interview', 'Selected', 'Approved'].includes(st) ? [{ reviewer: 'Femi Johnson', criteria: { 'Technical competence': int(3, 5), 'Sea-time & experience': int(3, 5), Certification: int(3, 5), Communication: int(3, 5), 'Safety record': int(3, 5) }, comment: pick(['Strong tanker background.', 'Good references from previous master.', 'Certificates verified with issuing authority.', 'Would benefit from ECDIS refresher.']), ts: ts(-int(1, 9)) }] : [], history: [{ status: 'Submitted', ts: ts(-int(10, 35)), user: n }] }; });
    const interviews = applications.filter((a) => ['Interview', 'Selected', 'Approved', 'Shortlisted'].includes(a.status)).map((a, i) => ({ id: 'int_' + i, applicationId: a.id, date: i < 3 ? d(int(1, 6)) + 'T' + pick(['09:00', '11:30', '14:00']) : d(-int(2, 12)) + 'T10:00', interviewers: pick(['Hannah Mensah, Capt. Ivan Horvat', 'Femi Johnson, Rajesh Iyer', 'Hannah Mensah, Chief Eng. Dariusz Zieliński']), mode: pick(['Video call', 'In person — Lagos Office', 'Video call']), link: 'https://meet.example.com/nyv-' + N.uidRaw(), status: i < 3 ? 'Scheduled' : 'Completed', score: i < 3 ? null : int(60, 92), recommendation: i < 3 ? '' : pick(['Recommend', 'Recommend', 'Do not recommend']), notes: i < 3 ? '' : 'Good situational awareness; answered COLREG scenarios confidently.' }));

    // ---- working arrangements ----
    const workingArrangements = [
      { id: 'wa_1', name: '4-on/8-off Navigational Watch (00-04 / 12-16)', vesselId: 'ves_1', department: 'Deck', rank: 'Second Officer', crewId: '', days: 'Mon–Sun', schedule: '00:00–04:00, 12:00–16:00', start: '00:00', end: '16:00', breaks: '04:00–12:00, 16:00–24:00', effective: d(-200), endDate: '', status: 'Approved', pattern: [[0, 8], [24, 32]] },
      { id: 'wa_2', name: '4-on/8-off Watch (04-08 / 16-20)', vesselId: 'ves_1', department: 'Deck', rank: 'Chief Officer', crewId: '', days: 'Mon–Sun', schedule: '04:00–08:00, 16:00–20:00', start: '04:00', end: '20:00', breaks: '08:00–16:00, 20:00–04:00', effective: d(-200), endDate: '', status: 'Approved', pattern: [[8, 16], [32, 40]] },
      { id: 'wa_3', name: '4-on/8-off Watch (08-12 / 20-24)', vesselId: 'ves_1', department: 'Deck', rank: 'Third Officer', crewId: '', days: 'Mon–Sun', schedule: '08:00–12:00, 20:00–24:00', start: '08:00', end: '24:00', breaks: '12:00–20:00, 00:00–08:00', effective: d(-200), endDate: '', status: 'Approved', pattern: [[16, 24], [40, 48]] },
      { id: 'wa_4', name: 'Day Work (08-12 / 13-17)', vesselId: 'ves_1', department: 'Engine', rank: '', crewId: '', days: 'Mon–Sat', schedule: '08:00–12:00, 13:00–17:00', start: '08:00', end: '17:00', breaks: '12:00–13:00', effective: d(-200), endDate: '', status: 'Approved', pattern: [[16, 24], [26, 34]] },
      { id: 'wa_5', name: 'Galley Schedule (06-13 / 16-19)', vesselId: 'ves_1', department: 'Catering', rank: 'Chief Cook', crewId: '', days: 'Mon–Sun', schedule: '06:00–13:00, 16:00–19:00', start: '06:00', end: '19:00', breaks: '13:00–16:00', effective: d(-200), endDate: '', status: 'Approved', pattern: [[12, 26], [32, 38]] },
      { id: 'wa_6', name: 'Port Cargo Watch (6-on/6-off)', vesselId: 'ves_2', department: 'Deck', rank: '', crewId: '', days: 'In port', schedule: '00:00–06:00, 12:00–18:00', start: '00:00', end: '18:00', breaks: '06:00–12:00, 18:00–24:00', effective: d(-30), endDate: d(30), status: 'Pending Approval', pattern: [[0, 12], [24, 36]] }
    ];
    // ---- rest-hour records (30-min slots: 48 per day) ----
    const patternFor = (c) => {
      if (c.rank === 'Master') return [[16, 24], [26, 34]];
      if (c.rank === 'Chief Officer') return [[8, 16], [32, 40]];
      if (c.rank === 'Second Officer') return [[0, 8], [24, 32]];
      if (c.rank === 'Third Officer') return [[16, 24], [40, 48]];
      if (c.rank === 'Chief Cook' || c.rank === 'Messman') return [[12, 26], [32, 38]];
      if (['Able Seaman', 'Ordinary Seaman'].includes(c.rank)) return [[0, 8], [24, 32]];
      return [[16, 24], [26, 34]];
    };
    const restRecords = [];
    onboard.forEach((c, ci) => {
      const daysBack = c.vesselId === 'ves_1' ? 45 : 21;
      for (let k = daysBack; k >= 0; k--) {
        const date = d(-k);
        if (c.signedOn && date < c.signedOn) continue;
        if (k === 0 && ci % 3) continue;
        if ((ci === 4 && (k === 6 || k === 7)) || (ci === 15 && k === 3)) continue; // missing records
        let work = patternFor(c).map((p) => p.slice());
        // port days and extra work
        if (k % 9 === 2 && ['Second Officer', 'Able Seaman', 'Chief Officer'].includes(c.rank)) work = c.rank === 'Chief Officer' ? [[8, 40]] : [[0, 8], [12, 36]];
        if (k % 7 === 3 && c.department === 'Engine') work.push([36, 40]);
        if (k % 11 === 5 && c.rank === 'Master') work = [[10, 24], [26, 40]];
        if (ci === 0 && (k === 12 || k === 13)) work = [[0, 8], [12, 34]];
        if (rnd() > 0.85 && c.department === 'Deck') work.push([18, 20]);
        let status = k > 3 ? 'Approved' : k > 1 ? 'Submitted' : 'Draft';
        if (k > 3 && rnd() > 0.93) status = 'Approved Exception';
        if (k === 3 && ci % 4 === 1) status = 'Correction Requested';
        restRecords.push({ id: `rh_${c.id}_${date}`, crewId: c.id, vesselId: c.vesselId, date, work: merge(work), status, remarks: work.length > 2 ? 'Cargo operations / port arrival' : '', tz: c.vesselId === 'ves_1' ? 'UTC+00:00' : 'UTC+01:00', clockAdj: 0, recordedBy: c.id === 'crw_1' ? 'Emmanuel Adeyemi' : 'Capt. Marek Kowalski', submittedOn: status !== 'Draft' ? ts(-k + 1, 8) : '', receivedOn: status !== 'Draft' ? ts(-k + 1, 8) : '', source: 'Web', reviews: status === 'Approved' || status === 'Approved Exception' ? [{ decision: status === 'Approved Exception' ? 'Approved Exception' : 'Approved', user: c.rank === 'Master' ? 'Hannah Mensah' : 'Capt. Marek Kowalski', ts: ts(-k + 2, 9), note: status === 'Approved Exception' ? 'Emergency drill — exception under A2.3 para 14 recorded' : '' }] : status === 'Correction Requested' ? [{ decision: 'Correction Requested', user: 'Capt. Marek Kowalski', ts: ts(-k + 2, 9), note: 'Please confirm the 13:00–14:00 period — conflicts with deck log.' }] : [] });
      }
    });
    function merge(p) { p = p.filter((x) => x[1] > x[0]).sort((a, b) => a[0] - b[0]); const o = []; p.forEach((x) => { if (o.length && x[0] <= o[o.length - 1][1]) o[o.length - 1][1] = Math.max(o[o.length - 1][1], x[1]); else o.push(x.slice()); }); return o; }
    const m1 = d(-40).slice(0, 7);
    const restLocks = [{ id: 'lk_1', vesselId: 'ves_1', month: m1, locked: true, by: 'Hannah Mensah', ts: ts(-8), reason: 'Monthly review complete', history: [{ action: 'Locked', user: 'Hannah Mensah', ts: ts(-8), reason: 'Monthly review complete' }] }];
    const restRules = [
      { id: 'rule_1', version: 'MLC-2006 A2.3 v1', name: 'MLC 2006 / STCW baseline', flag: 'All flags (baseline)', effective: '2013-08-20', minRest24: 10, minRest7d: 77, maxPeriods: 2, minLongPeriod: 6, maxGap: 14, minCounted: 1, status: 'Active', notes: 'Baseline per MLC Standard A2.3 and STCW A-VIII/1.' },
      { id: 'rule_2', version: 'LR-CBA-2025', name: 'Liberia flag + ITF CBA', flag: 'Liberia', effective: '2025-01-01', minRest24: 10, minRest7d: 77, maxPeriods: 2, minLongPeriod: 6, maxGap: 14, minCounted: 1, status: 'Active', notes: 'Collective agreement applied to ves_1 and ves_7.' },
      { id: 'rule_3', version: 'MLC-2006 A2.3 v0 (archived)', name: 'Legacy baseline (pre-2024 config)', flag: 'All flags', effective: '2019-01-01', minRest24: 10, minRest7d: 77, maxPeriods: 2, minLongPeriod: 6, maxGap: 14, minCounted: 0.5, status: 'Archived', notes: 'Kept for historical recalculation.' }
    ];

    // ---- welfare ----
    const checkIns = [
      { id: 'ci_1', ref: 'WCI-2026-031', title: 'Monthly wellbeing pulse — November', category: 'General wellbeing', vesselId: 'ves_1', due: d(5), assigned: 10, completed: 6, frequency: 'Monthly', status: 'Open' },
      { id: 'ci_2', ref: 'WCI-2026-030', title: 'Connectivity & welfare facilities survey', category: 'Connectivity', vesselId: '', due: d(12), assigned: 36, completed: 14, frequency: 'Quarterly', status: 'Open' },
      { id: 'ci_3', ref: 'WCI-2026-027', title: 'Food & nutrition feedback', category: 'Food and nutrition', vesselId: 'ves_2', due: d(-9), assigned: 4, completed: 4, frequency: 'Quarterly', status: 'Completed' },
      { id: 'ci_4', ref: 'WCI-2026-025', title: 'Monthly wellbeing pulse — October', category: 'General wellbeing', vesselId: 'ves_1', due: d(-14), assigned: 10, completed: 9, frequency: 'Monthly', status: 'Closed' }
    ];
    const checkInResponses = [{ id: 'cir_1', checkInId: 'ci_4', crewId: 'crw_1', ts: ts(-15), answers: { mood: 4, workload: 3, accommodation: 4, food: 4, connectivity: 2 }, comment: 'Internet is slow during evening hours.', followUp: 'Raised with IT — bandwidth upgrade scheduled.' }];
    const WR = [['Request for shore leave in Tema', 'Shore leave', 'Low', 'Resolved'], ['Family emergency — compassionate leave', 'Family emergency', 'Urgent', 'In Progress'], ['Air-conditioning not working in cabin 3.12', 'Accommodation', 'Medium', 'Assigned'], ['Allotment not received for October', 'Wages & allotments', 'High', 'Escalated'], ['Request dental appointment at next port', 'Medical assistance', 'Medium', 'Received'], ['Gym equipment replacement', 'General wellbeing', 'Low', 'Submitted'], ['Wi-Fi data allowance too low', 'Connectivity', 'Medium', 'Awaiting Information'], ['Fresh fruit supply during long passage', 'Food and nutrition', 'Low', 'Closed'], ['Counselling support request', 'Access to support', 'High', 'Assigned'], ['Laundry machine broken', 'Accommodation', 'Low', 'Resolved']];
    const welfareRequests = WR.map((w, i) => ({ id: 'wr_' + (i + 1), ref: 'WR-2026-' + String(201 + i).padStart(4, '0'), subject: w[0], category: w[1], priority: w[2], status: w[3], crewId: i === 0 || i === 6 ? 'crw_1' : crew[(i * 3) % 30].id, vesselId: i < 4 ? 'ves_1' : vessels[i % 7].id, description: 'Details provided by the seafarer. ' + w[0] + '.', contact: pick(['Email', 'Phone', 'In-app message']), assignedTo: ['Submitted', 'Received'].includes(w[3]) ? '' : pick(['Blessing Udo (Welfare Officer)', 'Hannah Mensah']), createdOn: ts(-int(1, 40)), resolvedOn: ['Resolved', 'Closed'].includes(w[3]) ? ts(-int(0, 5)) : '', updates: [{ ts: ts(-int(1, 10)), user: 'Blessing Udo', note: 'Case acknowledged. We will follow up within 48 hours.', visibleToCrew: true }], attachment: null, confidential: w[1] === 'Access to support' }));
    const complaints = [
      { id: 'cmp_1', ref: 'GRV-2026-0019', category: 'Harassment / bullying', subject: 'Verbal abuse by senior rating', anonymous: true, confidential: true, vesselId: 'ves_3', crewId: '', status: 'Under Investigation', priority: 'High', assignedTo: 'Blessing Udo (Welfare Officer)', createdOn: ts(-9), description: 'Reported via confidential channel.', evidence: [{ name: 'statement.pdf', size: 88000, type: 'application/pdf' }], updates: [] },
      { id: 'cmp_2', ref: 'GRV-2026-0018', category: 'Working hours', subject: 'Excessive overtime during cargo ops', anonymous: false, confidential: true, vesselId: 'ves_2', crewId: crew[13].id, status: 'Assigned', priority: 'Medium', assignedTo: 'Hannah Mensah', createdOn: ts(-14), description: 'Seafarer reports consecutive days without adequate rest.', evidence: [], updates: [] },
      { id: 'cmp_3', ref: 'GRV-2026-0016', category: 'Wages', subject: 'Overtime not reflected in payslip', anonymous: false, confidential: false, vesselId: 'ves_1', crewId: 'crw_9', status: 'Resolved', priority: 'Medium', assignedTo: 'Payroll Office', createdOn: ts(-31), description: 'September overtime hours omitted.', evidence: [], updates: [{ ts: ts(-20), user: 'Payroll Office', note: 'Adjustment paid in October payroll.', visibleToCrew: true }] },
      { id: 'cmp_4', ref: 'GRV-2026-0012', category: 'Food & provisions', subject: 'Quality of provisions', anonymous: true, confidential: false, vesselId: 'ves_6', crewId: '', status: 'Closed', priority: 'Low', assignedTo: 'Blessing Udo (Welfare Officer)', createdOn: ts(-60), description: 'Provisions supplier changed.', evidence: [], updates: [] },
      { id: 'cmp_5', ref: 'GRV-2026-0021', category: 'Discrimination', subject: 'Unequal treatment in shore leave rota', anonymous: false, confidential: true, vesselId: 'ves_7', crewId: crew[21].id, status: 'Submitted', priority: 'High', assignedTo: '', createdOn: ts(-1), description: 'Submitted via seafarer portal.', evidence: [], updates: [] }
    ];
    const incidents = [
      { id: 'inc_1', ref: 'INC-2026-0077', vesselId: 'ves_1', dateTime: ts(-3, 14).slice(0, 16), location: 'Engine room, lower platform', category: 'Injury — minor', description: 'Oiler sustained a hand laceration while changing a filter. First aid administered.', persons: 'Tunde Ogunleye', witnesses: 'Chinedu Okonkwo', immediateAction: 'First aid, area made safe, toolbox talk held', status: 'Under Investigation', assignedTo: 'Capt. Marek Kowalski', findings: '', corrective: '', documents: [{ name: 'incident_photo.jpg', size: 420000, type: 'image/jpeg' }] },
      { id: 'inc_2', ref: 'INC-2026-0071', vesselId: 'ves_4', dateTime: ts(-12, 3).slice(0, 16), location: 'Main deck, manifold', category: 'Near miss', description: 'Hose coupling slipped during connection; no spill.', persons: '', witnesses: 'Deck crew', immediateAction: 'Operation stopped, coupling replaced', status: 'Corrective Actions', assignedTo: 'HSE Department', findings: 'Worn coupling gasket', corrective: 'Replace all manifold gaskets; update checklist', documents: [] },
      { id: 'inc_3', ref: 'INC-2026-0064', vesselId: 'ves_5', dateTime: ts(-25, 22).slice(0, 16), location: 'Accommodation', category: 'Welfare concern', description: 'Crew member expressed distress after family bereavement.', persons: 'Confidential', witnesses: '', immediateAction: 'Master spoke with crew member; welfare officer informed', status: 'Closed', assignedTo: 'Blessing Udo (Welfare Officer)', findings: 'Support provided; repatriation arranged', corrective: 'N/A', documents: [] },
      { id: 'inc_4', ref: 'INC-2026-0080', vesselId: 'ves_7', dateTime: ts(-1, 10).slice(0, 16), location: 'Mooring station aft', category: 'Equipment damage', description: 'Mooring line parted during berthing; no injuries.', persons: '', witnesses: 'Bosun, AB on station', immediateAction: 'Area cleared, line replaced', status: 'Submitted', assignedTo: '', findings: '', corrective: '', documents: [] }
    ];

    // ---- training ----
    const courses = [
      ['Advanced Fire Fighting Refresher', 'TR-SAF-101', 'Safety', 'Maritime Academy of Nigeria', 4, 'Classroom', 1825, 450], ['ECDIS Type-Specific (JRC)', 'TR-NAV-210', 'Navigation', 'Bridge Systems Training Centre', 3, 'Simulator', 0, 780], ['Bridge Resource Management', 'TR-LDR-120', 'Leadership', 'Gulf Maritime Institute', 5, 'Classroom', 0, 1100],
      ['High Voltage Safety (Operational)', 'TR-ENG-305', 'Engineering', 'Marine Power Academy', 3, 'Blended', 1825, 900], ['MLC 2006 Awareness for Seafarers', 'TR-REG-010', 'Regulatory', 'Nyovara eLearning', 0.2, 'eLearning', 0, 0], ['Enclosed Space Entry & Rescue', 'TR-SAF-140', 'Safety', 'Internal — Fleet HSE', 1, 'Onboard', 365, 0],
      ['Tanker Familiarisation (Oil)', 'TR-TNK-200', 'Technical', 'Maritime Academy of Nigeria', 5, 'Classroom', 1825, 650], ['Mental Health First Aid at Sea', 'TR-PRO-050', 'Professional Development', 'Seafarer Wellbeing Network', 1, 'Virtual', 1095, 120], ['Anti-Harassment & Bullying', 'TR-REG-030', 'Regulatory', 'Nyovara eLearning', 0.1, 'eLearning', 730, 0],
      ['Ship Security Officer', 'TR-SEC-110', 'Regulatory', 'Gulf Maritime Institute', 3, 'Classroom', 1825, 520], ['Leadership & Managerial Skills', 'TR-LDR-200', 'Leadership', 'Nautical College Gdynia', 5, 'Classroom', 0, 1300], ['Engine Room Resource Management', 'TR-ENG-150', 'Engineering', 'Marine Power Academy', 4, 'Simulator', 0, 980]
    ].map((c, i) => ({ id: 'crs_' + (i + 1), name: c[0], code: c[1], category: c[2], provider: c[3], duration: c[4] < 1 ? Math.round(c[4] * 8) + ' hours' : c[4] + ' days', delivery: c[5], validity: c[6] ? Math.round(c[6] / 365) + ' years' : 'No expiry', cost: c[7], currency: 'USD', prerequisites: i === 3 ? 'CoC (Engine) OIC' : i === 10 ? 'Management-level CoC' : '', description: 'Course delivered by ' + c[3] + '.', status: i === 11 ? 'Draft' : i === 9 ? 'Archived' : 'Published' }));
    const trainingAssignments = [];
    crew.slice(0, 34).forEach((c, i) => {
      const crs = courses[[4, 8, 5, 0, 7, 1, 3][i % 7]];
      const st = ['Completed', 'In Progress', 'Not Started', 'Completed', 'Overdue', 'Assigned', 'Completed'][i % 7];
      trainingAssignments.push({ id: 'ta_' + i, crewId: c.id, courseId: crs.id, assignedBy: 'Hannah Mensah', assignedOn: ts(-int(10, 60)), deadline: st === 'Overdue' ? d(-int(2, 10)) : d(int(5, 45)), status: st, progress: st === 'Completed' ? 100 : st === 'In Progress' ? int(20, 80) : st === 'Overdue' ? int(0, 40) : 0, scope: 'Individual' });
    });
    Object.assign(trainingAssignments[0], { courseId: 'crs_5', status: 'In Progress', progress: 40, deadline: d(9) });
    const trainingRecords = crew.slice(0, 30).map((c, i) => { const crs = courses[i % 10]; const comp = d(-int(20, 900)); return { id: 'tr_' + i, crewId: c.id, courseId: crs.id, provider: crs.provider, enrolled: N.addDaysRaw(comp, -int(5, 30)), completed: comp, result: i % 13 === 7 ? 'Failed' : 'Passed', certificate: { name: crs.code + '_certificate.pdf', size: 160000, type: 'application/pdf' }, expiry: crs.validity === 'No expiry' ? '' : N.addDaysRaw(comp, parseInt(crs.validity, 10) * 365), verification: i % 6 === 2 ? 'Pending Verification' : 'Verified' }; });
    const competency = crew.slice(0, 14).map((c, i) => ({ id: 'cmp_a' + i, crewId: c.id, type: pick(['Onboard assessment', 'Simulator assessment', 'Annual review']), category: c.department === 'Engine' ? 'Engineering operations' : c.department === 'Catering' ? 'Galley & hygiene' : 'Navigation & watchkeeping', criteria: c.department === 'Engine' ? 'Machinery operation, fault diagnosis, safe isolation' : 'COLREGs, passage planning, bridge team communication', rating: int(3, 5), comments: pick(['Meets standard', 'Exceeds expectations', 'Further mentoring recommended']), assessor: pick(['Capt. Marek Kowalski', 'Chinedu Okonkwo', 'Capt. Ivan Horvat']), date: d(-int(5, 200)), status: i % 4 === 1 ? 'Pending Approval' : 'Approved' }));
    const AREAS = ['Technical Ability', 'Professional Conduct', 'Leadership', 'Teamwork', 'Safety Awareness', 'Communication', 'Job Performance'];
    const appraisals = crew.slice(0, 16).map((c, i) => { const st = ['Approved', 'Submitted', 'Assigned', 'Approved', 'Review', 'Archived', 'Completed', 'Created'][i % 8]; const sc = {}; AREAS.forEach((a) => (sc[a] = st === 'Assigned' || st === 'Created' ? null : int(3, 5))); return { id: 'apr_' + i, ref: 'APR-2026-' + String(120 + i), crewId: c.id, vesselId: c.vesselId || 'ves_1', period: 'Contract ' + (2025 + (i % 2)), appraiser: pick(['Capt. Marek Kowalski', 'Chinedu Okonkwo', 'Capt. Ivan Horvat']), status: st, scores: sc, comments: st === 'Assigned' ? '' : pick(['Reliable and safety-conscious.', 'Strong technical skills; develop delegation.', 'Recommended for promotion.']), recommendation: st === 'Approved' ? pick(['Re-employ', 'Promote', 'Re-employ']) : '', due: d(int(-5, 30)) }; });

    // ---- payroll ----
    const wageStructures = allRanks.map((r, i) => ({ id: 'ws_' + i, rank: r, department: deptOf(r), basic: wageByRank[r], currency: 'USD', allowances: Math.round(wageByRank[r] * 0.18), overtimeRule: wageByRank[r] > 6000 ? 'Included in consolidated wage' : 'Fixed OT: 103 hrs @ 1.25×', effective: '2026-01-01', endDate: '', status: 'Active' }));
    const employed = crew.filter((c) => ['Onboard', 'Employed'].includes(c.status));
    const compensation = employed.map((c, i) => ({ id: 'cmpn_' + i, crewId: c.id, contractRef: (contracts.find((x) => x.crewId === c.id) || {}).ref || '', salary: wageByRank[c.rank], currency: 'USD', frequency: 'Monthly', allowances: Math.round(wageByRank[c.rank] * 0.18), deductions: Math.round(wageByRank[c.rank] * 0.07), effective: c.signedOn || d(10), status: 'Active' }));
    const allotments = employed.slice(0, 12).map((c, i) => ({ id: 'alt_' + i, crewId: c.id, beneficiary: c.nextOfKin[0].name, relationship: c.nextOfKin[0].relationship, type: i % 3 ? 'Percentage' : 'Fixed amount', amount: i % 3 ? int(30, 60) : int(400, 1500), currency: 'USD', frequency: 'Monthly', bank: pick(['Zenith Bank', 'Access Bank', 'GCB Bank', 'BDO Unibank', 'State Bank of India']), account: '•••• ' + int(1000, 9999), effective: c.signedOn || d(-30), status: 'Active' }));
    const payrollPeriods = [];
    const payslips = [], payments = [];
    for (let k = 3; k >= 1; k--) {
      const md = new Date(T); md.setMonth(md.getMonth() - k); const month = `${md.getFullYear()}-${String(md.getMonth() + 1).padStart(2, '0')}`;
      const status = k === 1 ? 'Pending Approval' : 'Paid'; const pid = 'pp_' + month;
      let total = 0;
      employed.filter((c) => c.status === 'Onboard').forEach((c, i) => {
        const basic = wageByRank[c.rank], ot = wageByRank[c.rank] > 6000 ? 0 : Math.round(basic * 0.12 + int(0, 120)), allow = Math.round(basic * 0.18), bonus = i % 9 === 0 ? 250 : 0;
        const gross = basic + ot + allow + bonus; const ded = Math.round(gross * 0.07) + (i % 5 === 0 ? 150 : 0); const net = gross - ded; total += net;
        payslips.push({ id: `ps_${month}_${c.id}`, ref: `PS-${month.replace('-', '')}-${c.code.slice(4)}`, periodId: pid, month, crewId: c.id, vesselId: c.vesselId, rank: c.rank, basic, overtime: ot, allowances: allow, bonus, leave: 0, travel: 0, deductions: ded, deductionLines: [['Pension (employee)', Math.round(gross * 0.04)], ['Union dues', Math.round(gross * 0.01)], ['Income tax withholding', Math.round(gross * 0.02)]].concat(i % 5 === 0 ? [['Cash advance recovery', 150]] : []), gross, net, currency: 'USD', status: status === 'Paid' ? 'Paid' : 'Calculated' });
        if (status === 'Paid') payments.push({ id: `pay_${month}_${c.id}`, ref: `PAY-${month.replace('-', '')}-${c.code.slice(4)}`, crewId: c.id, period: month, amount: net, currency: 'USD', method: pick(['Bank transfer', 'Bank transfer', 'Allotment + bank']), date: `${month}-28`, txn: 'TXN' + int(100000000, 999999999), status: 'Paid' });
      });
      payrollPeriods.push({ id: pid, month, status, crewCount: employed.filter((c) => c.status === 'Onboard').length, total, currency: 'USD', createdBy: 'Kemi Adewale', approvals: status === 'Paid' ? [{ stage: 'Payroll Officer', user: 'Kemi Adewale', ts: `${month}-25T10:00:00Z`, decision: 'Submitted' }, { stage: 'Finance Approver', user: 'Adaeze Okafor', ts: `${month}-26T12:00:00Z`, decision: 'Approved' }] : [{ stage: 'Payroll Officer', user: 'Kemi Adewale', ts: ts(-2), decision: 'Submitted' }], exceptions: k === 1 ? 2 : 0 });
    }
    payments.slice(0, 3).forEach((p) => { p.status = 'Partially Paid'; });
    const expenses = [['Travel', 'Taxi from airport to Tema port', 85, 'Approved', 'Reimbursed'], ['Medical', 'Dental treatment — Durban', 240, 'Approved', 'Pending'], ['Visa fees', 'Schengen visa for Rotterdam crew change', 95, 'Pending Approval', 'Pending'], ['Accommodation', 'Hotel — 2 nights awaiting joining', 210, 'Pending Approval', 'Pending'], ['Training', 'Course materials ECDIS', 60, 'Rejected', 'Not Applicable'], ['Travel', 'Excess baggage — tools', 70, 'Approved', 'Reimbursed'], ['Communication', 'Satellite SIM top-up (approved scheme)', 40, 'Approved', 'Pending']].map((e, i) => ({ id: 'exp_' + i, ref: 'EXP-2026-' + String(140 + i), category: e[0], description: e[1], amount: e[2], currency: 'USD', receipt: { name: 'receipt_' + (i + 1) + '.jpg', size: 180000, type: 'image/jpeg' }, crewId: crew[i * 2].id, submittedOn: ts(-int(2, 30)), approver: 'Kemi Adewale', status: e[3], reimbursement: e[4] }));

    // ---- admin ----
    const roles = [
      { id: 'role_1', name: 'Organisation Administrator', description: 'Full access to organisation configuration and all modules.', users: 1, system: true, perms: 'all' },
      { id: 'role_2', name: 'Crewing Manager', description: 'Manages crew records, planning, recruitment approvals.', users: 2, perms: { crew: ['View', 'Create', 'Edit', 'Approve', 'Export'], recruitment: ['View', 'Create', 'Edit', 'Approve'], planning: ['View', 'Create', 'Edit', 'Approve'], vessels: ['View'], training: ['View', 'Create'], reports: ['View', 'Export'] }, scope: 'Organisation' },
      { id: 'role_3', name: 'Recruitment Officer', description: 'Vacancies, applications and interviews.', users: 1, perms: { recruitment: ['View', 'Create', 'Edit'], crew: ['View'] }, scope: 'Organisation' },
      { id: 'role_4', name: 'Compliance Officer', description: 'Shore review of rest hours and documents.', users: 1, perms: { resthours: ['View', 'Approve', 'Export', 'Configure'], crew: ['View'], vessels: ['View'] }, scope: 'Assigned vessels' },
      { id: 'role_5', name: 'Welfare Officer', description: 'Confidential welfare cases, complaints and check-ins.', users: 1, perms: { welfare: ['View', 'Create', 'Edit', 'Manage'] }, scope: 'Organisation (confidential)' },
      { id: 'role_6', name: 'Payroll Officer', description: 'Payroll processing, payslips and payments.', users: 1, perms: { payroll: ['View', 'Create', 'Edit', 'Export'] }, scope: 'Organisation' },
      { id: 'role_7', name: 'Vessel Master', description: 'Vessel portal: manifest, onboard rest-hours review, incidents. No payroll access.', users: 6, perms: { resthours: ['View', 'Create', 'Approve'], crew: ['View'], welfare: ['Create'], voyages: ['View'] }, scope: 'Own vessel' },
      { id: 'role_8', name: 'Seafarer', description: 'Self-service access to own records only.', users: 41, system: true, perms: { self: ['View', 'Edit'] }, scope: 'Own records' }
    ];
    const users = [
      ['Adaeze Okafor', 'admin@atlanticmeridian.com', 'Organisation Administrator', 'Shore Operations', 'All vessels', 'Active'], ['Hannah Mensah', 'h.mensah@atlanticmeridian.com', 'Crewing Manager', 'Shore Operations', 'All vessels', 'Active'], ['Olumide Bankole', 'o.bankole@atlanticmeridian.com', 'Crewing Manager', 'Shore Operations', 'ves_1, ves_2, ves_3', 'Active'],
      ['Femi Johnson', 'f.johnson@atlanticmeridian.com', 'Recruitment Officer', 'Shore Operations', '—', 'Active'], ['Ngozi Peters', 'n.peters@atlanticmeridian.com', 'Compliance Officer', 'Shore Operations', 'All vessels', 'Active'], ['Blessing Udo', 'b.udo@atlanticmeridian.com', 'Welfare Officer', 'Shore Operations', 'All vessels', 'Active'],
      ['Kemi Adewale', 'k.adewale@atlanticmeridian.com', 'Payroll Officer', 'Shore Operations', '—', 'Active'], ['Capt. Marek Kowalski', 'master.aurora@atlanticmeridian.com', 'Vessel Master', 'Deck', 'MV Atlantic Aurora', 'Active'], ['Capt. Ivan Horvat', 'master.meridian@atlanticmeridian.com', 'Vessel Master', 'Deck', 'MT Gulf Meridian', 'Active'],
      ['Rajesh Iyer', 'r.iyer@atlanticmeridian.com', 'Crewing Manager', 'Shore Operations', 'ves_4, ves_5', 'Disabled'], ['Katarzyna Nowak', 'k.nowak@atlanticmeridian.com', 'Compliance Officer', 'Shore Operations', 'ves_6, ves_7', 'Invited']
    ].map((u, i) => ({ id: 'usr_' + (i + 1), name: u[0], email: u[1], role: u[2], department: u[3], vessels: u[4], status: u[5], mfa: u[5] === 'Active', lastLogin: u[5] === 'Active' ? ts(-int(0, 6)) : '', createdOn: ts(-int(60, 400)) }));
    const workflows = [
      { id: 'wf_1', name: 'Recruitment Approval', trigger: 'Candidate marked Selected', stages: ['Recruitment Officer', 'Crewing Manager', 'Organisation Approver'], escalation: 'Escalate to Organisation Administrator after 3 days', notifications: 'Email + in-app', status: 'Active' },
      { id: 'wf_2', name: 'Crew Deployment Approval', trigger: 'Crew change / sign-on submitted', stages: ['Crewing Manager', 'Fleet Manager'], escalation: 'After 48 hours', notifications: 'Email + in-app', status: 'Active' },
      { id: 'wf_3', name: 'Rest Hours Approval', trigger: 'Daily record submitted', stages: ['Vessel Officer (Head of Dept)', 'Vessel Master', 'Shore Compliance (on potential non-compliance)'], escalation: 'Unreviewed after 72 hours', notifications: 'In-app', status: 'Active' },
      { id: 'wf_4', name: 'Payroll Approval', trigger: 'Payroll period submitted', stages: ['Payroll Officer', 'Finance Approver'], escalation: 'After 2 working days', notifications: 'Email', status: 'Active' },
      { id: 'wf_5', name: 'Expense Approval', trigger: 'Expense claim submitted', stages: ['Line Manager', 'Payroll Officer'], escalation: 'After 5 days', notifications: 'Email + in-app', status: 'Active' },
      { id: 'wf_6', name: 'Welfare Escalation', trigger: 'Case priority Urgent or unresolved > 7 days', stages: ['Welfare Officer', 'Crewing Manager', 'DPA / Organisation Administrator'], escalation: 'Immediate for Urgent', notifications: 'Email + SMS + in-app', status: 'Active' }
    ];
    const notifications = [
      ['Certificate expiring', 'Advanced Fire Fighting for Joseph Mensah expires in 21 days.', 'award', 'pages/crew/certificates.html', 'app', 0],
      ['Rest-hours potential non-compliance', '3 records on MV Atlantic Aurora require review.', 'alert-triangle', 'pages/rest-hours/review.html', 'app', 0],
      ['Payroll awaiting approval', 'Payroll period submitted by Kemi Adewale.', 'wallet', 'pages/payroll/processing.html', 'app', 0],
      ['New application received', 'Oluwaseun Afolabi applied for Second Officer.', 'file-user', 'pages/recruitment/applications.html', 'app', 1],
      ['Urgent welfare request', 'Family emergency — compassionate leave (WR-2026-0202).', 'heart-handshake', 'pages/welfare/requests.html', 'app', 1],
      ['Crew change pending approval', 'CC-2026-0141 at Tema in 9 days.', 'repeat', 'pages/crew/changes.html', 'app', 1],
      ['Incident reported', 'INC-2026-0080 reported by LPG Kaduna Breeze.', 'siren', 'pages/welfare/incidents.html', 'app', 1],
      ['Rest hours awaiting your submission', 'You have 2 draft days not yet submitted.', 'clock', 'pages/seafarer/rest-hours.html', 'seafarer', 0],
      ['Passport expiring soon', 'Your passport expires within 120 days. Upload a replacement.', 'book-open', 'pages/seafarer/documents.html', 'seafarer', 0],
      ['Training assigned', 'MLC 2006 Awareness for Seafarers is due soon.', 'graduation-cap', 'pages/seafarer/training.html', 'seafarer', 1],
      ['Payslip available', 'Your payslip for last month is ready.', 'wallet', 'pages/seafarer/payroll.html', 'seafarer', 1],
      ['Welfare case updated', 'WR-2026-0201 marked Resolved.', 'heart-handshake', 'pages/seafarer/welfare.html', 'seafarer', 1],
      ['Records pending your review', '7 rest-hour records submitted by crew.', 'check-check', 'pages/vessel-portal/rest-hours-review.html', 'vessel', 0],
      ['Crew change approved', 'Able Seaman relief at Tema confirmed.', 'repeat', 'pages/vessel-portal/crew-changes.html', 'vessel', 0],
      ['New organisation awaiting verification', 'Coastal Guard Marine Services registered.', 'building-2', 'pages/platform/organisations.html', 'platform', 0],
      ['Support enquiry', 'Demo request from Lagoon Offshore Ltd.', 'inbox', 'pages/platform/enquiries.html', 'platform', 0]
    ].map((n, i) => ({ id: 'ntf_' + i, title: n[0], body: n[1], icon: n[2], link: n[3], portal: n[4], read: !!n[5], ts: ts(-Math.floor(i / 3), 8 + (i % 9)) }));
    const audit = [];
    const AU = [['Login', 'auth', 'admin@atlanticmeridian.com'], ['Record modified', 'crew', 'AMS-1003'], ['Approval', 'restRecords', 'rh_crw_2'], ['Record created', 'vacancies', 'VAC-2026-0065'], ['File access', 'certificates', 'CoC_Mensah.pdf'], ['Failed authentication', 'auth', 'unknown@test.com'], ['Permission changes', 'roles', 'Compliance Officer'], ['Rejection', 'expenses', 'EXP-2026-0144'], ['Record created', 'crewChanges', 'CC-2026-0144'], ['Logout', 'auth', 'h.mensah@atlanticmeridian.com'], ['Administrative changes', 'settings', 'Alert intervals'], ['Record archived', 'certificates', 'BST/44120/2019']];
    for (let i = 0; i < 60; i++) { const a = AU[i % AU.length]; audit.push({ id: 'aud_s' + i, ts: ts(-Math.floor(i / 4), 7 + (i % 11)), user: a[0] === 'Failed authentication' ? '—' : pick(['Adaeze Okafor', 'Hannah Mensah', 'Ngozi Peters', 'Kemi Adewale', 'Capt. Marek Kowalski']), org: ORG, action: a[0], entity: a[1], ref: a[2], ip: '10.20.4.' + int(20, 60), changes: a[0] === 'Record modified' ? [{ field: 'status', from: 'Available', to: 'Employed' }] : a[0] === 'Permission changes' ? [{ field: 'resthours', from: 'View', to: 'View, Approve' }] : [] }); }
    const loginHistory = Array.from({ length: 14 }, (_, i) => ({ id: 'lh_' + i, ts: ts(-i, 8), result: i === 4 ? 'Failed' : 'Success', ip: '102.89.3.' + int(10, 200), device: pick(['Chrome on Windows', 'Edge on Windows', 'Safari on iPhone']), mfa: i !== 4 }));
    const activity = [];
    crew.slice(0, 12).forEach((c) => { activity.push({ id: 'act_' + c.id + '1', entity: 'crew', refId: c.id, title: 'Crew record created (legacy import)', ts: c.createdOn, user: 'System import' }); activity.push({ id: 'act_' + c.id + '2', entity: 'crew', refId: c.id, title: 'Certificate uploaded — Basic Safety Training', ts: ts(-int(60, 300)), user: 'Hannah Mensah', tone: 'teal' }); if (c.vesselId) { activity.push({ id: 'act_' + c.id + '3', entity: 'crew', refId: c.id, title: 'Contract approved', ts: ts(-int(20, 60)), user: 'Adaeze Okafor' }); activity.push({ id: 'act_' + c.id + '4', entity: 'crew', refId: c.id, title: 'Signed on ' + vessels.find((v) => v.id === c.vesselId).name, ts: new Date(c.signedOn + 'T10:00:00').toISOString(), user: 'Capt. Marek Kowalski', tone: 'teal' }); } });
    activity.sort((a, b) => (a.ts < b.ts ? 1 : -1));

    // ---- platform ----
    const organisations = [
      { id: 'org_1', name: ORG, type: 'Ship management company', country: 'Nigeria', regNo: 'RC-1458820', contact: 'Adaeze Okafor', email: 'admin@atlanticmeridian.com', status: 'Active', plan: 'Enterprise', crew: crew.length, vessels: vessels.length, joined: d(-420) },
      { id: 'org_2', name: 'Lagoon Offshore Services Ltd', type: 'Offshore service company', country: 'Nigeria', regNo: 'RC-2011457', contact: 'Ike Nwachukwu', email: 'it@lagoonoffshore.ng', status: 'Active', plan: 'Professional', crew: 312, vessels: 14, joined: d(-210) },
      { id: 'org_3', name: 'Volta Crewing Agency', type: 'Crewing agency', country: 'Ghana', regNo: 'CS-084421', contact: 'Abena Ofori', email: 'abena@voltacrew.com.gh', status: 'Active', plan: 'Professional', crew: 860, vessels: 0, joined: d(-150) },
      { id: 'org_4', name: 'Coastal Guard Marine Services', type: 'Shipowner', country: 'Nigeria', regNo: 'RC-3302291', contact: 'Musa Abubakar', email: 'musa@coastalguardmarine.ng', status: 'Pending Verification', plan: 'Trial', crew: 0, vessels: 0, joined: d(-2) },
      { id: 'org_5', name: 'Manila Bay Manning Inc', type: 'Manning agency', country: 'Philippines', regNo: 'SEC-CS2019-55120', contact: 'Liza Ramos', email: 'liza@manilabaymanning.ph', status: 'Pending Verification', plan: 'Trial', crew: 0, vessels: 0, joined: d(-5) },
      { id: 'org_6', name: 'Kestrel Tankers SA', type: 'Shipping operator', country: 'Greece', regNo: 'GEMI-1529304', contact: 'Nikos Pappas', email: 'n.pappas@kestreltankers.gr', status: 'Suspended', plan: 'Professional', crew: 140, vessels: 6, joined: d(-500) }
    ];
    const subscriptions = organisations.map((o, i) => ({ id: 'sub_' + i, orgId: o.id, plan: o.plan, seats: [500, 400, 1000, 25, 25, 200][i], used: o.crew, billing: o.plan === 'Trial' ? '—' : pick(['Annual', 'Monthly']), renewal: d(int(-10, 300)), amount: { Enterprise: 18000, Professional: 6400, Trial: 0 }[o.plan], status: o.status === 'Suspended' ? 'Suspended' : o.plan === 'Trial' ? 'Trial' : 'Active' }));
    const enquiries = [
      ['Lagoon Offshore Ltd', 'Ike Nwachukwu', 'it@lagoonoffshore.ng', 'Demo request', 'Open'], ['Delta Pilots Association', 'Grace Akpan', 'grace@deltapilots.org', 'Pricing', 'Open'], ['Volta Crewing Agency', 'Abena Ofori', 'abena@voltacrew.com.gh', 'Data import support', 'In Progress'], ['Seafarer (individual)', 'Kelvin Etim', 'kelvin.etim@mail.com', 'Account access', 'Resolved'], ['Harbour Consultancy', 'Rita Okeke', 'rita@harbourconsult.com', 'Partnership', 'Closed']
    ].map((e, i) => ({ id: 'enq_' + i, ref: 'ENQ-2026-' + String(88 + i).padStart(4, '0'), org: e[0], name: e[1], email: e[2], phone: '', subject: e[3], message: 'Hello, we would like to learn more about Nyovara for our operations.', status: e[4], ts: ts(-i * 2) }));
    const supportAccess = [{ id: 'sa_1', orgId: 'org_3', requestedBy: 'Tunde Bakare', reason: 'Assist with bulk crew import errors (ticket ENQ-2026-0090)', scope: 'Crew module — read only', from: ts(-1), until: ts(2), approvedBy: 'Abena Ofori (Org Admin)', status: 'Approved' }, { id: 'sa_2', orgId: 'org_1', requestedBy: 'Tunde Bakare', reason: 'Investigate report export issue', scope: 'Reports — read only', from: '', until: '', approvedBy: '', status: 'Pending' }];
    const orgSettings = { name: ORG, legalName: 'Atlantic Meridian Shipmanagement Limited', regNo: 'RC-1458820', type: 'Ship management company', address: '14 Marine Drive, Apapa, Lagos', country: 'Nigeria', email: 'operations@atlanticmeridian.com', phone: '+234 1 270 4410', timezone: 'Africa/Lagos (UTC+01:00)', currency: 'USD', dateFormat: 'DD MMM YYYY', language: 'English (UK)', codePrefix: 'AMS-', autoCode: true, alertDays: '90, 60, 30, 7', logo: null };
    const notifSettings = { email: true, inApp: true, sms: false, certExpiry: true, approvals: true, assignments: true, welfare: true, restHours: true, digest: 'Daily at 07:00' };
    const integrations = [['Microsoft 365', 'Calendar & email', 'Connected'], ['Microsoft Entra ID', 'Single sign-on', 'Connected'], ['Email service (SMTP / SendGrid)', 'Transactional email', 'Connected'], ['SMS gateway', 'Urgent alerts', 'Not configured'], ['AIS data provider', 'Live vessel positions', 'Not configured'], ['Mapping service', 'Route visualisation', 'Not configured'], ['Payment provider', 'Crew payments', 'Not configured'], ['External document storage (Azure Blob)', 'Secure documents', 'Connected'], ['Training provider LMS', 'Course completions', 'Not configured']].map((x, i) => ({ id: 'int_' + i, name: x[0], purpose: x[1], status: x[2] }));
    const profileRequests = [{ id: 'pr_1', crewId: 'crw_1', field: 'Mobile Phone', from: crew[0].mobile, to: '+234 803 555 0142', status: 'Pending Approval', ts: ts(-1) }];
    const syncQueue = [];
    const syncLog = [{ id: 'sl_1', ts: ts(-1, 6), records: 8, result: 'Synced', duplicates: 0, conflicts: 0, device: 'Bridge PC — MV Atlantic Aurora' }, { id: 'sl_2', ts: ts(-3, 6), records: 10, result: 'Synced', duplicates: 1, conflicts: 0, device: 'Bridge PC — MV Atlantic Aurora' }, { id: 'sl_3', ts: ts(-5, 23), records: 3, result: 'Failed', duplicates: 0, conflicts: 1, device: 'Ship Office tablet' }];
    const vesselDocs = vessels.map((v) => [['Certificate of Registry', 1825], ['Safety Management Certificate (ISM)', 1825], ['International Ship Security Certificate', 1825], ['Maritime Labour Certificate', 1825], ['Minimum Safe Manning Document', 0], ['Declaration of Maritime Labour Compliance Part II', 0]].map((x, i) => ({ id: `vd_${v.id}_${i}`, vesselId: v.id, name: x[0], number: 'VC-' + int(10000, 99999), issued: d(-int(100, 900)), expiry: x[1] ? d(i === 3 && v.id === 'ves_1' ? 52 : int(120, 1200)) : '', category: 'Statutory', file: { name: x[0].replace(/\W+/g, '_') + '.pdf', size: 300000, type: 'application/pdf' } }))).flat();
    const vesselEvents = [{ id: 've_1', vesselId: 'ves_1', ts: ts(-1, 6), type: 'Drill', note: 'Abandon ship drill — all crew mustered in 6 min' }, { id: 've_2', vesselId: 'ves_1', ts: ts(-2, 14), type: 'Bunkering', note: '320 MT VLSFO received' }, { id: 've_3', vesselId: 'ves_1', ts: ts(-4, 9), type: 'Departure', note: 'Departed Lagos (Apapa) pilot away 09:12' }];

    return { reference, crew, certificates: certs, medical, travelDocs, employment, seaService, contracts, vessels, voyages, portCalls, crewChanges, relief, vacancies, applications, interviews, workingArrangements, restRecords, restLocks, restRules, checkIns, checkInResponses, welfareRequests, complaints, incidents, courses, trainingAssignments, trainingRecords, competency, appraisals, wageStructures, compensation, allotments, payrollPeriods, payslips, payments, expenses, roles, users, workflows, notifications, audit, loginHistory, activity, organisations, subscriptions, enquiries, supportAccess, orgSettings, notifSettings, integrations, profileRequests, syncQueue, syncLog, vesselDocs, vesselEvents, enquiriesPublic: [], viewAsRole: null, vesselOffline: false };
  };
  N.addDaysRaw = (iso, n) => { const x = new Date(iso + 'T00:00:00'); x.setDate(x.getDate() + n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
  N.uidRaw = () => Math.random().toString(36).slice(2, 8);
})();
