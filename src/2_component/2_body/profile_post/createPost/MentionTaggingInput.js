import React, { useState, useEffect } from "react";
import "../../../../App.css"

// Simplified version - to show usage with 'connections' prop
const MentionTaggingInput = ({
  mentions1,
  setMentions1,
  setText,
  mentions,
  setMentions,
  text,
  cursorPos,
  setTextExternally,
  connections,
}) => {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if(mentions.length === 0) {
      setMentions(mentions1);
    }
  }, []) 

  useEffect(() => {
    if (text[cursorPos - 1] === "@") {
      setShowList(true);
    } else {
      setShowList(false);
    }

    if(text.length === 0) {
      setMentions([]);
    }
  }, [text, cursorPos]);

  const insertMention = (username) => {
    const before = text.slice(0, cursorPos);
    const after = text.slice(cursorPos);
    const newText = `${before}@${username} ${after}`;
    setTextExternally(newText);
    setText(newText)
    console.log(username)
    setMentions((prev) => [...new Set([...prev, username])]);
    setMentions1(mentions);
    setShowList(false);
  };

  const handleRemoveMention = (mention) => {
    // 1. Remove mention from mentions array
    setMentions((prev) => prev.filter((m) => m !== mention));
  
    // 2. Remove `@mention` from the text
    const tex = text.replace(new RegExp(`@${mention}\\b`, "g"), "").trim();
    setText(tex);
    setTextExternally(tex);
  };

  return (
    <div className="relative mt-2">
      <div className="flex gap-2 w-full overflow-x-auto removeScrollX">
        <strong className="flex-shrink-0 mt-2">Mentions:</strong>
        <div className="text-sm text-gray-600 flex gap-2 items-center mt-2 min-w-max">
          {console.log(mentions)}
          {mentions.length === 0 ? (
            <span className="text-blue-500 ml-2">None</span>
          ) : (
            <div className="flex gap-2 overflow-x-auto">
              {mentions.map((mention, index) => (
                <span
                  key={index}
                  onClick={() =>handleRemoveMention(mention)}
                  className="text-blue-700 bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-red-100 hover:text-red-600 transition-all whitespace-nowrap"
                  title="Click to remove"
                >
                  @{mention}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showList && (
        <div className="absolute bg-white border rounded shadow-md mt-2 z-20 w-full max-h-48 overflow-auto">
          {connections.map((conn) => (
            <div
              key={conn.uid}
              onClick={() => insertMention(conn.username || conn.name)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              @{conn.username || conn.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionTaggingInput;
