# SharedCalendar 
**Work in Progress**

Webapp to handle social scheduling with others

## Motivation
As my schedule gets busier, I would like to keep track of it easily. 
While there are existing apps with these functionalities already, why not create one and see how it goes?

## Security
As an infosec undergraduate, I will be focusing more on the security aspects of this webapp.
In particular, I will be practising the Secure Software Development Life Cycle:
1. Planning
2. Architecture & Design
3. Implementation
4. Testing / Bug Fixing
5. Maintenance 

### Planning
Purpose: To create a webapp which allows users to manage their schedules with their partner. 

Users can form groups which they can then add their events to keep everyone up to date.
The webapp should be secure against common web vulnerabilites, with reference to the OWASP Top 10.

### Architecture & Design
To emulate a real web application, I will be splitting the development of frontend and backend. 

Tech Stack: ReactJS (Frontend), Django (Backend), Firebase (Hosting w Database)

As such, the languages used is primarily TypeScript and Python.

For DevSecOps, Github Actions will be the primary deliverer. CodeQL is a SAST tool developed by Github and will be used to check vulnerabilities in the code.
Gitleaks will also be used to ensure that no secrets are leaked on the repo.

### TODO
1. Implement Login and Users
2. Start writing unittests