import axios from "axios";

const generateAIDraft = async (accompliqData) => {
  // Validate inputs
  if (!accompliqData) {
    throw new Error("No accompliq data provided");
  }

  // Check for required minimum data
  if (
    !accompliqData.personalInfo?.fullName ||
    (!accompliqData.personalInfo?.dateOfBirth &&
      !accompliqData.personalInfo?.dob)
  ) {
    throw new Error(
      "Insufficient data to generate accompliq. Need at least fullName and dateOfBirth"
    );
  }

  // Validate OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    // Construct comprehensive AI prompt
    const userPrompt = `Compose a heartfelt Accompliq memorial for:
    
    Name: ${accompliqData.personalInfo.fullName}
    Born: ${accompliqData.personalInfo.dateOfBirth}${
      accompliqData.personalInfo.placeOfBirth
        ? ` in ${accompliqData.personalInfo.placeOfBirth}`
        : ""
    }${
      accompliqData.personalInfo.dateOfPassing
        ? `\nPassed: ${accompliqData.personalInfo.dateOfPassing}${
            accompliqData.personalInfo.ageAtPassing
              ? ` (Age ${accompliqData.personalInfo.ageAtPassing})`
              : ""
          }`
        : ""
    }
    
    Family Details:${
      accompliqData.familyInfo
        ? `
    - Parents: ${accompliqData.familyInfo.parents || "Not specified"}
    - Spouse: ${accompliqData.familyInfo.spouse || "Not specified"}
    - Children: ${
      accompliqData.familyInfo.children
        ? Array.isArray(accompliqData.familyInfo.children)
          ? accompliqData.familyInfo.children.join(", ")
          : accompliqData.familyInfo.children.toString()
        : "Not specified"
    }`
        : ""
    }
    
    Career and Education:${
      accompliqData.educationCareer
        ? `
    - Education: ${accompliqData.educationCareer.college || "Not specified"}
    - Occupation: ${
      accompliqData.educationCareer.occupation || "Not specified"
    }`
        : ""
    }
    
    Life Highlights:${
      accompliqData.personalLife
        ? `
    - ${accompliqData.personalLife.greatestAccomplishments || "Not specified"}`
        : ""
    }
    
    Final Message: ${accompliqData.legacyTribute?.finalWords || "Not specified"}

    Funeral Arrangements:${
      accompliqData.funeralDetail
        ? `
    - Service: ${accompliqData.funeralDetail.serviceType || "Not specified"}
    - Date: ${accompliqData.funeralDetail.serviceDate || "Not specified"}
    - Location: ${
      accompliqData.funeralDetail.serviceLocation || "Not specified"
    }
    - Additional Info: ${
      accompliqData.funeralDetail.additionalInfo || "None provided"
    }`
        : " Not specified"
    }
    
    Please create a respectful memorial in a warm, personal tone that captures the essence of this person's life journey.${
      !accompliqData.personalInfo.dateOfPassing
        ? " Note that this is a living memorial as no passing date was provided."
        : ""
    }`;

    const requestData = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate memorial writer who creates personalized Accompliq tributes that honor people's lives with dignity and warmth." +
            (!accompliqData.personalInfo.dateOfPassing
              ? " The subject is still living, so focus on celebrating their life journey so far."
              : ""),
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestData,
      config
    );

    if (!response?.data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from OpenAI API");
    }

    const generatedText = response.data.choices[0].message.content;
    return {
      generatedText: generatedText
        .trim()
        .replace(/^["']+|["']+$/g, "")
        .replace(/^\n+/, "")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\b(?:here lies|dearly departed)\b/gi, (match) =>
          !accompliqData.personalInfo.dateOfPassing ? "" : match
        ),
      prompt: userPrompt,
    };
  } catch (error) {
    console.error("Accompliq Generation Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(
            "Invalid request format - please check your input data"
          );
        case 401:
          throw new Error("Invalid OpenAI API key - check your configuration");
        case 429:
          throw new Error("API rate limit exceeded - please try again later");
        default:
          throw new Error(`API request failed: ${error.response.statusText}`);
      }
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - please try again");
    } else if (error.request) {
      throw new Error(
        "No response from server - check your network connection"
      );
    }

    throw new Error(`Failed to generate Accompliq: ${error.message}`);
  }
};

export default generateAIDraft;
