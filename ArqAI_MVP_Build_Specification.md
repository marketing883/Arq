# ArqAI Foundry - MVP Build Specification

## 1. Objective
To build a fully functional, single-tenant MVP of the ArqAI Foundry. This build will prove the integrated, real-world operation of its three core pillars: the Compliance-Aware Prompt Compiler (CAPC), Trust-Aware Agent Orchestration (TAO), and Observability-Driven Adaptive RAG (ODA-RAG). All features described herein are to be implemented as working software with no simulation.

## 2. Core Use Case
The MVP will focus on a single, high-value agent blueprint: the **"SME Loan Pre-Qualifier."** This agent will perform the following actions:
1.  Analyze an uploaded document (a bank statement).
2.  Extract key financial data from the document.
3.  Apply user-defined business logic to render a decision ("Auto-Approve" or "Flag for Review").
4.  Adhere to user-defined compliance policies.
5.  Undergo a real-time quality score assessment.
6.  Execute the entire process within a secure, auditable transaction framework.

## 3. Technology Stack
*   **Frontend:** React (with Next.js)
*   **Backend:** Python (with FastAPI)
*   **Database:** PostgreSQL
*   **ORM:** SQLAlchemy (with Alembic for migrations)
*   **Authentication:** JWT-based for user sessions.

## 4. Database Schema (PostgreSQL)
The following tables define the complete data model for the Foundry.

```sql
-- For user management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- For high-level agent definition and configuration
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    blueprint_type VARCHAR(50) NOT NULL, -- e.g., 'DocumentAnalysisDecision'
    config_json JSONB, -- Stores the agent's skill configurations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- For defining compliance/business rules
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- e.g., 'KEYWORD_MUST_CONTAIN', 'NATURAL_LANGUAGE_CHECK'
    content TEXT NOT NULL -- The actual rule value or instruction
);

-- Many-to-many relationship between agents and policies
CREATE TABLE agent_policies (
    agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    PRIMARY KEY (agent_id, policy_id)
);

-- For the TAO pillar: single-use capability tokens
CREATE TABLE issued_tokens (
    id SERIAL PRIMARY KEY,
    token_string VARCHAR(255) UNIQUE NOT NULL,
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE, -- NULL if not used yet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- For the TAO pillar: the immutable log
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id),
    agent_id INTEGER REFERENCES agents(id),
    token_id INTEGER REFERENCES issued_tokens(id),
    level VARCHAR(10) NOT NULL, -- 'INFO', 'AUDIT', 'ERROR'
    message TEXT NOT NULL
);

-- For the ODA-RAG pillar: logging agent performance
CREATE TABLE agent_runs (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILURE'
    input_data JSONB,
    final_output TEXT,
    quality_score REAL, -- 0.0 to 100.0
    quality_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

```

## 5. Backend API & Core Logic (FastAPI)
All endpoints must be fully implemented as described.

#### User Authentication (`/auth`)
*   `/auth/register` (POST): Creates a new user in the `users` table.
*   `/auth/login` (POST): Authenticates a user, returns a standard JWT for session management.

#### Policy Management (`/policies`)
*   `GET /`: Fetches all policies.
*   `POST /`: Creates a new policy in the `policies` table.
*   `PUT /{policy_id}`: Updates a policy.

#### Agent Management (`/agents`)
*   `GET /`: Lists all agents for the authenticated user.
*   `POST /`: Creates a new agent record. The request body will contain `name`, `description`, `blueprint_type`.
*   `GET /{agent_id}`: Retrieves the full agent configuration, including its associated policies.
*   `PUT /{agent_id}`: Updates the agent's configuration (name, description, `config_json`, and attached policies). This is called when the user saves in the builder UI.

#### Agent Execution (TAO, CAPC, ODA-RAG Integration)
This is the core operational flow.

*   **`POST /agents/{agent_id}/issue-token`**
    1.  **Requires:** Authenticated user session.
    2.  **Action:** Creates a new, unique, un-used token in the `issued_tokens` table with a 5-minute expiry, linked to the `user_id` and `agent_id`.
    3.  **Log:** Writes an `AUDIT` message to `audit_logs` ("Token issued for Agent X by User Y").
    4.  **Returns:** The `token_string`.

*   **`POST /agents/{agent_id}/run`**
    1.  **Requires:** Authenticated user session AND a valid `X-Agent-Token` in the header.
    2.  **TAO: Verification.**
        *   Find the token in `issued_tokens`.
        *   Verify it exists, is not expired, and `used_at` is NULL.
        *   If invalid, return 403 Forbidden and log an `ERROR`.
        *   Immediately set `used_at = CURRENT_TIMESTAMP` to prevent reuse.
        *   Log an `AUDIT` message ("Token validated and consumed").
    3.  **Agent Logic Execution:**
        *   Load the agent's `config_json` from the `agents` table.
        *   Execute the "Skills" from the config (e.g., call an LLM to extract data from the request's input file).
        *   Execute the "Decision Logic" from the config to get a `raw_output`.
    4.  **CAPC: Validation.**
        *   Load all associated policies for the `agent_id` from the `agent_policies` table.
        *   For each policy, run a validation check against the `raw_output`. Log each check to `audit_logs`.
        *   If any check fails, stop, log the failure to `agent_runs`, and return an error. The `final_output` is the validated `raw_output`.
    5.  **ODA-RAG: Scoring.**
        *   Make a **second LLM call** to a scoring model. The prompt will include the `final_output` and the descriptions of the policies it was meant to follow.
        *   The scoring LLM will return a JSON object with `score` and `reasoning`. Parse this response.
    6.  **Finalize.**
        *   Save the complete record (input, output, score, etc.) to the `agent_runs` table with status `SUCCESS`.
        *   Log a final `INFO` message to `audit_logs`.
        *   Return the `final_output`, `quality_score`, and `quality_reasoning`.

#### Data Retrieval
*   `GET /agents/{agent_id}/logs`: Fetches all logs from `audit_logs` for a given agent.
*   `GET /agents/{agent_id}/runs`: Fetches the history of all runs from the `agent_runs` table.

## 6. Frontend Specification (React/Next.js)
The frontend must provide a UI for all backend functionality.

*   **Authentication:** Login and registration pages. All API calls must include the user session JWT.
*   **Dashboard (`/`):** Lists agents owned by the user. Links to the builder and operations center for each.
*   **Policy Hub (`/policies`):** A full CRUD interface for the `policies` table.
*   **Agent Builder (`/build/{agent_id}`):** The four-step linear builder UI. Each step will have a "Save" button that calls the `PUT /agents/{agent_id}` endpoint to update the `config_json` and associated policies.
*   **Operations Center (`/operate/{agent_id}`):**
    1.  **On Page Load:** Automatically call `POST /agents/{agent_id}/issue-token` and store the received TAO token in the component's state.
    2.  **"Run Agent" Button:** Triggers the `POST /agents/{agent_id}/run` call, sending the input data and the TAO token in the header.
    3.  **Data Display:** The three panels (Interaction, Audit Log, Quality Score) will display the data returned from the `/run` endpoint. The Audit Log and a "Run History" panel will also periodically fetch from `/logs` and `/runs` to stay up-to-date.
