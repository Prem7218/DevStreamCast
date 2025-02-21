import React from "react";
import JitsiMeetingComponent from "../../../Demo/try";
import { useParams } from "react-router-dom";

const CreatedMeeting = () => {
  const { emailId, nameId } = useParams();
  return (
    <>
      <JitsiMeetingComponent emailId={emailId} nameId={nameId} />
    </>
  );
};

export default CreatedMeeting;
