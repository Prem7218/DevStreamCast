import React from "react";
import { useOpen } from "../../../3_context/openContext";
import { addMeetLink } from "../../../constantData/Slices/meetSessionSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const PrivateMeetMe = () => {
  const dispatch = useDispatch();
  const { roomid, username } = useParams();

  useEffect(() => {
    if (roomid && username) {
      dispatch(addMeetLink(`/meeting/${roomid}/${username}/private`));
    }
  }, [dispatch, roomid, username]);
  const { meetingRef } = useOpen();
  return <div ref={meetingRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default PrivateMeetMe;
