require('dotenv').config({ path: __dirname + '/../.env' });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const Skill = require('../src/models/Skill');
const Project = require('../src/models/Project');
const Experience = require('../src/models/Experience');
const Certificate = require('../src/models/Certificate');
const Resume = require('../src/models/Resume');
const Message = require('../src/models/Message');
const Visitor = require('../src/models/Visitor');
const Download = require('../src/models/Download');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hariharan_portfolio');
    console.log(`[Database Connected for Seeding]: ${conn.connection.host}`);
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany(),
    Profile.deleteMany(),
    Skill.deleteMany(),
    Project.deleteMany(),
    Experience.deleteMany(),
    Certificate.deleteMany(),
    Resume.deleteMany(),
    Message.deleteMany(),
    Visitor.deleteMany(),
    Download.deleteMany(),
  ]);

  console.log('Seeding Admin User...');
  const adminUser = await User.create({
    name: process.env.ADMIN_NAME || 'Hariharan Ravikumar',
    email: process.env.ADMIN_EMAIL || 'admin@hariharan.dev',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  console.log('Seeding Profile...');
  await Profile.create({
    name: 'Hariharan Ravikumar',
    titles: [
      'Full Stack Software Engineer',
      'MERN Stack Developer',
      'React.js Specialist',
      'Node.js & Express Architect',
      'Technical Support Engineer',
    ],
    shortIntro:
      'Passionate Full Stack Developer specializing in modern JavaScript, MERN stack architectures, and high-performance, accessible digital experiences.',
    about:
      'I am Hariharan Ravikumar, an enthusiastic Full Stack Engineer dedicated to designing and developing robust web systems. With a strong foundation in modern JavaScript, React, Node.js, Express, and MongoDB, I bridge technical excellence with clean, user-centric interface design. Whether crafting responsive single-page applications or designing performant RESTful microservices, I deliver scalable and maintainable solutions.',
    careerObjective:
      'To contribute as an innovative Full Stack / Software Engineer within an agile, forward-thinking team, building impactful applications and driving business value through clean code and modern web architectures.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    socialLinks: {
      github: 'https://github.com/hariharan-ravikumar',
      linkedin: 'https://linkedin.com/in/hariharan-ravikumar',
      naukri: 'https://www.naukri.com/mnjuser/profile',
      instagram: 'https://instagram.com/hariharan',
      facebook: 'https://facebook.com/hariharan',
      portfolio: 'https://hariharan.dev',
      email: 'admin@hariharan.dev',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
    },
    stats: {
      yearsExperience: 2,
      completedProjects: 18,
      happyClients: 12,
      codeCommits: 840,
    },
    education: [
      {
        institution: 'Anna University / Regional Campus',
        degree: 'Bachelor of Engineering (B.E.)',
        field: 'Computer Science and Engineering',
        startYear: '2020',
        endYear: '2024',
        grade: 'First Class with Distinction (8.6 CGPA)',
        description:
          'Specialized in Data Structures & Algorithms, Database Management Systems, Object-Oriented Software Engineering, and Web Technologies.',
      },
      {
        institution: 'Higher Secondary School',
        degree: 'HSC (+2)',
        field: 'Computer Science & Mathematics',
        startYear: '2018',
        endYear: '2020',
        grade: '92.5%',
        description: 'Completed Higher Secondary with top honors in Computer Science and Mathematics.',
      },
    ],
    achievements: [
      {
        title: 'First Place - National Level Web Hackathon',
        organization: 'TechFest Innovate',
        year: '2023',
        description: 'Led a 4-member team to design and build a real-time collaborative workspace using React and WebSockets in 36 hours.',
      },
      {
        title: 'Open Source Contributor of the Month',
        organization: 'Community Developer Initiative',
        year: '2024',
        description: 'Contributed 15+ bug fixes and performance optimizations to popular JavaScript and React developer tooling repositories.',
      },
    ],
    strengths: [
      'Problem Solving & Clean Code Architecture',
      'End-to-End Full Stack Web Application Development',
      'Responsive Glassmorphism & Modern UI/UX Implementation',
      'REST API Design & Database Schema Optimization',
      'Cross-browser Compatibility & Performance Auditing',
      'Effective Technical Collaboration & Agile Mindset',
    ],
    languages: [
      { language: 'English', proficiency: 'Professional Working Proficiency', level: 95 },
      { language: 'Tamil', proficiency: 'Native / Bilingual', level: 100 },
    ],
  });

  console.log('Seeding Skills...');
  const skills = [
    // Frontend
    { name: 'HTML5', category: 'Frontend', proficiency: 95, icon: 'FileCode', order: 1 },
    { name: 'CSS3 / Modern Styling', category: 'Frontend', proficiency: 90, icon: 'Palette', order: 2 },
    { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 92, icon: 'Code', order: 3 },
    { name: 'React.js', category: 'Frontend', proficiency: 90, icon: 'Layers', order: 4 },
    { name: 'Redux Toolkit / Context API', category: 'Frontend', proficiency: 85, icon: 'Box', order: 5 },
    { name: 'Tailwind CSS / Glassmorphism', category: 'Frontend', proficiency: 88, icon: 'Sparkles', order: 6 },
    // Backend
    { name: 'Node.js', category: 'Backend', proficiency: 88, icon: 'Server', order: 7 },
    { name: 'Express.js', category: 'Backend', proficiency: 90, icon: 'Cpu', order: 8 },
    { name: 'RESTful API Architecture', category: 'Backend', proficiency: 92, icon: 'Network', order: 9 },
    { name: 'JWT Authentication & RBAC', category: 'Backend', proficiency: 88, icon: 'ShieldCheck', order: 10 },
    // Database
    { name: 'MongoDB & Mongoose', category: 'Database', proficiency: 88, icon: 'Database', order: 11 },
    { name: 'MySQL / Relational DBs', category: 'Database', proficiency: 80, icon: 'Table', order: 12 },
    // Tools & DevOps
    { name: 'Git', category: 'Tools', proficiency: 90, icon: 'GitBranch', order: 13 },
    { name: 'GitHub & CI/CD', category: 'Tools', proficiency: 88, icon: 'Github', order: 14 },
    { name: 'VS Code', category: 'Tools', proficiency: 95, icon: 'Terminal', order: 15 },
    { name: 'Postman', category: 'Tools', proficiency: 92, icon: 'Send', order: 16 },
    { name: 'Vercel & Railway Deployment', category: 'Tools', proficiency: 85, icon: 'Cloud', order: 17 },
  ];
  await Skill.insertMany(skills);

  console.log('Seeding Projects...');
  const projects = [
    {
      title: 'DevPulse - Full Stack Developer Career & Resume Platform',
      slug: 'devpulse-developer-career-platform',
      shortDescription:
        'A comprehensive resume management and developer portfolio engine with JWT authentication, visitor analytics, and automated contact notifications.',
      fullDescription:
        'Engineered a production-ready portfolio and resume dispatch platform featuring role-based access control, multiple downloadable categorized resumes, visitor telemetry, and multi-channel notifications (SMTP + WhatsApp alerts).',
      category: 'MERN Stack',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'JWT', 'Nodemailer', 'Tailwind CSS'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      ],
      githubLink: 'https://github.com/hariharan-ravikumar/devpulse-portfolio',
      liveDemo: 'https://hariharan.dev',
      pdfUrl: '/resumes/sample_resume.pdf',
      featured: true,
      order: 1,
    },
    {
      title: 'ShopZen - Modern MERN E-Commerce Ecosystem',
      slug: 'shopzen-modern-mern-ecommerce',
      shortDescription:
        'Full featured e-commerce application with product filtering, cart state management, checkout, order tracking, and administrative catalog controls.',
      fullDescription:
        'Built with React, Redux, Express, and MongoDB. Features secure token authentication, product reviews, payment gateway simulation, and comprehensive analytics for sales and inventory tracking.',
      category: 'Full Stack',
      technologies: ['React', 'Redux Toolkit', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
      ],
      githubLink: 'https://github.com/hariharan-ravikumar/shopzen-ecommerce',
      liveDemo: 'https://github.com/hariharan-ravikumar/shopzen-ecommerce#readme',
      pdfUrl: '',
      featured: true,
      order: 2,
    },
    {
      title: 'TaskFlow - Collaborative Agile Project Management Tool',
      slug: 'taskflow-agile-project-tool',
      shortDescription:
        'Kanban-style team productivity application with drag-and-drop task tracking, column workflows, and priority management.',
      fullDescription:
        'Responsive single-page application crafted with React and CSS animations, backed by Express REST APIs with granular project permission controls.',
      category: 'Frontend',
      technologies: ['React', 'React Beautiful DND', 'Tailwind CSS', 'Axios', 'Node.js'],
      image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
      ],
      githubLink: 'https://github.com/hariharan-ravikumar/taskflow-app',
      liveDemo: 'https://github.com/hariharan-ravikumar/taskflow-app#readme',
      pdfUrl: '',
      featured: true,
      order: 3,
    },
  ];
  await Project.insertMany(projects);

  console.log('Seeding Experiences...');
  const experiences = [
    {
      company: 'TechNovus Solutions Pvt Ltd',
      role: 'Full Stack Developer Intern',
      type: 'Internship',
      location: 'Chennai, Tamil Nadu (Hybrid)',
      startDate: 'January 2024',
      endDate: 'June 2024',
      isCurrent: false,
      responsibilities: [
        'Developed interactive React frontend modules and integrated reusable glassmorphic UI components.',
        'Engineered scalable Node.js/Express REST APIs for user profile and document workflows.',
        'Optimized MongoDB aggregate queries, reducing endpoint latency by 28%.',
        'Participated in daily agile stand-ups, code reviews, and Git feature-branch workflows.',
      ],
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'Postman'],
      certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 1,
    },
    {
      company: 'InnovateX Labs',
      role: 'Web Development & Technical Support Intern',
      type: 'Internship',
      location: 'Remote',
      startDate: 'July 2023',
      endDate: 'December 2023',
      isCurrent: false,
      responsibilities: [
        'Assisted in maintaining client web portals, resolving UI defects, and diagnosing network/API issues.',
        'Implemented responsive CSS layouts ensuring 100% mobile and tablet browser compatibility.',
        'Drafted technical support documentation and API integration guides for client onboarding.',
      ],
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'REST APIs', 'Technical Support'],
      certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 2,
    },
  ];
  await Experience.insertMany(experiences);

  console.log('Seeding Certificates...');
  const certificates = [
    {
      title: 'Full Stack Web Development (MERN)',
      issuer: 'Coursera / Meta',
      issueDate: 'May 2024',
      credentialId: 'META-MERN-892401',
      credentialUrl: 'https://coursera.org/verify/META-MERN-892401',
      imagePreview: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    },
    {
      title: 'JavaScript Algorithms and Data Structures',
      issuer: 'freeCodeCamp',
      issueDate: 'November 2023',
      credentialId: 'FCC-JS-77491',
      credentialUrl: 'https://freecodecamp.org/certification/hariharan/javascript-algorithms',
      imagePreview: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: ['JavaScript', 'Algorithms', 'Data Structures'],
    },
    {
      title: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      issueDate: 'August 2023',
      credentialId: 'FCC-RWD-12048',
      credentialUrl: 'https://freecodecamp.org/certification/hariharan/responsive-web-design',
      imagePreview: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'Grid'],
    },
  ];
  await Certificate.insertMany(certificates);

  console.log('Seeding Multiple Resumes (All 5 Categories)...');
  const dummyPdfUrl = '/resumes/sample_resume.pdf';
  const resumes = [
    {
      title: 'Full Stack Developer Resume',
      category: 'Full Stack Developer Resume',
      description:
        'Comprehensive resume highlighting full-lifecycle web development, end-to-end architectures, React frontends, Node/Express backends, and database administration.',
      fileUrl: dummyPdfUrl,
      fileName: 'Hariharan_Ravikumar_Full_Stack_Developer_Resume.pdf',
      fileSize: '194 KB',
      downloadCount: 142,
      isActive: true,
      isDefault: true,
      version: 'v2.4',
    },
    {
      title: 'MERN Stack Developer Resume',
      category: 'MERN Stack Developer Resume',
      description:
        'Tailored specifically for MERN stack roles, focusing on MongoDB schema design, Express REST microservices, React state machines, and Node server optimizations.',
      fileUrl: dummyPdfUrl,
      fileName: 'Hariharan_Ravikumar_MERN_Stack_Resume.pdf',
      fileSize: '188 KB',
      downloadCount: 98,
      isActive: true,
      isDefault: false,
      version: 'v2.3',
    },
    {
      title: 'Frontend Developer Resume',
      category: 'Frontend Developer Resume',
      description:
        'Focused on modern client-side engineering: React.js, JavaScript (ES6+), responsive CSS architectures, accessibility, and modern UI/UX design patterns.',
      fileUrl: dummyPdfUrl,
      fileName: 'Hariharan_Ravikumar_Frontend_Developer_Resume.pdf',
      fileSize: '180 KB',
      downloadCount: 84,
      isActive: true,
      isDefault: false,
      version: 'v2.1',
    },
    {
      title: 'Software Engineer Resume',
      category: 'Software Engineer Resume',
      description:
        'Emphasizes Core Computer Science principles, Data Structures & Algorithms, Object-Oriented Analysis, testing paradigms, and system design fundamentals.',
      fileUrl: dummyPdfUrl,
      fileName: 'Hariharan_Ravikumar_Software_Engineer_Resume.pdf',
      fileSize: '185 KB',
      downloadCount: 65,
      isActive: true,
      isDefault: false,
      version: 'v2.0',
    },
    {
      title: 'Technical Support Engineer Resume',
      category: 'Technical Support Engineer Resume',
      description:
        'Geared toward Technical Support, systems troubleshooting, API diagnostics, customer-facing technical issue resolution, and infrastructure debugging.',
      fileUrl: dummyPdfUrl,
      fileName: 'Hariharan_Ravikumar_Technical_Support_Resume.pdf',
      fileSize: '175 KB',
      downloadCount: 41,
      isActive: true,
      isDefault: false,
      version: 'v1.8',
    },
  ];
  await Resume.insertMany(resumes);

  console.log('Seeding Sample Messages & Analytics Visitors...');
  await Message.create({
    name: 'Priya Sharma',
    email: 'priya.sharma@techventures.in',
    phone: '+91 94433 22110',
    company: 'TechVentures India',
    subject: 'Full Stack Developer Opportunity',
    message: 'Hello Hariharan, we reviewed your projects and would love to discuss a Full Stack Engineer role at TechVentures.',
    isRead: false,
    status: 'new',
  });

  // Sample analytics visitors
  const sampleVisitors = [
    { ipHash: 'a1b2c3d4e5f60001', device: 'Desktop', browser: 'Chrome', os: 'Windows', country: 'India', city: 'Chennai', pageVisited: '/' },
    { ipHash: 'a1b2c3d4e5f60002', device: 'Mobile', browser: 'Safari', os: 'iOS', country: 'India', city: 'Bengaluru', pageVisited: '/projects' },
    { ipHash: 'a1b2c3d4e5f60003', device: 'Desktop', browser: 'Firefox', os: 'Linux', country: 'United States', city: 'San Francisco', pageVisited: '/resume' },
    { ipHash: 'a1b2c3d4e5f60004', device: 'Tablet', browser: 'Chrome', os: 'Android', country: 'India', city: 'Mumbai', pageVisited: '/skills' },
    { ipHash: 'a1b2c3d4e5f60005', device: 'Desktop', browser: 'Edge', os: 'Windows', country: 'Germany', city: 'Berlin', pageVisited: '/about' },
  ];
  await Visitor.insertMany(sampleVisitors);

  console.log('\n======================================================');
  console.log(' Seed Data successfully loaded!');
  console.log(` Admin Credentials:`);
  console.log(` Email:    ${adminUser.email}`);
  console.log(` Password: Admin@12345`);
  console.log('======================================================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
