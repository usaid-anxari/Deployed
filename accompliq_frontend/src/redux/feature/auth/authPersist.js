export const loadAuthState = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (token === null) {
      return undefined;
    }
    return { token };
  } catch (error) {
    return undefined;
  }
};

export const saveAuthState = ({ auth }) => {
  try {
    if (auth.token) {
      localStorage.setItem("authToken", auth.token);
    }
  } catch (error) {
    console.error("Error saving auth state:", error);
  }
};
