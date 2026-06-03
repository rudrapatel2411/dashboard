const Student = require('../models/Student');
const Performance = require('../models/Performance');
const TestPerformance = require('../models/TestPerformance');
const Institute = require('../models/Institute');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const seedStudents = async (force = false) => {
  try {
    const getCounts = async () => ({
      users: await User.countDocuments(),
      students: await Student.countDocuments(),
      performances: await Performance.countDocuments(),
      testPerformances: await TestPerformance.countDocuments(),
      institutes: await Institute.countDocuments()
    });

    if (!force) {
      if (process.env.SEEDED === 'true') {
        console.log("SEEDED=true flag set. Skipping seeder entirely.");
        return;
      }

      const counts = await getCounts();
      if (Object.values(counts).some((count) => count > 0)) {
        console.log(`Database already contains data ${JSON.stringify(counts)}. Skipping seed.`);
        return;
      }
    }

    if (force) {
      await Student.deleteMany({});
      await Performance.deleteMany({});
      await TestPerformance.deleteMany({});
      await Institute.deleteMany({});
      await User.deleteMany({});
      console.log("Database cleared for forced reseed.");
    }

    console.log("Seeding admin user and institute portal...");

    const salt = await bcrypt.genSalt(10);
    // Fix #14: Passwords now read from environment variables.
    // Set SEED_ADMIN_PASSWORD, SEED_GMAIL_ADMIN_PASSWORD, SEED_INSTITUTE_PASSWORD in .env.
    // Falls back to weak defaults ONLY in development — never deploy with these.
    const adminPass = process.env.SEED_ADMIN_PASSWORD || '123456';
    const gmailAdminPass = process.env.SEED_GMAIL_ADMIN_PASSWORD || '123456';
    const institutePass = process.env.SEED_INSTITUTE_PASSWORD || 'password123';

    if (process.env.NODE_ENV === 'production') {
      if (!process.env.SEED_ADMIN_PASSWORD || !process.env.SEED_INSTITUTE_PASSWORD) {
        throw new Error('SEED_ADMIN_PASSWORD and SEED_INSTITUTE_PASSWORD must be set in production before seeding.');
      }
    }

    const hashedAdminPassword = await bcrypt.hash(adminPass, salt);
    const hashedGmailAdminPassword = await bcrypt.hash(gmailAdminPass, salt);
    const hashedInstitutePassword = await bcrypt.hash(institutePass, salt);

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
        type: "institute",
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
        type: "institute",
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
        type: "institute",
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
        type: "institute",
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
        type: "institute",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d106",
        name: "Lotus Valley Athletics Academy",
        email: "athletics@lotusvalley.edu",
        city: "Delhi NCR",
        state: "Delhi",
        address: "Sector 4, Dwarka",
        contactPerson: "Coach Ramesh Kalsaria",
        mobile: "+91 81234 98765",
        type: "institute",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d107",
        name: "Silver Oak Sports High",
        email: "admin@silveroakhigh.com",
        city: "Mumbai",
        state: "Maharashtra",
        address: "Malad West, Link Road",
        contactPerson: "Mr. Arijit Roy",
        mobile: "+91 79988 66554",
        type: "institute",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d108",
        name: "Shanti Asiatic School, Ahmedabad",
        email: "contact@shantiasiatic.edu.in",
        city: "Ahmedabad",
        state: "Gujarat",
        address: "Bopal, Ahmedabad",
        contactPerson: "Mr. Parth Shah",
        mobile: "+91 90088 77665",
        type: "institute",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d109",
        name: "Greenwood Sports Alliance",
        email: "alliance@greenwood.in",
        city: "Hyderabad",
        state: "Telangana",
        address: "Gachibowli, Nanakramguda",
        contactPerson: "Mr. Het Trivedi",
        mobile: "+91 80011 22334",
        type: "institute",
        status: "approved"
      },
      // 5 APPROVED SPORTS ACADEMIES (Matches former mock data exactly)
      {
        _id: "6650b2d1eb264088b036d301",
        name: "Dronacharya Cricket Academy",
        email: "contact@dronacharyacricket.in",
        city: "Ahmedabad",
        state: "Gujarat",
        address: "Navrangpura, Near Stadium Road",
        contactPerson: "Coach Devendra Prasad",
        mobile: "+91 99887 76655",
        type: "academy",
        sport: "Cricket",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d302",
        name: "Golden Boot Football Academy",
        email: "hello@goldenbootfc.com",
        city: "Mumbai",
        state: "Maharashtra",
        address: "Malad West, Link Road",
        contactPerson: "Coach Arthur Winston",
        mobile: "+91 91234 98765",
        type: "academy",
        sport: "Football",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d303",
        name: "Pinnacle Badminton Club",
        email: "play@pinnaclebadminton.com",
        city: "Hyderabad",
        state: "Telangana",
        address: "Gachibowli, Nanakramguda",
        contactPerson: "Coach Kareena Reddy",
        mobile: "+91 88776 65544",
        type: "academy",
        sport: "Badminton",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d304",
        name: "Apex Swimming Academy",
        email: "swim@apexacademy.in",
        city: "Delhi",
        state: "Delhi",
        address: "Sector 12, Dwarka",
        contactPerson: "Coach Sandeep Sharma",
        mobile: "+91 77665 54433",
        type: "academy",
        sport: "Swimming",
        status: "approved"
      },
      {
        _id: "6650b2d1eb264088b036d305",
        name: "Vanguard Athletics Academy",
        email: "run@vanguardathletics.com",
        city: "Gandhinagar",
        state: "Gujarat",
        address: "Sector 21, Vyas Circle",
        contactPerson: "Coach Mehta Sen",
        mobile: "+91 94567 12345",
        type: "academy",
        sport: "Athletics",
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
        type: "institute",
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
        type: "academy",
        sport: "Cricket",
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
        type: "academy",
        sport: "Football",
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
        type: "institute",
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
      // 1. St. Xavier's International School (6650b2d1eb264088b036d101)
      {
        studentId: "STU901XYZ1",
        name: "Rohan Sharma",
        dob: new Date("2011-05-15"),
        class: "9",
        gender: "Male",
        contact: "9898765432",
        address: "A-401, Shanti Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU101XYZ1",
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
        studentId: "STU801XYZ1",
        name: "Aarav Mehta",
        dob: new Date("2012-10-10"),
        class: "8",
        gender: "Male",
        contact: "7654321098",
        address: "Sector 12, Flat 304, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU902XYZ1",
        name: "Sneha Reddy",
        dob: new Date("2011-04-12"),
        class: "9",
        gender: "Female",
        contact: "7766554433",
        address: "Flat 102, Gachibowli Highrise",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d101"
      },
      {
        studentId: "STU802XYZ1",
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
        studentId: "STU903XYZ1",
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
        studentId: "STU102XYZ1",
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

      // 2. Delhi Public Sports Academy (6650b2d1eb264088b036d102)
      {
        studentId: "STU101XYZ2",
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
        studentId: "STU111XYZ2",
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
        studentId: "STU901XYZ2",
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
        studentId: "STU102XYZ2",
        name: "Manish Kumar",
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
        studentId: "STU801XYZ2",
        name: "Divya Teja",
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
        studentId: "STU902XYZ2",
        name: "Preeti Shenoy",
        dob: new Date("2011-06-30"),
        class: "9",
        gender: "Female",
        contact: "9123456789",
        address: "Sector 5, Flat 12, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d102"
      },

      // 3. Ryan Elite High School (6650b2d1eb264088b036d103)
      {
        studentId: "STU801XYZ3",
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
        studentId: "STU101XYZ3",
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
        studentId: "STU901XYZ3",
        name: "Arjun Rampal",
        dob: new Date("2011-12-05"),
        class: "9",
        gender: "Male",
        contact: "9991122334",
        address: "Gachibowli, Nanakramguda, Villa 8",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d103"
      },
      {
        studentId: "STU102XYZ3",
        name: "Kareena Kapoor",
        dob: new Date("2010-05-02"),
        class: "10",
        gender: "Female",
        contact: "9008812345",
        address: "B-404, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d103"
      },
      {
        studentId: "STU111XYZ3",
        name: "Saif Khan",
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

      // 4. Oakridge International Sports Hub (6650b2d1eb264088b036d104)
      {
        studentId: "STU901XYZ4",
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
        studentId: "STU801XYZ4",
        name: "Kiara Advani",
        dob: new Date("2012-10-10"),
        class: "8",
        gender: "Female",
        contact: "7654321098",
        address: "Sector 12, Flat 304, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d104"
      },
      {
        studentId: "STU101XYZ4",
        name: "Siddharth Malhotra",
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
        studentId: "STU902XYZ4",
        name: "Alia Bhatt",
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
        studentId: "STU802XYZ4",
        name: "Katrina Kaif",
        dob: new Date("2012-05-15"),
        class: "8",
        gender: "Female",
        contact: "9898765432",
        address: "A-401, Shanti Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d104"
      },

      // 5. DAV Public School, Gandhinagar (6650b2d1eb264088b036d105)
      {
        studentId: "STU801XYZ5",
        name: "Rohan Patel",
        dob: new Date("2012-05-15"),
        class: "8",
        gender: "Male",
        contact: "9898765432",
        address: "A-401, Shanti Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d105"
      },
      {
        studentId: "STU901XYZ5",
        name: "Jiya Shah",
        dob: new Date("2011-09-18"),
        class: "9",
        gender: "Female",
        contact: "8181234567",
        address: "C-501, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d105"
      },
      {
        studentId: "STU101XYZ5",
        name: "Manan Desai",
        dob: new Date("2010-05-02"),
        class: "10",
        gender: "Male",
        contact: "9008812345",
        address: "B-404, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d105"
      },
      {
        studentId: "STU902XYZ5",
        name: "Neil Nitin",
        dob: new Date("2011-06-30"),
        class: "9",
        gender: "Male",
        contact: "9123456789",
        address: "Sector 5, Flat 12, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d105"
      },
      {
        studentId: "STU102XYZ5",
        name: "Mukesh Ambani",
        dob: new Date("2010-07-28"),
        class: "10",
        gender: "Male",
        contact: "9876512345",
        address: "Sector 12, Flat 101, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d105"
      },
      {
        studentId: "STU802XYZ5",
        name: "Nita Shah",
        dob: new Date("2012-10-10"),
        class: "8",
        gender: "Female",
        contact: "7654321098",
        address: "Sector 12, Flat 304, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d105"
      },

      // 6. Lotus Valley Athletics Academy (6650b2d1eb264088b036d106)
      {
        studentId: "STU111XYZ6",
        name: "Arpit Gupta",
        dob: new Date("2009-03-24"),
        class: "11",
        gender: "Male",
        contact: "9112233445",
        address: "Malad West, Link Road, Flat 105",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d106"
      },
      {
        studentId: "STU101XYZ6",
        name: "Meera Joshi",
        dob: new Date("2010-11-19"),
        class: "10",
        gender: "Female",
        contact: "7676767676",
        address: "Malad West, Link Road, Flat 301",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d106"
      },
      {
        studentId: "STU901XYZ6",
        name: "Devansh Vyas",
        dob: new Date("2011-03-22"),
        class: "9",
        gender: "Male",
        contact: "9425012345",
        address: "Malad West, Link Road, Flat 602",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d106"
      },
      {
        studentId: "STU102XYZ6",
        name: "Gautam Adani",
        dob: new Date("2010-08-11"),
        class: "10",
        gender: "Male",
        contact: "9990011122",
        address: "Gachibowli, Nanakramguda, Villa 15",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d106"
      },
      {
        studentId: "STU801XYZ6",
        name: "Kunal Shah",
        dob: new Date("2012-01-25"),
        class: "8",
        gender: "Male",
        contact: "9988776655",
        address: "Malad West, Link Road, Flat 501",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d106"
      },

      // 7. Silver Oak Sports High (6650b2d1eb264088b036d107)
      {
        studentId: "STU801XYZ7",
        name: "Shreya Ghoshal",
        dob: new Date("2012-10-10"),
        class: "8",
        gender: "Female",
        contact: "7654321098",
        address: "Sector 12, Flat 304, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d107"
      },
      {
        studentId: "STU901XYZ7",
        name: "Arijit Roy",
        dob: new Date("2011-12-05"),
        class: "9",
        gender: "Male",
        contact: "9991122334",
        address: "Gachibowli, Nanakramguda, Villa 8",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d107"
      },
      {
        studentId: "STU101XYZ7",
        name: "Sonu Nigam",
        dob: new Date("2010-07-28"),
        class: "10",
        gender: "Male",
        contact: "9876512345",
        address: "Sector 12, Flat 101, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d107"
      },
      {
        studentId: "STU902XYZ7",
        name: "Sunidhi Chauhan",
        dob: new Date("2011-04-12"),
        class: "9",
        gender: "Female",
        contact: "7766554433",
        address: "Flat 102, Gachibowli Highrise",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d107"
      },
      {
        studentId: "STU111XYZ7",
        name: "Badshah Singh",
        dob: new Date("2009-01-30"),
        class: "11",
        gender: "Male",
        contact: "9444455555",
        address: "Sector 10, Flat 405, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d107"
      },

      // 8. Shanti Asiatic School, Ahmedabad (6650b2d1eb264088b036d108)
      {
        studentId: "STU101XYZ8",
        name: "Parth Shah",
        dob: new Date("2010-08-11"),
        class: "10",
        gender: "Male",
        contact: "9990011122",
        address: "Gachibowli, Nanakramguda, Villa 15",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d108"
      },
      {
        studentId: "STU901XYZ8",
        name: "Krisha Mehta",
        dob: new Date("2011-06-30"),
        class: "9",
        gender: "Female",
        contact: "9123456789",
        address: "Sector 5, Flat 12, Dwarka",
        taaluka: "Dwarka",
        city: "Delhi",
        pincode: "110075",
        instituteId: "6650b2d1eb264088b036d108"
      },
      {
        studentId: "STU111XYZ8",
        name: "Naman Pandya",
        dob: new Date("2009-09-09"),
        class: "11",
        gender: "Male",
        contact: "9008877665",
        address: "Gachibowli, Nanakramguda, Villa 22",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d108"
      },
      {
        studentId: "STU102XYZ8",
        name: "Hardik Pandya",
        dob: new Date("2010-05-02"),
        class: "10",
        gender: "Male",
        contact: "9008812345",
        address: "B-404, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d108"
      },
      {
        studentId: "STU902XYZ8",
        name: "Krunal Pandya",
        dob: new Date("2011-03-22"),
        class: "9",
        gender: "Male",
        contact: "9425012345",
        address: "Malad West, Link Road, Flat 602",
        taaluka: "Malad",
        city: "Mumbai",
        pincode: "400064",
        instituteId: "6650b2d1eb264088b036d108"
      },
      {
        studentId: "STU801XYZ8",
        name: "Rashmika Mandanna",
        dob: new Date("2012-09-18"),
        class: "8",
        gender: "Female",
        contact: "8181234567",
        address: "C-501, Tulip Heights, Near Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d108"
      },

      // 9. Greenwood Sports Alliance (6650b2d1eb264088b036d109)
      {
        studentId: "STU801XYZ9",
        name: "Yashvi Patel",
        dob: new Date("2012-08-20"),
        class: "8",
        gender: "Female",
        contact: "8765432109",
        address: "B-202, Radhe Bungalows, Navrangpura",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d109"
      },
      {
        studentId: "STU101XYZ9",
        name: "Het Trivedi",
        dob: new Date("2010-10-10"),
        class: "10",
        gender: "Male",
        contact: "9876543212",
        address: "Satellite, Ahmedabad",
        taaluka: "Vejalpur",
        city: "Ahmedabad",
        pincode: "380015",
        instituteId: "6650b2d1eb264088b036d109"
      },
      {
        studentId: "STU901XYZ9",
        name: "Vijay Deverakonda",
        dob: new Date("2011-11-19"),
        class: "9",
        gender: "Male",
        contact: "7766554434",
        address: "Karol Bagh",
        taaluka: "Karol Bagh",
        city: "Delhi",
        pincode: "110005",
        instituteId: "6650b2d1eb264088b036d109"
      },
      {
        studentId: "STU802XYZ9",
        name: "Samantha Ruth",
        dob: new Date("2012-02-14"),
        class: "8",
        gender: "Female",
        contact: "7766554433",
        address: "Connaught Place",
        taaluka: "New Delhi",
        city: "Delhi",
        pincode: "110001",
        instituteId: "6650b2d1eb264088b036d109"
      },
      {
        studentId: "STU102XYZ9",
        name: "Allu Arjun",
        dob: new Date("2010-01-25"),
        class: "10",
        gender: "Male",
        contact: "9456712347",
        address: "Sector 11",
        taaluka: "Gandhinagar",
        city: "Gandhinagar",
        pincode: "382011",
        instituteId: "6650b2d1eb264088b036d109"
      }
    ,
      // 15 APPROVED SPORTS ACADEMY STUDENTS (Matches former mock data exactly)
      // Dronacharya Cricket Academy (6650b2d1eb264088b036d301)
      {
        studentId: "STU901AC1",
        name: "Rohan Patel",
        dob: new Date("2011-05-15"),
        class: "9",
        gender: "Male",
        contact: "9876543210",
        address: "Navrangpura, Stadium Road",
        taaluka: "Haveli",
        city: "Ahmedabad",
        pincode: "380009",
        instituteId: "6650b2d1eb264088b036d301"
      },
      {
        studentId: "STU902AC1",
        name: "Amit Mishra",
        dob: new Date("2011-08-20"),
        class: "9",
        gender: "Male",
        contact: "9876543211",
        address: "Ghatlodia, Ahmedabad",
        taaluka: "Ghatlodia",
        city: "Ahmedabad",
        pincode: "380061",
        instituteId: "6650b2d1eb264088b036d301"
      },
      {
        studentId: "STU101AC1",
        name: "Kabir Dev",
        dob: new Date("2010-10-10"),
        class: "10",
        gender: "Male",
        contact: "9876543212",
        address: "Satellite, Ahmedabad",
        taaluka: "Vejalpur",
        city: "Ahmedabad",
        pincode: "380015",
        instituteId: "6650b2d1eb264088b036d301"
      },
      {
        studentId: "STU102AC1",
        name: "Sachin Verma",
        dob: new Date("2010-01-25"),
        class: "10",
        gender: "Male",
        contact: "9876543213",
        address: "Bodakdev, Ahmedabad",
        taaluka: "Ghatlodia",
        city: "Ahmedabad",
        pincode: "380054",
        instituteId: "6650b2d1eb264088b036d301"
      },
      // Golden Boot Football Academy (6650b2d1eb264088b036d302)
      {
        studentId: "STU903AC2",
        name: "Aditya Roy",
        dob: new Date("2011-12-05"),
        class: "9",
        gender: "Male",
        contact: "9123498765",
        address: "Andheri West",
        taaluka: "Andheri",
        city: "Mumbai",
        pincode: "400053",
        instituteId: "6650b2d1eb264088b036d302"
      },
      {
        studentId: "STU103AC2",
        name: "Neil Nitin",
        dob: new Date("2010-07-28"),
        class: "10",
        gender: "Male",
        contact: "9123498766",
        address: "Bandra West",
        taaluka: "Bandra",
        city: "Mumbai",
        pincode: "400050",
        instituteId: "6650b2d1eb264088b036d302"
      },
      {
        studentId: "STU904AC2",
        name: "Arjun Rampal",
        dob: new Date("2011-04-12"),
        class: "9",
        gender: "Male",
        contact: "9123498767",
        address: "Juhu, Mumbai",
        taaluka: "Andheri",
        city: "Mumbai",
        pincode: "400049",
        instituteId: "6650b2d1eb264088b036d302"
      },
      // Pinnacle Badminton Club (6650b2d1eb264088b036d303)
      {
        studentId: "STU801AC3",
        name: "Jiya Shah",
        dob: new Date("2012-09-18"),
        class: "8",
        gender: "Female",
        contact: "8877665544",
        address: "Banjara Hills",
        taaluka: "Khairatabad",
        city: "Hyderabad",
        pincode: "500034",
        instituteId: "6650b2d1eb264088b036d303"
      },
      {
        studentId: "STU905AC3",
        name: "Sneha Reddy",
        dob: new Date("2011-06-30"),
        class: "9",
        gender: "Female",
        contact: "8877665545",
        address: "Jubilee Hills",
        taaluka: "Khairatabad",
        city: "Hyderabad",
        pincode: "500033",
        instituteId: "6650b2d1eb264088b036d303"
      },
      {
        studentId: "STU104AC3",
        name: "Kareena Kapoor",
        dob: new Date("2010-05-02"),
        class: "10",
        gender: "Female",
        contact: "8877665546",
        address: "Gachibowli",
        taaluka: "Serilingampally",
        city: "Hyderabad",
        pincode: "500032",
        instituteId: "6650b2d1eb264088b036d303"
      },
      // Apex Swimming Academy (6650b2d1eb264088b036d304)
      {
        studentId: "STU802AC4",
        name: "Priya Patel",
        dob: new Date("2012-02-14"),
        class: "8",
        gender: "Female",
        contact: "7766554433",
        address: "Connaught Place",
        taaluka: "New Delhi",
        city: "Delhi",
        pincode: "110001",
        instituteId: "6650b2d1eb264088b036d304"
      },
      {
        studentId: "STU906AC4",
        name: "Ishaan Verma",
        dob: new Date("2011-11-19"),
        class: "9",
        gender: "Male",
        contact: "7766554434",
        address: "Karol Bagh",
        taaluka: "Karol Bagh",
        city: "Delhi",
        pincode: "110005",
        instituteId: "6650b2d1eb264088b036d304"
      },
      {
        studentId: "STU105AC4",
        name: "Kiara Advani",
        dob: new Date("2010-08-11"),
        class: "10",
        gender: "Female",
        contact: "7766554435",
        address: "Vasant Kunj",
        taaluka: "Vasant Vihar",
        city: "Delhi",
        pincode: "110070",
        instituteId: "6650b2d1eb264088b036d304"
      },
      // Vanguard Athletics Academy (6650b2d1eb264088b036d305)
      {
        studentId: "STU907AC5",
        name: "Rohan Sharma",
        dob: new Date("2011-03-22"),
        class: "9",
        gender: "Male",
        contact: "9456712345",
        address: "Sector 21",
        taaluka: "Gandhinagar",
        city: "Gandhinagar",
        pincode: "382021",
        instituteId: "6650b2d1eb264088b036d305"
      },
      {
        studentId: "STU803AC5",
        name: "Diya Sen",
        dob: new Date("2012-10-10"),
        class: "8",
        gender: "Female",
        contact: "9456712346",
        address: "Sector 8",
        taaluka: "Gandhinagar",
        city: "Gandhinagar",
        pincode: "382008",
        instituteId: "6650b2d1eb264088b036d305"
      },
      {
        studentId: "STU106AC5",
        name: "Aarav Mehta",
        dob: new Date("2010-12-05"),
        class: "10",
        gender: "Male",
        contact: "9456712347",
        address: "Sector 11",
        taaluka: "Gandhinagar",
        city: "Gandhinagar",
        pincode: "382011",
        instituteId: "6650b2d1eb264088b036d305"
      }
    ];

    const insertedStudents = await Student.insertMany(initialStudents);
    console.log("Student profiles successfully seeded into MongoDB!");

    // Seed Performance
    console.log("Seeding student physical performance history...");
    const performanceSeeds = [];

    insertedStudents.forEach((student, index) => {
      // Deterministic base scores so different students have unique-looking data
      const speedBase = 60 + (index % 25);
      const strengthBase = 58 + ((index + 3) % 25);
      const staminaBase = 62 + ((index + 7) % 20);
      const agilityBase = 60 + ((index + 12) % 25);
      const flexibilityBase = 55 + ((index + 18) % 30);
      const accuracyBase = 60 + ((index + 5) % 25);
      const enduranceBase = 58 + ((index + 9) % 25);
      const reactionBase = 60 + ((index + 14) % 25);

      const t1Speed = speedBase;
      const t1Str = strengthBase;
      const t1Stam = staminaBase;
      const t1Ag = agilityBase;
      const t1Flex = flexibilityBase;
      const t1Acc = accuracyBase;
      const t1End = enduranceBase;
      const t1React = reactionBase;
      const t1Overall = Math.round((t1Speed + t1Str + t1Stam + t1Ag + t1Flex + t1Acc + t1End + t1React) / 8);

      const t2Speed = Math.min(100, t1Speed + 5 + (index % 5));
      const t2Str = Math.min(100, t1Str + 4 + (index % 6));
      const t2Stam = Math.min(100, t1Stam + 6 + (index % 4));
      const t2Ag = Math.min(100, t1Ag + 5 + (index % 5));
      const t2Flex = Math.min(100, t1Flex + 3 + (index % 7));
      const t2Acc = Math.min(100, t1Acc + 4 + (index % 6));
      const t2End = Math.min(100, t1End + 5 + (index % 5));
      const t2React = Math.min(100, t1React + 4 + (index % 6));
      const t2Overall = Math.round((t2Speed + t2Str + t2Stam + t2Ag + t2Flex + t2Acc + t2End + t2React) / 8);

      const getFitnessLevel = (score) => {
        if (score >= 80) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 60) return "Average";
        return "Poor";
      };

      performanceSeeds.push({
        studentId: student._id,
        term: "TERM-1",
        speed: t1Speed,
        strength: t1Str,
        stamina: t1Stam,
        agility: t1Ag,
        flexibility: t1Flex,
        accuracy: t1Acc,
        endurance: t1End,
        reactionTime: t1React,
        attendance: 80 + (index % 16),
        discipline: 7 + (index % 4),
        matchPerformance: 60 + (index % 31),
        overallScore: t1Overall,
        fitnessLevel: getFitnessLevel(t1Overall),
        aiInsight: `Term-1 evaluation for ${student.name} shows baseline athletic indicators. Core strength training and flexibility routines are recommended.`
      });

      performanceSeeds.push({
        studentId: student._id,
        term: "TERM-2",
        speed: t2Speed,
        strength: t2Str,
        stamina: t2Stam,
        agility: t2Ag,
        flexibility: t2Flex,
        accuracy: t2Acc,
        endurance: t2End,
        reactionTime: t2React,
        attendance: 85 + (index % 16),
        discipline: 8 + (index % 3),
        matchPerformance: 70 + (index % 26),
        overallScore: t2Overall,
        fitnessLevel: getFitnessLevel(t2Overall),
        aiInsight: `Diagnostic evaluation for ${student.name} shows a notable performance index growth of +${t2Overall - t1Overall}% compared to TERM-1. Stamina and reaction cycles are aligned with advanced benchmarks.`
      });
    });

    if (performanceSeeds.length > 0) {
      // Fix #23: Use individual create() calls instead of insertMany() to ensure
      // pre-save hooks (if added to Performance model in future) are triggered correctly.
      for (const p of performanceSeeds) {
        await Performance.create(p);
      }
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
