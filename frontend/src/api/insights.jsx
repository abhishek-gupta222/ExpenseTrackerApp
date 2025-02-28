const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getExpenseInsights = async (expenses) => {
    try {
      const response = await fetch(`${backendUrl}/api/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenses }),
      });
  
      const data = await response.json();
      console.log(data)
      return data.insights;
    } catch (error) {
      console.error("Error fetching insights:", error);
      return "Failed to fetch insights.";
    }
  };
  