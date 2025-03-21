const AuthService = {
    login: async (email, password) => {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }
      
      return response.json();
    },
  
    logout: () => {
      localStorage.removeItem("user");
    },
  
    getCurrentUser: () => {
      return JSON.parse(localStorage.getItem("user"));
    },
  
    isAuthenticated: () => {
      return localStorage.getItem("user") !== null;
    }
  };
  
  export default AuthService;