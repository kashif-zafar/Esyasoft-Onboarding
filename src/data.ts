export type TrainingSession = {
  id: string;
  title: string;
  detail: string;
};

export type TrainingWeek = {
  n: string;
  area: string;
  title: string;
  desc: string;
  pdf: string;
  sessions: TrainingSession[];
};

export const weeks: TrainingWeek[] = [
  {
    n: '01',
    area: 'Domain Training',
    title:
      'Smart Metering & AMI',
    desc:
      'Build the foundation for smart metering, data acquisition and meter data intelligence.',
    pdf:
      '/api/pdf/week_01',

    sessions: [
      {
        id: '01-1',
        title:
          'Smart Metering & AMI',
        detail:
          'Understand smart metering, AMI, major components and the overall meter communication flow.',
      },
      {
        id: '01-2',
        title:
          'Smart Meter & Data Acquisition',
        detail:
          'Understand smart meter measurements, communication and data acquisition.',
      },
      {
        id: '01-3',
        title:
          'MDMS & Data Intelligence',
        detail:
          'Understand meter data management, validation, processing and data intelligence.',
      },
      {
        id: '01-4',
        title:
          'Smart Meters Portfolio',
        detail:
          'Review smart meter capabilities and common utility use cases.',
      },
    ],
  },

  {
    n: '02',
    area: 'Domain Training',
    title:
      'Connected Energy Systems',
    desc:
      'Explore EV charging, gas distribution, BESS, communication technologies and project delivery.',
    pdf:
      '/api/pdf/week_02',

    sessions: [
      {
        id: '02-1',
        title:
          'EV Charging & CPMS',
        detail:
          'Understand EV charging infrastructure and Charge Point Management Systems.',
      },
      {
        id: '02-2',
        title:
          'Gas Distribution Network',
        detail:
          'Understand gas distribution, metering and digital monitoring concepts.',
      },
      {
        id: '02-3',
        title:
          'BESS & Communication Technologies',
        detail:
          'Understand Battery Energy Storage Systems and connected communication technologies.',
      },
      {
        id: '02-4',
        title:
          'Project Management & Agile Practices',
        detail:
          'Understand project execution, Agile practices, sprint planning and collaboration.',
      },
    ],
  },

  {
    n: '03',
    area: 'Soft Skills',
    title:
      'Professional Effectiveness',
    desc:
      'Strengthen communication, teamwork, presentation and professional effectiveness.',
    pdf:
      '/api/pdf/week_03',

    sessions: [
      {
        id: '03-1',
        title:
          'Corporate Orientation',
        detail:
          'Understand workplace expectations and professional behaviour.',
      },
      {
        id: '03-2',
        title:
          'Communication & Professional Etiquette',
        detail:
          'Develop clear workplace communication and professional interaction.',
      },
      {
        id: '03-3',
        title:
          'Teamwork & Presentation Skills',
        detail:
          'Develop collaboration and effective presentation skills.',
      },
      {
        id: '03-4',
        title:
          'Time Management & Workplace Practices',
        detail:
          'Learn prioritization, time management and dependable workplace practices.',
      },
    ],
  },

  {
    n: '04',
    area:
      'Technical Training',
    title:
      'C# Fundamentals',
    desc:
      'Start C# with syntax, control flow, methods, collections and exception handling.',
    pdf:
      '/api/pdf/week_04',

    sessions: [
      {
        id: '04-1',
        title:
          'Programming Fundamentals & Syntax',
        detail:
          'Learn variables, data types, operators and basic C# program structure.',
      },
      {
        id: '04-2',
        title:
          'Control Structures',
        detail:
          'Practice conditions, loops and program flow.',
      },
      {
        id: '04-3',
        title:
          'Methods & Collections',
        detail:
          'Understand methods, parameters, arrays and collections.',
      },
      {
        id: '04-4',
        title:
          'Exception Handling',
        detail:
          'Understand runtime errors and exception handling.',
      },
    ],
  },

  {
    n: '05',
    area:
      'Technical Training',
    title:
      'C# & .NET',
    desc:
      'Move into object-oriented programming and the .NET application ecosystem.',
    pdf:
      '/api/pdf/week_05',

    sessions: [
      {
        id: '05-1',
        title:
          'Object-Oriented Programming',
        detail:
          'Understand classes, objects, encapsulation, inheritance, polymorphism and abstraction.',
      },
      {
        id: '05-2',
        title:
          '.NET Fundamentals',
        detail:
          'Understand the .NET runtime, projects and application execution.',
      },
      {
        id: '05-3',
        title:
          'Application Structure',
        detail:
          'Learn how application code is organized into clear responsibilities.',
      },
      {
        id: '05-4',
        title:
          'Development Practices',
        detail:
          'Review debugging, clean code and maintainable development practices.',
      },
    ],
  },

  {
    n: '06',
    area:
      'Technical Training',
    title:
      'MSSQL & Data',
    desc:
      'Build relational database fundamentals and practise SQL.',
    pdf:
      '/api/pdf/week_06',

    sessions: [
      {
        id: '06-1',
        title:
          'Database & Relational Fundamentals',
        detail:
          'Understand tables, keys, relationships and relational modelling.',
      },
      {
        id: '06-2',
        title:
          'Queries & CRUD',
        detail:
          'Practice SELECT, INSERT, UPDATE and DELETE.',
      },
      {
        id: '06-3',
        title:
          'Joins',
        detail:
          'Understand how SQL joins combine information from tables.',
      },
      {
        id: '06-4',
        title:
          'Practical Data Handling',
        detail:
          'Apply database concepts to realistic query scenarios.',
      },
    ],
  },

  {
    n: '07',
    area:
      'Technical Training',
    title:
      'MQTT Messaging',
    desc:
      'Understand messaging and publish-subscribe architecture.',
    pdf:
      '/api/pdf/week_07',

    sessions: [
      {
        id: '07-1',
        title:
          'Messaging Concepts',
        detail:
          'Understand why connected systems use messaging.',
      },
      {
        id: '07-2',
        title:
          'Publish / Subscribe Architecture',
        detail:
          'Understand brokers, publishers, subscribers and topics.',
      },
      {
        id: '07-3',
        title:
          'Communication Flow',
        detail:
          'Trace MQTT communication from publisher through broker to subscriber.',
      },
      {
        id: '07-4',
        title:
          'Integration Concepts',
        detail:
          'Connect MQTT with devices and application services.',
      },
    ],
  },

  {
    n: '08',
    area:
      'Technical Training',
    title:
      'ReactJS & Blazor',
    desc:
      'Learn component-based UI development and application interaction.',
    pdf:
      '/api/pdf/week_08',

    sessions: [
      {
        id: '08-1',
        title:
          'Component-Based Development',
        detail:
          'Understand reusable UI components and composition.',
      },
      {
        id: '08-2',
        title:
          'ReactJS Fundamentals',
        detail:
          'Understand components, props, state and events.',
      },
      {
        id: '08-3',
        title:
          'Blazor Fundamentals',
        detail:
          'Understand .NET-based interactive web UI development.',
      },
      {
        id: '08-4',
        title:
          'UI & Application Interaction',
        detail:
          'Understand forms, events and API interaction.',
      },
    ],
  },

  {
    n: '09',
    area:
      'Role-Specific Training',
    title:
      'Role Allocation & Context',
    desc:
      'Transition into your assigned role and technical or business area.',
    pdf:
      '/api/pdf/week_09',

    sessions: [
      {
        id: '09-1',
        title:
          'Role Allocation',
        detail:
          'Understand your assigned role and expected contribution.',
      },
      {
        id: '09-2',
        title:
          'Business / Technical Area Introduction',
        detail:
          'Understand the context of your assigned area.',
      },
      {
        id: '09-3',
        title:
          'Team Context',
        detail:
          'Understand team structure and collaboration.',
      },
      {
        id: '09-4',
        title:
          'Learning Expectations',
        detail:
          'Establish learning priorities and expected outcomes.',
      },
    ],
  },

  {
    n: '10',
    area:
      'Role-Specific Training',
    title:
      'Tools, Processes & Guided Learning',
    desc:
      'Learn role-specific concepts, tools and processes.',
    pdf:
      '/api/pdf/week_10',

    sessions: [
      {
        id: '10-1',
        title:
          'Role-Specific Concepts',
        detail:
          'Build the knowledge required for your assigned role.',
      },
      {
        id: '10-2',
        title:
          'Tools',
        detail:
          'Become familiar with relevant team tools.',
      },
      {
        id: '10-3',
        title:
          'Processes',
        detail:
          'Understand team workflows and working processes.',
      },
      {
        id: '10-4',
        title:
          'Guided Learning',
        detail:
          'Complete learning activities with guidance and feedback.',
      },
    ],
  },

  {
    n: '11',
    area:
      'Role-Specific Training',
    title:
      'Hands-on Practice',
    desc:
      'Move into practical exercises and assignments.',
    pdf:
      '/api/pdf/week_11',

    sessions: [
      {
        id: '11-1',
        title:
          'Hands-on Exercise 1',
        detail:
          'Apply role-specific concepts through practical work.',
      },
      {
        id: '11-2',
        title:
          'Hands-on Exercise 2',
        detail:
          'Continue practical learning with greater independence.',
      },
      {
        id: '11-3',
        title:
          'Practical Assignment',
        detail:
          'Work through a role-relevant practical assignment.',
      },
      {
        id: '11-4',
        title:
          'Review & Iteration',
        detail:
          'Review feedback and improve the completed work.',
      },
    ],
  },

  {
    n: '12',
    area:
      'Role-Specific Training',
    title:
      'Advanced Scenarios',
    desc:
      'Apply learning to advanced problems and real-world scenarios.',
    pdf:
      '/api/pdf/week_12',

    sessions: [
      {
        id: '12-1',
        title:
          'Advanced Role-Specific Learning',
        detail:
          'Explore advanced concepts relevant to the assigned role.',
      },
      {
        id: '12-2',
        title:
          'Problem Solving',
        detail:
          'Practice structured problem solving.',
      },
      {
        id: '12-3',
        title:
          'Real-World Scenarios',
        detail:
          'Work through realistic role-specific scenarios.',
      },
      {
        id: '12-4',
        title:
          'Independent Execution',
        detail:
          'Complete a scenario with reduced guidance.',
      },
    ],
  },

  {
    n: '13',
    area:
      'Role-Specific Training / Project',
    title:
      'Assessment & Transition',
    desc:
      'Consolidate learning through practical work, assessment and team transition.',
    pdf:
      '/api/pdf/week_13',

    sessions: [
      {
        id: '13-1',
        title:
          'Practical Project / Assignment',
        detail:
          'Complete a consolidated practical project or assignment.',
      },
      {
        id: '13-2',
        title:
          'Assessment',
        detail:
          'Demonstrate your understanding through evaluation.',
      },
      {
        id: '13-3',
        title:
          'Knowledge Consolidation',
        detail:
          'Review key learning and remaining gaps.',
      },
      {
        id: '13-4',
        title:
          'Transition to Assigned Team',
        detail:
          'Prepare for transition into your assigned team.',
      },
    ],
  },
];

/*
 * Explicit string[] fixes the TypeScript indexOf issue.
 */

export const allSessionIds: string[] =
  weeks.flatMap(
    (week) =>
      week.sessions.map(
        (session) =>
          String(
            session.id
          )
      )
  );