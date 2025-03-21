import React from "react";
import { useParams } from "react-router-dom";
import JitsiMeetingComponent from "./JitsiMeetingComponent";

const CreatedMeeting = () => {
  const { emailId, nameId } = useParams();
  return (
    <>
      <JitsiMeetingComponent emailId={emailId} nameId={nameId} />
    </>
  );
};

export default CreatedMeeting;
