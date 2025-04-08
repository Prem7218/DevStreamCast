import React, { useState, useEffect } from "react";
import { auth, database } from "../../../constantData/firebase";
import { get, ref, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { setProfiles, updateProfile } from "../../../constantData/Slices/profileSlice";
import { useNavigate } from "react-router-dom";

const ProfileForm = ({setProfiler}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get logged-in user's UID
  const loggedInUserUID = auth.currentUser?.uid;

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!loggedInUserUID) {
      navigate("/authentication/1");
    }
  }, [loggedInUserUID, navigate]);

  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's profile from Firebase
  useEffect(() => {
    if (!loggedInUserUID) return;

    const userRef = ref(database, `users/${loggedInUserUID}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUpdatedProfile({
          ...snapshot.val(),
          id: loggedInUserUID,
          mcqAptiStats: {
            subjects: {},
          },
          skills: snapshot.val().skills || {
            programming: [],
            softSkills: [],
            languages: [],
          },
          social: snapshot.val().social || {
            followers: [],
            following: [],
            messages: [],
          },
          preferences: snapshot.val().preferences || {
            theme: {},
            notifications: {},
            language: {},
          },
        });
      } else {
        setUpdatedProfile(null);
      }
      setLoading(false);
    });
  }, [loggedInUserUID]);

  // Prevent rendering until profile data is loaded
  if (loading) {
    return <div>Loading profile data...</div>;
  }

  // Handle profile updates (Save to Firebase)
  const handleProfileUpdate = async () => {
    try {
      if (!loggedInUserUID) {
        console.error("❌ Error: User UID is missing! Cannot update profile.");
        return;
      }

      const cleanedProfile = {
        ...updatedProfile,
        mcqAptiStats: {
          subjects: {},
        },
        id: loggedInUserUID, // ✅ Ensure it always updates the correct user
        experience:
          updatedProfile.experience?.filter((exp) => exp.company || exp.role) ||
          [],
        education:
          updatedProfile.education?.filter(
            (edu) => edu.institution || edu.degree
          ) || [],
      };

      dispatch(updateProfile(cleanedProfile)); // Update Redux store
      await update(ref(database, `users/${loggedInUserUID}`), cleanedProfile); // ✅ Updates the correct user

      console.log("✅ Profile updated successfully!");
      setProfiler("Main")
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProfile((prevProfile) => ({
          ...prevProfile,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Update nested fields (Experience, Education, Skills)
  const updateNestedField = (field, index, subField, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [field]: prevProfile[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  const updateSkill = (category, index, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      skills: {
        ...prevProfile.skills,
        [category]:
          prevProfile.skills?.[category]?.map((skill, i) =>
            i === index ? value : skill
          ) || [], // Ensure it's always an array
      },
    }));
  };

  // Add new experience, education, or skills
  const addNewSkill = (category) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      skills: {
        ...prevProfile.skills,
        [category]: [
          ...(Array.isArray(prevProfile.skills?.[category])
            ? prevProfile.skills[category]
            : []),
          "", // Add a new empty skill field
        ],
      },
    }));
  };

  // Remove experience, education, or skills
  const removeSkill = (category, index) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      skills: {
        ...prevProfile.skills,
        [category]:
          prevProfile.skills?.[category]?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addNewItem = (field, newItem) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [field]: [
        ...(Array.isArray(prevProfile[field]) ? prevProfile[field] : []),
        newItem,
      ],
    }));
  };

  return (
    <div className="w-full lg:w-3/4 max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden mt-5">
      {/* Background Image */}

      <div className="relative w-full h-48 bg-gray-300">
        <button
          onClick={() => setProfiler("Main")}
          className="absolute top-2 bg-blue-300 p-2 z-50 cursor-pointer">Go Back</button>

        {updatedProfile.backgroundImg && (
          <img
            src={updatedProfile.backgroundImg}
            alt="Background"
            className="w-full h-full object-cover"
          />
        )}
        <input
          type="file"
          onChange={(e) => handleImageUpload(e, "backgroundImg")}
          className="absolute bottom-2 left-2 text-white text-xs"
        />
      </div>

      {/* Profile Section */}
      <div className="p-6 text-center">
        <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden -mt-12">
          {updatedProfile.profilePic ? (
            <img
              src={updatedProfile.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <input
            type="file"
            onChange={(e) => handleImageUpload(e, "profilePic")}
            className="absolute bottom-0 left-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={updatedProfile.name || ""}
          onChange={handleChange}
          className="block w-full mt-4 text-xl font-semibold text-center border-b p-2 focus:outline-none"
        />
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={updatedProfile.title || ""}
          onChange={handleChange}
          className="block w-full text-gray-600 text-center border-b p-2 focus:outline-none"
        />
        <input
          type="text"
          name="location"
          placeholder="Location (City, Country)"
          value={updatedProfile.location || ""}
          onChange={handleChange}
          className="block w-full text-gray-500 text-center border-b p-2 focus:outline-none"
        />
        <textarea
          name="bio"
          placeholder="Write something about yourself..."
          value={updatedProfile.bio || ""}
          onChange={handleChange}
          className="block w-full text-gray-500 text-center border-b p-2 focus:outline-none mt-4"
        />
      </div>

      {/* Experience Section */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-semibold">Experience</h3>
        {updatedProfile.experience?.map((exp, index) => (
          <div key={index} className="mt-2">
            <input
              type="text"
              placeholder="Company"
              value={exp.company || ""}
              onChange={(e) =>
                updateNestedField(
                  "experience",
                  index,
                  "company",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={exp.role || ""}
              onChange={(e) =>
                updateNestedField("experience", index, "role", e.target.value)
              }
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={exp.startDate || ""}
              onChange={(e) =>
                updateNestedField(
                  "experience",
                  index,
                  "startDate",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="date"
              placeholder="End Date"
              value={exp.endDate || ""}
              onChange={(e) =>
                updateNestedField(
                  "experience",
                  index,
                  "endDate",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded mt-2"
            />
            <textarea
              placeholder="Description"
              value={exp.description || ""}
              onChange={(e) =>
                updateNestedField(
                  "experience",
                  index,
                  "description",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded mt-2"
            />
            <label className="block mt-2">
              <input
                type="checkbox"
                checked={exp.currentJob}
                onChange={(e) =>
                  updateNestedField(
                    "experience",
                    index,
                    "currentJob",
                    e.target.checked
                  )
                }
              />{" "}
              Current Job
            </label>
          </div>
        ))}
        <button
          onClick={() =>
            addNewItem("experience", {
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
              currentJob: false,
            })
          }
          className="mt-2 text-blue-500"
        >
          + Add Experience
        </button>
      </div>

      {/* Education Section */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-semibold">Education</h3>
        {updatedProfile.education?.map((edu, index) => (
          <div key={index} className="mt-2">
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) =>
                updateNestedField(
                  "education",
                  index,
                  "institution",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) =>
                updateNestedField("education", index, "degree", e.target.value)
              }
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="date"
              placeholder="Start Year"
              value={edu.startYear || ""}
              onChange={(e) =>
                updateNestedField(
                  "education",
                  index,
                  "startYear",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="date"
              placeholder="End Year"
              value={edu.endYear || ""}
              onChange={(e) =>
                updateNestedField("education", index, "endYear", e.target.value)
              }
              className="w-full p-2 border rounded mt-2"
            />
            <label className="block mt-2">
              <input
                type="checkbox"
                checked={edu.currentEducation}
                onChange={(e) =>
                  updateNestedField(
                    "education",
                    index,
                    "currentEducation",
                    e.target.checked
                  )
                }
              />{" "}
              Currently Studying
            </label>
          </div>
        ))}
        <button
          onClick={() =>
            addNewItem("education", {
              institution: "",
              degree: "",
              startYear: "",
              endYear: "",
              currentEducation: false,
            })
          }
          className="mt-2 text-blue-500"
        >
          + Add Education
        </button>
      </div>

      {/* Skills Section */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-semibold">Skills</h3>

        {Object.keys(updatedProfile.skills || {}).map((category) => (
          <div key={category}>
            <h4 className="text-md font-semibold mt-2">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h4>

            {/* ✅ Ensure skills[category] is an array before mapping */}
            {Array.isArray(updatedProfile.skills?.[category]) &&
              updatedProfile.skills[category].map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Skill"
                    value={skill || ""}
                    onChange={(e) =>
                      updateSkill(category, index, e.target.value)
                    }
                    className="w-full p-2 border rounded mt-2"
                  />
                  <button
                    onClick={() => removeSkill(category, index)}
                    className="mt-2 text-red-500"
                  >
                    ❌
                  </button>
                </div>
              ))}

            <button
              onClick={() => addNewSkill(category)}
              className="mt-2 text-blue-500"
            >
              + Add {category}
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="p-6 border-t text-center">
        <button
          onClick={handleProfileUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
