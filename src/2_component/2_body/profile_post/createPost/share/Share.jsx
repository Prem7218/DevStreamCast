import React from "react";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";
import "./Share.css";

function Share({ description, handleInteraction }) {
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const encodedMsg = encodeURIComponent(description);

  const handleWebShare = () => {
    if (navigator.share) {
      handleInteraction("shares")
      navigator
        .share({
          title: description,
          text: description,
          url: url,
        })
        .catch((err) => {
          alert("Error Sharing: " + err);
        });
    } else {
      alert("Web Share API not supported on this browser.");
    }
  };

  return (
    <>
      <div className="share-buttons mt-3 absolute z-30 mx-auto p-1 bg-blue-100 rounded-lg">
        <a
          onClick={() => handleInteraction("shares")}
          href={`https://wa.me/?text=${encodedMsg}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn whatsapp"
        >
          <FaWhatsapp />
        </a>

        <a
          onClick={() => handleInteraction("shares")}
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn telegram"
        >
          <FaTelegramPlane />
        </a>

        <a
          onClick={() => handleInteraction("shares")}
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn facebook"
        >
          <FaFacebookF />
        </a>

        <a
          onClick={() => handleInteraction("shares")}
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn twitter"
        >
          <FaTwitter />
        </a>

        <a
          onClick={() => handleInteraction("shares")}
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn linkedin"
        >
          <FaLinkedinIn />
        </a>

        <a
          onClick={() => handleInteraction("shares")}
          href={`mailto:?subject=Check this out&body=${encodedMsg}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn email"
        >
          <FaEnvelope />
        </a>

        {/* Web Share API */}
        <div
          onClick={handleWebShare}
          className="share-btn web-share cursor-pointer"
        >
          <FaShareAlt />
        </div>
      </div>
    </>
  );
}

export default Share;
