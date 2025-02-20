import { useState, useEffect } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("Checking API availability...");
    console.log("Translation API Available:", "translation" in self);
    console.log(
      "Create Detector Available:",
      self.ai?.languageDetector?.create ? true : false
    );
    console.log(
      "Create Translator Available:",
      self.translation?.createTranslator ? true : false
    );
    console.log(
      "Summarizer Available:",
      self.ai?.summarizer?.create ? true : false
    );
    if (!("translation" in self) || !self.translation?.createTranslator) {
      console.error("Translation API not fully supported");
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      language: "Detecting...",
      summary: "",
      translation: "",
    };

    setMessages([...messages, newMessage]);
    setInput("");

    try {
      if (self.ai?.languageDetector) {
        const languageDetectorCapabilities =
          await self.ai.languageDetector.capabilities();
        const canDetect = languageDetectorCapabilities.capabilities;
        let detector;

        if (canDetect === "no") {
          console.warn("Language Detector API is not usable.");
          newMessage.language = "Detection unavailable";
        } else if (canDetect === "readily") {
          detector = await self.ai.languageDetector.create();
        } else {
          detector = await self.ai.languageDetector.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });
          await detector.ready;
        }

        if (detector) {
          const detectedLang =
            (await detector.detect(input))[0]?.detectedLanguage || "Unknown";
          newMessage.language = detectedLang;
        }
      } else {
        console.warn("Language Detector API not available, defaulting to 'en'");
        newMessage.language = "en";
      }
    } catch (error) {
      console.error("Language detection error:", error);
      newMessage.language = "Error detecting language";
    }
    setMessages([...messages, newMessage]);
  };

  const summarizeText = async (index) => {
    try {
      if (!self.ai?.summarizer) {
        throw new Error("Summarizer API not available");
      }

      const capabilities = await self.ai.summarizer.capabilities();
      const available = capabilities.available;
      let summarizer;
      const options = {
        type: "key-points",
        format: "markdown",
        length: "medium",
      };

      if (available === "no") {
        console.warn("Summarization not possible on this device.");
        messages[index].summary = "Summarization unavailable";
      } else if (available === "readily") {
        summarizer = await self.ai.summarizer.create(options);
      } else {
        summarizer = await self.ai.summarizer.create({
          ...options,
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await summarizer.ready;
      }

      if (summarizer) {
        messages[index].summary = await summarizer.summarize(
          messages[index].text
        );
      }
    } catch (error) {
      console.error("Summarization error:", error);
      messages[index].summary = "Error summarizing text";
    }
    setMessages([...messages]);
  };

  const translateText = async (index, targetLang) => {
    try {
      if (self.translation?.createTranslator) {
        const translator = await self.translation.createTranslator({
          sourceLanguage: messages[index].language,
          targetLanguage: targetLang,
        });
        messages[index].translation = await translator.translate(
          messages[index].text
        );
      } else {
        throw new Error("Translator API not available");
      }
    } catch (error) {
      console.error("Translation error:", error);
      messages[index].translation = "Error translating text";
    }
    setMessages([...messages]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p>{msg.text}</p>
            <p className="text-sm text-gray-400">Language: {msg.language}</p>
            {msg.text.length > 150 && msg.language === "en" && (
              <button
                className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded-md"
                onClick={() => summarizeText(index)}
              >
                Summarize
              </button>
            )}
            <div className="mt-2">
              <select
                className="border p-1 rounded-md text-black"
                onChange={(e) => translateText(index, e.target.value)}
              >
                <option value="">Translate to...</option>
                <option value="es">Spanish</option>
                <option value="en">English</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="tr">Turkish</option>
                <option value="fr">French</option>
              </select>
            </div>
            {msg.summary && (
              <p className="mt-2 text-yellow-300">Summary: {msg.summary}</p>
            )}
            {msg.translation && (
              <p className="mt-2 text-green-400">
                Translation: {msg.translation}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 flex bg-gray-800">
        <input
          type="text"
          className="flex-grow p-2 rounded-md text-black"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 px-4 py-2 rounded-md"
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
