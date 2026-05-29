const Student = require('../models/Student');
const Performance = require('../models/Performance');
const TestPerformance = require('../models/TestPerformance');
const Institute = require('../models/Institute');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const seedStudents = async (force = false) => {
  try {
    // Check if database already has data to prevent data loss on restart
    if (!force) {
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log("Database already contains data. Skipping seeding to prevent overwrite on restart.");
        return;
      }
    }

    // Clear previous records to ensure clean seed
    await Student.deleteMany({});
    await Performance.deleteMany({});
    await TestPerformance.deleteMany({});
    await Institute.deleteMany({});
    await User.deleteMany({});

    console.log("Database cleared. Seeding admin user and institute portal...");

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);
    const hashedGmailAdminPassword = await bcrypt.hash("123456", salt);
    const hashedInstitutePassword = await bcrypt.hash("password123", salt);

    // Seed admin user
    await User.create({
      name: "SportSphere Admin",
      email: "admin@sportsphere.com",
      phone: "+91 99999 99999",
      password: hashedAdminPassword,
      role: "admin",
      approvalStatus: "approved"
    });

    // Seed admin@gmail.com admin user to prevent deletion on restart
    await User.create({
      name: "System Admin",
      email: "admin@gmail.com",
      phone: "1234567890",
      password: hashedGmailAdminPassword,
      role: "admin",
      approvalStatus: "approved"
    });

    console.log("Admin users seeded.");

    const initialInstitutes = [
      {
        _id: "6650b2d1eb264088b036d101",
        name: "St. Xavier's International School",
        email: "stxaviers@sportsphere.com",
        city: "Ahmedabad",
        state: "Gujarat",
        address: "Navrangpura, Near Stadium Road",
        contactPerson: "Dr. Arthur D'Souza",
        mobile: "+91 98765 43210",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d102",
        name: "Delhi Public Sports Academy",
        email: "dps@sportsphere.com",
        city: "Delhi",
        state: "Delhi",
        address: "Sector 12, Dwarka",
        contactPerson: "Mr. Sharma Kumar",
        mobile: "+91 91234 56789",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d103",
        name: "Ryan Elite High School",
        email: "ryan@sportsphere.com",
        city: "Mumbai",
        state: "Maharashtra",
        address: "Malad West, Link Road",
        contactPerson: "Mrs. Paul Fernandes",
        mobile: "+91 88776 65544",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d104",
        name: "Oakridge International Sports Hub",
        email: "oakridge@sportsphere.com",
        city: "Hyderabad",
        state: "Telangana",
        address: "Gachibowli, Nanakramguda",
        contactPerson: "Dr. Arthur Winston",
        mobile: "+91 77665 54433",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d105",
        name: "DAV Public School, Gandhinagar",
        email: "dav@sportsphere.com",
        city: "Gandhinagar",
        state: "Gujarat",
        address: "Sector 21, Vyas Circle",
        contactPerson: "Mrs. Mehta Patel",
        mobile: "+91 94567 12345",
        status: "approved"
      },
      // PENDING INSTITUTES (For the Pending Approvals page!)
      {
        _id: "6650b2d1eb264088b036d201",
        name: "St. Mary's High School",
        email: "stmarys@sportsphere.com",
        city: "Nadiad",
        state: "Gujarat",
        address: "College Road, Near Mission Area",
        contactPerson: "Sister Maria Joseph",
        mobile: "+91 98251 12345",
        status: "pending"
      },
      {
        _id: "6650b2d1eb264088b036d202",
        name: "Emerald Valley Sports Academy",
        email: "emerald@sportsphere.com",
        city: "Rajkot",
        state: "Gujarat",
        address: "Kalawad Road, Opp. University Gate",
        contactPerson: "Coach Ranjitsinh Jadeja",
        mobile: "+91 94282 54321",
        status: "pending"
      },
      {
        _id: "6650b2d1eb264088b036d203",
        name: "Galaxy Sports Academy",
        email: "galaxy@sportsphere.com",
        city: "Surat",
        state: "Gujarat",
        address: "Adajan, Near Star Bazar",
        contactPerson: "Mr. Ramesh Kalsaria",
        mobile: "+91 81400 99887",
        status: "pending"
      },
      {
        _id: "6650b2d1eb264088b036d204",
        name: "Global Pathfinder International",
        email: "pathfinder@sportsphere.com",
        city: "Vadodara",
        state: "Gujarat",
        address: "Gotri Road, Near Yash Complex",
        contactPerson: "Dr. Vinay Malhotra",
        mobile: "+91 76008 11223",
        status: "pending"
      }
    ];

    for (let inst of initialInstitutes) {
      const user = await User.create({
        name: inst.contactPerson,
        email: inst.email,
        phone: inst.mobile.replace(/[^0-9+]/g, ''),
        password: hashedInstitutePassword,
        role: "institution",
        approvalStatus: inst.status
      });
      inst.userId = user._id;
    }

    await Institute.insertMany(initialInstitutes);
    console.log("Institutions successfully seeded into MongoDB!");

    console.log("Seeding student roster...");

    const initialStudents = [
      {
        studentId: "STU801XYZ1",
        name: "Rohan Patel",
        dob: new Date("2012-05-15"),
        class: "8",
        gender: "Male",
        contact: "9898765432",
        address: "A-401, Shanti Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU802XYZ2",
        name: "Yashvi Patel",
        dob: new Date("2012-08-20"),
        class: "8",
        gender: "Female",
        contact: "8765432109",
        address: "B-202, Radhe Bungalows, Navrangpura",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU803XYZ3",
        name: "Shreya Ghoshal",
        dob: new Date("2012-10-10"),
        class: "8",
        gender: "Female",
        contact: "7654321098",
        address: "Sector 12, Flat 304, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d102"
      },
      {
        studentId: "STU804XYZ4",
        name: "Aditya Roy",
        dob: new Date("2012-01-25"),
        class: "8",
        gender: "Male",
        contact: "9988776655",
        address: "Malad West, Link Road, Flat 501",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d103"
      },
      {
        studentId: "STU901XYZ5",
        name: "Sneha Reddy",
        dob: new Date("2011-04-12"),
        class: "9",
        gender: "Female",
        contact: "7766554433",
        address: "Flat 102, Gachibowli Highrise",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d104"
      },
      {
        studentId: "STU902XYZ6",
        name: "Ishaan Verma",
        dob: new Date("2011-06-30"),
        class: "9",
        gender: "Male",
        contact: "9123456789",
        address: "Sector 5, Flat 12, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d102"
      },
      {
        studentId: "STU903XYZ7",
        name: "Varun Dhawan",
        dob: new Date("2011-12-05"),
        class: "9",
        gender: "Male",
        contact: "9991122334",
        address: "Gachibowli, Nanakramguda, Villa 8",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d104"
      },
      {
        studentId: "STU904XYZ8",
        name: "Jiya Shah",
        dob: new Date("2011-09-18"),
        class: "9",
        gender: "Female",
        contact: "8181234567",
        address: "C-501, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU905XYZ9",
        name: "Devansh Vyas",
        dob: new Date("2011-03-22"),
        class: "9",
        gender: "Male",
        contact: "9425012345",
        address: "Malad West, Link Road, Flat 602",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d103"
      },
      {
        studentId: "STU101XYZ10",
        name: "Priya Patel",
        dob: new Date("2010-02-14"),
        class: "10",
        gender: "Female",
        contact: "9090909090",
        address: "A-502, Shanti Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU102XYZ11",
        name: "Kabir Singh",
        dob: new Date("2010-07-28"),
        class: "10",
        gender: "Male",
        contact: "9876512345",
        address: "Sector 12, Flat 101, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d102"
      },
      {
        studentId: "STU103XYZ12",
        name: "Diya Sen",
        dob: new Date("2010-11-19"),
        class: "10",
        gender: "Female",
        contact: "7676767676",
        address: "Malad West, Link Road, Flat 301",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d103"
      },
      {
        studentId: "STU104XYZ13",
        name: "Manan Desai",
        dob: new Date("2010-05-02"),
        class: "10",
        gender: "Male",
        contact: "9008812345",
        address: "B-404, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU106XYZ14",
        name: "Parth Shah",
        dob: new Date("2010-08-11"),
        class: "10",
        gender: "Male",
        contact: "9990011122",
        address: "Gachibowli, Nanakramguda, Villa 15",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d104"
      },
      {
        studentId: "STU111XYZ15",
        name: "Ananya Iyer",
        dob: new Date("2009-01-30"),
        class: "11",
        gender: "Female",
        contact: "9444455555",
        address: "Sector 10, Flat 405, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d102"
      },
      {
        studentId: "STU112XYZ16",
        name: "Arpit Gupta",
        dob: new Date("2009-03-24"),
        class: "11",
        gender: "Male",
        contact: "9112233445",
        address: "Malad West, Link Road, Flat 105",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d103"
      },
      {
        studentId: "STU113XYZ17",
        name: "Naman Pandya",
        dob: new Date("2009-09-09"),
        class: "11",
        gender: "Male",
        contact: "9008877665",
        address: "Gachibowli, Nanakramguda, Villa 22",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d104"
      }
    ];

    const insertedStudents = await Student.insertMany(initialStudents);
    console.log("20+ student profiles successfully seeded into MongoDB!");

    // Seed Performance
    console.log("Seeding student physical performance history...");
    const performanceSeeds = [];

    insertedStudents.forEach((student) => {
      const targets = ["Rohan Patel", "Shreya Ghoshal", "Varun Dhawan", "Priya Patel", "Parth Shah"];
      
      if (targets.includes(student.name)) {
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
          overallScore: 67,
          fitnessLevel: "Good",
          aiInsight: "Exhibits solid linear sprint capabilities and strong stamina response thresholds. Core flexibility exercises are recommended."
        });

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
          overallScore: 81,
          fitnessLevel: "Excellent",
          aiInsight: "Flawless physical recovery rates! Agility and pushup counts showed a remarkable +15% increase compared to TERM-1."
        });
      }
    });

    if (performanceSeeds.length > 0) {
      await Performance.insertMany(performanceSeeds);
      console.log(`Successfully seeded ${performanceSeeds.length} physical performance records!`);
    }

    // Seed Academic TestPerformance
    console.log("Seeding academic test performance...");
    const testPerformanceSeeds = [];

    insertedStudents.forEach((student) => {
      if (student.instituteId.toString() === "6650b2d1eb264088b036d101") {
        // Seed TERM-1, HALF-YEARLY and ANNUAL
        testPerformanceSeeds.push({
          instituteId: student.instituteId,
          studentId: student._id,
          class: student.class,
          examName: "Unit Test 1",
          term: "TERM-1",
          subjects: [
            { subjectName: "Mathematics", marks: 85, maxMarks: 100 },
            { subjectName: "Science", marks: 78, maxMarks: 100 },
            { subjectName: "English", marks: 92, maxMarks: 100 },
            { subjectName: "Hindi", marks: 80, maxMarks: 100 },
            { subjectName: "Social Studies", marks: 88, maxMarks: 100 }
          ],
          remarks: "Excellent progress in all subjects. Active participation."
        });

        testPerformanceSeeds.push({
          instituteId: student.instituteId,
          studentId: student._id,
          class: student.class,
          examName: "Half-Yearly Examination",
          term: "HALF-YEARLY",
          subjects: [
            { subjectName: "Mathematics", marks: 90, maxMarks: 100 },
            { subjectName: "Science", marks: 82, maxMarks: 100 },
            { subjectName: "English", marks: 88, maxMarks: 100 },
            { subjectName: "Hindi", marks: 85, maxMarks: 100 },
            { subjectName: "Social Studies", marks: 90, maxMarks: 100 }
          ],
          remarks: "Continues to excel. Mathematics scores are very strong."
        });
      }
    });

    if (testPerformanceSeeds.length > 0) {
      for (const t of testPerformanceSeeds) {
        await TestPerformance.create(t);
      }
      console.log(`Successfully seeded ${testPerformanceSeeds.length} academic test performance records.`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  }
};

module.exports = seedStudents;
