"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Loader2Icon, Download } from "lucide-react";
import JSZip from "jszip";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages } = useContext(MessagesContext);
  const updateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchFiles();
  }, [id]);

  const fetchFiles = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      const processedFiles = preprocessFiles(result?.fileData || {});
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...processedFiles };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error fetching workspace files:", error);
    }
  };

  const preprocessFiles = (filesObj) => {
    const processed = {};
    Object.entries(filesObj).forEach(([path, content]) => {
      if (typeof content === "string") {
        processed[path] = { code: content };
      } else if (content && typeof content === "object") {
        processed[path] = content.code
          ? content
          : { code: JSON.stringify(content, null, 2) };
      }
    });
    return processed;
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const lastRole = messages[messages.length - 1].role;
      if (lastRole === "user") generateAiCode();
    }
  }, [messages]);

  const generateAiCode = async () => {
    setLoading(true);
  
    try {
      // Get the latest enhanced prompt from the assistant.
      // If it doesn't exist, use the latest user prompt.
      const lastAssistantMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === "assistant");
  
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === "user");
  
      const PROMPT =
        lastAssistantMessage?.content ||
        lastUserMessage?.content ||
        "";
  
      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });
  
      let aiFiles = result.data?.files;
  
      // Handle stringified JSON if Gemini returns it
      if (!aiFiles && typeof result.data?.result === "string") {
        try {
          const parsed = JSON.parse(result.data.result);
          aiFiles = parsed.files;
        } catch (err) {
          console.error("Failed to parse AI response", err);
        }
      }
  
      if (!aiFiles) {
        console.error("No files generated", result.data);
        return;
      }
  
      console.log("Generated Files:");
      console.log(Object.keys(aiFiles));
  
      const processedAiFiles = preprocessFiles(aiFiles);
  
      // Merge with default files
      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...processedAiFiles,
      };
  
      setFiles(mergedFiles);
  
      if (id) {
        await updateFiles({
          workspaceId: id,
          files: aiFiles,
        });
      }
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFiles = async () => {
    try {
      const zip = new JSZip();

      Object.entries(files).forEach(([filename, content]) => {
        let fileContent;
        if (typeof content === "string") fileContent = content;
        else if (content && typeof content === "object")
          fileContent = content.code || JSON.stringify(content, null, 2);

        if (fileContent) {
          const cleanFileName = filename.startsWith("/")
            ? filename.slice(1)
            : filename;
          zip.file(cleanFileName, fileContent);
        }
      });

      const packageJson = {
        name: "generated-project",
        version: "1.0.0",
        private: true,
        dependencies: Lookup.DEPENDANCY,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      const blob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project-files.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap shrink-0 bg-black p-1 justify-center w-[140px] gap-3 rounded-full">
            {["code", "preview"].map((tab) => (
              <h2
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
                    : ""
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </h2>
            ))}
          </div>

          <button
            onClick={downloadFiles}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Download Files</span>
          </button>
        </div>
      </div>

      {/* Sandpack */}
      <SandpackProvider
        files={files}
        template="react"
        theme="dark"
        customSetup={{
          dependencies: { ...Lookup.DEPENDANCY },
          entry: "/index.js",
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          bundlerTimeoutSecs: 120,
          recompileMode: "immediate",
          recompileDelay: 300,
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor
                style={{ height: "80vh" }}
                showTabs
                showLineNumbers
                showInlineErrors
                wrapContent
              />
            </>
          ) : (
            <SandpackPreview
              style={{ height: "80vh" }}
              showNavigator
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {/* Loading overlay */}
      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center gap-4">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white text-lg">Generating files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
