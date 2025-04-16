import { Request, Response } from 'express';
import * as path from 'path';
const { GoogleGenerativeAI } = require('@google/generative-ai');
import * as fs from 'fs';

const filePath = path.join(__dirname, 'prompt.txt'); // Ensure correct path

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMENI_API_KEY);

const dbSchema = `generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
  binaryTargets   = ["native", "darwin-arm64", "rhel-openssl-1.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model EmployeeDetails {
  id                    Int                     @id @default(autoincrement())
  firstName             String?                 @map("first_name")
  middleName            String?                 @map("middle_name")
  lastName              String?                 @map("last_name")
  gender                Int?
  birthDate             DateTime?               @map("birth_date") @db.Date
  mobileNumber          String?                 @map("mobile_number")
  alternateNumber       String?                 @map("alternate_number")
  companyEmail          String?                 @map("company_email")
  personalEmail         String?                 @map("personal_email")
  currentAddress        String?                 @map("current_address")
  permanentAddress      String?                 @map("permanent_address")
  passportNumber        String?                 @map("passport_number")
  passportValidity      String?                 @map("passport_validity")
  bloodGroup            String?                 @map("blood_group")
  photo                 String?
  empStatus             Int?                    @map("emp_status")
  location              String?
  aadharNumber          String?                 @map("aadhar_number")
  panCardNumber         String?                 @map("pan_card_number")
  height                String?
  weight                Float?
  benchOrPoc            Int?                    @map("bench_or_poc")
  benchDescription      String?                 @map("bench_description")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @default(now()) @updatedAt @map("updated_at")
  isEditable            Int?                    @default(1) @map("is_editable")
  genderRelation        MasterGender?           @relation(fields: [gender], references: [id])
  loginDetails          LoginDetails?
  employeeDetailRoles   EmployeeDetailRole[]
  employeeManagers      EmployeeManager[]       @relation("EmployeeToManager")
  managedEmployees      EmployeeManager[]       @relation("ManagerToEmployee")
  employeeResumes       EmployeeResume[]
  emergencyDetails      EmergencyDetails[]
  dailyAttendances      DailyAttendance[]
  currentCompanyDetails CurrentCompanyDetails[]
  bankDetails           BankDetails[]
  employeeProjects      EmployeeProject[]
  timesheets            Timesheet[]
  resources             Resource[]
  // continue from here
  businessUnitsHeaded   MasterBusinessUnit[]
  EmployeeBUDetails     EmployeeBUDetails[]
  FamilyDetails         FamilyDetails[]
  employeeAppraisals    Appraisal[]             @relation("EmployeeAppraisal")
  managerAppraisals     Appraisal[]             @relation("ManagerAppraisal")

  @@map("EmployeeDetails")
}

model EmployeeDetailRole {
  id                Int              @id @default(autoincrement())
  employeeDetailsId Int?             @map("employee_details_id")
  masterRoleId      Int?             @map("master_role_id")
  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @default(now()) @updatedAt @map("updated_at")
  employeeDetails   EmployeeDetails? @relation(fields: [employeeDetailsId], references: [id])
  masterRole        MasterRoles?     @relation(fields: [masterRoleId], references: [id])

  @@map("EmployeeDetailRole")
}

model EmployeeManager {
  id                Int             @id @default(autoincrement())
  employeeDetailsId Int             @map("employee_details_id")
  managerId         Int             @map("manager_id")
  isActive          Int?            @map("is_active")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @default(now()) @updatedAt @map("updated_at")
  employee          EmployeeDetails @relation("EmployeeToManager", fields: [employeeDetailsId], references: [id])
  manager           EmployeeDetails @relation("ManagerToEmployee", fields: [managerId], references: [id])

  @@map("EmployeeManager")
}

model EmployeeResume {
  id                Int             @id @default(autoincrement())
  employeeDetailsId Int             @map("employee_details_id")
  projectDetails    String?         @map("project_details")
  yearsOfExperience Float?          @map("years_of_experience")
  skills            String?
  resumeFile        String?         @map("resume_file")
  educationDetails  String?         @map("education_details")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @default(now()) @updatedAt @map("updated_at")
  employeeDetails   EmployeeDetails @relation(fields: [employeeDetailsId], references: [id])

  @@map("EmployeeResume")
}

model MasterGender {
  id        Int               @id @default(autoincrement())
  gender    String?
  createdAt DateTime          @default(now()) @map("created_at")
  updatedAt DateTime          @default(now()) @updatedAt @map("updated_at")
  employees EmployeeDetails[]

  @@map("MasterGender")
}

model MasterRoles {
  id                  Int                  @id @default(autoincrement())
  name                String?
  createdAt           DateTime             @default(now()) @map("created_at")
  updatedAt           DateTime             @default(now()) @updatedAt @map("updated_at")
  employeeDetailRoles EmployeeDetailRole[]

  @@map("MasterRoles")
}

model LoginDetails {
  id              Int             @id @default(autoincrement())
  username        String
  password        String?
  refreshToken    String?         @map("refresh_token")
  createdAt       DateTime        @default(now()) @map("created_at")
  updatedAt       DateTime        @default(now()) @updatedAt @map("updated_at")
  employeeDetails EmployeeDetails @relation(fields: [id], references: [id])

  @@map("LoginDetails")
}

model DailyAttendance {
  id                Int              @id @default(autoincrement())
  employeeDetailsId Int?             @map("employee_details_id")
  inTime            DateTime?        @map("in_time")
  outTime           DateTime?        @map("out_time")
  status            String?
  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @default(now()) @updatedAt @map("updated_at")
  employeeDetails   EmployeeDetails? @relation(fields: [employeeDetailsId], references: [id])

  @@map("DailyAttendance")
}

model EmergencyDetails {
  id                Int             @id @default(autoincrement())
  employeeDetailsId Int             @map("employee_details_id")
  personal1Name     String?         @map("personal_1_name")
  p1Contact         String?         @map("p1_contact") @db.VarChar(15)
  // p1Contact2        String?         @map("p1_contact_2") @db.VarChar(15)
  relation1         String?         @map("relation_1")
  email1            String?
  address1          String?
  personal2Name     String?         @map("personal_2_name")
  p2Contact         String?         @map("p2_contact") @db.VarChar(15)
  // p2Contact2        String?         @map("p2_contact_2") @db.VarChar(15)
  relation2         String?         @map("relation_2")
  email2            String?
  address2          String?
  // bloodGroup        String?         @map("blood_group") @db.VarChar(10)
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @default(now()) @updatedAt @map("updated_at")
  employeeDetails   EmployeeDetails @relation(fields: [employeeDetailsId], references: [id])

  @@map("EmergencyDetails")
}

model Project {
  id                   Int                 @id @default(autoincrement())
  projectName          String?             @map("project_name")
  technology           String?
  startDate            DateTime?           @map("start_date")
  endDate              DateTime?           @map("end_date")
  status               Int?
  clientName           String?             @map("client_name")
  clientId             Int?                @map("client_id")
  businessUnit         Int?                @map("business_unit")
  projectType          Int?                @map("project_type")
  currency             Int?
  billingType          Int?                @map("billing_type")
  teamSize             Int?                @default(0) @map("team_size")
  createdAt            DateTime            @default(now()) @map("created_at")
  updatedAt            DateTime            @default(now()) @updatedAt @map("updated_at")
  businessUnitRelation MasterBusinessUnit? @relation(fields: [businessUnit], references: [id])
  sowFiles             SOWFile[]
  milestones           Milestone[]
  resources            Resource[]
  employeeProjects     EmployeeProject[]
  timesheets           Timesheet[]
  client               ClientDetails?      @relation(fields: [clientId], references: [id])
  ProjectHistory       ProjectHistory[]

  @@map("Project")
}

model SOWFile {
  id               Int       @id @default(autoincrement())
  projectId        Int       @map("project_id")
  uploadedDate     DateTime? @map("uploaded_date")
  originalFilename String?   @map("original_filename") @db.VarChar(255)
  filename         String?   @db.VarChar(255)
  filesize         Float?
  description      String?
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @default(now()) @updatedAt @map("updated_at")
  project          Project   @relation(fields: [projectId], references: [id])

  @@map("SOWFile")
}

model Milestone {
  id             Int       @id @default(autoincrement())
  name           String?
  projectId      Int?      @map("project_id")
  amount         Float?
  completionDate DateTime? @map("completion_date")
  description    String?
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @default(now()) @updatedAt @map("updated_at")
  project        Project?  @relation(fields: [projectId], references: [id])

  @@map("Milestone")
}

model Resource {
  id            Int              @id @default(autoincrement())
  employeeId    Int?             @map("employee_id")
  projectId     Int?             @map("project_id")
  roleExpertise String?          @map("role_expertise")
  weeklyHours   Int?             @map("weekly_hours")
  durationType  Int?             @map("duration_type")
  cost          Int?
  isBillable    Boolean          @default(true) @map("is_billable")
  createdAt     DateTime         @default(now()) @map("created_at")
  updatedAt     DateTime         @default(now()) @updatedAt @map("updated_at")
  employee      EmployeeDetails? @relation(fields: [employeeId], references: [id])
  project       Project?         @relation(fields: [projectId], references: [id])

  @@map("Resource")
}

model EmployeeProject {
  id             Int              @id @default(autoincrement())
  employeeId     Int?             @map("employee_id")
  projectId      Int?             @map("project_id")
  assignedDate   DateTime?        @map("assigned_date")
  unassignedDate DateTime?        @map("unassigned_date")
  isBillable     Boolean?         @map("is_billable")
  role           String?
  cost           Int?
  durationType   Int?             @map("duration_type")
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @default(now()) @updatedAt @map("updated_at")
  employee       EmployeeDetails? @relation(fields: [employeeId], references: [id])
  project        Project?         @relation(fields: [projectId], references: [id])

  @@map("EmployeeProject")
}

model CurrentCompanyDetails {
  id                  Int                 @id @default(autoincrement())
  employeeDetailsId   Int?                @map("employee_details_id")
  currentCtc          Int?                @map("current_ctc")
  joiningDate         DateTime?           @map("joining_date") @db.Date
  designationMasterId Int?                @map("designation_master_id")
  // departmentMasterId  Int?                @map("department_master_id")
  department          String?
  nextRaiseDate       DateTime?           @map("next_raise_date")
  releaseDate         DateTime?           @map("release_date")
  experienceSkills    String?             @map("experience_skills")
  otherSkills         String?             @map("other_skills")
  yearsOfExperience   Float?              @map("years_of_experience")
  certifications      String?
  resumeFileName      String?             @map("resume_file_name")
  employeeTypeId      Int?                @map("employee_type_id")
  createdAt           DateTime            @default(now()) @map("created_at")
  updatedAt           DateTime            @default(now()) @updatedAt @map("updated_at")
  employeeDetails     EmployeeDetails?    @relation(fields: [employeeDetailsId], references: [id])
  designationMaster   DesignationMaster?  @relation(fields: [designationMasterId], references: [id])
  // departmentMaster    DepartmentMaster?   @relation(fields: [departmentMasterId], references: [id])
  employeeType        MasterEmployeeType? @relation(fields: [employeeTypeId], references: [id])

  @@map("CurrentCompanyDetails")
}

model BankDetails {
  id                Int              @id @default(autoincrement())
  employeeDetailsId Int?             @map("employee_details_id")
  accountHolderName String?          @map("account_holder_name")
  accountNumber     String?          @map("account_number")
  bankName          String?          @map("bank_name")
  // panCardNumber     String?          @map("pan_card_number")
  aadharCardNumber  String?          @map("aadhar_card_number")
  bankIfscCode      String?          @map("bank_ifsc_code")
  accountType       String?          @map("account_type")
  uanNumber         String?          @map("uan_number")
  pfNumber          String?          @map("pf_number")
  esicNumber        String?          @map("esic_number")
  bankAccountBranch String?          @map("bank_account_branch")
  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @default(now()) @updatedAt @map("updated_at")
  employeeDetails   EmployeeDetails? @relation(fields: [employeeDetailsId], references: [id])

  @@map("BankDetails")
}

model DesignationMaster {
  id                    Int                     @id @default(autoincrement())
  designation           String?                 @db.VarChar(60)
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @default(now()) @updatedAt @map("updated_at")
  currentCompanyDetails CurrentCompanyDetails[]

  @@map("DesignationMaster")
}

model DepartmentMaster {
  id             Int      @id @default(autoincrement())
  departmentName String?  @map("department_name") @db.VarChar(20)
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @default(now()) @updatedAt @map("updated_at")
  // currentCompanyDetails CurrentCompanyDetails[]

  @@map("DepartmentMaster")
}

model MasterBusinessUnit {
  id                         Int                 @id @default(autoincrement())
  businessUnitName           String?             @map("business_unit_name") @db.VarChar(50)
  businessUnitHeadEmployeeId Int?                @map("business_unit_head_employee_id")
  createdAt                  DateTime            @default(now()) @map("created_at")
  updatedAt                  DateTime            @default(now()) @updatedAt @map("updated_at")
  businessUnitHead           EmployeeDetails?    @relation(fields: [businessUnitHeadEmployeeId], references: [id])
  projects                   Project[]
  employeeBUDetails          EmployeeBUDetails[]

  @@map("MasterBusinessUnit")
}

model MasterEmployeeType {
  id                    Int                     @id @default(autoincrement())
  employeeTypeName      String?                 @map("employee_type_name") @db.VarChar(50)
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @default(now()) @updatedAt @map("updated_at")
  currentCompanyDetails CurrentCompanyDetails[]

  @@map("MasterEmployeeType")
}

model EmployeeBUDetails {
  id                           Int                 @id @default(autoincrement())
  employeeDetailsId            Int?                @map("employee_details_id")
  employeeMasterBusinessUnitId Int?                @map("employee_master_business_unit_id")
  percentage                   Int?
  createdAt                    DateTime            @default(now()) @map("created_at")
  updatedAt                    DateTime            @default(now()) @updatedAt @map("updated_at")
  employeeDetails              EmployeeDetails?    @relation(fields: [employeeDetailsId], references: [id])
  masterBusinessUnit           MasterBusinessUnit? @relation(fields: [employeeMasterBusinessUnitId], references: [id])

  @@map("EmployeeBUDetails")
}

model Timesheet {
  id             Int              @id @default(autoincrement())
  employeeId     Int?             @map("employee_id")
  projectId      Int?             @map("project_id")
  // isRegularization Int?             @map("is_regularization")
  taskType       Int?             @map("task_type")
  date           DateTime?
  timeTaken      Int?             @map("time_taken")
  description    String?
  blocker        String?
  verifiedStatus Int?             @default(0) @map("verified_status")
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @default(now()) @updatedAt @map("updated_at")
  employee       EmployeeDetails? @relation(fields: [employeeId], references: [id])
  project        Project?         @relation(fields: [projectId], references: [id])

  @@map("Timesheet")
}

model Holiday {
  id        Int      @id @default(autoincrement())
  name      String?
  date      DateTime @db.Date
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("Holiday")
}

model FamilyDetails {
  id                Int              @id @default(autoincrement())
  employeeDetailsId Int?             @map("employee_details_id")
  spouseName        String?          @map("spouse_name") @db.VarChar(50)
  spouseContact     String?          @map("spouse_contact") @db.VarChar(15)
  spouseEmail       String?          @map("spouse_email")
  spouseDob         DateTime?        @map("spouse_dob") @db.Date
  childrenCount     Int?             @map("children_count")
  childName1        String?          @map("child_name_1") @db.VarChar(50)
  childDob1         DateTime?        @map("child_dob_1") @db.Date
  childName2        String?          @map("child_name_2") @db.VarChar(50)
  childDob2         DateTime?        @map("child_dob_2") @db.Date
  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @default(now()) @updatedAt @map("updated_at")
  employee          EmployeeDetails? @relation(fields: [employeeDetailsId], references: [id])

  @@map("FamilyDetails")
}

model ClientDetails {
  id        Int       @id @default(autoincrement())
  name      String?
  email     String?
  contact   String?
  company   String?
  website   String?
  address   String?
  country   String?
  state     String?
  status    Int?
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @default(now()) @updatedAt @map("updated_at")
  projects  Project[]

  @@map("ClientDetails")
}

model ProjectHistory {
  id        Int      @id @default(autoincrement())
  projectId Int      @map("project_id")
  action    Int
  date      DateTime @default(now())
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")
  project   Project? @relation(fields: [projectId], references: [id])
}

model AppraisalCycle {
  id          Int         @id @default(autoincrement())
  startDate   DateTime?   @map("start_date")
  endDate     DateTime?   @map("end_date")
  phase1Start DateTime?   @map("phase_1_start")
  phase1End   DateTime?   @map("phase_1_end")
  phase2Start DateTime?   @map("phase_2_start")
  phase2End   DateTime?   @map("phase_2_end")
  phase3Start DateTime?   @map("phase_3_start")
  phase3End   DateTime?   @map("phase_3_end")
  year        Int?
  half        Int?
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @default(now()) @updatedAt @map("updated_at")
  appraisals  Appraisal[]

  @@map("AppraisalCycle")
}

model PredefinedGoal {
  id        Int      @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("PredefinedGoal")
}

model Skill {
  id              Int              @id @default(autoincrement())
  name            String
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @default(now()) @updatedAt @map("updated_at")
  appraisalSkills AppraisalSkill[]

  @@map("Skill")
}

model Appraisal {
  id               Int              @id @default(autoincrement())
  employeeId       Int              @map("employee_id")
  managerId        Int              @map("manager_id")
  appraisalCycleId Int              @map("appraisal_cycle_id")
  status           Int
  selfRatingStatus Int              @default(0) @map("self_rating_status")
  finalRating      Float?           @map("final_rating")
  goalsFinalized   Boolean?         @default(false) @map("goals_finalized")
  promotion        Boolean?
  promotionReason  String?          @map("promotion_reason")
  remark           String?
  createdAt        DateTime         @default(now()) @map("created_at")
  updatedAt        DateTime         @default(now()) @updatedAt @map("updated_at")
  employee         EmployeeDetails  @relation("EmployeeAppraisal", fields: [employeeId], references: [id])
  manager          EmployeeDetails  @relation("ManagerAppraisal", fields: [managerId], references: [id])
  appraisalCycle   AppraisalCycle   @relation(fields: [appraisalCycleId], references: [id])
  AppraisalGoals   AppraisalGoal[]
  AppraisalSkills  AppraisalSkill[]

  @@map("Appraisal")
}

model AppraisalGoal {
  id              Int       @id @default(autoincrement())
  appraisalId     Int       @map("appraisal_id")
  name            String
  weight          Int
  employeeRating  Int?      @map("employee_rating")
  managerRating   Int?      @map("manager_rating")
  employeeComment String?   @map("employee_comment")
  managerComment  String?   @map("manager_comment")
  finalRating     Int?      @map("final_rating")
  finalComment    String?   @map("final_comment")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @default(now()) @updatedAt @map("updated_at")
  appraisal       Appraisal @relation(fields: [appraisalId], references: [id])

  @@map("AppraisalGoal")
}

model AppraisalSkill {
  id              Int       @id @default(autoincrement())
  appraisalId     Int       @map("appraisal_id")
  skillId         Int       @map("skill_id")
  employeeRating  Int?      @map("employee_rating")
  managerRating   Int?      @map("manager_rating")
  employeeComment String?   @map("employee_comment")
  managerComment  String?   @map("manager_comment")
  finalRating     Int?      @map("final_rating")
  finalComment    String?   @map("final_comment")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @default(now()) @updatedAt @map("updated_at")
  appraisal       Appraisal @relation(fields: [appraisalId], references: [id])
  skill           Skill     @relation(fields: [skillId], references: [id])

  @@map("AppraisalSkill")
}

  `;

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: `You are a senior software developer. Set temperature to 0. Here is the PostgreSQL DB Schema: ${dbSchema}`,
});

export class GptController {
  async getGeminiData(req: Request, res: Response) {
    try {
      const prompt = req.body.prompt;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const finalPrompt = `${fs.readFileSync(filePath, 'utf8')}\n${prompt}`;
      const result = await model.generateContent(finalPrompt);
      const rawString = result.response.text().trim();

      //   Remove code block markers
      const cleanedString = rawString.replace(/^```json\n|\n```$/g, '');
      let gptData;

      try {
        gptData = JSON.parse(cleanedString);
      } catch (error) {
        return res.status(500).json({ error: 'Invalid JSON response from AI' });
      }

      let dbResponse: any = '';

      if (gptData.query) {
        const queryData = await prisma?.$queryRawUnsafe(gptData.query);
        dbResponse = {
          data: queryData,
          type: gptData.type,
          description: gptData.description,
        };
      } else if (gptData.message) {
        dbResponse = gptData.message;
      }

      return res.json({
        data: JSON.parse(
          JSON.stringify(dbResponse, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          )
        ),
      });
      return res.json({
        message: rawString,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async executeQuery(query: string) {
    try {
      return await prisma?.$queryRawUnsafe(query);
    } catch (error) {
      console.error('Database query error:', error);
      return { error: 'Invalid or unsafe query' };
    }
  }
}
