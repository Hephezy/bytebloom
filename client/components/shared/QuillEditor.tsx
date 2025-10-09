"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined" || !editorRef.current) {
      return;
    }

    // Prevent multiple initializations
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

      // Set initial content if value exists
      if (value && value.trim() !== "") {
        quillRef.current.root.innerHTML = value;
        const text = quillRef.current.getText();
        setCharacterCount(Math.max(0, text.length - 1));
      }

      // Handle text changes
      const handleChange = () => {
        const content = quillRef.current?.root.innerHTML || "";
        const text = quillRef.current?.getText() || "";
        onChange(content);
        setCharacterCount(Math.max(0, text.length - 1));
      };

      quillRef.current.on("text-change", handleChange);

      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing Quill editor:", error);
    }

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
      }
    };
  }, [placeholder, readOnly]); // Remove 'onChange' from dependency to prevent infinite loops

  // Update content when value prop changes (for edit mode)
  useEffect(() => {
    if (quillRef.current && isLoaded) {
      const currentContent = quillRef.current.root.innerHTML;

      // Only update if content actually changed and value is different
      if (value && value.trim() !== "" && currentContent !== value) {
        // Save cursor position
        const selection = quillRef.current.getSelection();
        quillRef.current.root.innerHTML = value;

        // Restore cursor position if it existed
        if (selection) {
          quillRef.current.setSelection(selection.index, selection.length);
        }

        const text = quillRef.current.getText();
        setCharacterCount(Math.max(0, text.length - 1));
      }
    }
  }, [value, isLoaded]);

  return (
    <div className="quill-editor-wrapper">
      <div
        ref={editorRef}
        className="min-h-[300px] bg-background border border-input rounded-md text-foreground [&_.ql-toolbar]:border-input [&_.ql-container]:border-input [&_.ql-editor]:bg-background [&_.ql-editor]:text-foreground"
      />
      <p className="text-xs text-muted-foreground mt-1">
        {characterCount} characters
      </p>
    </div>
  );
}