const Student = require('../models/Student');
const Performance = require('../models/Performance');

const seedStudents = async () => {
  try {
    // Clear previous records to ensure clean seed
    await Student.deleteMany({});
    await Performance.deleteMany({});

    console.log("Database empty. Seeding student roster with realistic athletic parameters...");

    const initialStudents = [
      {
        studentId: "STU-801",
        name: "Rohan Patel",
        age: 14,
        gender: "Male",
        height: 158,
        weight: 52,
        bmi: 20.83,
        bmiCategory: "Normal",
        class: "8",
        contact: "+91 98987 65432",
        assignedSport: "Athletics",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Rohan+Patel&background=2563EB&color=fff&size=200",
        tests: [{
          sprintTime: 12.8,
          broadJump: 215,
          pushups: 26,
          recommendedSport: "Athletics & Long Jump",
          manualReportData: "Good hamstring flexibility. High stride frequency. Aerobic capacity is standard for age.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        }]
      },
      {
        studentId: "STU-802",
        name: "Yashvi Patel",
        age: 14,
        gender: "Female",
        height: 154,
        weight: 48,
        bmi: 20.24,
        bmiCategory: "Normal",
        class: "8",
        contact: "+91 87654 32109",
        assignedSport: "Athletics",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Yashvi+Patel&background=EC4899&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-803",
        name: "Shreya Ghoshal",
        age: 14,
        gender: "Female",
        height: 152,
        weight: 44,
        bmi: 19.04,
        bmiCategory: "Normal",
        class: "8",
        contact: "+91 76543 21098",
        assignedSport: "Swimming",
        coachName: "Coach Priya",
        photoUrl: "https://ui-avatars.com/api/?name=Shreya+Ghoshal&background=EC4899&color=fff&size=200",
        tests: [{
          sprintTime: 14.2,
          broadJump: 190,
          pushups: 15,
          recommendedSport: "Cricket & General Sports",
          manualReportData: "Average muscle force, but excellent coordination. Recommended swimming routines to develop core endurance.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        }]
      },
      {
        studentId: "STU-804",
        name: "Aditya Roy",
        age: 14,
        gender: "Male",
        height: 162,
        weight: 56,
        bmi: 21.34,
        bmiCategory: "Normal",
        class: "8",
        contact: "+91 99887 76655",
        assignedSport: "Basketball",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Aditya+Roy&background=2563EB&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-901",
        name: "Sneha Reddy",
        age: 15,
        gender: "Female",
        height: 160,
        weight: 53,
        bmi: 20.7,
        bmiCategory: "Normal",
        class: "9",
        contact: "+91 77665 54433",
        assignedSport: "Volleyball",
        coachName: "Coach Priya",
        photoUrl: "https://ui-avatars.com/api/?name=Sneha+Reddy&background=EC4899&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-902",
        name: "Ishaan Verma",
        age: 15,
        gender: "Male",
        height: 168,
        weight: 60,
        bmi: 21.26,
        bmiCategory: "Normal",
        class: "9",
        contact: "+91 91234 56789",
        assignedSport: "Football",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Ishaan+Verma&background=2563EB&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-903",
        name: "Varun Dhawan",
        age: 15,
        gender: "Male",
        height: 170,
        weight: 64,
        bmi: 22.15,
        bmiCategory: "Normal",
        class: "9",
        contact: "+91 99911 22334",
        assignedSport: "Cricket",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Varun+Dhawan&background=2563EB&color=fff&size=200",
        tests: [{
          sprintTime: 12.1,
          broadJump: 225,
          pushups: 29,
          recommendedSport: "Athletics & Long Jump",
          manualReportData: "Explosive leg power. Very quick reaction time off the mark. High cardiovascular recovery rate.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        }]
      },
      {
        studentId: "STU-904",
        name: "Jiya Shah",
        age: 15,
        gender: "Female",
        height: 156,
        weight: 47,
        bmi: 19.31,
        bmiCategory: "Normal",
        class: "9",
        contact: "+91 81812 34567",
        assignedSport: "Badminton",
        coachName: "Coach Priya",
        photoUrl: "https://ui-avatars.com/api/?name=Jiya+Shah&background=EC4899&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-905",
        name: "Devansh Vyas",
        age: 15,
        gender: "Male",
        height: 165,
        weight: 58,
        bmi: 21.3,
        bmiCategory: "Normal",
        class: "9",
        contact: "+91 94250 12345",
        assignedSport: "Athletics",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Devansh+Vyas&background=2563EB&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-101",
        name: "Priya Patel",
        age: 16,
        gender: "Female",
        height: 158,
        weight: 50,
        bmi: 20.03,
        bmiCategory: "Normal",
        class: "10",
        contact: "+91 90909 09090",
        assignedSport: "Basketball",
        coachName: "Coach Priya",
        photoUrl: "https://ui-avatars.com/api/?name=Priya+Patel&background=EC4899&color=fff&size=200",
        tests: [{
          sprintTime: 13.1,
          broadJump: 235,
          pushups: 27,
          recommendedSport: "Basketball & Volleyball",
          manualReportData: "Great vertical suspension. Fast acceleration curves. Arm flexion and extension scores are good.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        }]
      },
      {
        studentId: "STU-102",
        name: "Kabir Singh",
        age: 16,
        gender: "Male",
        height: 172,
        weight: 68,
        bmi: 22.99,
        bmiCategory: "Normal",
        class: "10",
        contact: "+91 98765 12345",
        assignedSport: "Cricket",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Kabir+Singh&background=2563EB&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-103",
        name: "Diya Sen",
        age: 16,
        gender: "Female",
        height: 162,
        weight: 52,
        bmi: 19.81,
        bmiCategory: "Normal",
        class: "10",
        contact: "+91 76767 67676",
        assignedSport: "Athletics",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Diya+Sen&background=EC4899&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-104",
        name: "Manan Desai",
        age: 16,
        gender: "Male",
        height: 176,
        weight: 70,
        bmi: 22.59,
        bmiCategory: "Normal",
        class: "10",
        contact: "+91 90088 12345",
        assignedSport: "Football",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Manan+Desai&background=2563EB&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-106",
        name: "Parth Shah",
        age: 16,
        gender: "Male",
        height: 174,
        weight: 66,
        bmi: 21.8,
        bmiCategory: "Normal",
        class: "10",
        contact: "+91 99900 11122",
        assignedSport: "Volleyball",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Parth+Shah&background=2563EB&color=fff&size=200",
        tests: [{
          sprintTime: 12.9,
          broadJump: 240,
          pushups: 28,
          recommendedSport: "Basketball & Volleyball",
          manualReportData: "Exceptional jump heights. Fast recovery index. High standard of muscular endurance.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        }]
      },
      {
        studentId: "STU-111",
        name: "Ananya Iyer",
        age: 17,
        gender: "Female",
        height: 164,
        weight: 55,
        bmi: 20.45,
        bmiCategory: "Normal",
        class: "11",
        contact: "+91 94444 55555",
        assignedSport: "Swimming",
        coachName: "Coach Priya",
        photoUrl: "https://ui-avatars.com/api/?name=Ananya+Iyer&background=EC4899&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-112",
        name: "Arpit Gupta",
        age: 17,
        gender: "Male",
        height: 180,
        weight: 74,
        bmi: 22.84,
        bmiCategory: "Normal",
        class: "11",
        contact: "+91 91122 33445",
        assignedSport: "Cricket",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Arpit+Gupta&background=2563EB&color=fff&size=200",
        tests: []
      },
      {
        studentId: "STU-113",
        name: "Naman Pandya",
        age: 17,
        gender: "Male",
        height: 178,
        weight: 71,
        bmi: 22.41,
        bmiCategory: "Normal",
        class: "11",
        contact: "+91 90088 77665",
        assignedSport: "Cricket",
        coachName: "Coach Arthur",
        photoUrl: "https://ui-avatars.com/api/?name=Naman+Pandya&background=2563EB&color=fff&size=200",
        tests: []
      }
    ];

    const insertedStudents = await Student.insertMany(initialStudents);
    console.log("20+ student profiles successfully seeded into MongoDB!");

    // Let's seed TERM-1 and TERM-2 performance histories for some of the seeded students!
    console.log("Seeding student performance history...");
    const performanceSeeds = [];

    insertedStudents.forEach((student) => {
      // Seed 2 terms (TERM-1 and TERM-2) for selective students to demonstrate historical timelines!
      const targets = ["Rohan Patel", "Shreya Ghoshal", "Varun Dhawan", "Priya Patel", "Parth Shah"];
      
      if (targets.includes(student.name)) {
        // TERM-1 (Slightly lower scores)
        performanceSeeds.push({
          studentId: student._id,
          term: "TERM-1",
          speed: 68,
          strength: 65,
          stamina: 70,
          agility: 72,
          flexibility: 60,
          accuracy: 64,
          endurance: 68,
          reactionTime: 70,
          attendance: 88,
          discipline: 7,
          matchPerformance: 65,
          overallScore: 67.2,
          fitnessLevel: "Good",
          aiInsight: "Exhibits solid linear sprint capabilities and strong stamina response thresholds. Arm flexion counts are within healthy standard brackets. Core flexibility exercises are recommended to increase leg swing acceleration ranges."
        });

        // TERM-2 (Significant improvements!)
        performanceSeeds.push({
          studentId: student._id,
          term: "TERM-2",
          speed: 82,
          strength: 78,
          stamina: 85,
          agility: 88,
          flexibility: 72,
          accuracy: 75,
          endurance: 84,
          reactionTime: 82,
          attendance: 94,
          discipline: 9,
          matchPerformance: 85,
          overallScore: 81.3,
          fitnessLevel: "Excellent",
          aiInsight: "Flawless physical recovery rates! Agility and pushup counts showed a remarkable +15% increase compared to TERM-1. Stamina indexes suggest perfect adaptation for elite-tier track and field programs."
        });
      }
    });

    if (performanceSeeds.length > 0) {
      await Performance.insertMany(performanceSeeds);
      console.log(`Successfully seeded ${performanceSeeds.length} performance evaluation history documents!`);
    }

  } catch (error) {
    console.error("Seeding failed:", error.message);
  }
};

module.exports = seedStudents;
