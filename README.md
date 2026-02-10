# FridgeApp

## Intelligent Inventory Management System

FridgeApp is a next-generation mobile application utilizing advanced computer vision and Large Language Models (LLMs) to automate household inventory tracking. Built on the React Native ecosystem, it leverages a hybrid AI architecture to process visual data and provide structured, actionable insights for inventory management.

## Technical Architecture

The application follows a modular, service-oriented architecture designed for scalability and maintainability.

### Client Layer
- **Framework**: React Native with Expo (Managed Workflow)
- **UI/UX System**: NativeWind (Tailwind CSS for Native)
- **State Management**: React Context & Hooks
- **Navigation**: Expo Router (File-based routing)

### Data Layer
- **Local Persistence**: SQLite (via `expo-sqlite`) for robust, offline-first data storage.
- **KV Storage**: AsyncStorage for session and preference management.

### AI & Computing Layer
The application implements a dual-pipeline approach for visual recognition to maximize reliability and speed.

1.  **Primary Vision Pipeline (Google Gemini)**:
    -   **Model**: `gemini-2.5-flash`
    -   **Function**: High-fidelity image analysis for complex scene understanding and detailed item extraction.
    -   **Implementation**: Direct interface via `@google/generative-ai` SDK.

2.  **Secondary Vision Pipeline (Groq)**:
    -   **Model**: `meta-llama/llama-4-scout-17b-16e-instruct`
    -   **Function**: Low-latency inference for rapid item counting and classification.
    -   **Implementation**: `groq-sdk` leveraging Groq's LPU (Language Processing Unit) architecture.

## AI Integration Details

### Visual Recognition Engine
The core of FridgeApp's intelligence lies in its ability to convert unstructured visual data (camera stream/images) into structured JSON data.

-   **Input**: Base64 encoded image data (JPEG/PNG).
-   **Processing**:
    -   Images are captured via `expo-camera` or selected from the gallery.
    -   Preprocessing strips API-incompatible headers.
    -   Parallel or selective dispatch to AI providers based on availability or preference.
-   **Output**: JSON array containing item nomenclature (`name`) and detected quantities (`quantity`).

### Prompt Engineering
The system utilizes optimized system prompts to enforce strict JSON output formats, minimizing parsing errors and ensuring seamless database insertion.

## Technology Stack

### Core
-   **Runtime**: Node.js
-   **Language**: TypeScript
-   **Platform**: Android / iOS / Web

### Dependencies
-   **UI**: `react-native-reanimated`, `react-native-gesture-handler`
-   **Networking**: Native `fetch` with SDK abstractions.
-   **AI SDKs**: `@google/generative-ai`, `groq-sdk`

## Setup & configuration

1.  **Clone the Repository**
    ```bash
    git clone [repository-url]
    cd FridgeApp
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and populate the following keys:
    ```env
    EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
    ```

4.  **Database Initialization**
    The SQLite database initializes automatically upon the first application launch via the `db.ts` service handler.

## Execution

START the development server:

```bash
npx expo start
```

-   Press `a` for Android Emulator.
-   Press `i` for iOS Simulator.
-   Scan the QR code with Expo Go for physical device testing.
