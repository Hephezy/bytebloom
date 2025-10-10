"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Write your post content here...",
  readOnly = false,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize Quill
  useEffect(() => {
    if (typeof window === "undefined" || !editorRef.current) {
      return;
    }

    if (quillRef.current) {
      return;
    }

    try {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }, { header: 3 }],
            ["clean"],
          ],
        },
        placeholder: placeholder,
        readOnly: readOnly,
      });

      // Set initial content if provided
      if (value && value.trim() !== "") {
        quillRef.current.root.innerHTML = value;
        updateCharacterCount();
      }

      // Handle text changes
      const handleTextChange = (delta: any, oldDelta: any, source: string) => {
        if (source === "user") {
          const html = quillRef.current?.root.innerHTML || "";
          onChangeRef.current(html);
          updateCharacterCount();
        }
      };

      quillRef.current.on("text-change", handleTextChange);

      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing Quill editor:", error);
    }
  }, [placeholder, readOnly]);

  const updateCharacterCount = useCallback(() => {
    if (quillRef.current) {
      const text = quillRef.current.getText();
      setCharacterCount(Math.max(0, text.length - 1));
    }
  }, []);

  // Handle external value changes (for edit mode)
  useEffect(() => {
    if (quillRef.current && isLoaded && value) {
      const currentHtml = quillRef.current.root.innerHTML;
      if (value !== currentHtml && value.trim() !== "") {
        quillRef.current.root.innerHTML = value;
        updateCharacterCount();
      }
    }
  }, [value, isLoaded, updateCharacterCount]);

  return (
    <div className="quill-editor-wrapper">
      <style jsx>{`
        :global(.ql-container) {
          font-family: inherit;
          font-size: inherit;
        }
        :global(.ql-editor) {
          min-height: 300px;
          padding: 12px;
        }
        :global(.ql-editor.ql-blank::before) {
          color: var(--color-muted-foreground);
          font-style: italic;
        }
      `}</style>
      <div
        ref={editorRef}
        className="min-h-[300px] bg-background border border-input rounded-md text-foreground"
      />
      <p className="text-xs text-muted-foreground mt-1">
        {characterCount} characters
      </p>
    </div>
  );
}