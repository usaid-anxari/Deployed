// src/utils/mockAIService.js
const generateAIDraft = async (accompliq) => {
  // Simulate API delay (1-2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Helper function to format lists
  const formatList = (items) => {
    if (!items) return "";
    if (Array.isArray(items)) {
      return items.length > 1
        ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
        : items[0];
    }
    return items;
  };

  // Template selection logic
  const templates = {
    classic: (data) => `
      In Loving Memory
      ${data.fullName}
      ${data.dates}
      
      ${data.birthPlace} ${data.occupation ? data.occupation + "." : ""}
      
      ${data.family}
      
      ${data.accomplishments}
      
      ${data.finalWords}
      
      Funeral services will be ${data.serviceInfo}
    `,

    modern: (data) => `
      Celebrating the life of
      ${data.fullName}
      ${data.dates}
      
      ${data.bio}
      
      Remembered by: ${data.family}
      
      ${data.serviceInfo ? `Service details: ${data.serviceInfo}` : ""}
    `,

    religious: (data) => `
      Called Home to God
      ${data.fullName}
      ${data.dates}
      
      ${data.birthPlace}
      
      "${data.finalWords || "Well done, good and faithful servant."}"
      
      ${data.family}
      
      ${data.serviceInfo ? `Funeral Mass: ${data.serviceInfo}` : ""}
    `,
  };

  // Extract and format data
  const data = {
    fullName: accompliq.personalInfo?.fullName || "Name Not Provided",
    dates: `${accompliq.personalInfo?.dateOfBirth || "Unknown"} - ${
      accompliq.personalInfo?.dateOfPassing || "Present"
    }`,
    birthPlace: accompliq.personalInfo?.placeOfBirth
      ? `Born in ${accompliq.personalInfo.placeOfBirth}`
      : "",
    occupation:
      accompliq.educationCareer?.occupation ||
      accompliq.educationCareer?.careerHighlights?.[0],
    family: [
      accompliq.familyInfo?.spouse && `Spouse: ${accompliq.familyInfo.spouse}`,
      accompliq.familyInfo?.children &&
        `Children: ${formatList(accompliq.familyInfo.children)}`,
      accompliq.familyInfo?.parents &&
        `Parents: ${formatList(accompliq.familyInfo.parents)}`,
    ]
      .filter(Boolean)
      .join("\n"),
    accomplishments: [
      accompliq.personalLife?.greatestAccomplishments &&
        `Achievements: ${accompliq.personalLife.greatestAccomplishments}`,
      accompliq.educationCareer?.degrees &&
        `Education: ${formatList(accompliq.educationCareer.degrees)}`,
      accompliq.personalLife?.hobbies &&
        `Passions: ${formatList(accompliq.personalLife.hobbies)}`,
    ]
      .filter(Boolean)
      .join("\n"),
    finalWords: accompliq.legacyTributes?.finalWords || "",
    serviceInfo: [
      accompliq.funeralService?.serviceLocation &&
        `Location: ${accompliq.funeralService.serviceLocation}`,
      accompliq.funeralService?.burialOrCremation &&
        `Type: ${accompliq.funeralService.burialOrCremation}`,
      accompliq.funeralService?.servicePlans &&
        `Details: ${accompliq.funeralService.servicePlans}`,
    ]
      .filter(Boolean)
      .join(" | "),
    bio: [
      accompliq.personalInfo?.causeOfDeath &&
        `Passed from ${accompliq.personalInfo.causeOfDeath}`,
      accompliq.personalLife?.beliefs &&
        `Faith: ${accompliq.personalLife.beliefs}`,
      accompliq.personalLife?.organizations &&
        `Affiliations: ${formatList(accompliq.personalLife.organizations)}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  // Select template
  const template = templates[accompliq.selectedTemplate] || templates.classic;

  // Generate and clean up the accompliq
  return template(data)
    .replace(/\n\s+/g, "\n") // Remove extra indentation
    .replace(/\n{3,}/g, "\n\n") // Limit consecutive newlines
    .trim();
};

export default generateAIDraft;
