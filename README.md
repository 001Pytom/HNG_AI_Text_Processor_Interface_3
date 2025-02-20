# AI-Powered Text Processing Interface

## Overview
This is an AI-powered text processing web application that allows users to:
- Detect the language of input text
- Summarize long texts (English only)
- Translate text into multiple languages

The app utilizes **Chrome's AI APIs** for processing, including:
- **Language Detector API**
- **Summarizer API**
- **Translator API**

## **🚨 Important Notice**
This application will **not work** unless the following conditions are met:

### **1️⃣ Enable Chrome AI Experimental Features**
To use the AI APIs, you must enable experimental Chrome features:
1. Open **Google Chrome**
2. Go to: `chrome://flags/`
3. Search for and **enable** the following:
   - ✅ `Enable AI Features`
   - ✅ `Enable AI Text Processing API`
   - ✅ `Enable AI Summarizer API`
   - ✅ `Enable AI Translator API`
4. **Restart Chrome** after enabling these settings.

### **2️⃣ Chrome Version Requirements**
- The app requires **Chrome 133+**.
- Works best on **Chrome Canary** if features are not yet available in stable Chrome.

### **3️⃣ Device Compatibility**
- Your device must support **AI model execution**.
- To check if your device is eligible, open Chrome DevTools (`F12` > Console) and run:
  ```javascript
  self.ai.summarizer.capabilities().then(console.log);
  ```
  - If `{ available: "no" }`, your device **does not support** AI processing.
  - If `{ available: "readily" }`, it should work.

## **🔧 Setup Instructions**
### **For Local Development**
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and add your **Chrome Origin Trial Tokens**:
   ```sh
   VITE_ORIGIN_TRIAL_TRANSLATION=your_translation_token
   VITE_ORIGIN_TRIAL_DETECTOR=your_detector_token
   VITE_ORIGIN_TRIAL_SUMMARIZER=your_summarizer_token
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### **For Deployment (Vercel)**
1. Add the **Origin Trial Tokens** as **Environment Variables** in Vercel.
2. Deploy using:
   ```sh
   vercel --prod
   ```

## **🚀 Features & Usage**
- **Chat-like UI:** The interface is designed like ChatGPT.
- **Language Detection:** Automatically detects the input text language.
- **Summarization:** Available for English text longer than 150 characters.
- **Translation:** Supports multiple languages: English, Spanish, Portuguese, Russian, Turkish, French.

## **💡 Troubleshooting**
### **Q: The app isn't working on my browser. What should I do?**
✔ Ensure you have enabled AI features in `chrome://flags/`.
✔ Use Chrome **133+** (or Chrome Canary for best results).
✔ Run `self.translation.capabilities().then(console.log);` in DevTools to check API availability.
✔ Make sure your **Origin Trial Token** is correctly set up.
✔ Try running the app on **another device** if your current one is unsupported.


---
**

