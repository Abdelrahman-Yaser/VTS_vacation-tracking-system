# Vacation Tracking System (VTS)
## Enterprise System Design Document

---

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. System Overview](#2-system-overview)
- [3. System Architecture](#3-system-architecture)
- [4. Database Design](#4-database-design)
- [5. API Design](#5-api-design)
- [6. Business Logic & Workflows](#6-business-logic--workflows)
- [7. Security Architecture](#7-security-architecture)
- [8. Non-Functional Requirements](#8-non-functional-requirements)
- [9. Deployment Strategy](#9-deployment-strategy)
- [10. Monitoring & Observability](#10-monitoring--observability)
- [11. Testing Strategy](#11-testing-strategy)
- [12. Future Roadmap](#12-future-roadmap)

---

## 1. Executive Summary

### 1.1 Project Overview

The **Vacation Tracking System (VTS)** is an enterprise-grade, role-based leave management platform designed to automate and streamline employee vacation requests, approvals, and tracking across organizations.

### 1.2 Business Objectives

| Objective | Impact | Metric |
|-----------|--------|--------|
| **Reduce Administrative Overhead** | Eliminate manual paperwork | 80% reduction in processing time |
| **Improve Approval Efficiency** | Automated workflows | < 24 hours average approval time |
| **Ensure Compliance** | Real-time validation | 100% policy adherence |
| **Enhance Transparency** | Complete audit trail | Full visibility of all actions |
| **Enable Analytics** | Data-driven decisions | Monthly reports & insights |

### 1.3 Target Users

| Role | % of Users | Primary Use Cases |
|------|------------|-------------------|
| **Employees** | 80% | Submit, track, and manage leave requests |
| **Managers** | 15% | Review and approve team leave requests |
| **HR Staff** | 4% | Final approvals, policy management, reporting |
| **System Admins** | 1% | System configuration, user management |

### 1.4 Key Performance Indicators

```
Target Metrics:
├── Response Time: < 2 seconds (95th percentile)
├── Availability: 99.5% uptime SLA
├── Scalability: 1,000+ concurrent users
├── Security: SOC 2 Type II compliance-ready
└── User Satisfaction: > 4.5/5.0 rating
```

---

## 2. System Overview

### 2.1 Core Features

#### **For Employees** 👤
- ✅ Submit leave requests with date range and reason
- ✅ View real-time leave balance
- ✅ Track request status (pending, approved, rejected)
- ✅ Edit or cancel pending requests
- ✅ Receive notifications for all status changes
- ✅ View leave history and calendar
- ✅ Export leave records

#### **For Managers** 👔
- ✅ Review team leave requests
- ✅ Approve or reject with mandatory comments
- ✅ Grant bonus/reward leave days (within policy limits)
- ✅ View team availability calendar
- ✅ Receive alerts for pending approvals
- ✅ Generate team reports
- ✅ Delegate approval authority

#### **For HR Staff** 🏢
- ✅ Final approval authority
- ✅ Manage leave policies and balances
- ✅ Override decisions with audit logging
- ✅ Generate organization-wide reports
- ✅ Manage public holidays
- ✅ Configure system policies
- ✅ Export payroll data

#### **For System Admins** ⚙️
- ✅ User and role management
- ✅ System configuration
- ✅ Access control management
- ✅ Audit log review
- ✅ System health monitoring
- ✅ Backup and recovery

### 2.2 Leave Types Supported

| Leave Type | Description | Balance Rules |
|------------|-------------|---------------|
| **Annual Leave** | Standard vacation days | Accrued yearly, carry-over optional |
| **Sick Leave** | Medical/health-related | Separate balance, may require documentation |
| **Exceptional Leave** | Emergency situations | Requires justification, HR approval |
| **Unpaid Leave** | Extended time off | No balance required, affects payroll |
| **Compensatory Leave** | Overtime compensation | Granted for extra work hours |
| **Reward Leave** | Manager-granted bonus | Limited quota per manager |

### 2.3 System Boundaries

**In Scope:**
- Leave request management
- Multi-level approval workflows
- Leave balance tracking
- Notifications and alerts
- Reporting and analytics
- Audit logging

**Out of Scope (Phase 1):**
- Payroll calculation
- Time tracking
- Performance management
- Recruitment
- Training management

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React/Next.js)  │  Mobile App (React Native/Flutter) │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Load Balancer                 │
│                    (Nginx / AWS ALB / Cloudflare)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐        │
│  │   Auth      │  │   Leave      │  │  Notification  │        │
│  │  Service    │  │   Service    │  │    Service     │        │
│  └─────────────┘  └──────────────┘  └────────────────┘        │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐        │
│  │  Employee   │  │   Approval   │  │    Report      │        │
│  │  Service    │  │   Service    │  │    Service     │        │
│  └─────────────┘  └──────────────┘  └────────────────┘        │
│                                                                 │
│              Backend: Node.js + NestJS / Express               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │    Redis     │  │     S3       │         │
│  │  (Primary)   │  │   (Cache)    │  │  (Storage)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │  PostgreSQL  │  │    Bull      │                           │
│  │  (Replica)   │  │   (Queue)    │                           │
│  └──────────────┘  └──────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
├─────────────────────────────────────────────────────────────────┤
│  Email (SendGrid/SES)  │  SMS (Twilio)  │  Monitoring (Sentry) │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

#### **Frontend**
```
Framework: Next.js 14 (React 18)
Language: TypeScript
UI Library: Tailwind CSS + shadcn/ui
State Management: Zustand / React Query
Forms: React Hook Form + Zod
Charts: Recharts / Chart.js
Testing: Jest + React Testing Library
```

#### **Backend**
```
Framework: NestJS (Node.js)
Language: TypeScript
ORM: TypeORM
Validation: class-validator + class-transformer
Authentication: Passport.js (JWT Strategy)
Documentation: Swagger / OpenAPI
Testing: Jest + Supertest
```

#### **Database**
```
Primary: PostgreSQL 15+
Cache: Redis 7+
Queue: Bull (Redis-based)
Storage: AWS S3 / MinIO
```

#### **DevOps**
```
Containerization: Docker + Docker Compose
CI/CD: GitHub Actions / GitLab CI
Hosting: AWS / DigitalOcean / Railway
Monitoring: Sentry + DataDog / New Relic
Logging: Winston + ELK Stack
```

### 3.3 Architecture Patterns

- **Layered Architecture**: Separation of concerns (Controller → Service → Repository)
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling and testability
- **Event-Driven**: Async notifications and audit logging
- **CQRS (Light)**: Separate read/write models for complex queries

---

## 4. Database Design

### 4.1 Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│    employees    │
├─────────────────┤
│ id (PK)         │───┐
│ employee_number │   │
│ first_name      │   │
│ last_name       │   │
│ email (unique)  │   │
│ password_hash   │   │
│ role            │   │
│ department_id   │   │
│ manager_id (FK) │───┘ (self-referencing)
│ hire_date       │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ↓
┌─────────────────┐       ┌─────────────────┐
│ leave_requests  │       │ leave_balances  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ employee_id (FK)│───┐   │ employee_id (FK)│
│ leave_type      │   │   │ year            │
│ start_date      │   │   │ leave_type      │
│ end_date        │   │   │ total_days      │
│ days            │   │   │ used_days       │
│ reason          │   │   │ remaining_days  │
│ status          │   │   │ carry_over_days │
│ current_step    │   │   │ created_at      │
│ rejection_reason│   │   │ updated_at      │
│ created_at      │   │   └─────────────────┘
│ updated_at      │   │
└─────────────────┘   │
         │            │
         │ 1:N        │
         ↓            │
┌─────────────────┐   │
│ approval_logs   │   │
├─────────────────┤   │
│ id (PK)         │   │
│ request_id (FK) │───┘
│ actor_id (FK)   │
│ action          │
│ previous_status │
│ new_status      │
│ comment         │
│ timestamp       │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ notifications   │       │   audit_logs    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ recipient_id(FK)│       │ actor_id (FK)   │
│ type            │       │ action          │
│ title           │       │ entity_type     │
│ message         │       │ entity_id       │
│ payload (JSON)  │       │ changes (JSON)  │
│ read            │       │ ip_address      │
│ read_at         │       │ user_agent      │
│ created_at      │       │ timestamp       │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  departments    │       │  leave_policies │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ name            │       │ leave_type      │
│ description     │       │ days_per_year   │
│ manager_id (FK) │       │ max_consecutive │
│ parent_id (FK)  │       │ carry_over_max  │
│ created_at      │       │ requires_doc    │
│ updated_at      │       │ notice_days     │
└─────────────────┘       │ effective_date  │
                          │ created_at      │
                          └─────────────────┘

┌─────────────────┐
│ public_holidays │
├─────────────────┤
│ id (PK)         │
│ name            │
│ date            │
│ country         │
│ is_recurring    │
│ created_at      │
└─────────────────┘
```

### 4.2 Database Tables (Detailed Schema)

#### **1. employees**

```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Role-based access
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    -- Options: 'employee', 'manager', 'hr', 'admin'
    
    -- Organization structure
    department_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES employees(id),
    
    -- Employment details
    hire_date DATE NOT NULL,
    job_title VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'full_time',
    -- Options: 'full_time', 'part_time', 'contract'
    
    -- Contact info
    phone VARCHAR(50),
    address TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    -- Options: 'active', 'inactive', 'on_leave', 'terminated'
    
    -- Security
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_status ON employees(status);
```

#### **2. departments**

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Hierarchy
    parent_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES employees(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_manager ON departments(manager_id);
```

#### **3. leave_requests**

```sql
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    
    -- Leave details
    leave_type VARCHAR(50) NOT NULL,
    -- Options: 'annual', 'sick', 'exceptional', 'unpaid', 'compensatory'
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days DECIMAL(4,2) NOT NULL, -- Supports half days: 0.5, 1.0, 1.5, etc.
    
    -- Request info
    reason TEXT NOT NULL,
    attachment_url VARCHAR(500), -- For sick leave documentation, etc.
    
    -- Approval workflow
    status VARCHAR(50) NOT NULL DEFAULT 'pending_manager',
    -- Options: 'pending_manager', 'pending_hr', 'approved', 'rejected', 'canceled'
    
    current_step VARCHAR(50) DEFAULT 'manager',
    -- Options: 'manager', 'hr', 'completed'
    
    -- Rejection details
    rejection_reason TEXT,
    rejected_by UUID REFERENCES employees(id),
    rejected_at TIMESTAMP,
    
    -- Cancellation details
    cancellation_reason TEXT,
    canceled_by UUID REFERENCES employees(id),
    canceled_at TIMESTAMP,
    
    -- Approval details
    approved_by_manager UUID REFERENCES employees(id),
    approved_by_manager_at TIMESTAMP,
    approved_by_hr UUID REFERENCES employees(id),
    approved_by_hr_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT positive_days CHECK (days > 0)
);

-- Indexes
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_requests_type ON leave_requests(leave_type);
CREATE INDEX idx_leave_requests_created ON leave_requests(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_leave_requests_employee_status 
ON leave_requests(employee_id, status);
```

#### **4. leave_balances**

```sql
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    
    year INTEGER NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    
    -- Balance tracking
    total_days DECIMAL(5,2) NOT NULL DEFAULT 0,
    used_days DECIMAL(5,2) NOT NULL DEFAULT 0,
    remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (total_days - used_days) STORED,
    
    -- Carry-over from previous year
    carry_over_days DECIMAL(5,2) DEFAULT 0,
    
    -- Manager-granted bonus days
    bonus_days DECIMAL(5,2) DEFAULT 0,
    bonus_granted_by UUID REFERENCES employees(id),
    bonus_granted_at TIMESTAMP,
    bonus_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(employee_id, year, leave_type),
    CONSTRAINT non_negative_balance CHECK (remaining_days >= 0)
);

-- Indexes
CREATE INDEX idx_leave_balances_employee_year 
ON leave_balances(employee_id, year);
CREATE INDEX idx_leave_balances_type 
ON leave_balances(leave_type);
```

#### **5. approval_logs**

```sql
CREATE TABLE approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    
    -- Actor information
    actor_id UUID NOT NULL REFERENCES employees(id),
    actor_role VARCHAR(50) NOT NULL,
    
    -- Action details
    action VARCHAR(50) NOT NULL,
    -- Options: 'submit', 'approve', 'reject', 'cancel', 'edit', 'override'
    
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    
    -- Comments
    comment TEXT,
    
    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Indexes
CREATE INDEX idx_approval_logs_request ON approval_logs(request_id);
CREATE INDEX idx_approval_logs_actor ON approval_logs(actor_id);
CREATE INDEX idx_approval_logs_timestamp ON approval_logs(timestamp DESC);
```

#### **6. notifications**

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES employees(id),
    
    -- Notification content
    type VARCHAR(50) NOT NULL,
    -- Options: 'request_submitted', 'request_approved', 'request_rejected', 
    --          'approval_needed', 'request_canceled', 'balance_low'
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entity
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    
    -- Payload for additional data
    payload JSONB,
    
    -- Read status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Delivery channels
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Composite index for unread notifications
CREATE INDEX idx_notifications_recipient_unread 
ON notifications(recipient_id, read, created_at DESC);
```

#### **7. audit_logs**

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Actor (who performed the action)
    actor_id UUID REFERENCES employees(id),
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    -- Examples: 'user.login', 'leave.submit', 'leave.approve', 'settings.update'
    
    -- Target entity
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    
    -- Changes (before/after)
    changes JSONB,
    
    -- Request metadata
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100), -- For correlating multiple logs
    
    -- Result
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_request ON audit_logs(request_id);

-- Partial index for failed actions
CREATE INDEX idx_audit_logs_failures 
ON audit_logs(timestamp DESC) 
WHERE success = FALSE;
```

#### **8. leave_policies**

```sql
CREATE TABLE leave_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    leave_type VARCHAR(50) NOT NULL UNIQUE,
    
    -- Policy rules
    days_per_year DECIMAL(5,2) NOT NULL,
    max_consecutive_days INTEGER,
    min_advance_notice_days INTEGER DEFAULT 0,
    
    -- Carry-over rules
    allow_carry_over BOOLEAN DEFAULT FALSE,
    max_carry_over_days DECIMAL(5,2),
    carry_over_expiry_months INTEGER,
    
    -- Documentation requirements
    requires_documentation BOOLEAN DEFAULT FALSE,
    documentation_threshold_days INTEGER, -- e.g., require doc for sick leave > 3 days
    
    -- Accrual rules
    accrual_type VARCHAR(50) DEFAULT 'annual',
    -- Options: 'annual', 'monthly', 'biweekly'
    
    accrual_start_month INTEGER DEFAULT 1,
    
    -- Proration for new hires
    prorated_for_new_hires BOOLEAN DEFAULT TRUE,
    
    -- Effective date
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **9. public_holidays**

```sql
CREATE TABLE public_holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    
    -- Location
    country VARCHAR(50) DEFAULT 'EG',
    region VARCHAR(100), -- Optional: for region-specific holidays
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(100), -- e.g., "first Monday of September"
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(date, country, region)
);

-- Index
CREATE INDEX idx_public_holidays_date ON public_holidays(date);
CREATE INDEX idx_public_holidays_country ON public_holidays(country);
```

#### **10. system_settings**

```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(50) DEFAULT 'string',
    -- Options: 'string', 'number', 'boolean', 'json'
    
    description TEXT,
    category VARCHAR(50),
    
    -- Metadata
    updated_by UUID REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example settings:
-- ('max_bonus_days_per_manager', '5', 'number')
-- ('require_manager_approval', 'true', 'boolean')
-- ('email_notifications_enabled', 'true', 'boolean')
```

### 4.3 Database Indexes Strategy

```sql
-- Performance optimization indexes

-- For manager approval queries
CREATE INDEX idx_pending_manager_approvals 
ON leave_requests(status, created_at) 
WHERE status = 'pending_manager';

-- For HR approval queries
CREATE INDEX idx_pending_hr_approvals 
ON leave_requests(status, created_at) 
WHERE status = 'pending_hr';

-- For date overlap checks
CREATE INDEX idx_leave_requests_overlap 
ON leave_requests(employee_id, start_date, end_date) 
WHERE status IN ('approved', 'pending_manager', 'pending_hr');

-- For reporting queries
CREATE INDEX idx_leave_requests_reporting 
ON leave_requests(leave_type, status, created_at);

-- For balance calculations
CREATE INDEX idx_leave_balances_current_year 
ON leave_balances(employee_id, year) 
WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);
```

### 4.4 Database Constraints & Business Rules

```sql
-- Prevent overlapping leave requests
CREATE OR REPLACE FUNCTION check_leave_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM leave_requests
        WHERE employee_id = NEW.employee_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
        AND status IN ('approved', 'pending_manager', 'pending_hr')
        AND (
            (NEW.start_date, NEW.end_date) OVERLAPS (start_date, end_date)
        )
    ) THEN
        RAISE EXCEPTION 'Leave request overlaps with existing request';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_leave_overlap
BEFORE INSERT OR UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION check_leave_overlap();

-- Auto-update leave balance on approval
CREATE OR REPLACE FUNCTION update_leave_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE leave_balances
        SET used_days = used_days + NEW.days,
            updated_at = CURRENT_TIMESTAMP
        WHERE employee_id = NEW.employee_id
        AND year = EXTRACT(YEAR FROM NEW.start_date)
        AND leave_type = NEW.leave_type;
    END IF;
    
    IF NEW.status = 'canceled' AND OLD.status = 'approved' THEN
        UPDATE leave_balances
        SET used_days = used_days - NEW.days,
            updated_at = CURRENT_TIMESTAMP
        WHERE employee_id = NEW.employee_id
        AND year = EXTRACT(YEAR FROM NEW.start_date)
        AND leave_type = NEW.leave_type;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_balance
AFTER UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION update_leave_balance();

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employees_timestamp
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Apply to other tables as needed
```

---

## 5. API Design

### 5.1 API Architecture

**Base URL:** `https://api.vts.company.com/v1`

**API Style:** RESTful

**Authentication:** JWT Bearer Token

**Content Type:** `application/json`

### 5.2 Authentication Endpoints

#### **POST /auth/register**
Register a new user (admin only)

**Request:**
```json
{
  "employee_number": "EMP001",
  "first_name": "Ahmed",
  "last_name": "Hassan",
  "email": "ahmed@company.com",
  "password": "SecurePass123!",
  "role": "employee",
  "department_id": "uuid",
  "manager_id": "uuid",
  "hire_date": "2024-01-01"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "