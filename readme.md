# **Banglish to Bangla Conversion App**

### Empowering seamless communication and cultural preservation through advanced language translation.

---

## **Table of Contents**
1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Installation](#installation)
6. [Usage](#usage)
   - [Translation Workflow](#translation-workflow)
   - [Chatbot Query Handling](#chatbot-query-handling)
   - [Authentication Flow](#authentication-flow)
   - [Content Management](#content-management)
   - [Search Functionality](#search-functionality)
   - [Feedback and Continuous Learning](#feedback-and-continuous-learning)
7. [Project Structure](#project-structure)
8. [Future Enhancements](#future-enhancements)
9. [API Documentation](#api-documentation)
   - [Translation API](#translation-api)
   - [Chatbot API](#chatbot-api)
   - [Content Management API](#content-management-api)
   - [Search API](#search-api)

---

## **Overview**
The Banglish to Bangla Conversion App is a user-friendly platform designed to:
- Convert Banglish text (Bengali written in English script) to Bangla with high accuracy
- Enable users to create, manage, and export content in Bangla
- Provide a chatbot capable of understanding and responding to queries in both Banglish and Bangla
- Continuously improve translation accuracy through user feedback and AI learning

---

## **Features**
### Core Features:
- **Banglish to Bangla Translation**: Real-time, accurate conversion of Banglish text to Bangla
- **Chatbot**: AI-powered chatbot for queries in Banglish and Bangla
- **Content Management**: Create, edit, and export content as customizable PDFs
- **Search Functionality**: Search for user profiles and content using Banglish or Bangla keywords

### Bonus Features:
- **Voice Interaction**: Hands-free content input and chatbot responses
- **Real-Time Collaboration**: Collaborate on content creation with other users
- **Analytics Dashboard**: Insights into user activity and app performance
- **Customizable Bangla Fonts**: Choose fonts for exporting PDFs

---

## **System Architecture**
The app's system architecture integrates multiple components to deliver high performance and scalability.

```mermaid
graph TD
    subgraph Frontend["Frontend (React.js)"]
        UI[User Interface]
        LangInteg[LangChain Integration]
    end

    subgraph Backend["Backend (Node.js + Express)"]
        API[API Endpoints]
        TC[Database Controller]
        GA[GroqAI Accelerator]
    end

    subgraph Database["Database (MongoDB)"]
        UD[User Data]
        CD[Content Data]
        AD[Analytics Data]
    end

    subgraph LangChain["LangChain OpenAPI"]
        WM[Workflow Manager]
        TW[Translation Workflow]
        CW[Chatbot Workflow]
        FW[Feedback Workflow]
    end

    subgraph AIModels["AI Models"]
        TM[Translation Model]
        CM[Chatbot Model]
    end

    User((User)) --> UI
    UI --> LangInteg
    LangInteg --> API
    API --> TC
    API --> GA
    TC --> UD
    TC --> CD
    TC --> AD
    API --> WM
    WM --> TW
    WM --> CW
    WM --> FW
    TW --> TM
    CW --> CM
    GA --> TM
    GA --> CM

    style Frontend fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Backend fill:#f0f0f0,stroke:#333,stroke-width:2px
    style Database fill:#e1e1e1,stroke:#333,stroke-width:2px
    style LangChain fill:#f5f5f5,stroke:#333,stroke-width:2px
    style AIModels fill:#f0f0f0,stroke:#333,stroke-width:2px
```

---

## **Tech Stack**
- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI Models**:
  - Hugging Face MarianMT (Translation)
  - Hugging Face Conversational Models (Chatbot)
- **Workflow Management**: LangChain OpenAPI
- **Inference Optimization**: GroqAI
- **Containerization**: Docker

---

## **Installation**

### Prerequisites:
- Node.js (v14 or higher)
- MongoDB
- Docker (for containerized deployment)

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/banglish-to-bangla.git
   cd banglish-to-bangla
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   MONGO_URI=<your-mongo-db-uri>
   LANGCHAIN_API_KEY=<your-langchain-api-key>
   HUGGINGFACE_API_KEY=<your-huggingface-api-key>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Access the app at http://localhost:3000

---

## **Usage**

### Translation Workflow
```mermaid
sequenceDiagram
    actor User
    participant F as Frontend
    participant L as LangChain API
    participant T as Translation Model
    
    User->>F: Enter Banglish Text
    F->>L: Send Translation Request
    L->>T: Process Text
    T->>L: Return Bangla Text
    L->>F: Deliver Translation
    F->>User: Display Bangla Text

    rect rgb(240, 240, 240)
        Note over F,T: Translation process optimized<br/>with GroqAI acceleration
    end
```

### Chatbot Query Handling
```mermaid
sequenceDiagram
    actor User
    participant F as Frontend
    participant L as LangChain API
    participant C as Chatbot Model
    participant D as Database
    
    User->>F: Submit Query
    F->>L: Process Query
    L->>C: Analyze Query
    C->>D: Fetch Context
    D->>C: Return Context
    C->>L: Generate Response
    L->>F: Send Response
    F->>User: Display Answer

    rect rgb(240, 240, 240)
        Note over F,D: Bilingual support with<br/>context awareness
    end
```

The chatbot leverages:
- Advanced Natural Language Processing
- Context-aware Response Generation
- Continuous Learning from Interactions

### Authentication Flow
graph TD
  %% User Actions
  subgraph User Actions
    A[User Inputs] -->|Register| B(Register Endpoint)
    A -->|Login| C(Login Endpoint)
    A -->|Forgot Password| D(Forgot Password Endpoint)
    A -->|Reset Password| E(Reset Password Endpoint)
    A -->|Logout| F(Logout Endpoint)
    A -->|Get User Details| G(Get User Details Endpoint)
    A -->|Total Teachers| H(Total Teachers Endpoint)
    A -->|Total Students| I(Total Students Endpoint)
  end

  %% API Layer
  subgraph API Layer
    B --> J[Register Controller]
    C --> K[Login Controller]
    F --> L[Logout Controller]
    D --> M[Forgot Password Controller]
    E --> N[Reset Password Controller]
    G --> O[Get User Controller]
    H --> P[Total Teachers Controller]
    I --> Q[Total Students Controller]
  end

  %% Database Layer
  subgraph Database Layer
    R[User Schema]
  end

  %% Relationships
  J -->|Write User Data| R
  K -->|Find User by Email| R
  L -->|Expire Token| R
  M -->|Find User by Email| R
  N -->|Update User Password| R
  O -->|Retrieve User by Token| R
  P -->|Count Users with Role=Teacher| R
  Q -->|Count Users with Role=Student| R


### Content Management
```mermaid
flowchart TD
    A[User Input] --> B{Content Type}
    B -->|Document| C[Create/Edit]
    B -->|Media| D[Upload]
    C --> E[Auto-Save Draft]
    D --> E
    E --> F{Review}
    F -->|Approve| G[Publish]
    F -->|Edit| C
    G --> H[Export Options]
    H --> I[PDF Export]
    H --> J[Share Content]
    
    style A fill:#f9f9f9
    style G fill:#e1f5fe
    style H fill:#e8f5e9
```

Content Features:
- Document Creation and Editing
- Automatic Draft Saving
- PDF Export with Custom Styling
- Content Sharing and Collaboration

### Search Functionality
```mermaid
graph LR
    subgraph Input
        A[Search Query] --> B{Query Type}
        B -->|Banglish| C[Script Detection]
        B -->|Bangla| D[Direct Process]
    end
    
    subgraph Processing
        C --> E[Translation Layer]
        E --> F[Search Engine]
        D --> F
        F --> G[MongoDB Query]
    end
    
    subgraph Results
        G --> H[Filter Results]
        H --> I[Sort by Relevance]
        I --> J[Return Results]
    end

    style A fill:#f0f0f0
    style F fill:#e1e1e1
    style J fill:#f5f5f5
```

Features:
- Intelligent Cross-script Search
- Smart Profile Discovery
- Advanced Content Filtering
- Context-aware Suggestions

### Feedback and Continuous Learning
```mermaid
graph TD
    subgraph Collection
        A[User Feedback] --> B[Feedback Queue]
        B --> C{Admin Review}
    end
    
    subgraph Verification
        C -->|Approve| D[Verified Feedback]
        C -->|Reject| E[Rejection Notice]
        D --> F[Training Dataset]
    end
    
    subgraph Learning
        F --> G[Model Retraining]
        G --> H[Validation]
        H -->|Success| I[Deploy Update]
        H -->|Fail| G
    end

    style A fill:#f0f0f0
    style D fill:#e1f5fe
    style I fill:#e8f5e9
```

Process Overview:
- Systematic Feedback Collection
- Admin-driven Quality Control
- Continuous Model Improvement
- Validated Updates Deployment

---

## **Project Structure**
```
banglish-to-bangla/
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   ├── pages/            # Application pages
│   ├── services/         # API calls and integrations
│   ├── utils/            # Utility functions
│   └── styles/           # CSS and styling
├── server/
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   └── config/           # Environment configurations
└── README.md             # Project documentation
```

---

## **Future Enhancements**
- Enhance voice interaction with advanced NLP models
- Add a mobile-friendly interface
- Implement advanced analytics for admin users
- Expand language support options
- Add offline functionality

---

## **Contributing**
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Submit a Pull Request

---

## **API Documentation**

### Base URL
```
https://api.banglish2bangla.com/v1
```

### Authentication
# **Banglish to Bangla App - API Documentation**

## **Table of Contents**
1. [Base URL](#base-url)
2. [Endpoints](#endpoints)
    - [Register User](#1-register-user)
    - [Login User](#2-login-user)
    - [Logout User](#3-logout-user)
    - [Get User Details](#4-get-user-details)
    - [Forgot Password](#5-forgot-password)
    - [Reset Password](#6-reset-password)
    - [Get Total Teachers](#7-get-total-teachers)
    - [Get Total Students](#8-get-total-students)
3. [Error Response Format](#error-response-format)
4. [Authentication](#authentication)
5. [Status Codes](#status-codes)

---

## **Base URL**
```
http://localhost:5000/api
```

---

## **Endpoints**

### 1. **Register User**
#### `POST /register`
Registers a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "securePassword",
  "role": "Teacher"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User Registered!",
  "token": "jwt_token_here"
}
```

### 2. **Login User**
#### `POST /login`
Authenticates a user and provides a JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword",
  "role": "Teacher"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User Logged In!",
  "token": "jwt_token_here"
}
```

**Errors:**
- 400 Bad Request: Missing or invalid credentials
- 404 Not Found: User with provided email and role not found

### 3. **Logout User**
#### `POST /logout`
Logs the user out by expiring the JWT token.

**Response:**
```json
{
  "success": true,
  "message": "Logged Out Successfully."
}
```


### 4. **Forgot Password**
#### `POST /forgot-password`
Generates a password reset link and sends it to the user's email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "Status": "Success",
  "message": "Check your mail"
}
```

**Errors:**
- 404 Not Found: User with the provided email does not exist
- 500 Internal Server Error: Failed to send the email

### 5. **Reset Password**
#### `POST /reset-password/:id/:token`
Resets the user's password.

**Request Parameters:**
- `id`: User ID
- `token`: JWT token from the password reset email

**Request Body:**
```json
{
  "password": "newSecurePassword"
}
```

**Response:**
```json
{
  "Status": "Success",
  "message": "Password reset successfully"
}
```

**Errors:**
- 400 Bad Request: Invalid or expired token, or missing password
- 404 Not Found: User not found


## **Error Response Format**
All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error message describing the issue",
  "errorCode": "ERROR_CODE"
}
```

**Common Error Codes:**
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## **Authentication**
All endpoints requiring authentication must include the following header:

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

## **Status Codes**
| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |
```

### Endpoints

#### Translation API

##### 1. Translate Text
```http
POST /translate
```

Request Body:
```json
{
  "text": "ami tomake valobashi",
  "source": "banglish",
  "target": "bangla"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "translated_text": "আমি তোমাকে ভালোবাসি",
    "confidence_score": 0.98
  }
}
```

##### 2. Batch Translation
```http
POST /translate/batch
```

Request Body:
```json
{
  "texts": [
    "ami tomake valobashi",
    "tumi kemon acho"
  ],
  "source": "banglish",
  "target": "bangla"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "translations": [
      {
        "original": "ami tomake valobashi",
        "translated": "আমি তোমাকে ভালোবাসি",
        "confidence_score": 0.98
      },
      {
        "original": "tumi kemon acho",
        "translated": "তুমি কেমন আছো",
        "confidence_score": 0.97
      }
    ]
  }
}
```

#### Chatbot API

##### 1. Send Message
```http
POST /chat/message
```

Request Body:
```json
{
  "message": "What is the weather today?",
  "language": "banglish",
  "session_id": "user_123_session"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "response": "I apologize, but I don't have access to real-time weather data. You can check your local weather service for accurate information.",
    "language": "banglish",
    "context_maintained": true
  }
}
```

#### Content Management API

##### 1. Create Document
```http
POST /documents
```

Request Body:
```json
{
  "title": "My First Document",
  "content": "This is the content in Banglish or Bangla",
  "language": "banglish",
  "auto_translate": true
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "document_id": "doc_123",
    "title": "My First Document",
    "content": {
      "original": "This is the content in Banglish or Bangla",
      "translated": "এটি বাংলিশ বা বাংলায় বিষয়বস্তু"
    },
    "created_at": "2025-01-03T12:00:00Z"
  }
}
```

##### 2. Export Document
```http
GET /documents/{document_id}/export
```

Query Parameters:
- `format`: pdf, docx (default: pdf)
- `font`: Optional custom Bangla font name

Response: Binary file stream

#### Search API

##### 1. Universal Search
```http
GET /search
```

Query Parameters:
- `q`: Search query (Banglish or Bangla)
- `type`: content, users, all (default: all)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

Response:
```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "type": "content",
        "id": "content_123",
        "title": "Sample Content",
        "snippet": "Matching content excerpt...",
        "relevance_score": 0.95
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_results": 48
    }
  }
}
```

#### Error Responses

All endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details if available
    }
  }
}
```

Common Error Codes:
- `INVALID_TOKEN`: Authentication token is invalid or expired
- `INVALID_REQUEST`: Request body or parameters are invalid
- `RATE_LIMIT_EXCEEDED`: API rate limit has been exceeded
- `SERVICE_ERROR`: Internal service error
- `RESOURCE_NOT_FOUND`: Requested resource does not exist

### Rate Limits
- Free tier: 100 requests per hour
- Pro tier: 1000 requests per hour
- Enterprise tier: Custom limits

### Webhooks

Register webhook endpoints to receive notifications for:
- Translation completions
- Document updates
- Chatbot session events

Webhook Registration:
```http
POST /webhooks
```

Request Body:
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["translation.complete", "document.update"],
  "secret": "your_webhook_secret"
}
```

### SDKs and Libraries

Official SDKs are available for:
- JavaScript/TypeScript
- Python
- Java
- Ruby

Example using JavaScript SDK:
```javascript
import { Banglish2Bangla } from 'banglish2bangla-sdk';

const client = new Banglish2Bangla('your_api_key');

// Translate text
const result = await client.translate('ami tomake valobashi');
console.log(result.translated_text);
```
