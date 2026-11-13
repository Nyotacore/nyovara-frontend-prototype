# Database design (SQL Server / EF Core)

The demo collections map 1:1 to the PRD Part 21 tables. Every tenant row carries an `OrganisationId`.

| Area | Tables (demo collection) |
|---|---|
| Identity | Users (users), Roles (roles), Permissions, UserRoles, OrganisationUsers, UserSessions (loginHistory) |
| Organisation | Organisations, OrganisationSettings (orgSettings), Departments, Locations, Subscriptions, OrganisationReferenceData (reference) |
| Crew | CrewMembers (crew), CrewNextOfKin and CrewChildren (crew.nextOfKin / crew.children → separate tables), CrewAttachments, CrewCertificates (certificates), CrewMedicalRecords (medical), CrewTravelDocuments (travelDocs), CrewEmploymentHistory (employment), CrewSeaService (seaService), CrewContracts (contracts), CrewStatusHistory (crew.history), CrewCompensation (compensation) |
| Recruitment | JobVacancies, JobApplications, CandidateEvaluations (applications.reviews), Interviews, RecruitmentApprovals (applications.approvals) |
| Vessel | Vessels, VesselAssignments, CrewChanges, Voyages, PortCalls, VesselDocuments, VesselEvents |
| Rest hours | WorkingArrangements, RestHourRecords, RestHourPeriods (record.work), RestHourReviews (record.reviews), RestHourRuleVersions (restRules), RestHourLocks (restLocks), RestHourSyncLogs (syncLog) |
| Welfare | WelfareCheckIns, WelfareCheckInResponses, WelfareCases (welfareRequests), WelfareComplaints, WelfareIncidents, WelfareCaseUpdates (updates) |
| Training | TrainingCourses, TrainingAssignments, TrainingRecords, CompetencyAssessments, PerformanceAppraisals |
| Payroll | WageStructures, PayrollPeriods, PayrollTransactions (payslips), PayrollDeductions (deductionLines), CrewAllotments, CrewPayments, CrewExpenses |
| System | Notifications, AuditLogs (audit), FileAttachments, ApprovalWorkflows, WorkflowStages |

## Rules
- Store money as `decimal(18,2)`.
- Store system events as UTC `datetime2`. Rest records keep the ship's local zone and clock adjustment separately.
- Add a unique index on (OrganisationId, EmployeeCode) and on Vessels.IMO.
- Use soft delete (`IsArchived`) for historical records.
- Run multi-record operations (crew-change completion, payroll approval) in a transaction.
