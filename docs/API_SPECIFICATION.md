# API specification (v1)

Each `N.db` call in the prototype becomes a REST call:

- `/api/v1/auth`
- `/api/v1/organisations`
- `/api/v1/users`
- `/api/v1/crew` and `/api/v1/crew/{id}/(next-of-kin|children|documents|certificates|travel-documents|employment|sea-service)`
- `/api/v1/recruitment/(vacancies|applications)`
- `/api/v1/vessels` and `/api/v1/vessels/{id}/crew`
- `/api/v1/voyages`
- `/api/v1/crew-planning`
- `/api/v1/crew-changes`
- `/api/v1/rest-hours/(records|reviews|reports)`
- `/api/v1/welfare/(cases|complaints|incidents)`
- `/api/v1/training/(courses|assignments)`
- `/api/v1/payroll/(periods|payments)`
- `/api/v1/reports`
- `/api/v1/notifications`
- `/api/v1/settings`

Every endpoint must enforce authentication, organisation scope and permissions, and validate on the server. Never trust frontend values for authorisation, financial results or compliance decisions.

Rest-hours sync accepts a batch of `{recordKey, payload, eventTimestamp, baseVersion}` and returns, per item, one of `synced | duplicate | conflict`, together with the server receipt time.
