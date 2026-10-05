import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  Globe,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
    phone: "",
    location: "",
    bio: "",

    skills: [],
    resumeUrl: "",

    education: [],
    experience: [],

    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyLogo: "",
  });

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("hirehub_token");

        const response = await api.get("/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.user;

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          profileImage: profile.profileImage || "",
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",

          skills: profile.skills || [],
          resumeUrl: profile.resumeUrl || "",

          education: profile.education || [],
          experience: profile.experience || [],

          companyName: profile.companyName || "",
          companyDescription: profile.companyDescription || "",
          companyWebsite: profile.companyWebsite || "",
          companyLogo: profile.companyLogo || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);

        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const handleSkillChange = (index, value) => {
    setFormData((prev) => {
      const skills = [...prev.skills];

      skills[index] = value;

      return {
        ...prev,
        skills,
      };
    });
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // EDUCATION
  // ==========================================

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          description: "",
        },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData((prev) => {
      const education = [...prev.education];

      education[index] = {
        ...education[index],
        [field]: value,
      };

      return {
        ...prev,
        education,
      };
    });
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // EXPERIENCE
  // ==========================================

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData((prev) => {
      const experience = [...prev.experience];

      experience[index] = {
        ...experience[index],
        [field]: value,
      };

      return {
        ...prev,
        experience,
      };
    });
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("hirehub_token");

      const cleanedSkills = formData.skills
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await api.put(
        "/profile/me",
        {
          name: formData.name,
          profileImage: formData.profileImage,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,

          skills: cleanedSkills,
          resumeUrl: formData.resumeUrl,

          education: formData.education,
          experience: formData.experience,

          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          companyWebsite: formData.companyWebsite,
          companyLogo: formData.companyLogo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = response.data.user;

      setFormData((prev) => ({
        ...prev,

        name: updatedUser.name || "",
        profileImage: updatedUser.profileImage || "",
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        bio: updatedUser.bio || "",

        skills: updatedUser.skills || [],
        resumeUrl: updatedUser.resumeUrl || "",

        education: updatedUser.education || [],
        experience: updatedUser.experience || [],

        companyName: updatedUser.companyName || "",
        companyDescription: updatedUser.companyDescription || "",
        companyWebsite: updatedUser.companyWebsite || "",
        companyLogo: updatedUser.companyLogo || "",
      }));

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        {/* HEADER */}
        <div className="profile-header">
          <div>
            <span className="profile-eyebrow">
              {user?.role === "recruiter"
                ? "Recruiter Profile"
                : "Jobseeker Profile"}
            </span>

            <h1>My Profile</h1>

            <p>Manage your personal information and professional details.</p>
          </div>

          <div className="profile-avatar">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" />
            ) : (
              <User size={32} />
            )}
          </div>
        </div>

        {/* MESSAGES */}

        {message && <div className="profile-success">{message}</div>}

        {error && <div className="profile-error">{error}</div>}

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* =================================
              BASIC INFORMATION
          ================================= */}

          <section className="profile-section">
            <div className="section-heading">
              <div className="section-icon">
                <User size={20} />
              </div>

              <div>
                <h2>Basic Information</h2>
                <p>Your personal account information.</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="form-group">
                <label>Full Name</label>

                <div className="input-with-icon">
                  <User size={17} />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>

                <div className="input-with-icon">
                  <Mail size={17} />

                  <input type="email" value={formData.email} disabled />
                </div>

                <small>Email cannot be changed here.</small>
              </div>

              <div className="form-group">
                <label>Phone</label>

                <div className="input-with-icon">
                  <Phone size={17} />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>

                <div className="input-with-icon">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Profile Image URL</label>

                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <div className="form-group full-width">
                <label>Bio</label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  placeholder="Tell employers about yourself..."
                />

                <small>{formData.bio.length}/500 characters</small>
              </div>
            </div>
          </section>

          {/* =================================
              JOBSEEKER SECTION
          ================================= */}

          {user?.role === "jobseeker" && (
            <>
              {/* SKILLS */}

              <section className="profile-section">
                <div className="section-heading">
                  <div className="section-icon">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div>
                    <h2>Skills</h2>
                    <p>Add technologies and skills you know.</p>
                  </div>
                </div>

                <div className="skills-list">
                  {formData.skills.map((skill, index) => (
                    <div className="skill-row" key={index}>
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) =>
                          handleSkillChange(index, e.target.value)
                        }
                        placeholder="e.g. React.js"
                      />

                      <button
                        type="button"
                        className="icon-danger-button"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-button"
                    onClick={addSkill}
                  >
                    <Plus size={17} />
                    Add Skill
                  </button>
                </div>
              </section>

              {/* RESUME */}

              <section className="profile-section">
                <div className="section-heading">
                  <div className="section-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2>Resume</h2>
                    <p>Add a link to your resume.</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Resume URL</label>

                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </section>

              {/* EDUCATION */}

              <section className="profile-section">
                <div className="section-heading">
                  <div className="section-icon">
                    <GraduationCap size={20} />
                  </div>

                  <div>
                    <h2>Education</h2>
                    <p>Add your educational background.</p>
                  </div>
                </div>

                {formData.education.map((item, index) => (
                  <div className="repeatable-card" key={index}>
                    <div className="repeatable-header">
                      <h3>Education #{index + 1}</h3>

                      <button
                        type="button"
                        className="icon-danger-button"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="profile-grid">
                      <div className="form-group">
                        <label>Degree</label>

                        <input
                          type="text"
                          value={item.degree || ""}
                          onChange={(e) =>
                            updateEducation(index, "degree", e.target.value)
                          }
                          placeholder="BCA"
                        />
                      </div>

                      <div className="form-group">
                        <label>Institution</label>

                        <input
                          type="text"
                          value={item.institution || ""}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "institution",
                              e.target.value,
                            )
                          }
                          placeholder="University / College"
                        />
                      </div>

                      <div className="form-group">
                        <label>Field of Study</label>

                        <input
                          type="text"
                          value={item.fieldOfStudy || ""}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "fieldOfStudy",
                              e.target.value,
                            )
                          }
                          placeholder="Computer Applications"
                        />
                      </div>

                      <div className="form-group">
                        <label>Start Year</label>

                        <input
                          type="number"
                          value={item.startYear || ""}
                          onChange={(e) =>
                            updateEducation(index, "startYear", e.target.value)
                          }
                          placeholder="2024"
                        />
                      </div>

                      <div className="form-group">
                        <label>End Year</label>

                        <input
                          type="number"
                          value={item.endYear || ""}
                          onChange={(e) =>
                            updateEducation(index, "endYear", e.target.value)
                          }
                          placeholder="2027"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Description</label>

                        <textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          rows="3"
                          placeholder="Add relevant details..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-button"
                  onClick={addEducation}
                >
                  <Plus size={17} />
                  Add Education
                </button>
              </section>

              {/* EXPERIENCE */}

              <section className="profile-section">
                <div className="section-heading">
                  <div className="section-icon">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div>
                    <h2>Experience</h2>
                    <p>Add your professional experience.</p>
                  </div>
                </div>

                {formData.experience.map((item, index) => (
                  <div className="repeatable-card" key={index}>
                    <div className="repeatable-header">
                      <h3>Experience #{index + 1}</h3>

                      <button
                        type="button"
                        className="icon-danger-button"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="profile-grid">
                      <div className="form-group">
                        <label>Job Title</label>

                        <input
                          type="text"
                          value={item.jobTitle || ""}
                          onChange={(e) =>
                            updateExperience(index, "jobTitle", e.target.value)
                          }
                          placeholder="Frontend Developer"
                        />
                      </div>

                      <div className="form-group">
                        <label>Company</label>

                        <input
                          type="text"
                          value={item.company || ""}
                          onChange={(e) =>
                            updateExperience(index, "company", e.target.value)
                          }
                          placeholder="Company name"
                        />
                      </div>

                      <div className="form-group">
                        <label>Location</label>

                        <input
                          type="text"
                          value={item.location || ""}
                          onChange={(e) =>
                            updateExperience(index, "location", e.target.value)
                          }
                          placeholder="Remote / City"
                        />
                      </div>

                      <div className="form-group">
                        <label>Start Date</label>

                        <input
                          type="date"
                          value={
                            item.startDate ? item.startDate.slice(0, 10) : ""
                          }
                          onChange={(e) =>
                            updateExperience(index, "startDate", e.target.value)
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>End Date</label>

                        <input
                          type="date"
                          value={item.endDate ? item.endDate.slice(0, 10) : ""}
                          disabled={item.currentlyWorking}
                          onChange={(e) =>
                            updateExperience(index, "endDate", e.target.value)
                          }
                        />
                      </div>

                      <div className="form-checkbox">
                        <input
                          type="checkbox"
                          checked={item.currentlyWorking || false}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "currentlyWorking",
                              e.target.checked,
                            )
                          }
                        />

                        <label>I currently work here</label>
                      </div>

                      <div className="form-group full-width">
                        <label>Description</label>

                        <textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          rows="3"
                          placeholder="Describe your responsibilities..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-button"
                  onClick={addExperience}
                >
                  <Plus size={17} />
                  Add Experience
                </button>
              </section>
            </>
          )}

          {/* =================================
              RECRUITER SECTION
          ================================= */}

          {user?.role === "recruiter" && (
            <section className="profile-section">
              <div className="section-heading">
                <div className="section-icon">
                  <Building2 size={20} />
                </div>

                <div>
                  <h2>Company Information</h2>
                  <p>Tell candidates about your company.</p>
                </div>
              </div>

              <div className="profile-grid">
                <div className="form-group">
                  <label>Company Name</label>

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </div>

                <div className="form-group">
                  <label>Company Website</label>

                  <div className="input-with-icon">
                    <Globe size={17} />

                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Company Logo URL</label>

                  <input
                    type="url"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Company Description</label>

                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    rows="5"
                    maxLength="1000"
                    placeholder="Describe your company..."
                  />

                  <small>
                    {formData.companyDescription.length}
                    /1000 characters
                  </small>
                </div>
              </div>
            </section>
          )}

          {/* SAVE */}

          <div className="profile-save-area">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Profile;
