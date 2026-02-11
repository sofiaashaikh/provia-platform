export const verifyGithub = async (url) => {
  if (!url || !url.includes("github.com")) {
    return { valid: false, message: "Use a valid GitHub link." };
  }
  try {
    const path = url.split("github.com/")[1];
    const response = await fetch(`https://api.github.com/repos/${path}`);
    return response.ok ? { valid: true } : { valid: false, message: "Repo not found." };
  } catch (error) {
    return { valid: false, message: "Verification failed." };
  }
};