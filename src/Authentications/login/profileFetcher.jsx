import { get, ref } from "firebase/database";
import { database } from "../../constantData/firebase";
import { setProfiles } from "../../constantData/Slices/profileSlice";

export const fetchProfiles = () => async (dispatch) => {
    try {
        const userRef = ref(database, "users/");
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            dispatch(setProfiles(Object.values(snapshot.val())));
        } else {
            dispatch(setProfiles([]));
        }
    } catch (error) {
        console.error("Error fetching profiles:", error);
        console.log("Hello Error");
    }
    finally {
        console.log("Done...");
    }
};

