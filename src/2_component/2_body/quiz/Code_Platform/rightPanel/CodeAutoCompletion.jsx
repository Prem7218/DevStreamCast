import { search, searchKeymap } from "@codemirror/search";
import { completeJSDoc, myCompletions } from "../../../../../constantData/mock_data";
import { autocompletion } from "@codemirror/autocomplete";
import { syntaxHighlighting } from "@codemirror/language";
import { EditorView, keymap } from "@codemirror/view";

export const editorExtensions1 = [
  autocompletion({
    override: [completeJSDoc, myCompletions],
  }),
  syntaxHighlighting(),
];

export const editorExtensionsWithSearch = [
    search(), // ✅ Enables search panel
    keymap.of(searchKeymap) // ✅ Enables search shortcuts (Ctrl+F, F3, etc.)
  ];

export const editorExtensions2 = [
  search({
    caseSensitive: false, // Default: false
    literal: true, // Treat string search as literal (not regex)
    wholeWord: false, // Default: false
    regexp: false, // Disable regex by default
  }),
  keymap.of(searchKeymap),
  autocompletion(),
];


export let myTheme = EditorView.theme(
  {
    "&": {
      color: "white",
      backgroundColor: "#034",
    },
    ".cm-content": {
      caretColor: "#0e9",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#0e9",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#074",
    },
    ".cm-gutters": {
      backgroundColor: "#045",
      color: "#ddd",
      border: "none",
    },
  },
  { dark: true }
);
