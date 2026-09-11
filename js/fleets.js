const FLEET_REGS = {
  "Gulfstream": ["5N-IZA", "P4-ADTW", "P4-AA", "P4-ORJ"],
  "Hawker": ["5N-ISB", "5N-IKO", "5N-JAZ", "5N-ALG", "5N-JAK", "5N-BNM", "5N-KAL"],
  "Challenger": ["5N-DSY", "P4-ZZK"]
};

const FLEET_TEMPLATES = {
  "Gulfstream": [
    {
      title: "Documentation & Certification (NCAR Compliance)",
      items: [
        { description: "Aircraft Technical Log (ATL) – onboard and updated." },
        { description: "Review of previous defect entries – rectified or deferred per MEL/CDL." },
        { description: "Aircraft documents folder – checked and confirmed updated with all required documents." },
        { description: "Certificate of Airworthiness (C of A) and ARC validity confirmed." },
        { description: "Flight Manual, MEL, QRH, checklists – present and accessible." },
        { description: "Mandatory equipment (ELT, CVR, FDR, etc.) – operable." },
        { description: "Debrief incoming crew for reported discrepancies (postflight)." },
        { description: "Brief outgoing crew on aircraft status and deferred items (Preflight)." }
      ]
    },
    {
      title: "Technical Additions (Gulfstream GIV Manuals)",
      items: [
        { description: "APU oil level checked per GIV AMM 49-00-00." },
        { description: "APU run log and general area – soot, leaks, panel integrity." },
        { description: "Avionics cooling fan operation verified (GIV MM 31-50-00)." },
        { description: "Cargo bay smoke detector and fire suppression system (if installed)." },
        { description: "FOD inspection of ramp around aircraft – completed." },
        { description: "Tool and rag control accounted for." }
      ]
    },
    {
      title: "Nose Section",
      items: [
        { description: "Pitot static tubes – Condition and obstruction." },
        { description: "Windshield and windows – Condition & security." },
        { description: "Nose gear components – Security and integrity." },
        { description: "Tires pressure and condition." },
        { description: "Radome – Check radar switch & security." }
      ]
    },
    {
      title: "Fuselage",
      items: [
        { description: "Outflow and dump valves – Visual check." },
        { description: "Oxygen system – Pressure and vent status." },
        { description: "Access doors/panels – Left and right secured." },
        { description: "Antennas and AOA probes – Condition." },
        { description: "General area – Cleanliness and signs of leaks." }
      ]
    },
    {
      title: "Wings",
      items: [
        { description: "Flaps and rollers – Check for damage." },
        { description: "Fuel caps and vent covers – Secure and clear." },
        { description: "Static discharge wicks – Present and secure." },
        { description: "Wing leading edges and winglets – Condition and security." },
        { description: "Check for fuel leaks on upper and lower surfaces." }
      ]
    },
    {
      title: "Engine and Pylon",
      items: [
        { description: "Intake/exhaust covers – Removed; check for FOD." },
        { description: "Engine oil levels and quantity added." },
        { description: "Engines/accessories – Security and leaks." },
        { description: "Cowling latches and doors – Secure." },
        { description: "Thrust reversers – Normal position." }
      ]
    },
    {
      title: "Main Wheel Wells",
      items: [
        { description: "Main tire pressures and condition." },
        { description: "Oleo strut height and cleanliness." },
        { description: "Brakes – Damage, leaks and condition." },
        { description: "Fuel lines and pump connectors – Condition and leaks." },
        { description: "Utility lights, pump connectors – Operational status." }
      ]
    },
    {
      title: "Cockpit & Avionics",
      items: [
        { description: "Circuit breakers – Depressed." },
        { description: "Flight documentation – Present and updated." },
        { description: "Flight & engine controls – Direction & travel." },
        { description: "Safety systems – Warning lights, fire detectors, etc." },
        { description: "Cockpit and equipment – Secured and clean." }
      ]
    },
    {
      title: "Entrance & Cabin",
      items: [
        { description: "Circuit breakers and electronic rack – Checked." },
        { description: "Emergency exits, lights, and smoke evacuation knob." },
        { description: "Cabin configuration and ballast – Secure." },
        { description: "Cabin area and baggage door – Clean and secured." }
      ]
    },
    {
      title: "Final (Just Prior to Departure)",
      items: [
        { description: "Safety pins (gear and door valves) – Removed." },
        { description: "Nose strut scissor pin – Installed." },
        { description: "Weight-on-wheel switches – Clear." },
        { description: "All service items completed and signed off." },
        { description: "Pre-dispatch inspection logbook entries recorded." }
      ]
    }
  ],
  "Challenger": [
    {
      "section_id": "CHL-SEC1",
      "title": "Front Fuselage",
      "items": [
        {
          "id": "CHL-FF-A1",
          "task_number": "A",
          "description": "Static Ports: Make sure there is no damage or obstruction."
        },
        {
          "id": "CHL-FF-B1",
          "task_number": "B",
          "description": "Angle-of-Attack Vanes: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-FF-C1",
          "task_number": "C",
          "description": "Pitot Tubes: Make sure there is no damage or obstruction."
        },
        {
          "id": "CHL-FF-D1",
          "task_number": "D",
          "description": "Nose Landing Gear, Doors and Bay: Do a check of the oleo extension, look for damaged tires and wheels, damaged or loose installations and hydraulic leaks. Make sure the proximity sensors and their harnesses are attached correctly. Make sure the brake accumulators pressures are within permitted limits."
        },
        {
          "id": "CHL-FF-D2",
          "task_number": "D",
          "description": "Wheel & Tire: Visual check of the right and left nose wheel and tire assembly. Check for wear and/or tear."
        },
        {
          "id": "CHL-FF-D3",
          "task_number": "D",
          "description": "Wheel & Tire: Record NLG Tire #1 Pressure IAW AMM 12-15-00-780-801.",
          "note_text": "Check tire pressure IAW AMM 12-15-00-780-801. Target: 155 +7/-0 psi.",
          "meta_entry": {
            "type": "tire_pressure",
            "label": "NLG #1 Pressure",
            "unit": "psi",
            "target_value": "155 +7/-0 psi",
            "value": null
          }
        },
        {
          "id": "CHL-FF-D4",
          "task_number": "D",
          "description": "Wheel & Tire: Record NLG Tire #2 Pressure IAW AMM 12-15-00-780-801.",
          "note_text": "Check tire pressure IAW AMM 12-15-00-780-801. Target: 155 +7/-0 psi.",
          "meta_entry": {
            "type": "tire_pressure",
            "label": "NLG #2 Pressure",
            "unit": "psi",
            "target_value": "155 +7/-0 psi",
            "value": null
          }
        },
        {
          "id": "CHL-FF-E1",
          "task_number": "E",
          "description": "Oxygen System: Make sure that the pressure shown on the gauge on the ground service panel is within permitted limits. Make sure that the green disc on the overboard discharge indicator is not damaged. Make sure that the valves on the oxygen bottles are opened."
        },
        {
          "id": "CHL-FF-E2",
          "task_number": "E",
          "description": "Oxygen System: Ensure oxygen bottle is within life limit and record due date.",
          "meta_entry": {
            "type": "due_date",
            "label": "Oxygen Bottle Due Date",
            "value": null
          }
        },
        {
          "id": "CHL-FF-E3",
          "task_number": "E",
          "description": "Oxygen System: Ensure PBE is within life limit and record due date.",
          "meta_entry": {
            "type": "due_date",
            "label": "PBE Due Date",
            "value": null
          }
        },
        {
          "id": "CHL-FF-F1",
          "task_number": "F",
          "description": "Windshield and Windows: Clean."
        },
        {
          "id": "CHL-FF-G1",
          "task_number": "G",
          "description": "Total Air Temperature Sensor: Make sure there is no damage or obstruction."
        },
        {
          "id": "CHL-FF-H1",
          "task_number": "H",
          "description": "Antennae: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-FF-I1",
          "task_number": "I",
          "description": "Radome: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-FF-J1",
          "task_number": "J",
          "description": "Passenger Entrance Door-Seal: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-FF-K1",
          "task_number": "K",
          "description": "Fuselage Exterior: Make sure there is no damage or fluid leaks. Make sure that access panels are closed correctly."
        }
      ]
    },
    {
      "section_id": "CHL-SEC2",
      "title": "Wings",
      "items": [
        {
          "id": "CHL-WG-A1",
          "task_number": "A",
          "description": "Wing Exterior: Make sure there is no damage or fluid leaks. Make sure that access panels are closed correctly. Make sure that the anti-ice duct on the leading edge is not obstructed. Make sure the static dischargers are not damaged."
        },
        {
          "id": "CHL-WG-B1",
          "task_number": "B",
          "description": "Main Landing Gear, Doors and Bay: Do a check of the oleo extension, look for damaged tires and wheels, damaged or loose installations and hydraulic leaks. Make sure that brake wear is within limits and there are no signs of overheat."
        },
        {
          "id": "CHL-WG-B2",
          "task_number": "B",
          "description": "Wheel & Tire: Visual check of the right and left main wheel and tire assembly. Check for wear and/or tear."
        },
        {
          "id": "CHL-WG-B3",
          "task_number": "B",
          "description": "Wheel & Tire: Record LH MLG Tire #1 Pressure IAW AMM 12-15-00-780-801.",
          "note_text": "Check tire pressure IAW AMM 12-15-00-780-801. Target: 184 +9/-0 psi.",
          "meta_entry": {
            "type": "tire_pressure",
            "label": "LH MLG #1 Pressure",
            "unit": "psi",
            "target_value": "184 +9/-0 psi",
            "value": null
          }
        },
        {
          "id": "CHL-WG-B4",
          "task_number": "B",
          "description": "Wheel & Tire: Record LH MLG Tire #2 Pressure IAW AMM 12-15-00-780-801.",
          "note_text": "Check tire pressure IAW AMM 12-15-00-780-801. Target: 184 +9/-0 psi.",
          "meta_entry": {
            "type": "tire_pressure",
            "label": "LH MLG #2 Pressure",
            "unit": "psi",
            "target_value": "184 +9/-0 psi",
            "value": null
          }
        },
        {
          "id": "CHL-WG-B5",
          "task_number": "B",
          "description": "Wheel & Tire: Record RH MLG Tire #3 Pressure IAW AMM 12-15-00-780-801.",
          "note_text": "Check tire pressure IAW AMM 12-15-00-780-801. Target: 184 +9/-0 psi.",
          "meta_entry": {
            "type": "tire_pressure",
            "label": "RH MLG #3 Pressure",
            "unit": "psi",
            "target_value": "184 +9/-0 psi",
            "value": null
          }
        },
        {
          "id": "CHL-WG-B6",
          "task_number": "B",
          "description": "Wheel & Tire: Record RH MLG Tire #4 Pressure IAW AMM 12-15-00-780-801.",
          "note_text": "Check tire pressure IAW AMM 12-15-00-780-801. Target: 184 +9/-0 psi.",
          "meta_entry": {
            "type": "tire_pressure",
            "label": "RH MLG #4 Pressure",
            "unit": "psi",
            "target_value": "184 +9/-0 psi",
            "value": null
          }
        },
        {
          "id": "CHL-WG-B7",
          "task_number": "B",
          "description": "Main Landing Gear: Make sure there are no hydraulic leaks. Make sure the proximity sensors and their harnesses are attached correctly."
        },
        {
          "id": "CHL-WG-B8",
          "task_number": "B",
          "description": "Hydraulics: Make sure the No. 3 hydraulic system accumulator pressure is within permitted limits, refer to AMM 12-12-29-210-803. Make sure the differential-pressure pop-up indicator on the No. 3 hydraulic system is in the serviceable position.",
          "note_text": "Refer to AMM 12-12-29-210-803."
        },
        {
          "id": "CHL-WG-C1",
          "task_number": "C",
          "description": "Ailerons: Look at the general condition and make sure there is no damage. Make sure the static dischargers are not damaged."
        },
        {
          "id": "CHL-WG-D1",
          "task_number": "D",
          "description": "Flaps: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-WG-E1",
          "task_number": "E",
          "description": "Flight Spoilers: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-WG-F1",
          "task_number": "F",
          "description": "Ground Spoilers: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-WG-G1",
          "task_number": "G",
          "description": "Fuel Tanks: Drain the water condensate."
        },
        {
          "id": "CHL-WG-H1",
          "task_number": "H",
          "description": "Fuel Filler Caps: Make sure the filler caps closed correctly."
        },
        {
          "id": "CHL-WG-I1",
          "task_number": "I",
          "description": "Fuel Vent Inlet: Make sure there is no damage or obstruction."
        },
        {
          "id": "CHL-WG-J1",
          "task_number": "J",
          "description": "Navigation and Strobe Lights: Make sure there is no damage."
        },
        {
          "id": "CHL-WG-K1",
          "task_number": "K",
          "description": "Landing, Taxi, and Inspection Lights: Make sure there is no damage."
        }
      ]
    },
    {
      "section_id": "CHL-SEC3",
      "title": "Rear Fuselage, Stabilizer and Powerplant",
      "items": [
        {
          "id": "CHL-RFS-A1",
          "task_number": "A",
          "description": "Rear Fuselage-Exterior: Make sure there is no damage or fluid leaks. Make sure that access panels are closed correctly. Make sure the static dischargers are not damaged. Make sure there is no damage or obstruction to the exhausts from the air condition unit and the APU."
        },
        {
          "id": "CHL-RFS-B1",
          "task_number": "B",
          "description": "Antennae: Look at the general condition and make sure there is no damage."
        },
        {
          "id": "CHL-RFS-C1",
          "task_number": "C",
          "description": "Stabilizers: Make sure there is no damage or fluid leaks. Make sure that access panels are closed correctly. Make sure the static dischargers are not damaged."
        },
        {
          "id": "CHL-RFS-D1",
          "task_number": "D",
          "description": "Rudder: Look at the general condition and make sure there is no damage. Make sure the static dischargers are not damaged."
        },
        {
          "id": "CHL-RFS-E1",
          "task_number": "E",
          "description": "Elevators: Look at the general condition and make sure there is no damage. Make sure the static dischargers are not damaged."
        },
        {
          "id": "CHL-RFS-F1",
          "task_number": "F",
          "description": "Pylon and Engine: Do a check of the intake, exhaust and stage 6 turbine blades for FOD. Do a check of the overboard drains for leaks. Make sure the cowl doors and panels are closed correctly. Turn the fan rotor by hand and make sure it turns freely."
        },
        {
          "id": "CHL-RFS-G1",
          "task_number": "G",
          "description": "Engine: Add oil, as required. Check oil level and do the servicing between 15 and 30 minutes after engine shutdown.",
          "note_text": "Check oil level and do the servicing between 15 and 30 minutes after engine shutdown."
        },
        {
          "id": "CHL-RFS-H1",
          "task_number": "H",
          "description": "Integrated Drive Generator (IDG): Add oil, as required. Wait at least 3 minutes after engine shutdown to let the IDG oil level become stable. Make sure that the pressure differential indicators show a serviceable condition (whenever the nacelle access doors are open).",
          "note_text": "Wait at least 3 minutes after engine shutdown to let the IDG oil level become stable."
        },
        {
          "id": "CHL-RFS-I1",
          "task_number": "I",
          "description": "Emergency Lights: Make sure there is no damage."
        }
      ]
    },
    {
      "section_id": "CHL-SEC4",
      "title": "Rear Equipment Bay",
      "items": [
        {
          "id": "CHL-REB-A1",
          "task_number": "A",
          "description": "Compartment: Do a check of all equipment and installations for condition and correct installation. Make sure the No. 1 and No. 2 hydraulic system accumulator pressures are within permitted limits, refer to AMM 12-12-29-210-803. Make sure the hydraulic level in system 1 and 2 are within limit. Make sure that the differential-pressure pop-up indicators on the No. 1 and No. 2 hydraulic system filters show a serviceable condition.",
          "note_text": "Refer to AMM 12-12-29-210-803."
        },
        {
          "id": "CHL-REB-B1",
          "task_number": "B",
          "description": "APU: Do a check of wires, tubes, ducts, fittings, air intakes duct and exhaust duct for condition. Empty ecology bottles when more than 3/4 full. Add oil, as required. Make sure the oil level in the generator adaptor is within limits.",
          "note_text": "Empty ecology bottles when more than 3/4 full."
        }
      ]
    },
    {
      "section_id": "CHL-SEC5",
      "title": "Rear Fuselage Interior",
      "items": [
        {
          "id": "CHL-RFI-A1",
          "task_number": "A",
          "description": "Loose Equipment: Make sure that all equipment is attached correctly."
        },
        {
          "id": "CHL-RFI-B1",
          "task_number": "B",
          "description": "Baggage Compartment Door Seal: Do a check for damage and general condition."
        },
        {
          "id": "CHL-RFI-C1",
          "task_number": "C",
          "description": "Portable Fire Extinguisher: Make sure that the pressure is within permitted limits, the tamper indicator is not broken and the nozzle is not obstructed."
        },
        {
          "id": "CHL-RFI-C2",
          "task_number": "C",
          "description": "Portable Fire Extinguisher: Ensure fire extinguishers are within life limit and record due date.",
          "meta_entry": {
            "type": "due_date",
            "label": "Fire Extinguisher Due Date",
            "value": null
          }
        },
        {
          "id": "CHL-RFI-D1",
          "task_number": "D",
          "description": "Overwing Emergency Exit: Make sure that the door is closed correctly."
        }
      ]
    },
    {
      "section_id": "CHL-SEC6",
      "title": "First Aid Kit",
      "items": [
        {
          "id": "CHL-FAK-01",
          "task_number": "6",
          "description": "First Aid Kit: Do a visual check for general condition."
        },
        {
          "id": "CHL-FAK-02",
          "task_number": "6",
          "description": "First Aid Kit: Record due date.",
          "meta_entry": {
            "type": "due_date",
            "label": "First Aid Kit Due Date",
            "value": null
          }
        }
      ]
    },
    {
      "section_id": "CHL-SEC7",
      "title": "Restraint Systems",
      "items": [
        {
          "id": "CHL-RST-01",
          "task_number": "7",
          "description": "Restraint Systems: Ensure each seat is equipped with seat belt and safety harness for crew seat. Check general condition."
        }
      ]
    },
    {
      "section_id": "CHL-SEC8",
      "title": "Life Vests",
      "items": [
        {
          "id": "CHL-LV-01",
          "task_number": "8",
          "description": "Life Vests: Ensure all life vests are within life limit and record due date.",
          "meta_entry": {
            "type": "due_date",
            "label": "Life Vests Due Date",
            "value": null
          }
        }
      ]
    }
  ],
  "Hawker": [
    {
      title: "General",
      items: [
        { description: "Make sure that any defects reported in the technical log or Pilot's Report have been cleared or cleared for flight in accordance with the Minimum Equipment List." },
        { description: "Assure that Post Flight Inspections have been accomplished. Do not remove gear pins." },
        { description: "Remove external covers, plugs, guards, internal control locks (if installed) and stow correctly Ground Handling Check List (Part III, Para. C)." }
      ]
    },
    {
      title: "Left Nose and Fuselage",
      items: [
        { description: "Make sure the stall detector vane moves freely through the full range of travel. Vane movement must be smooth and damped." },
        { description: "Check pitot tube condition, cover removed and hole clear.", is_daily_only: true },
        { description: "Check static plate and static ports for condition; free from dents, corrosion, contaminants and obstructions." },
        { description: "Check OAT sensor probe for condition." },
        { description: "Check ice detector for condition and rotor movement." },
        { description: "Check external fuselage and flight compartment windows for damage. Check windshield weather seals for condition." },
        { description: "Check nose skin, forward of static plate, free from dents, paint bubbles and sealant bulges." },
        { description: "Make sure avionics access door is correctly seated and secure." },
        { description: "Check radome for condition and security." },
        { description: "Check condition of nose taxi light lens and bulbs (L & R)." }
      ]
    },
    {
      title: "Nose Landing Gear & Bay",
      items: [
        { description: "Make sure the nose landing gear ground lock is installed in the nose landing gear and is secure (check overall condition of NLG bay)." },
        { description: "Make sure there is no visible damage to doors, nose gear assembly or wheels." },
        { description: "Check the nose gear bay to make sure there is no fluid leakage." },
        { description: "Check condition of wiring and hoses." },
        { description: "Make sure that the auxiliary hydraulic system reservoir has been checked.", is_daily_only: true },
        { description: "Check nose landing gear doors are closed and manual release is secure." },
        { description: "Visually check the strut for normal condition.", is_daily_only: true },
        { description: "Check tires for condition.", is_daily_only: true }
      ]
    },
    {
      title: "Right Nose & Fuselage",
      items: [
        { description: "Check radome for condition & security." },
        { description: "Make sure avionics access door is correctly seated and secure." },
        { description: "Check nose skin, forward of static plate, free from dents, corrosion, paint bubbles and sealant bulges." },
        { description: "Check static plate and static ports for condition, free from dents, corrosion, contaminants and obstructions." },
        { description: "Check external fuselage & flight compartment windows for damage." },
        { description: "Check pitot tube condition, cover removed and holes clear.", is_daily_only: true },
        { description: "Make sure the stall detector vane moves freely through the full range of travel. Vane movement must be smooth and damped." },
        { description: "Make sure venturi outlet is clear." },
        { description: "Check SAT sensor for condition." },
        { description: "Check external fuselage & windows for damage, overwing emergency exit closed and flush with fuselage and dorsal air intake cover removed and intake clear." }
      ]
    },
    {
      title: "Right Wing",
      items: [
        { description: "Make sure that all water has been drained from the center section fuel tank sumps." },
        { description: "Check condition of the wing ice light lens and bulbs." },
        { description: "Check the condition of overwing fillet fairing." },
        { description: "Check the condition of the external structure of the wing to make sure it is clean and undamaged; upper and lower surface (no fuel leaks), leading edge, stall strip, landing and taxi lights (condition of lens and bulbs) and vortilon." },
        { description: "Make sure the vortex generators are secure and not deformed." },
        { description: "Check the overwing fuel cap for security." },
        { description: "Make sure the stall warning system vent (if installed) is clear." },
        { description: "Make sure the NACA vent is clear." },
        { description: "Check surge tank vent drain." },
        { description: "Check condition of strobes and navigation light lens and bulbs/LEDs (if installed)." },
        { description: "Check condition of wing tip. Check winglet (if installed)." },
        { description: "Check condition of the aileron aileron trip tab." },
        { description: "Make sure there are no foreign objects or debris in the aileron shrouds." },
        { description: "Make sure the aileron moves freely through the full range of travel." },
        { description: "Check condition of flap and air brakes." },
        { description: "Check for damaged or missing static wick." }
      ]
    },
    {
      title: "Right Main Landing Gear",
      items: [
        { description: "Make sure main landing gear ground lock is installed in the main landing gear and is secure." },
        { description: "Visually inspect the side stay components and attachment points for security and make sure there is no visible damage." },
        { description: "Visually check the strut for normal condition.", is_daily_only: true },
        { description: "Check tires for condition.", is_daily_only: true },
        { description: "Make sure there is no visible damage to the fairing and main landing gear doors." },
        { description: "Check the main gear and inside the main gear bay to make sure there is no fluid leakage." },
        { description: "Check condition of wiring and hoses." }
      ]
    },
    {
      title: "Right Engine and Nacelle",
      items: [
        { description: "Check right engine, remove engine cover and make sure there are no visible oil leaks in the engine intake and cowling and free from foreign objects. DO NOT ATTEMPT TO STOP THE FAN BY HOLDING THE BLADES." },
        { description: "Make sure there is no damage to the fan blades when viewed through the engine intake." },
        { description: "Check P2T2 sensor clean, undamaged and secure." },
        { description: "Make sure the starter generator cooling intake and outlet are unobstructed. Check general condition of cowling and latches for damage, vents and drain holes should be clear." },
        { description: "Check engine oil tank quantity (Part III, Para L) and engine oil filter bypass pin (if installed)." },
        { description: "Make sure there are no damage to the turbine blades when viewed through the exhaust." },
        { description: "Make sure there are no visible oil leaks in the engine cowling and the engine exhaust areas." },
        { description: "Check engine exhaust drain mast clear, no leaks." },
        { description: "Make sure the pin is removed from the thrust reverser and the TR is stowed and is secure.", is_daily_only: true }
      ]
    },
    {
      title: "Aft Fuselage - Right Side",
      items: [
        { description: "Check the APU (if installed) exhaust is unobstructed/damaged.", is_daily_only: true },
        { description: "Check condition of pressure refueling cap and make sure it is secure. Make sure the pressure refueling door is closed and secured." },
        { description: "Make sure the ground power unit access door is secure." },
        { description: "Make sure the oxygen charging port access panel is secure." }
      ]
    },
    {
      title: "Empennage (Tail Section)",
      items: [
        { description: "Check condition of tail cone and make sure it is secured and locked and the vents are unobstructed." },
        { description: "Check condition of tailcone strobe and navigation light lenses and bulbs." },
        { description: "Make sure there is no visible damage to the vertical stabilizer and rudder." },
        { description: "Make sure there is no visible damage to the horizontal stabilizer and elevator." },
        { description: "Visually check that vortex generators are present and undamaged (airplanes with winglets only)." },
        { description: "Check condition of the upper anti-collision light." },
        { description: "Check condition of static wicks, present and undamaged." }
      ]
    },
    {
      title: "Aft Fuselage - Left Side",
      items: [
        { description: "Check ventral tank (if installed) filler cap for security and make sure the ventral tank access door is closed and secure." },
        { description: "Check ventral tank (if installed) fairing installed and secure." },
        { description: "Make sure the fire extinguisher pressure relief indication disc for each engine is intact and APU fire extinguisher pressure relief indication disc is intact (if installed)." },
        { description: "Make sure the APU inlet is clear and unobstructed." }
      ]
    },
    {
      title: "Rear Equipment Bay",
      items: [
        { description: "Open hatch to rear equipment bay and check condition of hatch." },
        { description: "Check general condition of the rear equipment bay." },
        { description: "Check the maintenance panel (if installed), located next to the hydraulic accumulators." },
        { description: "Assure that hydraulic accumulator pressures have been checked. Check for minimum pressure." },
        { description: "Assure that the main hydraulic reservoir contents (dependent on accumulator pressure) have been checked and there are no leaks." },
        { description: "Check battery connectors for security." },
        { description: "Check computers, connected and secure." },
        { description: "Check APU general condition, no leaks." },
        { description: "Make sure the fire extinguisher pressure relief indication disc, located in the rear bay adjacent to the APU is intact." },
        { description: "Check the stick pusher assembly, general condition and latched securely." },
        { description: "Make sure the equipment bay light is off and the hatch is closed and latched securely." }
      ]
    },
    {
      title: "Left Engine and Nacelle",
      items: [
        { description: "Remove engine cover and check exhaust and make sure it is free from foreign object." },
        { description: "Make sure there is no damage to the turbine blades when viewed through the exhaust." },
        { description: "Make sure there are no visible oil leaks in the engine cowling and engine exhaust areas." },
        { description: "Make sure the pin is removed from the thrust reverser and the TR is stowed and is secured.", is_daily_only: true },
        { description: "Check general condition of cowling and latches for damage, vents and drain holes should be clear." },
        { description: "Check engine oil tank quantity Ground Handling Check List (Part III, Para. L) and engine oil filter by pass pin." },
        { description: "Check engine exhaust drain mast clear no leaks." },
        { description: "Make sure there are no visible oil leaks in the engine intake and cowling. DO NOT ATTEMPT TO STOP THE FAN BY HOLDING THE BLADES." },
        { description: "Make sure there is no damage to the fan blades when viewed through the engine intake." },
        { description: "Check P2T2 sensor clean, undamaged and secure." },
        { description: "Make sure the starter generator cooling intake and outlet are unobstructed." }
      ]
    },
    {
      title: "Left Main Landing Gear Center Keel",
      items: [
        { description: "Make sure main landing gear ground lock is installed in the main landing gear and is secure." },
        { description: "Visually inspect the side stay components and attachment points for security and make sure there is no visual damage." },
        { description: "Visually check the strut for normal condition.", is_daily_only: true },
        { description: "Check tires for condition.", is_daily_only: true },
        { description: "Make sure there is no visible damage to the fairing and main landing gear doors." },
        { description: "Check the main gear and inside the main gear bay to make sure there is no fluid leakage." },
        { description: "Check condition of wiring and hoses." },
        { description: "Check condition of anticollision light lens and bulb, located on the center keel." },
        { description: "Check all antennas attached to keel secure and undamaged." },
        { description: "Make sure that all water has been drained from ventral fuel tank Ground Handling Check List (Part III, Para. D)." }
      ]
    },
    {
      title: "Left Wing",
      items: [
        { description: "Check condition of flap and air brakes." },
        { description: "Check for damaged or missing static wicks." },
        { description: "Check condition of aileron and aileron trim tab." },
        { description: "Make sure there are no foreign objects or debris in the aileron shrouds." },
        { description: "Make sure the aileron moves freely through the full range of travel." },
        { description: "Check condition of wing tip. Check winglet (if installed)." },
        { description: "Check condition of strobe and navigation light lens and bulbs/ LEDs (if installed)." },
        { description: "Check drain vent surge tank drain." },
        { description: "Make sure the NACA vent is clear." },
        { description: "Make sure the vortex generators are secure and not deformed." },
        { description: "Check the overwing fuel cap for security." },
        { description: "Make sure the stall warning system vent (if installed) is clear." },
        { description: "Check the condition of the external structure of the wing to make sure it is clean and undamaged; upper and lower surface (no fuel leaks), leading edge, stall strip, landing and taxi lights (condition of lens and bulbs) and vortilon." },
        { description: "Check condition of the wing ice light lens and bulb." },
        { description: "Check condition of overwing fillet fairing." },
        { description: "Check condition of the boarding light lens and bulb." },
        { description: "Check condition of the main entry door seal/frame, external fuselage and windows." },
        { description: "Make sure that all water has been drained from the center section fuel tank sumps Ground Handling Check List (Part III, Para. D)." }
      ]
    },
    {
      title: "Flight Compartment",
      items: [
        { description: "Make sure all flashlights function correctly." },
        { description: "Make sure the auxiliary hydraulic system handpump handle/rudder gust lock is properly stowed." },
        { description: "Make sure the dump valve lever is set to SHUT." },
        { description: "Make sure there is full and free movement of the aileron, elevator and rudder primary controls." },
        { description: "Make sure the oxygen system contents are adequate and the valves are ON Ground Handling Check List (Part III, Para H)." },
        { description: "With the landing gear ground locks installed, make sure that the emergency dump valve is properly exercised by operating the auxiliary hydraulic system selector handle several times." },
        { description: "Check the portable breathing equipment (if installed)." },
        { description: "Check the airframe anti-icing system tank contents." },
        { description: "Check the fuel tanks for required fuel quantities." }
      ]
    },
    {
      title: "Vestibule, Passenger Cabin, Toilet Compartment",
      items: [
        { description: "Make sure all emergency equipment is on board and properly stowed." },
        { description: "Make sure the emergency exit door is secured." },
        { description: "Remove the emergency exit internal locking pin (if installed) and stow securely." }
      ]
    },
    {
      title: "Final Items",
      items: [
        { description: "Make sure that all access doors and servicing panels are secure." },
        { description: "Make sure that any frost, snow or ice is removed, refer to AFM Section 2 for limitations. Make sure that any accumulation of snow or ice is removed from the air conditioning system cooling turbine exhaust duct before starting the APU or the main engines." },
        { description: "Make sure steering disconnect pin, located between the nose gear torque link sleeve and the steering sleeve, is secured in place with the quick-release pin locked. Quick release pin is locked when indicator groove is exposed and level with the head." },
        { description: "Remove the gear pins and stow." }
      ]
    }
  ]
};
